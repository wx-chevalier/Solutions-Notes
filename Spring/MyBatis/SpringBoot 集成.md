# Spring Boot 中集成 MyBatis 

在 Mybatis 3.5支持Optional 之后，我们还可以将判断优雅化为如下形式：

```java
@Mapper
public interface UserMapper {
    @Select("select * from user where id = #{id}")
    Optional<User> selectById(Long id);
}
```

```java
public class UserController {
    @Autowired
    private UserMapper userMapper;

    @GetMapping("/{id}")
    public User findById(@PathVariable Long id) {
        User user = this.userMapper.selectById(id);
        if(user == null) {
          // 抛异常，或者做点其他事情
        }
    }
}
```

```java
public class UserController {
    @Autowired
    private UserMapper userMapper;

    @GetMapping("/{id}")
    public User findById(@PathVariable Long id) {
        return this.userMapper.selectById(id)
                .orElseThrow(() -> new IllegalArgumentException("This user does not exit!"));
    }
}
```