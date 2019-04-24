# Bean

## Definition

``` xml
<?xml version="1.0" encoding="UTF-8"?>

<beans xmlns="http://www.springframework.org/schema/beans"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://www.springframework.org/schema/beans
    http://www.springframework.org/schema/beans/spring-beans-3.0.xsd">

   <!-- A simple bean definition -->
   <bean id="..." class="...">
       <!-- collaborators and configuration for this bean go here -->
   </bean>

   <!-- A bean definition with lazy init set on -->
   <bean id="..." class="..." lazy-init="true">
       <!-- collaborators and configuration for this bean go here -->
   </bean>

   <!-- A bean definition with initialization method -->
   <bean id="..." class="..." init-method="...">
       <!-- collaborators and configuration for this bean go here -->
   </bean>

   <!-- A bean definition with destruction method -->
   <bean id="..." class="..." destroy-method="...">
       <!-- collaborators and configuration for this bean go here -->
   </bean>

   <!-- more bean definitions go here -->

</beans>
```

### Instantiation:Bean 定义与初始化

#### Constructor:构造函数法

```
<bean id="exampleBean" class="examples.ExampleBean"/>

<bean name="anotherExample" class="examples.ExampleBeanTwo"/>
```

#### Static Factory Method

```
<bean id="clientService"
    class="examples.ClientService"
    factory-method="createInstance"/>
```

```
public class ClientService {
    private static ClientService clientService = new ClientService();
    private ClientService() {}

    public static ClientService createInstance() {
        return clientService;
    }
}
```

#### Instance Factory Method:实例工厂方法

``` xml
<!-- the factory bean, which contains a method called createInstance() -->
<bean id="serviceLocator" class="examples.DefaultServiceLocator">
    <!-- inject any dependencies required by this locator bean -->
</bean>

<!-- the bean to be created via the factory bean -->
<bean id="clientService"
    factory-bean="serviceLocator"
    factory-method="createClientServiceInstance"/>
```

``` java
public class DefaultServiceLocator {

    private static ClientService clientService = new ClientServiceImpl();
    private DefaultServiceLocator() {}

    public ClientService createClientServiceInstance() {
        return clientService;
    }
}
```

当然，实例工厂方法也可以在一个工厂类中提供多个方法：

```xml
<bean id="serviceLocator" class="examples.DefaultServiceLocator">
    <!-- inject any dependencies required by this locator bean -->
</bean>

<bean id="clientService"
    factory-bean="serviceLocator"
    factory-method="createClientServiceInstance"/>

<bean id="accountService"
    factory-bean="serviceLocator"
    factory-method="createAccountServiceInstance"/>
```

```java
public class DefaultServiceLocator {

    private static ClientService clientService = new ClientServiceImpl();
    private static AccountService accountService = new AccountServiceImpl();

    private DefaultServiceLocator() {}

    public ClientService createClientServiceInstance() {
        return clientService;
    }

    public AccountService createAccountServiceInstance() {
        return accountService;
    }

}
```

一般来说，如果完全用注解方式来定义 Bean，可以用 Configuration 方式来定义一系列的 Bean，譬如:

```
@Configuration
public class TestConfig {

    @Bean
    public HessianProxyFactoryBean helloClient() {
        HessianProxyFactoryBean factory = new HessianProxyFactoryBean();
        factory.setServiceUrl("http://localhost:8181/HelloService");
        factory.setServiceInterface(HelloService.class);
        return factory;
    }
}
```

这里用 Configuration 进行注解之后，其中注解为@Bean 的方法就可以自动地变为了实例工厂方法。

### Definition Inheritance(定义继承)

类似于 Java 中的抽象类或者接口，在 Spring 中定义 Bean 时也支持继承，最简单的示例如下所示：

