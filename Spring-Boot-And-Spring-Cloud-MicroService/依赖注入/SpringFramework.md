.wiz-todo, .wiz-todo-img {width: 16px; height: 16px; cursor: default; padding: 0 10px 0 2px; vertical-align: -10%;-webkit-user-select: none;} .wiz-todo-label { display: inline-block; padding-top: 7px; padding-bottom: 6px; line-height: 1.5;} .wiz-todo-label-checked { /*text-decoration: line-through;*/ color: #666;} .wiz-todo-label-unchecked {text-decoration: initial;} .wiz-todo-completed-info {padding-left: 44px; display: inline-block; } .wiz-todo-avatar { width:20px; height: 20px; vertical-align: -20%; margin-right:10px; border-radius: 2px;} .wiz-todo-account, .wiz-todo-dt { color: #666; }
 

# Introduce

## Reference

### Tutorials & Docs

- [Spring MVC 4.2.4.RELEASE 中文文档 ](https://www.gitbook.com/book/linesh/spring-mvc-documentation-linesh-translation/details)

- [Spring知识点提炼](http://www.importnew.com/19933.html?utm_source=tuicool&utm_medium=referral)

# Bean

## Definition

| Properties               | Description                              |
| ------------------------ | ---------------------------------------- |
| class                    | This attribute is mandatory and specify the bean class to be used to create the bean. |
| name/id                  | This attribute specifies the bean identifier uniquely. In XML-based configuration metadata, you use the id and/or name attributes to specify the bean identifier(s). |
| scope                    | This attribute specifies the scope of the objects created from a particular bean definition and it will be discussed in bean scopes chapter. |
| constructor-arg          | This is used to inject the dependencies and will be discussed in next chapters. |
| properties               | This is used to inject the dependencies and will be discussed in next chapters. |
| autowiring mode          | This is used to inject the dependencies and will be discussed in next chapters. |
| lazy-initialization mode | A lazy-initialized bean tells the IoC container to create a bean instance when it is first requested, rather than at startup. |
| initialization method    | A callback to be called just after all necessary properties on the bean have been set by the container. It will be discussed in bean life cycle chapter. |
| destruction method       | A callback to be used when the container containing the bean is destroyed. It will be discussed in bean life cycle chapter. |

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

### Instantiation:Bean定义与初始化

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

``` java
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

``` 
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
一般来说，如果完全用注解方式来定义Bean，可以用Configuration方式来定义一系列的Bean，譬如:
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
这里用Configuration进行注解之后，其中注解为@Bean的方法就可以自动地变为了实例工厂方法。

### Definition Inheritance(定义继承)

类似于Java中的抽象类或者接口，在Spring中定义Bean时也支持继承，最简单的示例如下所示：

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

对应的HelloWorld.java文件定义如下：

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

HelloIndia.java文件为：

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

有时候可以创建一个抽象的Bean定义的模板以方便被其他的Bean定义时候使用。在定义模板时，并不需要指定一个类属性而只需要指定为抽象即可。

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

Spring框架中主要的作用域为如下五种，其中三种只能用在基于Web的ApplicationContext中：

| Scope          | Description                              |
| -------------- | ---------------------------------------- |
| singleton      | This scopes the bean definition to a single instance per Spring IoC container (default). |
| prototype      | This scopes a single bean definition to have any number of object instances. |
| request        | This scopes a bean definition to an HTTP request. Only valid in the context of a web-aware Spring ApplicationContext. |
| session        | This scopes a bean definition to an HTTP session. Only valid in the context of a web-aware Spring ApplicationContext. |

| global-session | This scopes a bean definition to a global HTTP session. Only valid in the context of a web-aware Spring ApplicationContext. |


最常用的作用域就是Prototype与Singleton，原型作用域下Spring IoC容器会在每次使用该对象的时候动态创建一个新的Bean实例，而如果设置为了单例模式，那么整个生命周期中都只会生成一个对象实例。一般来说对于无状态的Bean是建议生成单例作用域，而对于有状态的Bean是原型作用域。
### Singleton(单例)
- 声明单例

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

- 创建Java文件

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

- 创建全局容器

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

如果你信不过Spring IoC或者需要一些额外的操作，那么可以用如下方式手动创建：
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

容器初始化 bean 和销毁前所做的操作定义方式有三种：


- [第一种：通过@PostConstruct 和 @PreDestroy 方法 实现初始化和销毁bean之前进行的操作](http://write.blog.csdn.net/postedit/8681497)


- 第二种是：[通过 在xml中定义init-method 和  destory-method方法](http://blog.csdn.net/topwqp/article/details/8681467)


- 第三种是：[ 通过bean实现InitializingBean和 DisposableBean接口](http://blog.csdn.net/topwqp/article/details/8681573)

### @PostConstruct 和 @PreDestory

- 定义相关的实现类

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

- 定义相关的配置文件

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

- 定义相应类实现InitializingBean ,DisposableBean 接口

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

- 定义相应的配置文件

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

- 测试类

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

## Dependence Injection

自动注入的具体表现即所有在ApplicationContext中声明的Bean可以允许其他同样注册的Bean根据接口类或者名称自动完成赋值或者实例化。

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

有些依赖不需要显示声明，而只需要在Java的类定义时使用@Autowired注解即可。

| Mode                                     | Description                              |
| ---------------------------------------- | ---------------------------------------- |
| no                                       | This is default setting which means no autowiring and you should use explicit bean reference for wiring. You have nothing to do special for this wiring. This is what you already have seen in Dependency Injection chapter. |
| [byName](http://www.tutorialspoint.com/spring/spring_autowiring_byname.htm) | Autowiring by property name. Spring container looks at the properties of the beans on which *autowire* attribute is set to*byName* in the XML configuration file. It then tries to match and wire its properties with the beans defined by the same names in the configuration file. |
| [byType](http://www.tutorialspoint.com/spring/spring_autowiring_bytype.htm) | Autowiring by property datatype. Spring container looks at the properties of the beans on which *autowire* attribute is set to *byType* in the XML configuration file. It then tries to match and wire a property if its **type** matches with exactly one of the beans name in configuration file. If more than one such beans exists, a fatal exception is thrown. |
| [constructor](http://www.tutorialspoint.com/spring/spring_autowiring_byconstructor.htm) | Similar to byType, but type applies to constructor arguments. If there is not exactly one bean of the constructor argument type in the container, a fatal error is raised. |
| autodetect                               | Spring first tries to wire using autowire by *constructor*, if it does not work, Spring tries to autowire by *byType*. |



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


It is also possible to provide *all* beans of a particular type from the `ApplicationContext` by adding the annotation to a field or method that expects an array of that type:


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


By default, the autowiring fails whenever *zero* candidate beans are available; the default behavior is to treat annotated methods, constructors, and fields as indicating*required* dependencies. This behavior can be changed as demonstrated below.


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



# ApplicationContext

## IoC/DI(控制反转/依赖注入)

在Spring中，常常用到控制反转（IoC），而这个概念的理解恰恰是最困难的部分：控制反转中，“反转”的概念在于，将对象的控制权由代码本身移交给容器，过容器来实现对象组件的装配和管理。所谓的“控制反转”概念就是对组件对象控制权的转移，从程序代码本身转移到了外部容器。多数时候，控制反转也叫依赖注入(DI),(虽然控制反转的实现不止依赖注入一种，还有其它方式如依赖查找等)

依赖注入的方法是：

- 如果类X的一个实例对象x调用了类Y的一个实例对象y的方法，那么就称类X依赖于类Y。为了打破这种依赖——“反转”，首先我们可以引入一个接口I（第三方类），接口I中声明了对象y将被对象x调用的所有方法；然后，我们对类Y稍加改造，使其实现接口I；最后，我们把在对象x中对y的调用改为对接口I中对应方法的调用。经过这番改造后，原先的X对Y的依赖关系不存在了，类X和Y现在都依赖于接口I。
- 这种通过引入接口I来消除类X对Y的依赖的方法，被称作“控制反转”，又叫做“依赖注入”。
- 需要注意的是，类Y可能还依赖于其他类。在应用反转之前，X依赖于Y，从而也间接依赖于Y所依赖的所有“其他类”。应用控制反转之后，不仅消除了X对Y的直接依赖，且前面提到的那些所有的间接依赖也消除了。而新引入的接口I则不依赖于任何类。

一般控制反转分为3类：

- Type 1 : 基于接口 (interface injection)。Depending object 需要实现(implement) 特定 interface 以供框架注入所需对象。
- Type 2 : 基于设值函数 (setter injection)。Depending object 需要实现特定 setter 方法 (但不需要依赖特定interface)，
- Type 3 : 基于构造函数 (constructor injection)

套用Laravel中的名词，Spring中的ApplicationContext本身就是起到了一个服务容器的作用，所有在ApplicationContext中注入的Bean会由Spring自动构造，并且根据@AutoWired关键字自动的注入到各个类的成员中。

## Configuration(配置)

这里的配置即指所有Bean的注册地，即声明一个Bean之后，ApplicationContext需要自动去加载并且初始化这些Bean。有点类似于Zookeeper的作用，即告诉下文的ApplicationContext的下载器应该去哪些包中加载Bean。

### XML-Based

基于XML的配置方案即是传统意义上将所有的Bean及其他配置放置在了XML文件中并且以XML作为第一加载入口。

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

基于注解的配置方案同样是选择了XML作为第一配置入口，但是会将大量的Controller等Bean的配置放置在Java代码中。

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

基于Java代码的配置方案即是选择将Java类作为第一配置入口。

``` java
@Configuration
@ComponentScan(basePackages = "org.example",
        includeFilters = @Filter(type = FilterType.REGEX, pattern = ".*Stub.*Repository"),
        excludeFilters = @Filter(Repository.class))
public class AppConfig {
    ...
}
```

同样的，在配置类中依然可以引入XML配置的内容：

``` java
@Configuration
@PropertySource("classpath:apis.application.properties")
@ComponentScan(basePackages = {"org.surfnet.oaaas.resource", "org.surfnet.oaaas.service"})
@ImportResource({"classpath:spring-repositories.xml", "classpath:commonApplicationContext.xml"})
@EnableTransactionManagement
public class SpringConfiguration {

}
```

有时候，也可以使用@ContextConfiguration注解：

``` java
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration({ "classpath:META-INF/conf/spring/this-xml-conf.xml",
                    "classpath:META-INF/conf/spring/that-other-xml-conf.xml" })
public class CleverMoneyMakingBusinessServiceIntegrationTest {...}
```



## Instantiating(加载)

在配置了基本的Bean和整个ApplicationContext之后，在具体应用时就需要从容器中获取相对应的Bean。在Web项目中，类似于Tomcat或者Jetty这样的Servlet容器会自动从web.xml开始加载配置文件，此处不赘述，可以详见笔者的Spring-MVC系列实战笔记。而在本系列中主要介绍如何在Java代码中加载整个Spring ApplicationContext。

### ConfigurableApplicationContext

``` java
new ClassPathXmlApplicationContext( 
    new String[] { "classpath:META-INF/conf/spring/this-xml-conf.xml",
                   "classpath:META-INF/conf/spring/that-other-xml-conf.xml" } );
```



### AnnotationConfigApplicationContext

AnnotationConfigApplicationContext可以从某个以`@Configuration`配置的类中初始化加载所有的Bean，即以`@Configuration`注解的类本身会注册成某个Bean，以及所有声明在其中的Bean也会完成在ApplicationContext中的注册。

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

除了在初始化时候传入一些Bean的配置，`AnnotationConfigApplicationContext`还允许在运行时利用代码动态地注册一些Bean的配置类，如下所示：

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