.wiz-todo, .wiz-todo-img {width: 16px; height: 16px; cursor: default; padding: 0 10px 0 2px; vertical-align: -10%;-webkit-user-select: none;} .wiz-todo-label { display: inline-block; padding-top: 7px; padding-bottom: 6px; line-height: 1.5;} .wiz-todo-label-checked { /*text-decoration: line-through;*/ color: #666;} .wiz-todo-label-unchecked {text-decoration: initial;} .wiz-todo-completed-info {padding-left: 44px; display: inline-block; } .wiz-todo-avatar { width:20px; height: 20px; vertical-align: -20%; margin-right:10px; border-radius: 2px;} .wiz-todo-account, .wiz-todo-dt { color: #666; }
[TOC]
# Introduction

## Reference

### Books



- [another-tutorial-about-java-web](https://github.com/someus/another-tutorial-about-java-web) 
### Practice & Resources

- [推荐几个自己写的范例项目](http://wosyingjun.iteye.com/blog/2312553?hmsr=toutiao.io&utm_medium=toutiao.io&utm_source=toutiao.io):基于Spring MVC的最佳实践
# Quick Start

## Spring Boot

> 
- [Spring Boot官方文档](http://docs.spring.io/spring-boot/docs/1.3.0.RC1/reference/htmlsingle/#getting-started-introducing-spring-boot)
> 
- [Spring Boot性能评测](http://spring.io/blog/2015/12/10/spring-boot-memory-performance)

Spring Boot充分利用了JavaConfig的配置模式以及“约定优于配置”的理念，能够极大的简化基于Spring MVC的Web应用和REST服务开发。Spring Boot可以使得创建独立的产品级别的基于Spring的应用程序变得更加简单，使得能够做到开箱即用。Spring Boot可以用于创建能够直接用`java -jar`命令运行的或者类似于传统的war部署方式的应用程序。同样也提供了所谓的`spring scripts`这样的命令行工具。

### Installation

一方面，可以直接从Spring提供的父项目中集成所有相关的依赖，如下方式：

``` xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.example</groupId>
    <artifactId>myproject</artifactId>
    <version>0.0.1-SNAPSHOT</version>

    <!-- Inherit defaults from Spring Boot -->
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>1.3.0.RC1</version>
    </parent>

    <!-- Add typical dependencies for a web application -->
    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
    </dependencies>

    <!-- Package as an executable jar -->
    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
        </plugins>
    </build>

    <!-- Add Spring repositories -->
    <!-- (you don't need this if you are using a .RELEASE version) -->
    <repositories>
        <repository>
            <id>spring-snapshots</id>
            <url>http://repo.spring.io/snapshot</url>
            <snapshots><enabled>true</enabled></snapshots>
        </repository>
        <repository>
            <id>spring-milestones</id>
            <url>http://repo.spring.io/milestone</url>
        </repository>
    </repositories>
    <pluginRepositories>
        <pluginRepository>
            <id>spring-snapshots</id>
            <url>http://repo.spring.io/snapshot</url>
        </pluginRepository>
        <pluginRepository>
            <id>spring-milestones</id>
            <url>http://repo.spring.io/milestone</url>
        </pluginRepository>
    </pluginRepositories>
</project>
```

当然，很多情况下并不是都适合从`spring-boot-starter-parent`项目中继承POM文件，同样的，可以直接从该项目中继承依赖，即是使用如下方式：

``` xml
<dependencyManagement>
     <dependencies>
        <dependency>
            <!-- Import dependency management from Spring Boot -->
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-dependencies</artifactId>
            <version>1.3.0.RC1</version>
            <type>pom</type>
            <scope>import</scope>

        </dependency>    <dependency>
        <groupId>org.hibernate</groupId>
        <artifactId>hibernate-validator-annotation-processor</artifactId>
        <version>4.1.0.Final</version>
    </dependency>
    <dependency>
        <groupId>javax.el</groupId>
        <artifactId>javax.el-api</artifactId>
        <version>2.2.4</version>
    </dependency>
    </dependencies>
</dependencyManagement>
```

### Code

``` java
import org.springframework.boot.*;
import org.springframework.boot.autoconfigure.*;
import org.springframework.stereotype.*;
import org.springframework.web.bind.annotation.*;

@RestController
@EnableAutoConfiguration
public class Example {

    @RequestMapping("/")
    String home() {
        return "Hello World!";
    }

    public static void main(String[] args) throws Exception {
        SpringApplication.run(Example.class, args);
    }

}
```

很多时候，也可以在配置文件中引入XML的配置文件：

``` java
package sample.integration;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.ImportResource;

@SpringBootApplication
@EnableConfigurationProperties(ServiceProperties.class)
@ImportResource("integration-context.xml")
public class SampleIntegrationApplication {

	public static void main(String[] args) throws Exception {
		SpringApplication.run(SampleIntegrationApplication.class, args);
	}

}
```

### Run

``` 
$ mvn spring-boot:run

  .   ____          _            __ _ _
 /\\ / ___'_ __ _ _(_)_ __  __ _ \ \ \ \
( ( )\___ | '_ | '_| | '_ \/ _` | \ \ \ \
 \\/  ___)| |_)| | | | | || (_| |  ) ) ) )
  '  |____| .__|_| |_|_| |_\__, | / / / /
 =========|_|==============|___/=/_/_/_/
 :: Spring Boot ::  (v1.3.0.RC1)
