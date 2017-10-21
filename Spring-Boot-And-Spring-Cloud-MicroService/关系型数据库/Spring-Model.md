
# Spring JDBC

Spring JDBC框架提供了多种访问数据库的方法，其中最著名的就是使用`JdbcTemplate`这个类。这也是主要的用于管理数据库连接与异常处理的类。要使用Spring JDBC的话，首先需要在pom.xml文件中配置依赖项：

``` xml
<dependency>
    <groupId>org.springframework</groupId>
    <artifactId>spring-context</artifactId>
    <version>${spring.version}</version>
</dependency>
<dependency>
    <groupId>mysql</groupId>
    <artifactId>mysql-connector-java</artifactId>
    <version>5.1.26</version>
</dependency>
```

## Query

``` java
@SuppressWarnings({ "unchecked", "rawtypes" })
public Employee findById(int id){
    String sql = "SELECT * FROM EMPLOYEE WHERE ID = ?";
    jdbcTemplate = new JdbcTemplate(dataSource);
    Employee employee = (Employee) jdbcTemplate.queryForObject(
    sql, new Object[] { id }, new BeanPropertyRowMapper(Employee.class));
    return employee;
}
```

在query中，最后需要传入一个继承自RowMapper的实现类，有时候方便起见，也可以直接传入一个Entity。如果是采用的RowMapper模式，需要实现如下的映射器类：

``` java
package com.javacodegeeks.snippets.enterprise;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.springframework.jdbc.core.RowMapper;

@SuppressWarnings("rawtypes")
public class EmployeeRowMapper implements RowMapper	{
public Object mapRow(ResultSet rs, int rowNum) throws SQLException {
Employee employee = new Employee();
employee.setId(rs.getInt("ID"));
employee.setName(rs.getString("NAME"));
employee.setAge(rs.getInt("AGE"));
return employee;
}
}
```

最后在调用的时候，把映射器作为最后一个参数传入：

``` java
Employee employee = (Employee) jdbcTemplate.queryForObject(sql, new Object[] { id }, new EmployeeRowMapper());
```



## Insert

``` java
public void insert(Employee employee){

String sql = "INSERT INTO EMPLOYEE " +
"(ID, NAME, AGE) VALUES (?, ?, ?)";

jdbcTemplate = new JdbcTemplate(dataSource);

jdbcTemplate.update(sql, new Object[] { employee.getId(),
employee.getName(), employee.getAge()  
});
}
```

有时候需要在插入之后，将插入行自动生成的主键返回，可以使用jdbcTemplate中提供的KeyHolder来实现：

``` java
package com.javacreed.examples.spring;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.sql.Statement;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.PreparedStatementCreator;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;

public class ExampleDao {

  @Autowired
  private JdbcTemplate jdbcTemplate;

  public long addNew(final String name) {
    final PreparedStatementCreator psc = new PreparedStatementCreator() {
      @Override
      public PreparedStatement createPreparedStatement(final Connection connection) throws SQLException {
        final PreparedStatement ps = connection.prepareStatement("INSERT INTO `names` (`name`) VALUES (?)",
            Statement.RETURN_GENERATED_KEYS);
        ps.setString(1, name);
        return ps;
      }
    };

    // The newly generated key will be saved in this object
    final KeyHolder holder = new GeneratedKeyHolder();

    jdbcTemplate.update(psc, holder);

    final long newNameId = holder.getKey().longValue();
    return newNameId;
  }
}
```

