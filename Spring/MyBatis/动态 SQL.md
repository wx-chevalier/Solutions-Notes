# 动态 SQL

MyBatis  的真正强大在于它的映射语句，由于它的异常强大，映射器的XML  文件就显得相对简单。如果拿它跟具有相同功能的JDBC  代码进行对比，你会立即发现省掉了将近95%  的代码。MyBatis  就是针对SQL  构建的，并且比普通的方法做的更好。

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

# 查询

# 插入

``` java
@Options(useGeneratedKeys = true, keyProperty = "challenge_id")
@Insert("insert into t_challenge(" +
        "challenge_user_id_creator," +
        "challenge_city_id)" +
        "values(" +
        "#{challenge_user_id_creator}," +
        "#{challenge_city_id}" +
        ");")
public boolean insertChallenge(ChallengeResource.Entity challenge);
```

## 多行插入

## 插入多行

``` java
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