....... . . .
....... . . . (log output here)
....... . . .
........ Started Example in 2.222 seconds (JVM running for 6.514)
```



## Sketch(零基础配置)

### web.xml

#### Servlet

``` xml
<servlet>
    <servlet-name>springmvc</servlet-name>
    <servlet-class>org.springframework.web.servlet.DispatcherServlet</servlet-class>
    <init-param>
        <param-name>contextConfigLocation</param-name>
        <param-value>classpath:spring/webmvc-config.xml</param-value>
    </init-param>
    <load-on-startup>1</load-on-startup>
    <async-supported>true</async-supported>
</servlet>
```



# Configuration

## XML-Based

## Java-Based



# Controller

## Handler

### HttpServletRequest

``` java
@Autowired HttpServletRequest request;
```

### HttpServletResponse

注意，HttpServletResponse无法使用自动注入进行插入，如果需要获取该对象，可以在具体的Controller方法中加入HttpServletResponse这个参数，譬如：

``` java
public DeferredResult<String> autologin(
        @PathVariable String user_id,//路徑參數,在统一的鉴权的Aspect中完成替换
        @RequestParam("requestData") String requestData,//請求數據,
        HttpServletResponse response//固定写法，把HttpServletResponse放在最后
)
```

这样的话就可以在AOP中获取到response对象。

## Request Mapping(请求映射)

### 路径匹配

\1. The container will try to find an exact match of the path of the request to the path of the servlet. A successful match selects the servlet.

\2. The container will recursively try to match the longest path-prefix. This is done by stepping down the path tree a directory at a time, using the ’/’ character as a path separator. The longest match determines the servlet selected.

\3. If the last segment in the URL path contains an extension (e.g. .jsp), the servlet container will try to match a servlet that handles requests for the extension. An extension is defined as the part of the last segment after the last ’.’ character.

\4. If neither of the previous three rules result in a servlet match, the container will attempt to serve content appropriate for the resource requested. If a “default” servlet is defined for the application, it will be used.

@RequestMapping是Spring MVC中最常用的注解之一，`org.springframework.web.bind.annotation.RequestMapping`被用于将某个请求映射到具体的处理类或者方法中

- **@RequestMapping with Class**

``` java
@Controller
@RequestMapping("/home")
public class HomeController {

}
```

- **@RequestMapping with Method**

``` java
@RequestMapping(value="/method0")
@ResponseBody
public String method0(){
    return "method0";
}
```

- **@RequestMapping with Multiple URI**

``` java
@RequestMapping(value={"/method1","/method1/second"})
@ResponseBody
public String method1(){
    return "method1";
}
```

- **@RequestMapping with HTTP Method**

``` java
@RequestMapping(value="/method2", method=RequestMethod.POST)
@ResponseBody
public String method2(){
    return "method2";
}

@RequestMapping(value="/method3", method={RequestMethod.POST,RequestMethod.GET})
@ResponseBody
public String method3(){
    return "method3";
}
```

- **@RequestMapping default method**：用于某个类映射下的默认处理方法

``` java
@RequestMapping()
@ResponseBody
public String defaultMethod(){
    return "default method";
}
```

- **@RequestMapping fallback method**

``` java
@RequestMapping("*")
@ResponseBody
public String fallbackMethod(){
    return "fallback method";
}
```



### 请求过滤

- headers

``` java
@RequestMapping(value="/method4", headers="name=pankaj")
@ResponseBody
public String method4(){
    return "method4";
}

@RequestMapping(value="/method5", headers={"name=pankaj", "id=1"})
@ResponseBody
public String method5(){
    return "method5";
}
```



- produces

@RequestMapping(value = "/produces", produces = "application/json")：表示将功能处理方法将生产json格式的数据，此时根据请求头中的Accept进行匹配，如请求头“Accept:application/json”时即可匹配;

@RequestMapping(value = "/produces", produces = "application/xml")：表示将功能处理方法将生产xml格式的数据，此时根据请求头中的Accept进行匹配，如请求头“Accept:application/xml”时即可匹配。

此种方式相对使用@RequestMapping的“headers = "Accept=application/json"”更能表明你的目的。

@RequestMapping(produces={"text/html", "application/json"}) ：将匹配“Accept:text/html”或“Accept:application/json”。

## Request Params(请求参数)

Spring MVC在完成路径映射之后，需要进行请求参数的提取，即参数绑定常用的注解，主要可以分为以下四大类型：

A、处理requet uri 部分（这里指uri template中variable，不含queryString部分）的注解：   @PathVariable;

B、处理request header部分的注解：   @RequestHeader, @CookieValue;

C、处理request body部分的注解：@RequestParam,  @RequestBody;

D、处理attribute类型是注解： @SessionAttributes, @ModelAttribute;

### @PathVariable 

当使用@RequestMapping URI template 样式映射时， 即 someUrl/{paramId}, 这时的paramId可通过 @Pathvariable注解绑定它传过来的值到方法的参数上。

``` java
@Controller
@RequestMapping("/owners/{ownerId}")
public class RelativePathUriTemplateController {

