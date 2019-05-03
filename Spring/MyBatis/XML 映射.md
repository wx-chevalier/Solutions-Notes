# XML 映射文件

MyBatis 的真正强大在于它的映射语句，由于它的异常强大，映射器的 XML 文件就显得相对简单。如果拿它跟具有相同功能的 JDBC 代码进行对比，你会立即发现省掉了将近 95%的代码。MyBatis 就是针对 SQL 构建的，并且比普通的方法做的更好。首先我们通过某个简单而完整的 MyBatis 示例来了解映射文件的配置规则：

```java
public interface UserMapper 
{
 public void insertUser(User user);
 public User getUserById(Integer userId);
 public List<User> getAllUsers();
 public void updateUser(User user);
 public void deleteUser(Integer userId);
}
```

```xml
<?xml version='1.0' encoding='UTF-8' ?>
<!DOCTYPE mapper PUBLIC '-//mybatis.org//DTD Mapper 3.0//EN'
  'http://mybatis.org/dtd/mybatis-3-mapper.dtd'>

<mapper namespace='wx.mappers.UserMapper'>
  <select id='getUserById' parameterType='int' resultType='wx.domain.User'>
     SELECT 
      user_id as userId, 
      email_id as emailId , 
      password, 
      first_name as firstName, 
      last_name as lastName
     FROM USER 
     WHERE USER_ID = #{userId}
  </select>

  <!-- Instead of referencing Fully Qualified Class Names we can register Aliases in mybatis-config.xml and use Alias names. -->
   <resultMap type='User' id='UserResult'>
    <id property='userId' column='user_id'/>
    <result property='emailId' column='email_id'/>
    <result property='password' column='password'/>
    <result property='firstName' column='first_name'/>
    <result property='lastName' column='last_name'/>   
   </resultMap>

  <select id='getAllUsers' resultMap='UserResult'>
   SELECT * FROM USER
  </select>

  <insert id='insertUser' parameterType='User' useGeneratedKeys='true' keyProperty='userId'>
   INSERT INTO USER(email_id, password, first_name, last_name)
    VALUES(#{emailId}, #{password}, #{firstName}, #{lastName})
  </insert>

  <update id='updateUser' parameterType='User'>
    UPDATE USER 
    SET
     PASSWORD= #{password},
     FIRST_NAME = #{firstName},
     LAST_NAME = #{lastName}
    WHERE USER_ID = #{userId}
  </update>

  <delete id='deleteUser' parameterType='int'>
    DELETE FROM USER WHERE USER_ID = #{userId}
  </delete>

</mapper>
```

在 MyBatis 3.0 之后，即可以直接以 Annotation 方式将 SQL 与配置写在 Java 文件中，也可以直接写在 XML 文件中。笔者建议的简单的 SQL 语句可以直接以 Annotation 方式编写，复杂的 SQL 语句可以写在 XML 文件中。

```java
public interface BlogMapper 
{
 @Insert('INSERT INTO BLOG(BLOG_NAME, CREATED_ON) VALUES(#{blogName}, #{createdOn})')
 @Options(useGeneratedKeys=true, keyProperty='blogId')
 public void insertBlog(Blog blog);

 @Select('SELECT BLOG_ID AS blogId, BLOG_NAME as blogName, CREATED_ON as createdOn FROM BLOG WHERE BLOG_ID=#{blogId}')
 public Blog getBlogById(Integer blogId);

 @Select('SELECT * FROM BLOG ')
 @Results({
  @Result(id=true, property='blogId', column='BLOG_ID'),
  @Result(property='blogName', column='BLOG_NAME'),
  @Result(property='createdOn', column='CREATED_ON')  
 })
 public List<Blog> getAllBlogs();

 @Update('UPDATE BLOG SET BLOG_NAME=#{blogName}, CREATED_ON=#{createdOn} WHERE BLOG_ID=#{blogId}')
 public void updateBlog(Blog blog);

 @Delete('DELETE FROM BLOG WHERE BLOG_ID=#{blogId}')
 public void deleteBlog(Integer blogId);

}
```

# select

查询是最常见的数据操作之一，如下查询语句接受一个 int（或 Integer）类型的参数，并返回一个 HashMap 类型的对象，其中的键是列名，值便是结果行中的对应值。

