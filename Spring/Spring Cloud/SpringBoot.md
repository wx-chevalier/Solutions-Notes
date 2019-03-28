#### Dynamic Profile

在构建环境之初，一个很重要的特性就是根据不同的环境自动使用不同的配置文件，从而完成譬如测试数据库与开发数据库的动态切换。而 Spring Boot 提供了一个非常好用的动态切换配置文件的方法，在 application.properties 文件中指定`spring.profiles.active`参数，那么 Spring 会自动在 classpath 或者 classpath:./config 目录下寻找`application-{profile}.properties`文件，并且将其中内容提取出来用作创建 Bean 的时候动态替换占位符。

在`database.xml`中可以这么写：

```xml
...
<bean name="dataSource" class="org.apache.commons.dbcp.BasicDataSource"
      p:driverClassName="com.mysql.jdbc.Driver"
      p:url="${db.url}?useUnicode=true&amp;characterEncoding=utf-8&amp;allowMultiQueries=true"
      p:username="${db.username}"
      p:password="${db.password}">

</bean>
...
```

### Gradle

```grale
import org.apache.tools.ant.filters.*
/**
 * @region 插件应用于基本脚本
 */

apply plugin: 'java'
apply plugin: 'maven'
apply plugin: 'eclipse'
apply plugin: 'idea'
apply plugin: 'spring-boot'

buildscript {
    repositories {
        mavenCentral()
    }
    dependencies {
        classpath("org.springframework.boot:spring-boot-gradle-plugin:1.3.3.RELEASE")
    }
}

/**
 * @region 项目基本信息
 */

group = 'wx'

version = '0.2.0-SNAPSHOT'

description = 'SpringMVC-Boilerplate'

sourceCompatibility = 1.8

targetCompatibility = 1.8

//配置Spring Boot
bootRun {
    main = "wx.application.Application"
    addResources = false
    systemProperty 'spring.profiles.active', 'dev'
}

bootRepackage {
    mainClass = "wx.application.Application4Deploy"
}

//配置多打包环境
task prod << {
    bootRun.systemProperty 'spring.profiles.active', 'prod'
}

task deploy << {
    bootRun.systemProperty 'spring.profiles.active', 'deploy'
}

//配置资源过滤

processResources {

    filter org.apache.tools.ant.filters.ReplaceTokens, tokens: [
            activeProfiles: project.getProperties().containsKey('activeProfiles') ? project.property('activeProfiles') : 'deploy'  //默认值只会用在打包部署的情况下,因此使用deploy配置文件
    ]

}

//配置资源中心
repositories {

    maven { url "http://repo.spring.io/snapshot" }
    maven { url "http://repo.spring.io/milestone" }
    maven { url "https://jitpack.io" }
    maven { url "http://repo.maven.apache.org/maven2" }
}


//配置依赖
dependencies {
    compile group: 'javax.servlet', name: 'javax.servlet-api', version: '3.1.0'
    compile(group: 'org.springframework.boot', name: 'spring-boot-starter-web', version: '1.3.3.RELEASE') {
        exclude(module: 'spring-boot-starter-tomcat')
        exclude(module: 'spring-boot-starter-logging')
    }
    compile group: 'org.springframework', name: 'spring-jdbc', version: '4.2.2.RELEASE'
    ...
    testCompile("org.springframework.boot:spring-boot-starter-test")
}
```

## HelloWorld

### SpringApplication

## DevTools

Spring Boot 提供了 DevTools，内含了一系列辅助开发工具，可以大大简化我们开发过程中的繁琐操作与配置。

### AutoReload

自动重载功能即指在用`gradle bootRun`之后可以自动监听 Classpath 以及其他指定目录下文件的变化，从而能够自动重新加载最新的代码文件。该功能是在 Spring Boot 1.3 版本一起发布的，本实例中是将该功能与 gradle 的 continuous build 功能一起使用，首先来看下`build.gradle`配置文件：

```
buildscript {
    dependencies {
        classpath("org.springframework.boot:spring-boot-gradle-plugin:1.3.0.RELEASE")
    }
    repositories {
        mavenCentral()
    }
}
apply plugin: 'java'
apply plugin: 'spring-boot'
repositories {
    mavenCentral()
}
configurations {
    dev
}
dependencies {
    compile("org.springframework.boot:spring-boot-starter-web:1.3.0.RELEASE")
    compile 'org.slf4j:slf4j-api:1.7.13'
    dev("org.springframework.boot:spring-boot-devtools")
}
bootRun {
    // Use Spring Boot DevTool only when we run Gradle bootRun task
    classpath = sourceSets.main.runtimeClasspath + configurations.dev
}
```

在配置完成之后，需要输入以下命令：

- `gradle build --continuous`来开启 Gradle 的持续编译
- `gradle bootRun`来开启 Spring Boot 服务

![](https://raw.githubusercontent.com/d-sauer/blog/master/2015/spring_boot_dev_tools_with_gradle/console.png)
实例可以查看[这里](https://github.com/wx-chevalier/SpringMVC-Boilerplate/blob/master/build.gradle)

# Configuration

[How SpringBoot AutoConfiguration magic works?](http://www.sivalabs.in/2016/03/how-springboot-autoconfiguration-magic.html)

```@EnableAutoConfiguration
@ImportResource("classpath:spring/applicationContext.xml")
public class Application {

    public static void main(String[] args) throws Exception {

        SpringApplication.run(Application.class, args);
    }

}
```

注意，这里配置的 EnableAutoConfiguration 会自动搜索使用@Configuration 进行注解的类，同时@ImportResource 是自动导入关联的 XML 文件。

## Filter

这边是一个在 Spring Boot MVC 中使用自定义的过滤器的例子，只要保证该 Package 包含在 Component Scan 的路径中即可。

```java
@Component
public class XClacksOverhead implements Filter {

  public static final String X_CLACKS_OVERHEAD = "X-Clacks-Overhead";

  @Override
  public void doFilter(ServletRequest req, ServletResponse res,
      FilterChain chain) throws IOException, ServletException {

    HttpServletResponse response = (HttpServletResponse) res;
    response.setHeader(X_CLACKS_OVERHEAD, "GNU Terry Pratchett");
    chain.doFilter(req, res);
  }

  @Override
  public void destroy() {}

  @Override
  public void init(FilterConfig arg0) throws ServletException {}

}
```

# 日志默认情况下，Spring Boot 的日志是输出到控制台的，不写入任何日志文件。

要让 Spring Boot 输出日志文件，最简单的方式是在 application.properties 配置文件中配置 logging.path 键值，如下：(日志文件为 spring.log)

logging.path=/var/log

第二种方法是在 application.properties 配置文件中配置 logging.file 键值，如下：

logging.file=/var/log/myapp.log

这两种配置方法适用于开发阶段，对于部署则存在一定的问题。比如部署到不同的环境，可能就存在需要修改 application.properties 文件的情况，这就意味着需要重新打包，再次部署，显得不便捷。

有鉴于此，Spring Boot 提供了一种覆写 application.properties 配置文件中键值的方法，在命令行通过指定参数来实现覆写——在运行时把命令行参数当作标准的系统属性，如下：

java -jar -Dlogging.path=/tmp myapp.jar

最后，还可以在命令行调用 Spring Boot 的 Maven 插件时覆写这个值。但是，直接使用系统属性对于插件方式是无效的。需要使用 run.jvmArguments 参数来指定系统属性，设置想要的值：

mvn spring-boot:run -Drun.jvmArguments="-Dlogging.path=/tmp"