  @RequestMapping("/pets/{petId}")
  public void findPet(@PathVariable String ownerId, @PathVariable String petId, Model model) {    
    // implementation omitted
  }
}
```

上面代码把URI template 中变量 ownerId的值和petId的值，绑定到方法的参数上。若方法参数名称和需要绑定的uri template中变量名称不一致，需要在@PathVariable("name")指定uri template中的名称。

### @RequestHeader&@CookieValue

@RequestHeader 注解，可以把Request请求header部分的值绑定到方法的参数上。这是一个Request 的header部分：

``` 
Host                    localhost:8080
Accept                  text/html,application/xhtml+xml,application/xml;q=0.9
Accept-Language         fr,en-gb;q=0.7,en;q=0.3
Accept-Encoding         gzip,deflate
Accept-Charset          ISO-8859-1,utf-8;q=0.7,*;q=0.7
Keep-Alive              300
```

``` java
@RequestMapping("/displayHeaderInfo.do")
public void displayHeaderInfo(@RequestHeader("Accept-Encoding") String encoding,
                              @RequestHeader("Keep-Alive") long keepAlive)  {

  //...

}
```

上面的代码，把request header部分的 Accept-Encoding的值，绑定到参数encoding上了， Keep-Alive header的值绑定到参数keepAlive上。@CookieValue 可以把Request header中关于cookie的值绑定到方法的参数上。

例如有如下Cookie值：

``` 
JSESSIONID=415A4AC178C59DACE0B2C9CA727CDD84
```

参数绑定的代码：

``` java
@RequestMapping("/displayHeaderInfo.do")
public void displayHeaderInfo(@CookieValue("JSESSIONID") String cookie)  {

  //...

}
```

即把JSESSIONID的值绑定到参数cookie上。

### @RequestParam

A） 常用来处理简单类型的绑定，通过Request.getParameter() 获取的String可直接转换为简单类型的情况（ String--> 简单类型的转换操作由ConversionService配置的转换器来完成）；因为使用request.getParameter()方式获取参数，所以可以处理get 方式中queryString的值，也可以处理post方式中 body data的值；

B）用来处理Content-Type: 为 `application/x-www-form-urlencoded`编码的内容，提交方式GET、POST；

C) 该注解有两个属性： value、required； value用来指定要传入值的id名称，required用来指示参数是否必须绑定；

``` java
@Controller
@RequestMapping("/pets")
@SessionAttributes("pet")
public class EditPetForm {

    // ...

    @RequestMapping(method = RequestMethod.GET)
    public String setupForm(@RequestParam("petId") int petId, ModelMap model) {
        Pet pet = this.clinic.loadPet(petId);
        model.addAttribute("pet", pet);
        return "petForm";
    }

    // ...
```

### @RequestBody

该注解常用来处理Content-Type: 不是`application/x-www-form-urlencoded`编码的内容，例如application/json, application/xml等；

它是通过使用HandlerAdapter 配置的`HttpMessageConverters`来解析post data body，然后绑定到相应的bean上的。

因为配置有FormHttpMessageConverter，所以也可以用来处理 `application/x-www-form-urlencoded`的内容，处理完的结果放在一个MultiValueMap<String, String>里，这种情况在某些特殊需求下使用，详情查看FormHttpMessageConverter api;

``` java
@RequestMapping(value = "/something", method = RequestMethod.PUT)
public void handle(@RequestBody String body, Writer writer) throws IOException {
  writer.write(body);
}
```

### @SessionAttributes

该注解用来绑定HttpSession中的attribute对象的值，便于在方法中的参数里使用。

该注解有value、types两个属性，可以通过名字和类型指定要使用的attribute 对象；

示例代码：

``` java
@Controller
@RequestMapping("/editPet.do")
@SessionAttributes("pet")
public class EditPetForm {
    // ...
}
```

### @ModelAttribute

该注解有两个用法，一个是用于方法上，一个是用于参数上；

用于方法上时：  通常用来在处理@RequestMapping之前，为请求绑定需要从后台查询的model；

用于参数上时： 用来通过名称对应，把相应名称的值绑定到注解的参数bean上；要绑定的值来源于：

A） @SessionAttributes 启用的attribute 对象上；

B） @ModelAttribute 用于方法上时指定的model对象；

C） 上述两种情况都没有时，new一个需要绑定的bean对象，然后把request中按名称对应的方式把值绑定到bean中。

用到方法上@ModelAttribute的示例代码：

``` java
// Add one attribute
// The return value of the method is added to the model under the name "account"
// You can customize the name via @ModelAttribute("myAccount")

@ModelAttribute
public Account addAccount(@RequestParam String number) {
    return accountManager.findAccount(number);
}

```

这种方式实际的效果就是在调用@RequestMapping的方法之前，为request对象的model里put（“account”， Account）；

用在参数上的@ModelAttribute示例代码：

``` java
@RequestMapping(value="/owners/{ownerId}/pets/{petId}/edit", method = RequestMethod.POST)
public String processSubmit(@ModelAttribute Pet pet) {

}
```

首先查询 @SessionAttributes有无绑定的Pet对象，若没有则查询@ModelAttribute方法层面上是否绑定了Pet对象，若没有则将URI template中的值按对应的名称绑定到Pet对象的各属性上。

## Response

### Json

### Jsonp

对于Jsonp风格的请求，Spring在返回时需要加以修改已支持前端的跨域调用，在后端处理方式如下：

``` java
protected String responseHandler(JSONObject rtn, 
        HttpServletRequest request) {
			if(request.getParameter("callback") != null){
				//将数据填充到callback，并回调
				StringBuffer buf = new StringBuffer();
				buf.append(request.getParameter("callback"));
				buf.append("(");
				buf.append(rtn.toJSONString());
				buf.append(");");
				return buf.toString();
			}
			// TODO Auto-generated method stub
			return rtn.toJSONString();
		}
```

前端请求方式：

``` javascript
jsonp: function (path, params, callback) {
    //构造出URL
    var url = 'http://localhost:8080/' + path + '?requestData=' + JSON.stringify(params) + '&callback=JSON_CALLBACK';
    console.log(url);
    //发起网络请求
    $http({
        method: 'JSONP',
        url: url
    }).success(function (data, status, headers, config) {
        console.log(data);
    }).error(errorCallBack);

}
```

## Restful





# Model

## Spring JDBC



## Transaction(事务管理)

### Programmatic transaction management(编程式事务)

### 声明式事务

``` java
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:p="http://www.springframework.org/schema/p"
       xmlns:context="http://www.springframework.org/schema/context"
       xmlns:tx="http://www.springframework.org/schema/tx"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans-3.0.xsd
        http://www.springframework.org/schema/aop http://www.springframework.org/schema/aop/spring-aop-3.0.xsd
        http://www.springframework.org/schema/context http://www.springframework.org/schema/context/spring-context-3.0.xsd
        http://www.springframework.org/schema/jee http://www.springframework.org/schema/jee/spring-jee-3.0.xsd
        http://www.springframework.org/schema/tx http://www.springframework.org/schema/tx/spring-tx-3.0.xsd">