```xml
<select id="selectPerson" parameterType="int" resultType="hashmap">
  SELECT * FROM PERSON WHERE ID = #{id}
</select>
```

其类似于创建一个新的预处理语句，并以 ? 来传递参数。select 元素允许你配置很多属性来配置每条语句的作用细节：

```xml
<select
  id="selectPerson"
  parameterType="int"
  parameterMap="deprecated"
  resultType="hashmap"
  resultMap="personResultMap"

  <!-- 将其设置为 true 后，只要语句被调用，都会导致本地缓存和二级缓存被清空，默认值：false。 -->
  flushCache="false"
  useCache="true"
  timeout="10"
  fetchSize="256"
  statementType="PREPARED"
  resultSetType="FORWARD_ONLY"></select>
```

# 数据操作

数据变更语句 insert，update 和 delete 的实现非常接近：

```xml
<insert
  id="insertAuthor"
  parameterType="domain.blog.Author"
  flushCache="true"
  statementType="PREPARED"
  <!-- 通过生成的键值设置表中的列名，这个设置仅在某些数据库（像 PostgreSQL）是必须的，当主键列不是表中的第一列的时候需要设置。如果希望使用多个生成的列，也可以设置为逗号分隔的属性名称列表。 -->
  keyProperty=""
  keyColumn=""
  <!-- 令 MyBatis 使用 JDBC 的 getGeneratedKeys 方法来取出由数据库内部生成的主键（比如：像 MySQL 和 SQL Server 这样的关系数据库管理系统的自动递增字段） -->
  useGeneratedKeys=""
  timeout="20">

<update
  id="updateAuthor"
  parameterType="domain.blog.Author"
  flushCache="true"
  statementType="PREPARED"
  timeout="20">

<delete
  id="deleteAuthor"
  parameterType="domain.blog.Author"
  flushCache="true"
  statementType="PREPARED"
  timeout="20">
```

典型的操作语句示范如下：

```xml
<insert id="insertAuthor">
  insert into Author (id,username,password,email,bio)
  values (#{id},#{username},#{password},#{email},#{bio})
</insert>

<update id="updateAuthor">
  update Author set
    username = #{username},
    password = #{password},
    email = #{email},
    bio = #{bio}
  where id = #{id}
</update>

<delete id="deleteAuthor">
  delete from Author where id = #{id}
</delete>
```

## 主键

如果你的数据库支持自动生成主键的字段（比如 MySQL 和 SQL Server），那么你可以设置 useGeneratedKeys=”true”，然后再把 keyProperty 设置到目标属性上：

```xml
<insert id="insertAuthor" useGeneratedKeys="true"
    keyProperty="id">
  insert into Author (username,password,email,bio)
  values (#{username},#{password},#{email},#{bio})
</insert>
```

对于不支持自动生成类型的数据库或可能不支持自动生成主键的 JDBC 驱动，MyBatis 有另外一种方法来生成主键。

```xml
<insert id="insertAuthor">
  <selectKey keyProperty="id" resultType="int" order="BEFORE">
    select CAST(RANDOM()*1000000 as INTEGER) a from SYSIBM.SYSDUMMY1
  </selectKey>
  insert into Author
    (id, username, password, email,bio, favourite_section)
  values
    (#{id}, #{username}, #{password}, #{email}, #{bio}, #{favouriteSection,jdbcType=VARCHAR})
</insert>
```

在上面的示例中，selectKey 元素中的语句将会首先运行，Author 的 id 会被设置，然后插入语句会被调用。这可以提供给你一个与数据库中自动生成主键类似的行为，同时保持了 Java 代码的简洁。

```xml
<selectKey
  keyProperty="id"
  resultType="int"
  <!-- 这可以被设置为 BEFORE 或 AFTER。如果设置为 BEFORE，那么它会首先生成主键，设置 keyProperty 然后执行插入语句。如果设置为 AFTER，那么先执行插入语句，然后是 selectKey 中的语句 - 这和 Oracle 数据库的行为相似，在插入语句内部可能有嵌入索引调用。 -->
  order="BEFORE"
  statementType="PREPARED">
```

## 复杂参数

