# Spring Mybatis

```xml
<bean id="dataSource" class="org.springframework.jdbc.datasource.DriverManagerDataSource">
  <property name="driverClassName" value="com.microsoft.sqlserver.jdbc.SQLServerDriver"/>
  <property name="url" value="${center.connectionURL}"/>
  <property name="username"value="${userName}"/>
  <property name="password" value="${password}"/>
</bean>


<bean class="org.mybatis.spring.mapper.MapperScannerConfigurer">
  <property name="basePackage" value="com.xxx.dao.center"/>
  <property name="sqlSessionFactoryBeanName" value="cneterSqlSessionFactory"/>
</bean>


<bean id="sqlSessionFactory" class="org.mybatis.spring.SqlSessionFactoryBean" name="cneterSqlSessionFactory">
  <property name="dataSource" ref="dataSource"></property>
  <property name="mapperLocations" value="classpath*:mapperConfig/center/*.xml"/>
  <property name="configLocation" value="classpath:mybatis-config.xml"/>
</bean>


<bean id="transactionManager" class="org.springframework.jdbc.datasource.DataSourceTransactionManager">
  <property name="dataSource" ref="dataSource"/>
</bean>
<tx:annotation-driven transaction-manager="transactionManager"/>
<!--center db end-->
<!--exdb-->
<bean id="dataSourceEx" class="org.springframework.jdbc.datasource.DriverManagerDataSource">
  <property name="driverClassName" value="com.microsoft.sqlserver.jdbc.SQLServerDriver"/>
  <property name="url" value="${ex.connectionURL}"/>
  <property name="username"value="${userName}"/>
  <property name="password" value="${password}"/>
</bean>
<bean class="org.mybatis.spring.mapper.MapperScannerConfigurer">
  <property name="basePackage" value="com.xxx.dao.ex"/>
  <property name="sqlSessionFactoryBeanName" value="exSqlSessionFactory"/>
</bean>
<bean id="sqlSessionFactoryEx" class="org.mybatis.spring.SqlSessionFactoryBean" name="exSqlSessionFactory">
  <property name="dataSource" ref="dataSourceEx"></property>
  <property name="mapperLocations" value="classpath*:mapperConfig/ex/*.xml"/>
  <property name="configLocation" value="classpath:mybatis-config.xml"/>
</bean>
<bean id="transactionManagerEx" class="org.springframework.jdbc.datasource.DataSourceTransactionManager">
  <property name="dataSource" ref="dataSourceEx"/>
</bean>
```

```java
import org.apache.ibatis.session.SqlSessionFactory;
import org.apache.ibatis.type.JdbcType;
import org.mybatis.spring.SqlSessionFactoryBean;
import org.mybatis.spring.mapper.MapperScannerConfigurer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.datasource.DataSourceTransactionManager;
import org.springframework.jdbc.datasource.lookup.JndiDataSourceLookup;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.annotation.EnableTransactionManagement;


import javax.sql.DataSource;


@Configuration
@ComponentScan(basePackages = "com.mycompany")
@EnableTransactionManagement(proxyTargetClass = true)
public class ApplicationConfig2 {
  public static final String DATA_SOURCE_NAME_1 = "jdbc/dataSource1";
  public static final String DATA_SOURCE_NAME_2 = "jdbc/dataSource2";


  public static final String SQL_SESSION_FACTORY_NAME_1 = "sqlSessionFactory1";
  public static final String SQL_SESSION_FACTORY_NAME_2 = "sqlSessionFactory2";


  public static final String MAPPERS_PACKAGE_NAME_1 = "com.mycompany.mappers.dao1";
  public static final String MAPPERS_PACKAGE_NAME_2 = "com.mycompany.mappers.dao2";


  @Bean
  public DataSource dataSource1() {
  JndiDataSourceLookup dsLookup = new JndiDataSourceLookup();
  return dsLookup.getDataSource(DATA_SOURCE_NAME_1);
  }


  @Bean
  public DataSource dataSource2() {
  JndiDataSourceLookup dsLookup = new JndiDataSourceLookup();
  return dsLookup.getDataSource(DATA_SOURCE_NAME_2);
  }


  @Bean
  public PlatformTransactionManager transactionManager() {
  return new DataSourceTransactionManager(dataSource());
  }




  @Bean(name = SQL_SESSION_FACTORY_NAME_1)
  public SqlSessionFactory sqlSessionFactory1(DataSource dataSource1) throws Exception {
  SqlSessionFactoryBean sqlSessionFactoryBean = new SqlSessionFactoryBean();
  sqlSessionFactoryBean.setTypeHandlersPackage(DateTimeTypeHandler.class.getPackage().getName());
  sqlSessionFactoryBean.setDataSource(dataSource1);
  SqlSessionFactory sqlSessionFactory = sqlSessionFactoryBean.getObject();
  sqlSessionFactory.getConfiguration().setMapUnderscoreToCamelCase(true);
  sqlSessionFactory.getConfiguration().setJdbcTypeForNull(JdbcType.NULL);
  return sqlSessionFactory;
  }


  @Bean(name = SQL_SESSION_FACTORY_NAME_2)
  public SqlSessionFactory sqlSessionFactory2(DataSource dataSource2) throws Exception {
  SqlSessionFactoryBean diSqlSessionFactoryBean = new SqlSessionFactoryBean();
  diSqlSessionFactoryBean.setTypeHandlersPackage(DateTimeTypeHandler.class.getPackage().getName());
  diSqlSessionFactoryBean.setDataSource(dataSource2);
  SqlSessionFactory sqlSessionFactory = diSqlSessionFactoryBean.getObject();
  sqlSessionFactory.getConfiguration().setMapUnderscoreToCamelCase(true);
  sqlSessionFactory.getConfiguration().setJdbcTypeForNull(JdbcType.NULL);
  return sqlSessionFactory;
  }


  @Bean
  public MapperScannerConfigurer mapperScannerConfigurer1() {
  MapperScannerConfigurer configurer = new MapperScannerConfigurer();
  configurer.setBasePackage(MAPPERS_PACKAGE_NAME_1);
  configurer.setSqlSessionFactoryBeanName(SQL_SESSION_FACTORY_NAME_1);
  return configurer;
  }


  @Bean
  public MapperScannerConfigurer mapperScannerConfigurer2() {
  MapperScannerConfigurer configurer = new MapperScannerConfigurer();
  configurer.setBasePackage(MAPPERS_PACKAGE_NAME_2);
  configurer.setSqlSessionFactoryBeanName(SQL_SESSION_FACTORY_NAME_2);
  return configurer;
  }
}
```

```java
@Bean
@Primary
public DataSource dataSource1() {
  JndiDataSourceLookup dsLookup = new JndiDataSourceLookup();
  return dsLookup.getDataSource(DATA_SOURCE_NAME_1);
}


@Bean
public DataSource dataSource2() {
  JndiDataSourceLookup dsLookup = new JndiDataSourceLookup();
  return dsLookup.getDataSource(DATA_SOURCE_NAME_2);
}
```