    <context:annotation-config/>

    <context:component-scan base-package="com.edw.springmybatis.service"/>

    <!-- middleware datasource  -->
    <bean id="dataSource" class="org.apache.commons.dbcp.BasicDataSource" destroy-method="close"
          p:driverClassName="com.mysql.jdbc.Driver" p:url="jdbc:mysql://localhost/test"
          p:username="root" p:password=""
          p:initialSize="2"
          p:maxActive="30"
          p:maxIdle="10"
          p:minIdle="3"
          p:maxWait="30000"
          p:removeAbandoned="true"
          p:removeAbandonedTimeout="30"
          p:validationQuery="SELECT 1" />

    <bean id="sqlSessionFactory" class="org.mybatis.spring.SqlSessionFactoryBean">
        <property name="dataSource" ref="dataSource" />
        <property name="configLocation" value="/WEB-INF/configuration.xml" />
    </bean>

    <bean class="org.mybatis.spring.mapper.MapperScannerConfigurer">
        <property name="basePackage" value="com.edw.springmybatis.mapper" />
    </bean>

    <tx:annotation-driven transaction-manager="transactionManager"/>

    <bean id="transactionManager"
          class="org.springframework.jdbc.datasource.DataSourceTransactionManager">
        <property name="dataSource" ref="dataSource" />
    </bean>   
</beans>
```

## Cache

### Ehcache

关键的pom文件声明如下：

``` xml

	<dependency>
		<groupId>net.sf.ehcache</groupId>
		<artifactId>ehcache</artifactId>
		<version>2.9.0</version>
	</dependency>

        <!-- Optional, to log stuff -->
	<dependency>
		<groupId>ch.qos.logback</groupId>
		<artifactId>logback-classic</artifactId>
		<version>1.0.13</version>
	</dependency>

	<!-- Spring caching framework inside this -->
	<dependency>
		<groupId>org.springframework</groupId>
		<artifactId>spring-context</artifactId>
		<version>4.1.4.RELEASE</version>
	</dependency>

	<!-- Support for Ehcache and others -->
	<dependency>
		<groupId>org.springframework</groupId>
		<artifactId>spring-context-support</artifactId>
		<version>4.1.4.RELEASE</version>
	</dependency>
```



然后在Spring的配置文件中：

``` xml
    <!-- 缓存配置 -->  
    <!-- Spring自己的基于java.util.concurrent.ConcurrentHashMap实现的缓存管理器(该功能是从Spring3.1开始提供的) -->  
    <!--   
    <bean id="cacheManager" class="org.springframework.cache.support.SimpleCacheManager">  
        <property name="caches">  
            <set>  
                <bean name="myCache" class="org.springframework.cache.concurrent.ConcurrentMapCacheFactoryBean"/>  
            </set>  
        </property>  
    </bean>  
     -->  
    <!-- 若只想使用Spring自身提供的缓存器,则注释掉下面的两个关于Ehcache配置的bean,并启用上面的SimpleCacheManager即可 -->  
    <!-- Spring提供的基于的Ehcache实现的缓存管理器 -->  
<bean id="cacheManager"
      class="org.springframework.cache.ehcache.EhCacheCacheManager" p:cache-manager-ref="ehcache"/>

<!-- EhCache library setup -->
<bean id="ehcache"
     class="org.springframework.cache.ehcache.EhCacheManagerFactoryBean" p:config-location="ehcache.xml"/>
```



相对应的ehcache的配置如下：

``` xml
<!-- Ehcache2.x的变化(取自https://github.com/springside/springside4/wiki/Ehcache) -->
<!-- 1)最好在ehcache.xml中声明不进行updateCheck -->
<!-- 2)为了配合BigMemory和Size Limit,原来的属性最好改名 -->
<!--   maxElementsInMemory->maxEntriesLocalHeap -->
<!--   maxElementsOnDisk->maxEntriesLocalDisk -->
<ehcache xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	xsi:noNamespaceSchemaLocation="ehcache.xsd" 
	updateCheck="true"
	monitoring="autodetect" 
	dynamicConfig="true">
	<diskStore path="java.io.tmpdir"/>
	<defaultCache
		   maxElementsInMemory="1000"
		   eternal="false"
		   timeToIdleSeconds="120"
		   timeToLiveSeconds="120"
		   overflowToDisk="false"/>
	<cache name="myCache"
		   maxElementsOnDisk="20000"
		   maxElementsInMemory="2000"
		   eternal="true"
		   overflowToDisk="true"
		   diskPersistent="true"/>
    <cache name="movieFindCache" 
            maxEntriesLocalHeap="10000"
            maxEntriesLocalDisk="1000" 
            eternal="false" 
            diskSpoolBufferSizeMB="20"
            timeToIdleSeconds="300" timeToLiveSeconds="600"
            memoryStoreEvictionPolicy="LFU" 
            transactionalMode="off">
            <persistence strategy="localTempSwap" />
        </cache>