MyBatis 允许我们传入处理复杂的参数，譬如 User 类型的参数对象传递到了语句中，id、username 和 password 属性将会被查找，然后将它们的值传入预处理语句的参数中。

```xml
<insert id="insertUser" parameterType="User">
  insert into users (id, username, password)
  values (#{id}, #{username}, #{password})
</insert>
```

如果我们希望在 Mapper 中传入多个参数，那么需要使用 `@Param` 注解：

```java
@Mapper
public interface MyMapper {
    void update(@Param("a") A a, @Param("b") B b);
    ...
}

<update id="update" >
   UPDATE SOME WHERE x=#{a.x} AND y=#{b.y}
</update>
```

或者将 parameterType 设置为 map 类型，然后按照键值引用：

```xml
void mapCategoryAndPage(@Param("categoryLocalId") Long categoryLocalId, @Param("pageLocalId") Long localId);

<insert id="mapCategoryAndPage" parameterType="map">
    INSERT INTO
        category_page_mapping (
            page_local_id,
            category_local_id)
    VALUES
        (#{pageLocalId},
         #{categoryLocalId});
</insert>
```

我们还可以为参数指定一个特殊的数据类型：

```xml
#{property,javaType=int,jdbcType=NUMERIC}
#{height,javaType=double,jdbcType=NUMERIC,numericScale=2}
#{age,javaType=int,jdbcType=NUMERIC,typeHandler=MyTypeHandler}
```

## 字符串替换

默认情况下,使用 `#{}` 格式的语法会导致 MyBatis 创建 PreparedStatement 参数占位符并安全地设置参数。如果想直接在 SQL 语句中插入一个不转义的字符串，譬如在使用 ORDER BY 时候，可以这样来使用：

```xml
ORDER BY ${columnName}
```

当 SQL 语句中的元数据（如表名或列名）是动态生成的时候，字符串替换将会非常有用。 举个例子，如果你想通过任何一列从表中 select 数据时，只需要像做如下的转化就好：

```java
@Select("select * from user where id = #{id}")
User findById(@Param("id") long id);

@Select("select * from user where name = #{name}")
User findByName(@Param("name") String name);

// 替换为单个写法，其中 ${column} 会被直接替换，而 #{value} 会被使用 ? 预处理
@Select("select * from user where ${column} = #{value}")
User findByColumn(@Param("column") String column, @Param("value") String value);

User userOfId1 = userMapper.findByColumn("id", 1L);
User userOfNameKid = userMapper.findByColumn("name", "kid");
```

## 批量操作

利用 MyBatis 提供的动态 SQL 能力，我们可以方便地在 XML 映射中执行批量插入地操作：

```xml
<insert id="insertAuthor" useGeneratedKeys="true"
    keyProperty="id">
  insert into Author (username, password, email, bio) values
  <foreach item="item" collection="list" separator=",">
    (#{item.username}, #{item.password}, #{item.email}, #{item.bio})
  </foreach>
</insert>
```

# resultMap | 结果映射

resultMap 元素能够替代原本 JDBC ResultSets 中的大量数据提取代码，并在一些情形下允许你进行一些 JDBC 不支持的操作。ResultMap 的设计思想是，对于简单的语句根本不需要配置显式的结果映射，而对于复杂一点的语句只需要描述它们的关系就行了。

```xml
<select id="selectUsers" resultType="map">
  select id, username, hashedPassword
  from some_table
  where id = #{id}
</select>
```

上述语句只是简单地将所有的列映射到 HashMap 的键上，但是 HashMap 不是一个很好的领域模型，我们也可以映射为 POJO：

```java
public class User {
  private int id;
  private String username;
  private String hashedPassword;
  // ... Getter & Setter
}

// <select id="selectUsers" resultType="com.someapp.model.User">
// ...
```

## 映射规则

id 和 result 元素都将一个列的值映射到一个简单数据类型（String, int, double, Date 等）的属性或字段。这两者之间的唯一不同是，id 元素表示的结果将是对象的标识属性，这会在比较对象实例时用到。

```xml
<id property="id" column="post_id"/>
<result property="subject" column="post_subject"/>
```