``` xml
<?xml version="1.0" encoding="UTF-8"?>

<beans xmlns="http://www.springframework.org/schema/beans"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://www.springframework.org/schema/beans
    http://www.springframework.org/schema/beans/spring-beans-3.0.xsd">

   <bean id="helloWorld" class="com.tutorialspoint.HelloWorld">
      <property name="message1" value="Hello World!"/>
      <property name="message2" value="Hello Second World!"/>
   </bean>

   <bean id="helloIndia" class="com.tutorialspoint.HelloIndia" parent="helloWorld">
      <property name="message1" value="Hello India!"/>
      <property name="message3" value="Namaste India!"/>
   </bean>

</beans>
```

对应的 HelloWorld.java 文件定义如下：

``` java
package com.tutorialspoint;

public class HelloWorld {
   private String message1;
   private String message2;

   public void setMessage1(String message){
      this.message1  = message;
   }

   public void setMessage2(String message){
      this.message2  = message;
   }

   public void getMessage1(){
      System.out.println("World Message1 : " + message1);
   }

   public void getMessage2(){
      System.out.println("World Message2 : " + message2);
   }
}
```

HelloIndia.java 文件为：

``` java
package com.tutorialspoint;

public class HelloIndia {
   private String message1;
   private String message2;
   private String message3;

   public void setMessage1(String message){
      this.message1  = message;
   }

   public void setMessage2(String message){
      this.message2  = message;
   }

   public void setMessage3(String message){
      this.message3  = message;
   }

   public void getMessage1(){
      System.out.println("India Message1 : " + message1);
   }

   public void getMessage2(){
      System.out.println("India Message2 : " + message2);
   }

   public void getMessage3(){
      System.out.println("India Message3 : " + message3);
   }
}
```

而主应用文件定义如下：

``` java
package com.tutorialspoint;

import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

public class MainApp {
   public static void main(String[] args) {
      ApplicationContext context = new ClassPathXmlApplicationContext("Beans.xml");

      HelloWorld objA = (HelloWorld) context.getBean("helloWorld");

      objA.getMessage1();
      objA.getMessage2();

      HelloIndia objB = (HelloIndia) context.getBean("helloIndia");
      objB.getMessage1();
      objB.getMessage2();
      objB.getMessage3();
   }
}
```

运行结果如下所示：

```
World Message1 : Hello World!
World Message2 : Hello Second World!
India Message1 : Hello India!
India Message2 : Hello Second World!
India Message3 : Namaste India!
```

#### Bean Definition Template

有时候可以创建一个抽象的 Bean 定义的模板以方便被其他的 Bean 定义时候使用。在定义模板时，并不需要指定一个类属性而只需要指定为抽象即可。

``` xml
<?xml version="1.0" encoding="UTF-8"?>

<beans xmlns="http://www.springframework.org/schema/beans"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://www.springframework.org/schema/beans
    http://www.springframework.org/schema/beans/spring-beans-3.0.xsd">

   <bean id="beanTeamplate" abstract="true">
      <property name="message1" value="Hello World!"/>
      <property name="message2" value="Hello Second World!"/>
      <property name="message3" value="Namaste India!"/>
   </bean>

   <bean id="helloIndia" class="com.tutorialspoint.HelloIndia" parent="beanTeamplate">
      <property name="message1" value="Hello India!"/>
      <property name="message3" value="Namaste India!"/>
   </bean>

</beans>
```

## Scope(作用域)

Spring 框架中主要的作用域为如下五种，其中三种只能用在基于 Web 的 ApplicationContext 中：

|  Scope           |  Description                                                                                                            |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------- |
|  singleton       |  This scopes the bean definition to a single instance per Spring IoC container (default).                               |
|  prototype       |  This scopes a single bean definition to have any number of object instances.                                           |
|  request         |  This scopes a bean definition to an HTTP request. Only valid in the context of a web-aware Spring ApplicationContext.  |
|  session         |  This scopes a bean definition to an HTTP session. Only valid in the context of a web-aware Spring ApplicationContext.  |