</ehcache>
<!--
<diskStore>==========当内存缓存中对象数量超过maxElementsInMemory时,将缓存对象写到磁盘缓存中(需对象实现序列化接口)
<diskStore path="">==用来配置磁盘缓存使用的物理路径,Ehcache磁盘缓存使用的文件后缀名是*.data和*.index
name=================缓存名称,cache的唯一标识(ehcache会把这个cache放到HashMap里)
maxElementsOnDisk====磁盘缓存中最多可以存放的元素数量,0表示无穷大
maxElementsInMemory==内存缓存中最多可以存放的元素数量,若放入Cache中的元素超过这个数值,则有以下两种情况
                     1)若overflowToDisk=true,则会将Cache中多出的元素放入磁盘文件中
                     2)若overflowToDisk=false,则根据memoryStoreEvictionPolicy策略替换Cache中原有的元素
eternal==============缓存中对象是否永久有效,即是否永驻内存,true时将忽略timeToIdleSeconds和timeToLiveSeconds
timeToIdleSeconds====缓存数据在失效前的允许闲置时间(单位:秒),仅当eternal=false时使用,默认值是0表示可闲置时间无穷大,此为可选属性
                     即访问这个cache中元素的最大间隔时间,若超过这个时间没有访问此Cache中的某个元素,那么此元素将被从Cache中清除
timeToLiveSeconds====缓存数据在失效前的允许存活时间(单位:秒),仅当eternal=false时使用,默认值是0表示可存活时间无穷大
                     即Cache中的某元素从创建到清楚的生存时间,也就是说从创建开始计时,当超过这个时间时,此元素将从Cache中清除
overflowToDisk=======内存不足时,是否启用磁盘缓存(即内存中对象数量达到maxElementsInMemory时,Ehcache会将对象写到磁盘中)
                     会根据标签中path值查找对应的属性值,写入磁盘的文件会放在path文件夹下,文件的名称是cache的名称,后缀名是data
diskPersistent=======是否持久化磁盘缓存,当这个属性的值为true时,系统在初始化时会在磁盘中查找文件名为cache名称,后缀名为index的文件
                     这个文件中存放了已经持久化在磁盘中的cache的index,找到后会把cache加载到内存
                     要想把cache真正持久化到磁盘,写程序时注意执行net.sf.ehcache.Cache.put(Element element)后要调用flush()方法
diskExpiryThreadIntervalSeconds==磁盘缓存的清理线程运行间隔,默认是120秒
diskSpoolBufferSizeMB============设置DiskStore（磁盘缓存）的缓存区大小,默认是30MB
memoryStoreEvictionPolicy========内存存储与释放策略,即达到maxElementsInMemory限制时,Ehcache会根据指定策略清理内存
                                 共有三种策略,分别为LRU(最近最少使用)、LFU(最常用的)、FIFO(先进先出)