指定主键可以提高整体的性能，尤其是进行缓存和嵌套结果映射（也就是连接映射）的时候；在使用复合主键的时候，你可以使用 `column="{prop1=col1,prop2=col2}"` 这样的语法来指定多个传递给嵌套 select 查询语句的列名。这会使得 prop1 和 prop2 作为参数对象，被设置为对应嵌套 select 语句的参数。

这两个元素都可以指定 javaType 与 jdbcType 属性，其中 javaType 是 Java 类名或者类型名别，当我们映射到 HashMap 时候，应该明确地指定 javaType 来保证行为与期望的相一致。jdbcType 则是指定 JDBC 的类型，只需要在可能执行插入、更新和删除的且允许空值的列上指定 JDBC 类型。我们还可以自定义 POJO 的构造函数：

```java
public class User {
   //...
   public User(Integer id, String username, int age) {
     //...
  }
//...
}
```

标准的 MyBatis 构造函数的传参是基于参数的顺序与类型：

```xml
<constructor>
   <idArg column="id" javaType="int"/>
   <arg column="username" javaType="String"/>
   <arg column="age" javaType="_int"/>
</constructor>
```

这种依赖于顺序的方式，简单易懂，却也有其弊端。当你在处理一个带有多个形参的构造方法时，很容易搞乱 arg 元素的顺序。从版本 3.4.3 开始，可以在利用 @Param 注解指定参数名称的前提下，以任意顺序编写 arg 元素。

```xml
<constructor>
   <idArg column="id" javaType="int" name="id" />
   <arg column="age" javaType="_int" name="age" />
   <arg column="username" javaType="String" name="username" />
</constructor>
```

## Alias | 别名

ResultMap 可以帮我们优雅地解决别名问题：

```xml
<resultMap id="userResultMap" type="User">
  <id property="id" column="user_id" />
  <result property="username" column="user_name"/>
  <result property="password" column="hashed_password"/>
</resultMap>
```

而在引用它的语句中使用 resultMap 属性就行了（注意我们去掉了 resultType 属性）。比如:

```xml
<select id="selectUsers" resultMap="userResultMap">
  select user_id, user_name, hashed_password
  from some_table
  where id = #{id}
</select>
```

类型别名则允许我们不用输入类的完全限定名称：

```xml
<!-- mybatis-config.xml 中 -->
<typeAlias type="com.someapp.model.User" alias="User"/>

<!-- SQL 映射 XML 中 -->
<select id="selectUsers" resultType="User">
```

## 自动映射

当自动映射查询结果时，MyBatis 会获取结果中返回的列名并在 Java 类中查找相同名字的属性（忽略大小写）。 这意味着如果发现了 ID 列和 id 属性，MyBatis 会将列 ID 的值赋给 id 属性。通常数据库列使用大写字母组成的单词命名，单词间用下划线分隔；而 Java 属性一般遵循驼峰命名法约定。为了在这两种命名方式之间启用自动映射，需要将 mapUnderscoreToCamelCase 设置为 true。

对于每一个结果映射，在 ResultSet 出现的列，如果没有设置手动映射，将被自动映射。在自动映射处理完毕后，再处理手动映射。

```xml
<select id="selectUsers" resultMap="userResultMap">
  select
    user_id             as "id",
    user_name           as "userName",
    hashed_password
  from some_table
  where id = #{id}
</select>

<resultMap id="userResultMap" type="User">
  <result property="password" column="hashed_password"/>
</resultMap>
```

MyBatis 提供了三种自动映射等级：

- NONE: 禁用自动映射。仅对手动映射的属性进行映射。
- PARTIAL: 对除在内部定义了嵌套结果映射（也就是连接的属性）以外的属性进行映射
- FULL: 自动映射所有属性。

无论设置的自动映射等级是哪种，你都可以通过在结果映射上设置 autoMapping 属性来为指定的结果映射设置启用/禁用自动映射。

```xml
<resultMap id="userResultMap" type="User" autoMapping="false">
  <result property="password" column="hashed_password"/>
</resultMap>
```

# Association | 关联查询

MyBatis 也允许我们通过 association 等元素来实现关联查询，即同时查询出多表的数据并且填充到 POJO 中。MyBatis 有两种不同的方式加载关联：

- 嵌套 Select 查询：通过执行另外一个 SQL 映射语句来加载期望的复杂类型。
- 嵌套结果映射：使用嵌套的结果映射来处理连接结果的重复子集

