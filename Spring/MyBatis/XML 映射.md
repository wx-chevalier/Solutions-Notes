# XML 映射文件

MyBatis 的真正强大在于它的映射语句，由于它的异常强大，映射器的 XML 文件就显得相对简单。如果拿它跟具有相同功能的 JDBC 代码进行对比，你会立即发现省掉了将近 95%的代码。MyBatis 就是针对 SQL 构建的，并且比普通的方法做的更好。

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

<mapper namespace='com.sivalabs.mybatisdemo.mappers.UserMapper'>

  <select id='getUserById' parameterType='int' resultType='com.sivalabs.mybatisdemo.domain.User'>
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

### 字符串替换

默认情况下,使用 `#{}` 格式的语法会导致 MyBatis 创建 PreparedStatement 参数占位符并安全地设置参数（就像使用 ? 一样）。 这样做更安全，更迅速，通常也是首选做法，不过有时你就是想直接在 SQL 语句中插入一个不转义的字符串。 比如，像 ORDER BY，你可以这样来使用：

```xml
ORDER BY ${columnName}
```

当 SQL 语句中的元数据（如表名或列名）是动态生成的时候，字符串替换将会非常有用。 举个例子，如果你想通过任何一列从表中 select 数据时，不需要像下面这样写：

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

## Alias | 别名

## Association | 关联

## 关联的多结果集