-->
```

最后，在Java代码中只要直接声明并且自动注入一个`CacheManager`对象即可：

``` java
Cache cache = manager.getCache("sampleCache1");  
```







# Mybatis

> [mybatis-3-annotation-example-with-select-insert-update-and-delete](http://www.concretepage.com/mybatis-3/mybatis-3-annotation-example-with-select-insert-update-and-delete)

MyBatis是一个半自动化的SQL辅助工具，在MyBatis的生命周期中，常见有以下几个组件：

- SqlSessionFactoryBuilder

这个类可以被实例化、使用和丢弃，一旦创建了 SqlSessionFactory，就不再需要它了。因此 SqlSessionFactoryBuilder 实例的最佳范围是方法范围（也就是局部方法变量）。你可以重用 SqlSessionFactoryBuilder 来创建多个 SqlSessionFactory 实例，但是最好还是不要让其一直存在以保证所有的 XML 解析资源开放给更重要的事情。

- SqlSessionFactory

SqlSessionFactory 一旦被创建就应该在应用的运行期间一直存在，没有任何理由对它进行清除或重建。使用 SqlSessionFactory 的最佳实践是在应用运行期间不要重复创建多次，多次重建 SqlSessionFactory 被视为一种代码“坏味道（bad smell）”。因此 SqlSessionFactory 的最佳范围是应用范围。有很多方法可以做到，最简单的就是使用单例模式或者静态单例模式。

- SqlSession

每个线程都应该有它自己的 SqlSession 实例。SqlSession 的实例不是线程安全的，因此是不能被共享的，所以它的最佳的范围是请求或方法范围。绝对不能将 SqlSession 实例的引用放在一个类的静态域，甚至一个类的实例变量也不行。也绝不能将 SqlSession 实例的引用放在任何类型的管理范围中，比如 Serlvet 架构中的 HttpSession。如果你现在正在使用一种 Web 框架，要考虑 SqlSession 放在一个和 HTTP 请求对象相似的范围中。换句话说，每次收到的 HTTP 请求，就可以打开一个 SqlSession，返回一个响应，就关闭它。这个关闭操作是很重要的，你应该把这个关闭操作放到 finally 块中以确保每次都能执行关闭。下面的示例就是一个确保 SqlSession 关闭的标准模式：

``` 
SqlSession session = sqlSessionFactory.openSession();
try {
  // do work
} finally {
  session.close();
}
```

在你的所有的代码中一致性地使用这种模式来保证所有数据库资源都能被正确地关闭。

- 映射器实例（Mapper Instances）

映射器是创建用来绑定映射语句的接口。映射器接口的实例是从 SqlSession 中获得的。因此从技术层面讲，映射器实例的最大范围是和 SqlSession 相同的，因为它们都是从 SqlSession 里被请求的。尽管如此，映射器实例的最佳范围是方法范围。也就是说，映射器实例应该在调用它们的方法中被请求，用过之后即可废弃。并不需要显式地关闭映射器实例，尽管在整个请求范围（request scope）保持映射器实例也不会有什么问题，但是很快你会发现，像 SqlSession 一样，在这个范围上管理太多的资源的话会难于控制。所以要保持简单，最好把映射器放在方法范围（method scope）内。下面的示例就展示了这个实践：

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

要使用 MyBatis， 只需将 mybatis-x.x.x.jar 文件置于 classpath 中即可。如果使用 Maven 来构建项目，则需将下面的 dependency 代码置于 pom.xml 文件中：

``` xml
<dependency>
  <groupId>org.mybatis</groupId>
  <artifactId>mybatis</artifactId>
  <version>x.x.x</version>
</dependency>
```

### Java:直接在代码中创建

如果你更愿意直接从 Java 程序而不是 XML 文件中创建 configuration，或者创建你自己的 configuration 构建器，MyBatis 也提供了完整的配置类，提供所有和 XML 文件相同功能的配置项。

``` 
DataSource dataSource = BlogDataSourceFactory.getBlogDataSource();
TransactionFactory transactionFactory = new JdbcTransactionFactory();
Environment environment = new Environment("development", transactionFactory, dataSource);
Configuration configuration = new Configuration(environment);
configuration.addMapper(BlogMapper.class);
SqlSessionFactory sqlSessionFactory = new SqlSessionFactoryBuilder().build(configuration);
```

注意该例中，configuration 添加了一个映射器类（mapper class）。映射器类是 Java 类，它们包含 SQL 映射语句的注解从而避免了 XML 文件的依赖。不过，由于 Java 注解的一些限制加之某些 MyBatis 映射的复杂性，XML 映射对于大多数高级映射（比如：嵌套 Join 映射）来说仍然是必须的。有鉴于此，如果存在一个对等的 XML 配置文件的话，MyBatis 会自动查找并加载它（这种情况下， BlogMapper.xml 将会基于类路径和 BlogMapper.class 的类名被加载进来）。具体细节稍后讨论。

既然有了 SqlSessionFactory ，顾名思义，我们就可以从中获得 SqlSession 的实例了。SqlSession 完全包含了面向数据库执行 SQL 命令所需的所有方法。你可以通过 SqlSession 实例来直接执行已映射的 SQL 语句。例如：

``` java
SqlSession session = sqlSessionFactory.openSession();
try {
  Blog blog = (Blog) session.selectOne("org.mybatis.example.BlogMapper.selectBlog", 101);
} finally {
  session.close();
}
```

诚然这种方式能够正常工作，并且对于使用旧版本 MyBatis 的用户来说也比较熟悉，不过现在有了一种更直白的方式。使用对于给定语句能够合理描述参数和返回值的接口（比如说BlogMapper.class），你现在不但可以执行更清晰和类型安全的代码，而且还不用担心易错的字符串字面值以及强制类型转换。

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



### XML-Configuration:使用独立的XML配置文件

每个基于 MyBatis 的应用都是以一个 SqlSessionFactory 的实例为中心的。SqlSessionFactory 的实例可以通过 SqlSessionFactoryBuilder 获得。而 SqlSessionFactoryBuilder 则可以从 XML 配置文件或一个预先定制的 Configuration 的实例构建出 SqlSessionFactory 的实例。从 XML 文件中构建 SqlSessionFactory 的实例非常简单，建议使用类路径下的资源文件进行配置。但是也可以使用任意的输入流(InputStream)实例，包括字符串形式的文件路径或者 file:// 的 URL 形式的文件路径来配置。MyBatis 包含一个名叫 Resources 的工具类，它包含一些实用方法，可使从 classpath 或其他位置加载资源文件更加容易。

``` java
String resource = "org/mybatis/example/mybatis-config.xml";
InputStream inputStream = Resources.getResourceAsStream(resource);
sqlSessionFactory = new SqlSessionFactoryBuilder().build(inputStream);
```

XML 配置文件（configuration XML）中包含了对 MyBatis 系统的核心设置，包含获取数据库连接实例的数据源（DataSource）和决定事务范围和控制方式的事务管理器（TransactionManager）。XML 配置文件的详细内容后面再探讨，这里先给出一个简单的示例：

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

### Spring-Integrated:在Spring中集成

在Spring MVC中使用Mybatis中的特性，需要做如下配置：

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

MyBatis 的真正强大在于它的映射语句，也是它的魔力所在。由于它的异常强大，映射器的 XML 文件就显得相对简单。如果拿它跟具有相同功能的 JDBC 代码进行对比，你会立即发现省掉了将近 95% 的代码。MyBatis 就是针对 SQL 构建的，并且比普通的方法做的更好。

SQL 映射文件有很少的几个顶级元素（按照它们应该被定义的顺序）：

- cache – 给定命名空间的缓存配置。
- cache-ref – 其他命名空间缓存配置的引用。
- resultMap – 是最复杂也是最强大的元素，用来描述如何从数据库结果集中来加载对象。
-  parameterMap – 已废弃！老式风格的参数映射。内联参数是首选,这个元素可能在将来被移除，这里不会记录。
- sql – 可被其他语句引用的可重用语句块。
- insert – 映射插入语句
- update – 映射更新语句
- delete – 映射删除语句
- select – 映射查询语句

在MyBatis 3.0之后，即可以直接以Annotation方式将SQL与配置写在Java文件中，也可以直接写在XML文件中。笔者建议的简单的SQL语句可以直接以Annotation方式编写，复杂的SQL语句可以写在XML文件中。

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

> [解决mybatis foreach 错误: Parameter ‘__frch_item_0‘ not found](http://www.bubuko.com/infodetail-913433.html)

foreach 多用于值重复

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



##### 插入多行

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



# View



# AOP

> 
- [spring-framework-reference-aop](http://docs.spring.io/spring/docs/current/spring-framework-reference/html/aop.html)

## Concepts

![](http://i.stack.imgur.com/k32oZ.jpg)

### Aspect

### Pointcut(切点)

``` 
package com.xyz.someapp;