MyBatis 提供的强大的关联映射的能力，让我们去方便地指定多层嵌套的映射形式：

```xml
<!-- 非常复杂的语句 -->
<select id="selectBlogDetails" resultMap="detailedBlogResultMap">
  select
       B.id as blog_id,
       B.title as blog_title,
       B.author_id as blog_author_id,
       A.id as author_id,
       A.username as author_username,
       A.password as author_password,
       A.email as author_email,
       A.bio as author_bio,
       A.favourite_section as author_favourite_section,
       P.id as post_id,
       P.blog_id as post_blog_id,
       P.author_id as post_author_id,
       P.created_on as post_created_on,
       P.section as post_section,
       P.subject as post_subject,
       P.draft as draft,
       P.body as post_body,
       C.id as comment_id,
       C.post_id as comment_post_id,
       C.name as comment_name,
       C.comment as comment_text,
       T.id as tag_id,
       T.name as tag_name
  from Blog B
       left outer join Author A on B.author_id = A.id
       left outer join Post P on B.id = P.blog_id
       left outer join Comment C on P.id = C.post_id
       left outer join Post_Tag PT on PT.post_id = P.id
       left outer join Tag T on PT.tag_id = T.id
  where B.id = #{id}
</select>
```

```xml
<!-- 非常复杂的结果映射 -->
<resultMap id="detailedBlogResultMap" type="Blog">
  <constructor>
    <idArg column="blog_id" javaType="int"/>
  </constructor>
  <result property="title" column="blog_title"/>
  <association property="author" javaType="Author">
    <id property="id" column="author_id"/>
    <result property="username" column="author_username"/>
    <result property="password" column="author_password"/>
    <result property="email" column="author_email"/>
    <result property="bio" column="author_bio"/>
    <result property="favouriteSection" column="author_favourite_section"/>
  </association>
  <collection property="posts" ofType="Post">
    <id property="id" column="post_id"/>
    <result property="subject" column="post_subject"/>
    <association property="author" javaType="Author"/>
    <collection property="comments" ofType="Comment">
      <id property="id" column="comment_id"/>
    </collection>
    <collection property="tags" ofType="Tag" >
      <id property="id" column="tag_id"/>
    </collection>
    <discriminator javaType="int" column="draft">
      <case value="1" resultType="DraftPost"/>
    </discriminator>
  </collection>
</resultMap>
```

## 关联的嵌套 select 查询

association 元素本身可以指定某个查询语句中获取到的列映射到子属性值中的关系：

```xml
<association property="author" column="blog_author_id" javaType="Author">
  <id property="id" column="author_id"/>
  <result property="username" column="author_username"/>
</association>
```

MyBatis 还支持关联的嵌套 select 查询，select 属性用于加载复杂类型属性的映射语句的 ID，它会从 column 属性指定的列中检索数据，作为参数传递给目标 select 语句。

```xml
<resultMap id="blogResult" type="Blog">
  <association property="author" column="author_id" javaType="Author" select="selectAuthor"/>
</resultMap>

<select id="selectBlog" resultMap="blogResult">
  SELECT * FROM BLOG WHERE ID = #{id}
</select>

<select id="selectAuthor" resultType="Author">
  SELECT * FROM AUTHOR WHERE ID = #{id}
</select>
```

两个 select 查询语句分别加载 Blog 与 Author 对象，其它所有的属性将会被自动加载，只要它们的列名和属性名相匹配。这种方式虽然简单，但是可能会存在所谓的 `N + 1` 查询问题，即：

- 执行了一个单独的 SQL 语句来获取结果的一个列表（就是“+1”）。
- 对列表返回的每条记录，你执行一个 select 查询语句来为每条记录加载详细信息（就是“N”）。

MyBatis 能够对这样的查询进行延迟加载，因此可以将大量语句同时运行的开销分散开来。然而，如果你加载记录列表之后立刻就遍历列表以获取嵌套的数据，就会触发所有的延迟加载查询，性能可能会变得很糟糕。当然，MyBatis 还提供了更优雅的方式来解决 `N + 1` 查询问题。

## 关联的嵌套结果映射

对于复杂的嵌套结果映射，同样可以指定子查询的结果映射：