| global-session | This scopes a bean definition to a global HTTP session. Only valid in the context of a web-aware Spring ApplicationContext. |

最常用的作用域就是 Prototype 与 Singleton，原型作用域下 Spring IoC 容器会在每次使用该对象的时候动态创建一个新的 Bean 实例，而如果设置为了单例模式，那么整个生命周期中都只会生成一个对象实例。一般来说对于无状态的 Bean 是建议生成单例作用域，而对于有状态的 Bean 是原型作用域。
### Singleton(单例)
-  声明单例

``` xml
<?xml version="1.0" encoding="UTF-8"?>

<beans xmlns="http://www.springframework.org/schema/beans"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://www.springframework.org/schema/beans
    http://www.springframework.org/schema/beans/spring-beans-3.0.xsd">

   <bean id="helloWorld" class="com.tutorialspoint.HelloWorld"
      scope="singleton">
   </bean>

</beans>
```

-  创建 Java 文件

``` java
package com.tutorialspoint;
//@Component //也可以在这里用注解声明，默认就是单例作用域
public class HelloWorld {
   private String message;

   public void setMessage(String message){
      this.message  = message;
   }

   public void getMessage(){
      System.out.println("Your Message : " + message);
   }
}
```

-  创建全局容器

``` java
package com.tutorialspoint;

import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

public class MainApp {
   public static void main(String[] args) {
      ApplicationContext context = new ClassPathXmlApplicationContext("Beans.xml");

      HelloWorld objA = (HelloWorld) context.getBean("helloWorld");

      objA.setMessage("I'm object A");
      objA.getMessage();

      HelloWorld objB = (HelloWorld) context.getBean("helloWorld");
      objB.getMessage();
   }
}
```

运行上述代码后，可以得到如下结果：

```
Your Message : I'm object A
Your Message : I'm object A
```

如果你信不过 Spring IoC 或者需要一些额外的操作，那么可以用如下方式手动创建：

```
@Service
public class Singleton {

    private static AtomicReference<Singleton> INSTANCE = new AtomicReference<Singleton>();

    public Singleton() {
        final Singleton previous = INSTANCE.getAndSet(this);
        if(previous != null)
            throw new IllegalStateException("Second singleton " + this + " created after " + previous);
    }

    public static Singleton getInstance() {
        return INSTANCE.get();
    }

}
```

### Prototype

- Java Class

``` java
package com.tutorialspoint;

public class HelloWorld {
   private String message;

   public void setMessage(String message){
      this.message  = message;
   }

   public void getMessage(){
      System.out.println("Your Message : " + message);
   }
}
```

- App

``` java
package com.tutorialspoint;

import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

public class MainApp {
   public static void main(String[] args) {
      ApplicationContext context = new ClassPathXmlApplicationContext("Beans.xml");

      HelloWorld objA = (HelloWorld) context.getBean("helloWorld");

      objA.setMessage("I'm object A");
      objA.getMessage();

      HelloWorld objB = (HelloWorld) context.getBean("helloWorld");
      objB.getMessage();
   }
}
```

- Beans.xml

``` xml
<?xml version="1.0" encoding="UTF-8"?>

<beans xmlns="http://www.springframework.org/schema/beans"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://www.springframework.org/schema/beans
    http://www.springframework.org/schema/beans/spring-beans-3.0.xsd">

   <bean id="helloWorld" class="com.tutorialspoint.HelloWorld"
      scope="prototype">
   </bean>

</beans>
```

结果如下：

```
Your Message : I'm object A
Your Message : null
```

## LifeCycle

容器初始化  bean  和销毁前所做的操作定义方式有三种：