import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;

@Aspect
public class SystemArchitecture {

    /**
     * A join point is in the web layer if the method is defined
     * in a type in the com.xyz.someapp.web package or any sub-package
     * under that.
     */
    @Pointcut("within(com.xyz.someapp.web..*)")
    public void inWebLayer() {}

    /**
     * A join point is in the service layer if the method is defined
     * in a type in the com.xyz.someapp.service package or any sub-package
     * under that.
     */
    @Pointcut("within(com.xyz.someapp.service..*)")
    public void inServiceLayer() {}

    /**
     * A join point is in the data access layer if the method is defined
     * in a type in the com.xyz.someapp.dao package or any sub-package
     * under that.
     */
    @Pointcut("within(com.xyz.someapp.dao..*)")
    public void inDataAccessLayer() {}

    /**
     * A business service is the execution of any method defined on a service
     * interface. This definition assumes that interfaces are placed in the
     * "service" package, and that implementation types are in sub-packages.
     *
     * If you group service interfaces by functional area (for example,
     * in packages com.xyz.someapp.abc.service and com.xyz.someapp.def.service) then
     * the pointcut expression "execution(* com.xyz.someapp..service.*.*(..))"
     * could be used instead.
     *
     * Alternatively, you can write the expression using the 'bean'
     * PCD, like so "bean(*Service)". (This assumes that you have
     * named your Spring service beans in a consistent fashion.)
     */
    @Pointcut("execution(* com.xyz.someapp..service.*.*(..))")
    public void businessService() {}

    /**
     * A data access operation is the execution of any method defined on a
     * dao interface. This definition assumes that interfaces are placed in the
     * "dao" package, and that implementation types are in sub-packages.
     */
    @Pointcut("execution(* com.xyz.someapp.dao.*.*(..))")
    public void dataAccessOperation() {}

}
```

### Advice

- *Before advice*: Advice that executes before a join point, but which does not have the ability to prevent execution flow proceeding to the join point (unless it throws an exception).
- *After returning advice*: Advice to be executed after a join point completes normally: for example, if a method returns without throwing an exception.
- *After throwing advice*: Advice to be executed if a method exits by throwing an exception.
- *After (finally) advice*: Advice to be executed regardless of the means by which a join point exits (normal or exceptional return).
- *Around advice*: Advice that surrounds a join point such as a method invocation. This is the most powerful kind of advice. Around advice can perform custom behavior before and after the method invocation. It is also responsible for choosing whether to proceed to the join point or to shortcut the advised method execution by returning its own return value or throwing an exception.

## Annotation-Based

如果需要以注解方式启动AspectJ，需要在Configuration类前加上注解：

``` java
@Configuration
@EnableAspectJAutoProxy
public class AppConfig {

}
```

### PointCut

``` 
@Pointcut("execution(public * *(..))")
private void anyPublicOperation() {}

@Pointcut("within(com.xyz.someapp.trading..*)")
private void inTrading() {}

@Pointcut("anyPublicOperation() && inTrading()")
private void tradingOperation() {}
```

### Aspect

``` java
@Aspect  
public class AopAnnotationTest {    

    @Pointcut("execution(* cn.test.business.*.*(..))")    
    private void anyMethod(){}//定义一个切入点   

    @Before("anyMethod() && args(name)")    
    public void doBefore(String name){    
        System.out.println("doBefore...");    
    }    

    @AfterReturning("anyMethod()")  
    public void doAfterReturning(){  
        System.out.println("doAfterReturning...");  
    }  

    @After("anyMethod()")  
    public void doAfter(){  
        System.out.println("doAfter...");  
    }  