```xml
<select id="selectBlog" resultMap="blogResult">
  select
    B.id            as blog_id,
    B.title         as blog_title,
    B.author_id     as blog_author_id,
    A.id            as author_id,
    A.username      as author_username,
    A.password      as author_password,
    A.email         as author_email,
    A.bio           as author_bio
  from Blog B left outer join Author A on B.author_id = A.id
  where B.id = #{id}
</select>
```

这里为确保结果能够拥有唯一且清晰的名字，我们设置的别名，而在 resultMap 中我们又需要将别名映射到属性：

```xml
<resultMap id="blogResult" type="Blog">
  <id property="id" column="blog_id" />
  <result property="title" column="blog_title"/>
  <association property="author" column="blog_author_id" javaType="Author" resultMap="authorResult"/>
</resultMap>

<resultMap id="authorResult" type="Author">
  <id property="id" column="author_id"/>
  <result property="username" column="author_username"/>
  <result property="password" column="author_password"/>
  <result property="email" column="author_email"/>
  <result property="bio" column="author_bio"/>
</resultMap>
```

如果 Blog 存在另一个 Author 属性域，譬如第二作者等，那么就可以复用 authorResult 这个结果映射：

```xml
<select id="selectBlog" resultMap="blogResult">
  select
    B.id            as blog_id,
    B.title         as blog_title,
    A.id            as author_id,
    A.username      as author_username,
    A.password      as author_password,
    A.email         as author_email,
    A.bio           as author_bio,
    CA.id           as co_author_id,
    CA.username     as co_author_username,
    CA.password     as co_author_password,
    CA.email        as co_author_email,
    CA.bio          as co_author_bio
  from Blog B
  left outer join Author A on B.author_id = A.id
  left outer join Author CA on B.co_author_id = CA.id
  where B.id = #{id}
</select>

<resultMap id="blogResult" type="Blog">
  <id property="id" column="blog_id" />
  <result property="title" column="blog_title"/>
  <association property="author"
    resultMap="authorResult" />
  <association property="coAuthor"
    resultMap="authorResult"
    columnPrefix="co_" />
</resultMap>
```

## 关联的多结果集

集合元素和关联元素几乎是一样的，不过它们能够用来描述多条数据，譬如某个 Blog 包含多个 Post，那么 Blog 类就会包含如下成员：

```java
private List<Post> posts;
```

然后同样编写多条 select 语句：

```xml
<resultMap id="blogResult" type="Blog">
  <collection property="posts" javaType="ArrayList" column="id" ofType="Post" select="selectPostsForBlog"/>
  <!-- 或者省略 javaType -->
  <!-- <collection property="posts" column="id" ofType="Post" select="selectPostsForBlog"/> -->
</resultMap>

<select id="selectBlog" resultMap="blogResult">
  SELECT * FROM BLOG WHERE ID = #{id}
</select>

<select id="selectPostsForBlog" resultType="Post">
  SELECT * FROM POST WHERE BLOG_ID = #{id}
</select>
```

ofType 属性用来将 JavaBean（或字段）属性的类型和集合存储的类型区分开来，我们同样可以为 collection 元素添加别名等配置：

```xml
<collection property="posts" ofType="domain.blog.Post">
  <id property="id" column="post_id"/>
  <result property="subject" column="post_subject"/>
  <result property="body" column="post_body"/>
</collection>
```

对于复杂嵌套属性的处理则同样类似于单结果集关联：

```xml
<select id="selectBlog" resultMap="blogResult">
  select
  B.id as blog_id,
  B.title as blog_title,
  B.author_id as blog_author_id,
  P.id as post_id,
  P.subject as post_subject,
  P.body as post_body,
  from Blog B
  left outer join Post P on B.id = P.blog_id
  where B.id = #{id}
</select>

<resultMap id="blogResult" type="Blog">
  <id property="id" column="blog_id" />
  <result property="title" column="blog_title"/>
  <collection property="posts" ofType="Post" resultMap="blogPostResult" columnPrefix="post_"/>
</resultMap>

<resultMap id="blogPostResult" type="Post">
  <id property="id" column="id"/>
  <result property="subject" column="subject"/>
  <result property="body" column="body"/>
</resultMap>
```
