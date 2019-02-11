# MyBatis

# Mybatis

> [mybatis-3-annotation-example-with-select-insert-update-and-delete](http://www.concretepage.com/mybatis-3/mybatis-3-annotation-example-with-select-insert-update-and-delete)

MyBatis 是一个半自动化的 SQL 辅助工具，在 MyBatis 的生命周期中，常见有以下几个组件：

- SqlSessionFactoryBuilder

这个类可以被实例化、使用和丢弃，一旦创建了  SqlSessionFactory，就不再需要它了。因此  SqlSessionFactoryBuilder  实例的最佳范围是方法范围(也就是局部方法变量)。你可以重用  SqlSessionFactoryBuilder  来创建多个  SqlSessionFactory  实例，但是最好还是不要让其一直存在以保证所有的  XML  解析资源开放给更重要的事情。

- SqlSessionFactory

SqlSessionFactory  一旦被创建就应该在应用的运行期间一直存在，没有任何理由对它进行清除或重建。使用  SqlSessionFactory  的最佳实践是在应用运行期间不要重复创建多次，多次重建  SqlSessionFactory  被视为一种代码“坏味道(bad smell)”。因此  SqlSessionFactory  的最佳范围是应用范围。有很多方法可以做到，最简单的就是使用单例模式或者静态单例模式。

- SqlSession

每个线程都应该有它自己的  SqlSession  实例。SqlSession  的实例不是线程安全的，因此是不能被共享的，所以它的最佳的范围是请求或方法范围。绝对不能将  SqlSession  实例的引用放在一个类的静态域，甚至一个类的实例变量也不行。也绝不能将  SqlSession  实例的引用放在任何类型的管理范围中，比如  Serlvet  架构中的  HttpSession。如果你现在正在使用一种  Web  框架，要考虑  SqlSession  放在一个和  HTTP  请求对象相似的范围中。换句话说，每次收到的  HTTP  请求，就可以打开一个  SqlSession，返回一个响应，就关闭它。这个关闭操作是很重要的，你应该把这个关闭操作放到  finally  块中以确保每次都能执行关闭。下面的示例就是一个确保  SqlSession  关闭的标准模式：

``` 
SqlSession session = sqlSessionFactory.openSession();
try {
  // do work
} finally {
  session.close();
}
```

在你的所有的代码中一致性地使用这种模式来保证所有数据库资源都能被正确地关闭。

-  映射器实例(Mapper Instances)

映射器是创建用来绑定映射语句的接口。映射器接口的实例是从  SqlSession  中获得的。因此从技术层面讲，映射器实例的最大范围是和  SqlSession  相同的，因为它们都是从  SqlSession  里被请求的。尽管如此，映射器实例的最佳范围是方法范围。也就是说，映射器实例应该在调用它们的方法中被请求，用过之后即可废弃。并不需要显式地关闭映射器实例，尽管在整个请求范围(request scope)保持映射器实例也不会有什么问题，但是很快你会发现，像  SqlSession  一样，在这个范围上管理太多的资源的话会难于控制。所以要保持简单，最好把映射器放在方法范围(method scope)内。下面的示例就展示了这个实践：

``` 
SqlSession session = sqlSessionFactory.openSession();
try {
  BlogMapper mapper = session.getMapper(BlogMapper.class);
  // do work
} finally {
  session.close();
}
```

## Enrollment

要使用  MyBatis，  只需将  mybatis-x.x.x.jar  文件置于  classpath  中即可。如果使用  Maven  来构建项目，则需将下面的  dependency  代码置于  pom.xml  文件中：

``` xml
<dependency>
  <groupId>org.mybatis</groupId>
  <artifactId>mybatis</artifactId>
  <version>x.x.x</version>
</dependency>
```

### Java:直接在代码中创建

如果你更愿意直接从  Java  程序而不是  XML  文件中创建  configuration，或者创建你自己的  configuration  构建器，MyBatis  也提供了完整的配置类，提供所有和  XML  文件相同功能的配置项。

``` 
DataSource dataSource = BlogDataSourceFactory.getBlogDataSource();
TransactionFactory transactionFactory = new JdbcTransactionFactory();
Environment environment = new Environment("development", transactionFactory, dataSource);
Configuration configuration = new Configuration(environment);
configuration.addMapper(BlogMapper.class);
SqlSessionFactory sqlSessionFactory = new SqlSessionFactoryBuilder().build(configuration);
```

注意该例中，configuration  添加了一个映射器类(mapper class)。映射器类是  Java  类，它们包含  SQL  映射语句的注解从而避免了  XML  文件的依赖。不过，由于  Java  注解的一些限制加之某些  MyBatis  映射的复杂性，XML  映射对于大多数高级映射(比如：嵌套  Join  映射)来说仍然是必须的。有鉴于此，如果存在一个对等的  XML  配置文件的话，MyBatis  会自动查找并加载它(这种情况下， BlogMapper.xml  将会基于类路径和  BlogMapper.class  的类名被加载进来)。具体细节稍后讨论。

既然有了  SqlSessionFactory ，顾名思义，我们就可以从中获得  SqlSession  的实例了。SqlSession  完全包含了面向数据库执行  SQL  命令所需的所有方法。你可以通过  SqlSession  实例来直接执行已映射的  SQL  语句。例如：

``` java
SqlSession session = sqlSessionFactory.openSession();
try {
  Blog blog = (Blog) session.selectOne("org.mybatis.example.BlogMapper.selectBlog", 101);
} finally {
  session.close();
}
```

诚然这种方式能够正常工作，并且对于使用旧版本  MyBatis  的用户来说也比较熟悉，不过现在有了一种更直白的方式。使用对于给定语句能够合理描述参数和返回值的接口(比如说 BlogMapper.class)，你现在不但可以执行更清晰和类型安全的代码，而且还不用担心易错的字符串字面值以及强制类型转换。

例如：

``` java
SqlSession session = sqlSessionFactory.openSession();
try {
  BlogMapper mapper = session.getMapper(BlogMapper.class);
  Blog blog = mapper.selectBlog(101);
} finally {
  session.close();
}
```

### XML-Configuration:使用独立的 XML 配置文件

每个基于  MyBatis  的应用都是以一个  SqlSessionFactory  的实例为中心的。SqlSessionFactory  的实例可以通过  SqlSessionFactoryBuilder  获得。而  SqlSessionFactoryBuilder  则可以从  XML  配置文件或一个预先定制的  Configuration  的实例构建出  SqlSessionFactory  的实例。从  XML  文件中构建  SqlSessionFactory  的实例非常简单，建议使用类路径下的资源文件进行配置。但是也可以使用任意的输入流(InputStream)实例，包括字符串形式的文件路径或者  file://  的  URL  形式的文件路径来配置。MyBatis  包含一个名叫  Resources  的工具类，它包含一些实用方法，可使从  classpath  或其他位置加载资源文件更加容易。

``` java
String resource = "org/mybatis/example/mybatis-config.xml";
InputStream inputStream = Resources.getResourceAsStream(resource);
sqlSessionFactory = new SqlSessionFactoryBuilder().build(inputStream);
```

XML  配置文件(configuration XML)中包含了对  MyBatis  系统的核心设置，包含获取数据库连接实例的数据源(DataSource)和决定事务范围和控制方式的事务管理器(TransactionManager)。XML  配置文件的详细内容后面再探讨，这里先给出一个简单的示例：

``` xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE configuration
  PUBLIC "-//mybatis.org//DTD Config 3.0//EN"
  "http://mybatis.org/dtd/mybatis-3-config.dtd">
<configuration>
  <environments default="development">
    <environment id="development">
      <transactionManager type="JDBC"/>
      <dataSource type="POOLED">
        <property name="driver" value="${driver}"/>
        <property name="url" value="${url}"/>
        <property name="username" value="${username}"/>
        <property name="password" value="${password}"/>
      </dataSource>
    </environment>
  </environments>
  <mappers>
    <mapper resource="org/mybatis/example/BlogMapper.xml"/>
  </mappers>
</configuration>
```

### Spring-Integrated:在 Spring 中集成

在 Spring MVC 中使用 Mybatis 中的特性，需要做如下配置：

``` xml
    <bean id="sqlSessionFactory" class="org.mybatis.spring.SqlSessionFactoryBean">
        <property name="configLocation" value="classpath:mybatis-config.xml"/>
        <property name="dataSource" ref="dataSource"/>
    </bean>
    <bean class="org.mybatis.spring.mapper.MapperScannerConfigurer">
        <property name="sqlSessionFactoryBeanName" value="sqlSessionFactory"/>
        <property name="basePackage" value="com.lf.service.mapper;com.lf.host.service.mapper"/>
    </bean>
```

## Mapper

MyBatis  的真正强大在于它的映射语句，也是它的魔力所在。由于它的异常强大，映射器的  XML  文件就显得相对简单。如果拿它跟具有相同功能的  JDBC  代码进行对比，你会立即发现省掉了将近  95%  的代码。MyBatis  就是针对  SQL  构建的，并且比普通的方法做的更好。

SQL  映射文件有很少的几个顶级元素(按照它们应该被定义的顺序)：

- cache –  给定命名空间的缓存配置。
- cache-ref –  其他命名空间缓存配置的引用。
- resultMap –  是最复杂也是最强大的元素，用来描述如何从数据库结果集中来加载对象。
-  parameterMap –  已废弃！老式风格的参数映射。内联参数是首选,这个元素可能在将来被移除，这里不会记录。
- sql –  可被其他语句引用的可重用语句块。
- insert –  映射插入语句
- update –  映射更新语句
- delete –  映射删除语句
- select –  映射查询语句

在 MyBatis 3.0 之后，即可以直接以 Annotation 方式将 SQL 与配置写在 Java 文件中，也可以直接写在 XML 文件中。笔者建议的简单的 SQL 语句可以直接以 Annotation 方式编写，复杂的 SQL 语句可以写在 XML 文件中。

#### XML-Based

``` java
package com.sivalabs.mybatisdemo.mappers;

import java.util.List;
import com.sivalabs.mybatisdemo.domain.User;

public interface UserMapper 
{

 public void insertUser(User user);

 public User getUserById(Integer userId);

 public List<User> getAllUsers();

 public void updateUser(User user);

 public void deleteUser(Integer userId);

}
```

``` xml
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

#### Java-Based

``` java
package com.sivalabs.mybatisdemo.mappers;

import java.util.List;

import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Options;
import org.apache.ibatis.annotations.Result;
import org.apache.ibatis.annotations.Results;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import com.sivalabs.mybatisdemo.domain.Blog;

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

### Dynamic SQL

#### foreach

> [解决 mybatis foreach  错误: Parameter ‘\_\_frch_item_0‘ not found](http://www.bubuko.com/infodetail-913433.html)

foreach  多用于值重复

##### in

``` 
@Options(useGeneratedKeys = true, keyProperty = "challenge_id")
@Insert("insert into t_challenge(" +
        "challenge_user_id_creator," +
        "challenge_user_id_invited," +
        "challenge_content," +
        "challenge_deadline," +
        "challenge_reward_credit," +
        "challenge_reward_text," +
        "challenge_city_id)" +
        "values(" +
        "#{challenge_user_id_creator}," +
        "#{challenge_user_id_invited}," +
        "#{challenge_content}," +
        "#{challenge_deadline}," +
        "#{challenge_reward_credit}," +
        "#{challenge_reward_text}," +
        "#{challenge_city_id}" +
        ");")
public boolean insertChallenge(ChallengeResource.Entity challenge);
```

#####  插入多行

``` 
@Options(useGeneratedKeys = false, keyProperty = "challengeAttendResourceList[].challenge_attend_id", keyColumn = "challenge_attend_id")
@Insert("<script>" +
        "insert into t_challenge_attend (" +
        "challenge_attend_challenge_id," +
        "challenge_attend_user_id," +
        "challenge_attend_state" +
        ") values " +
        "<foreach collection=\"challengeAttendResourceList\" item=\"item\" index=\"index\" open=\"(\" close=\")\" separator=\"),(\">\n" +
        "    ${item.challenge_attend_challenge_id},\n" +
        "    ${item.challenge_attend_user_id},\n" +
        "    ${item.challenge_attend_state}\n" +
        "</foreach>  " +
        ";</script>")
public boolean insertChallengeAttendSingleOrMultiple(@Param("challengeAttendResourceList") List<ChallengeAttendResource.Entity> challengeAttendResourceList);
```
