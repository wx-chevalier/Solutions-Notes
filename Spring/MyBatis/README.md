# MyBatis

MyBatis 是支持普通 SQL 查询，存储过程和高级映射的优秀持久层框架，它提供一种半自动化的 ORM 实现。这里的“半自动化”，是相对 Hibernate 等提供了全面的数据库封装机制的“全自动化”ORM 实现而言，全自动 ORM 实现了 POJO 和数据库表之间的映射，以及 SQL 的自动生成和执行。MyBatis 消除了几乎所有的 JDBC 代码和参数的手工设置以及对结果集的检索。 MyBatis 可以使用简单的 XML 或注解用于配置和原始映射，将接口和 Java 的 POJO（Plain Old Java Objects，普通的 Java 对象）映射成数据库中的记录。

MyBatis 允许将 SQL 写在 XML 中，便于统一的管理与优化，并且与程序代码解耦合。同时 MyBatis 提供了映射标签，支持对象与数据库 ORM 字段关系映射，支持编写动态 SQL。不过 MyBatis 也存在不少的痛点，由于 XML 里标签 ID 必须唯一，导致 DAO 中的方法不支持重载，并且 DAO 层过于简单，仍然需要大量对象组装的工作量。同时字段映射标签和对象关系映射标签仅仅是对映射关系的描述，具体实现仍然依赖于 SQL；譬如配置了一对多的 Collection 标签之后，如果 SQL 中没有 Join 子查询或者查询子表的话，查询后返回的对象是不具备对象关系的，即 Collection 的对象为 null。

# 数据类型

无论是 MyBatis 在预处理语句（PreparedStatement）中设置一个参数时，还是从结果集中取出一个值时， 都会用类型处理器将获取的值以合适的方式转换成 Java 类型。从 3.4.5 开始，MyBatis 默认支持 JSR-310(日期和时间 API) 。

```
 JDBCType            JavaType
  CHAR                String
  VARCHAR             String
  LONGVARCHAR         String
  NUMERIC             java.math.BigDecimal
  DECIMAL             java.math.BigDecimal
  BIT                 boolean
  BOOLEAN             boolean
  TINYINT             byte
  SMALLINT            short
  INTEGER             int
  BIGINT              long
  REAL                float
  FLOAT               double
  DOUBLE              double
  BINARY              byte[]
  VARBINARY           byte[]
  LONGVARBINARY               byte[]
  DATE                java.sql.Date
  TIME                java.sql.Time
  TIMESTAMP           java.sql.Timestamp
  CLOB                Clob
  BLOB                Blob
  ARRAY               Array
  DISTINCT            mapping of underlying type
  STRUCT              Struct
  REF                 Ref
  DATALINK            java.net.URL
```

# 链接

- https://mp.weixin.qq.com/s/X4pCR662mmFrcRM0tglaLg?from=groupmessage&isappinstalled=0