    @Around("anyMethod()")  
    public Object doAround(ProceedingJoinPoint joinPoint) throws Throwable{  
        System.out.println("begin doAround...");  
        Object object = joinPoint.proceed();  
        //proceed(newArgs);
        System.out.println("after doAround...");  
        return object;  
    }  

    @AfterThrowing(pointcut="anyMethod()",throwing="ex")  
    public void doThrow(Exception ex){  
        System.out.println("意外通知");  
    }  
}    
```

对应的测试类为：

``` java
//接口声明类
package cn.test.business;  

public interface Work {  
    public void doWork(String userName);  
}  

//实现类
package cn.test.business;  

public class Worker implements Work{  

    @Override  
    public void doWork(String userName) {  
        System.out.println(userName + " is working !");  
    }  
}  
```

实际的测试中，可以知道AOP的执行顺序为：

``` 
begin doAround...  
doBefore...  
张三 is working !  
after doAround...  
doAfter...  
doAfterReturning... 
```

#### JoinPoint

1.  * java.lang.Object[] getArgs()：获取连接点方法运行时的入参列表； 
2.  * Signature getSignature() ：获取连接点的方法签名对象； 
3.  * java.lang.Object getTarget() ：获取连接点所在的目标对象； 
4.  * java.lang.Object getThis() ：获取代理对象本身；



## XML-Based

采用XML配置时，需要启动AspectJ的支持。

``` xml
<aop:aspectj-autoproxy/>
```

### Declaration

``` xml
...
<!-- 定义一个切面类 -->  
<bean id="logAspect" class="cn.test.aop.advice.defineAspectClass.impl.TestAspect"></bean>  
 <aop:config>  
 	<aop:pointcut id="pointcut" expression="execution(* cn.test.business.*.*(..))" />  
    <aop:aspect id="aspect" ref="logAspect">  
    	<aop:before pointcut-ref="pointcut" method="doBefore"/>  
    	<aop:after-returning pointcut-ref="pointcut" method="afterReturning" returning="retValue"/>  
    	<aop:after-throwing pointcut-ref="pointcut" method="doThrowing" throwing="ex"/>  
    	<aop:after pointcut-ref="pointcut" method="doAfter"/>  
    	<aop:around pointcut-ref="pointcut" method="doAround"/>  
    </aop:aspect>  
</aop:config> 
...
```



# Error Handling

> 
- [spring-mvc-rest-exception-handling-best-practices](https://stormpath.com/blog/spring-mvc-rest-exception-handling-best-practices-part-1/)







### AOP Integration

有时候會在AOP中以doAround的方法進行統一的权限验证，譬如在某个业务场景中，需要在Controller之前对于传入的user_token进行验证，对于验证通过的则替换为user_id，否则就直接报错。这边有一个小的Trick，在正常执行时，可以直接返回方法创建的DeferredResult对象，而如果报错的话，就不会再执行原有方法了，因此需要在原方法中的最后加入一个HttpServletResponse对象，这样的话就可以从中获取返回流：

``` java
HttpServletResponse response = (HttpServletResponse) args[args.length - 1];
response.getWriter().print("aa");
response.getWriter().close();
```

### HTTP Streaming

## Reactive Integration(集成RxJava)

对于RxJava的使用这里不再赘述。

``` java
@RequestMapping("/getAMessageObsBlocking")
public Message getAMessageObsBlocking() {
    return service1.getAMessageObs().toBlocking().first();
}


@RequestMapping("/getAMessageObsAsync")
public DeferredResult<Message> getAMessageAsync() {
    Observable<Message> o = this.service1.getAMessageObs();
    DeferredResult<Message> deffered = new DeferredResult<>(90000);
    o.subscribe(m -> deffered.setResult(m), e -> deffered.setErrorResult(e));
    return deffered;
}
```

``` 
public Observable<Message> getAMessageObs() {
    return Observable.<Message>create(s -> {
        logger.info("Start: Executing slow task in Service 1");
        Util.delay(9000);
        s.onNext(new Message("data 1"));
        logger.info("End: Executing slow task in Service 1");
        s.onCompleted();
    }).subscribeOn(Schedulers.from(customObservableExecutor));
}
```



### Blocking(同步执行)

To transform an `Observable` into a `BlockingObservable`, use the[`Observable.toBlocking( )`](http://reactivex.io/RxJava/javadoc/rx/Observable.html#toBlocking()) method or the [`BlockingObservable.from( )`](http://reactivex.io/RxJava/javadoc/rx/observables/BlockingObservable.html#from(rx.Observable)) method.

## Future(集成Future)

``` 
@RequestMapping("/getAMessageFutureBlocking")
public Message getAMessageFutureBlocking() throws Exception {
    return service1.getAMessageFuture().get();
}

@RequestMapping("/getAMessageFutureAsync")
public DeferredResult<Message> getAMessageFutureAsync() {
    DeferredResult<Message> deffered = new DeferredResult<>(90000);
    CompletableFuture<Message> f = this.service1.getAMessageFuture();
    f.whenComplete((res, ex) -> {
        if (ex != null) {
            deffered.setErrorResult(ex);
        } else {
            deffered.setResult(res);
        }
    });
    return deffered;
}
```



``` 
public CompletableFuture<Message> getAMessageFuture() {
    return CompletableFuture.supplyAsync(() -> {
        logger.info("Start: Executing slow task in Service 1");
        Util.delay(1000);
        logger.info("End: Executing slow task in Service 1");
        return new Message("data 1");
    }, futureExecutor);
}
```