- [第一种：通过@PostConstruct  和  @PreDestroy  方法   实现初始化和销毁 bean 之前进行的操作](http://write.blog.csdn.net/postedit/8681497)

-  第二种是：[通过   在 xml 中定义 init-method  和   destory-method 方法](http://blog.csdn.net/topwqp/article/details/8681467)

-  第三种是：[  通过 bean 实现 InitializingBean 和  DisposableBean 接口](http://blog.csdn.net/topwqp/article/details/8681573)

### @PostConstruct  和  @PreDestory

-  定义相关的实现类

``` java
package com.myapp.core.annotation.init;

import javax.annotation.PostConstruct;
import javax.annotation.PreDestroy;

public class PersonService {

	private String  message;

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}

	@PostConstruct
	public void  init(){
		System.out.println("I'm  init  method  using  @PostConstrut...."+message);
	}

	@PreDestroy
	public void  dostory(){
		System.out.println("I'm  destory method  using  @PreDestroy....."+message);
	}
}
```

-  定义相关的配置文件

``` xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
xmlns:context="http://www.springframework.org/schema/context"
xsi:schemaLocation="http://www.springframework.org/schema/beans
http://www.springframework.org/schema/beans/spring-beans-3.1.xsd
http://www.springframework.org/schema/context
http://www.springframework.org/schema/context/spring-context-3.1.xsd">

<!-- <context:component-scan  base-package="com.myapp.core.jsr330"/> -->

<context:annotation-config />

<bean id="personService" class="com.myapp.core.annotation.init.PersonService">
  <property name="message" value="123"></property>
</bean>

</beans>
```

### InitializingBean,DisposableBean

-  定义相应类实现 InitializingBean ,DisposableBean  接口

``` java
package com.myapp.core.annotation.init;

import javax.annotation.PostConstruct;
import javax.annotation.PreDestroy;

import org.springframework.beans.factory.DisposableBean;
import org.springframework.beans.factory.InitializingBean;

public class PersonService  implements InitializingBean,DisposableBean{

	private String  message;

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}

	@Override
	public void destroy() throws Exception {
		// TODO Auto-generated method stub
		System.out.println("I'm  init  method  using implements InitializingBean interface...."+message);

	}

	@Override
	public void afterPropertiesSet() throws Exception {
		// TODO Auto-generated method stub
		System.out.println("I'm  init  method  using implements DisposableBean interface...."+message);

	}

}
```

-  定义相应的配置文件

``` xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
xmlns:context="http://www.springframework.org/schema/context"
xsi:schemaLocation="http://www.springframework.org/schema/beans
http://www.springframework.org/schema/beans/spring-beans-3.1.xsd
http://www.springframework.org/schema/context
http://www.springframework.org/schema/context/spring-context-3.1.xsd">

<!-- <context:component-scan  base-package="com.myapp.core.jsr330"/> -->

<!-- <context:annotation-config /> -->


<!-- <bean class="org.springframework.context.annotation.CommonAnnotationBeanPostProcessor" />
<bean id="personService" class="com.myapp.core.annotation.init.PersonService">
		  <property name="message" value="123"></property>
</bean>
 -->

<bean id="personService" class="com.myapp.core.annotation.init.PersonService">
		  <property name="message" value="123"></property>
</bean>

</beans>
```

-  测试类

```
package com.myapp.core.annotation.init;

import org.springframework.context.ApplicationContext;
import org.springframework.context.support.AbstractApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

public class MainTest {

	public static void main(String[] args) {

		AbstractApplicationContext  context = new ClassPathXmlApplicationContext("resource/annotation.xml");

		PersonService   personService  =  (PersonService)context.getBean("personService");

	         context.registerShutdownHook();
	}

}
```

# ApplicationContext

## Configuration(配置)

这里的配置即指所有 Bean 的注册地，即声明一个 Bean 之后，ApplicationContext 需要自动去加载并且初始化这些 Bean。有点类似于 Zookeeper 的作用，即告诉下文的 ApplicationContext 的下载器应该去哪些包中加载 Bean。

### XML-Based

基于 XML 的配置方案即是传统意义上将所有的 Bean 及其他配置放置在了 XML 文件中并且以 XML 作为第一加载入口。

``` xml
<beans>
    <context:component-scan base-package="org.example">
        <context:include-filter type="regex"
                expression=".*Stub.*Repository"/>
        <context:exclude-filter type="annotation"
                expression="org.springframework.stereotype.Repository"/>
    </context:component-scan>
</beans>
```

### Annotation-Based

基于注解的配置方案同样是选择了 XML 作为第一配置入口，但是会将大量的 Controller 等 Bean 的配置放置在 Java 代码中。

``` xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xmlns:context="http://www.springframework.org/schema/context"
    xsi:schemaLocation="http://www.springframework.org/schema/beans
        http://www.springframework.org/schema/beans/spring-beans.xsd
        http://www.springframework.org/schema/context
        http://www.springframework.org/schema/context/spring-context.xsd">

    <context:annotation-config/>
</beans>
```

### Java-Based

基于 Java 代码的配置方案即是选择将 Java 类作为第一配置入口。

``` java
@Configuration
@ComponentScan(basePackages = "org.example",
        includeFilters = @Filter(type = FilterType.REGEX, pattern = ".*Stub.*Repository"),
        excludeFilters = @Filter(Repository.class))
public class AppConfig {
    ...
}
```

同样的，在配置类中依然可以引入 XML 配置的内容：

``` java
@Configuration
@PropertySource("classpath:apis.application.properties")
@ComponentScan(basePackages = {"org.surfnet.oaaas.resource", "org.surfnet.oaaas.service"})
@ImportResource({"classpath:spring-repositories.xml", "classpath:commonApplicationContext.xml"})
@EnableTransactionManagement
public class SpringConfiguration {

}
```

有时候，也可以使用@ContextConfiguration 注解：

``` java
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration({ "classpath:META-INF/conf/spring/this-xml-conf.xml",
                    "classpath:META-INF/conf/spring/that-other-xml-conf.xml" })
public class CleverMoneyMakingBusinessServiceIntegrationTest {...}
```

## Instantiating(加载)

在配置了基本的 Bean 和整个 ApplicationContext 之后，在具体应用时就需要从容器中获取相对应的 Bean。在 Web 项目中，类似于 Tomcat 或者 Jetty 这样的 Servlet 容器会自动从 web.xml 开始加载配置文件，此处不赘述，可以详见笔者的 Spring-MVC 系列实战笔记。而在本系列中主要介绍如何在 Java 代码中加载整个 Spring ApplicationContext。

### ConfigurableApplicationContext

``` java
new ClassPathXmlApplicationContext(
    new String[] { "classpath:META-INF/conf/spring/this-xml-conf.xml",
                   "classpath:META-INF/conf/spring/that-other-xml-conf.xml" } );
```

### AnnotationConfigApplicationContext

AnnotationConfigApplicationContext 可以从某个以`@Configuration`配置的类中初始化加载所有的 Bean，即以`@Configuration`注解的类本身会注册成某个 Bean，以及所有声明在其中的 Bean 也会完成在 ApplicationContext 中的注册。

``` java
public static void main(String[] args) {
    ApplicationContext ctx = new AnnotationConfigApplicationContext(MyServiceImpl.class, Dependency1.class, Dependency2.class);
    MyService myService = ctx.getBean(MyService.class);
    myService.doStuff();
}
```

`AnnotationConfigApplicationContext`并不仅仅只可以传入某个配置类作为参数，任何以`@Component`作为注解的类都可以作为参数传入其构造器中：

``` java
public static void main(String[] args) {
    ApplicationContext ctx = new AnnotationConfigApplicationContext(MyServiceImpl.class, Dependency1.class, Dependency2.class);
    MyService myService = ctx.getBean(MyService.class);
    myService.doStuff();
}
```

除了在初始化时候传入一些 Bean 的配置，`AnnotationConfigApplicationContext`还允许在运行时利用代码动态地注册一些 Bean 的配置类，如下所示：

``` java
public static void main(String[] args) {
    AnnotationConfigApplicationContext ctx = new AnnotationConfigApplicationContext();
    ctx.register(AppConfig.class, OtherConfig.class);
    ctx.register(AdditionalConfig.class);//使用定义类
    ctx.scan("com.acme");//自动扫描某些包
    ctx.refresh();
    MyService myService = ctx.getBean(MyService.class);
    myService.doStuff();
}
```

# Dependence Injection | 依赖注入

自动注入的具体表现即所有在 ApplicationContext 中声明的 Bean 可以允许其他同样注册的 Bean 根据接口类或者名称自动完成赋值或者实例化。

### [Constructor-based dependency injection](http://www.tutorialspoint.com/spring/constructor_based_dependency_injection.htm)

Constructor-based DI is accomplished when the container invokes a class constructor with a number of arguments, each representing a dependency on other class.

```
package x.y;

public class Foo {

    public Foo(Bar bar, Baz baz) {
        // ...
    }

}
```

```
<beans>
    <bean id="foo" class="x.y.Foo">
        <constructor-arg ref="bar"/>
        <constructor-arg ref="baz"/>
    </bean>

    <bean id="bar" class="x.y.Bar"/>

    <bean id="baz" class="x.y.Baz"/>
</beans>
```

### [Setter-based dependency injection](http://www.tutorialspoint.com/spring/setter_based_dependency_injection.htm)

Setter-based DI is accomplished by the container calling setter methods on your beans after invoking a no-argument constructor or no-argument static factory method to instantiate your bean.

``` xml
<bean id="exampleBean" class="examples.ExampleBean">
    <!-- setter injection using the nested ref element -->
    <property name="beanOne">
        <ref bean="anotherExampleBean"/>
    </property>

    <!-- setter injection using the neater ref attribute -->
    <property name="beanTwo" ref="yetAnotherBean"/>
    <property name="integerProperty" value="1"/>
</bean>

<bean id="anotherExampleBean" class="examples.AnotherBean"/>
<bean id="yetAnotherBean" class="examples.YetAnotherBean"/>
```

### Autowiring

有些依赖不需要显示声明，而只需要在 Java 的类定义时使用@Autowired 注解即可。

|  Mode                                                                                     |  Description                                                                                                                                                                                                                                                                                                                                                           |
| ----------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|  no                                                                                       |  This is default setting which means no autowiring and you should use explicit bean reference for wiring. You have nothing to do special for this wiring. This is what you already have seen in Dependency Injection chapter.                                                                                                                                          |
|  [byName](http://www.tutorialspoint.com/spring/spring_autowiring_byname.htm)              |  Autowiring by property name. Spring container looks at the properties of the beans on which *autowire* attribute is set to*byName* in the XML configuration file. It then tries to match and wire its properties with the beans defined by the same names in the configuration file.                                                                                  |
|  [byType](http://www.tutorialspoint.com/spring/spring_autowiring_bytype.htm)              |  Autowiring by property datatype. Spring container looks at the properties of the beans on which *autowire* attribute is set to *byType* in the XML configuration file. It then tries to match and wire a property if its **type** matches with exactly one of the beans name in configuration file. If more than one such beans exists, a fatal exception is thrown.  |
|  [constructor](http://www.tutorialspoint.com/spring/spring_autowiring_byconstructor.htm)  |  Similar to byType, but type applies to constructor arguments. If there is not exactly one bean of the constructor argument type in the container, a fatal error is raised.                                                                                                                                                                                            |
|  autodetect                                                                               |  Spring first tries to wire using autowire by *constructor*, if it does not work, Spring tries to autowire by *byType*.                                                                                                                                                                                                                                                |

You can apply the `@Autowired` annotation to constructors:

```
public class MovieRecommender {


    private final CustomerPreferenceDao customerPreferenceDao;


    @Autowired
    public MovieRecommender(CustomerPreferenceDao customerPreferenceDao) {
        this.customerPreferenceDao = customerPreferenceDao;
    }


    // ...


}
```

As expected, you can also apply the `@Autowired` annotation to "traditional" setter methods:

```
public class SimpleMovieLister {


    private MovieFinder movieFinder;


    @Autowired
    public void setMovieFinder(MovieFinder movieFinder) {
        this.movieFinder = movieFinder;
    }


    // ...


}
```

You can also apply the annotation to methods with arbitrary names and/or multiple arguments:

```
public class MovieRecommender {


    private MovieCatalog movieCatalog;


    private CustomerPreferenceDao customerPreferenceDao;


    @Autowired
    public void prepare(MovieCatalog movieCatalog,
            CustomerPreferenceDao customerPreferenceDao) {
        this.movieCatalog = movieCatalog;
        this.customerPreferenceDao = customerPreferenceDao;
    }


    // ...


}
```

You can apply `@Autowired` to fields as well and even mix it with constructors:

```
public class MovieRecommender {


    private final CustomerPreferenceDao customerPreferenceDao;


    @Autowired
    private MovieCatalog movieCatalog;


    @Autowired
    public MovieRecommender(CustomerPreferenceDao customerPreferenceDao) {
        this.customerPreferenceDao = customerPreferenceDao;
    }


    // ...


}
```

It is also possible to provide _all_ beans of a particular type from the `ApplicationContext` by adding the annotation to a field or method that expects an array of that type:

```
public class MovieRecommender {


    @Autowired
    private MovieCatalog[] movieCatalogs;


    // ...


}
```

The same applies for typed collections:

```
public class MovieRecommender {


    private Set<MovieCatalog> movieCatalogs;


    @Autowired
    public void setMovieCatalogs(Set<MovieCatalog> movieCatalogs) {
        this.movieCatalogs = movieCatalogs;
    }


    // ...


}
```

Even typed Maps can be autowired as long as the expected key type is `String`. The Map values will contain all beans of the expected type, and the keys will contain the corresponding bean names:

```
public class MovieRecommender {


    private Map<String, MovieCatalog> movieCatalogs;


    @Autowired
    public void setMovieCatalogs(Map<String, MovieCatalog> movieCatalogs) {
        this.movieCatalogs = movieCatalogs;
    }


    // ...


}
```

By default, the autowiring fails whenever _zero_ candidate beans are available; the default behavior is to treat annotated methods, constructors, and fields as indicating*required* dependencies. This behavior can be changed as demonstrated below.

```
public class SimpleMovieLister {


    private MovieFinder movieFinder;


    @Autowired(required=false)
    public void setMovieFinder(MovieFinder movieFinder) {
        this.movieFinder = movieFinder;
    }


    // ...


}
```

#### Qualifier

如果有同一个类的不同的声明：

``` xml
<bean id="a" class="com.package.MyClass"/>
<bean id="b" class="com.package.MyClass"/>
```

可以使用：

``` java
@Autowired
@Qualifier("a")
MyClass a;

@Autowired
@Qualifier("b")
MyClass b;
```

# 注解方式声明

在 Spring2.0 之前的版本中，@Repository 注解可以标记在任何的类上，用来表明该类是用来执行与数据库相关的操作（即 DAO 对象），并支持自动处理数据库操作产生的异常。在 Spring2.5 版本中，引入了更多的 Spring 类注解：@Component,@Service,@Controller。@Component 是一个通用的 Spring 容器管理的单例 bean 组件。而@Repository, @Service, @Controller 就是针对不同的使用场景所采取的特定功能化的注解组件。

因此，当你的一个类被@Component 所注解，那么就意味着同样可以用@Repository, @Service, @Controller 来替代它，同时这些注解会具备有更多的功能，而且功能各异。最后，如果你不知道要在项目的业务层采用@Service 还是@Component 注解。那么，@Service 是一个更好的选择。就如上文所说的，@Repository 早已被支持了在你的持久层作为一个标记可以去自动处理数据库操作产生的异常
