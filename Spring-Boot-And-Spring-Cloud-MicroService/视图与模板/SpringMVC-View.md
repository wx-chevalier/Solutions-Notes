.wiz-todo, .wiz-todo-img {width: 16px; height: 16px; cursor: default; padding: 0 10px 0 2px; vertical-align: -10%;-webkit-user-select: none;} .wiz-todo-label { display: inline-block; padding-top: 7px; padding-bottom: 6px; line-height: 1.5;} .wiz-todo-label-checked { /*text-decoration: line-through;*/ color: #666;} .wiz-todo-label-unchecked {text-decoration: initial;} .wiz-todo-completed-info {padding-left: 44px; display: inline-block; } .wiz-todo-avatar { width:20px; height: 20px; vertical-align: -20%; margin-right:10px; border-radius: 2px;} .wiz-todo-account, .wiz-todo-dt { color: #666; }



# Static Resources
## Spring MVC

在我们定义Spring的通用的DispatcherServlet时，我们是将所有的URL映射到该处理器中：

``` xml
<servlet>
  <servlet-name>mvc</servlet-name>
  <servlet-class>org.springframework.web.servlet.DispatcherServlet</servlet-class>
  <init-param>
    <param-name>contextConfigLocation</param-name>
    <param-value>/WEB-INF/classes/conf/spring/mvc-*.xml</param-value>
  </init-param>
  <load-on-startup>1</load-on-startup>
</servlet>

<servlet-mapping>
  <servlet-name>mvc</servlet-name>
  <url-pattern>/</url-pattern>
</servlet-mapping>
```

很明显，该 servlet 对应的 url-pattern 定义成 /，因此该 servlet 会匹配上诸如 /images/a.jpg, /css/hello.css 等这些静态资源，甚至包括 /jsp/stock/index.jsp 这些 jsp 也会匹配。但是并没有定义相应的 Controller 来处理这些资源，因此这些请求通常是无法完成的。 Spring MVC 中，访问一个图片，还要走层层匹配。性能肯定好不到哪里去。不仅仅是 Spring MVC，即便 Struts，它们毕竟存活于 servlet 容器，只要由 servlet 容器处理这些静态资源，必然要将这些资源读入 JVM 的内存区中。所以，处理静态资源，我们通常会在前端加 apache 或 nginx。
 由 servlet 处理这些资源那是一定了。不过，不同的 servlet 容器/应用服务器，处理这些静态资源的 servlet 的名字不大一样： 
- **Tomcat, Jetty, JBoss, and GlassFish**：默认 Servlet 名字为 "default"
- **Google App Engine**：默认 Servlet 名字为 "_ah_default"
- **Resin**：默认 Servlet 名字为 "resin-file"
- **WebLogic**：默认 Servlet 名字为 "FileServlet"
- **WebSphere**：默认 Servlet 名字为 "SimpleFileServlet"

### 激活 Tomcat 的 defaultServlet 来处理静态资源** 

``` xml
<servlet-mapping>
  <servlet-name>default</servlet-name>
  <url-pattern>*.jpg</url-pattern>
</servlet-mapping>
<servlet-mapping>
  <servlet-name>default</servlet-name>
  <url-pattern>*.js</url-pattern>
</servlet-mapping>
<servlet-mapping>
  <servlet-name>default</servlet-name>
  <url-pattern>*.css</url-pattern>
</servlet-mapping>
```
每种类型的静态资源需要分别配置一个 servlet-mapping，同时，要写在 DispatcherServlet 的前面， 让 defaultServlet 先拦截。 

### Spring 3.0.4 以后版本提供了mvc:resources

```<mvc:resources location="/resources/" mapping="/resources/**"/>```映射到 ResourceHttpRequestHandler 进行处理，location 指定静态资源的位置，可以是 web application 根目录下、jar 包里面，这样可以把静态资源压缩到 jar 包中。cache-period 可以使得静态资源进行 web cache。 
使用 <mvc:resources /> 元素，会把 mapping 的 URI 注册到 SimpleUrlHandlerMapping 的 urlMap 中，key 为 mapping 的 URI pattern 值，而 value 为 ResourceHttpRequestHandler，这样就巧妙的把对静态资源的访问由 HandlerMapping 转到 ResourceHttpRequestHandler 处理并返回，所以就支持 classpath 目录, jar 包内静态资源的访问。 
### 使用 mvc:default-servlet-handler
```<mvc:default-servlet-handler />``` 会把 "/**" url 注册到 SimpleUrlHandlerMapping 的 urlMap 中，把对静态资源的访问由 HandlerMapping 转到 org.springframework.web.servlet.resource.DefaultServletHttpRequestHandler 处理并返回。DefaultServletHttpRequestHandler 使用就是各个 Servlet 容器自己的默认 Servlet。 
补充说明下以上提到的 HandlerMapping 的 order 的默认值： 
- **DefaultAnnotationHandlerMapping**：0
- **自动注册的 SimpleUrlHandlerMapping**：2147483646


## Spring Boot:Zero Configuration
Spring Boot中不需要任何的配置即可直接访问静态资源，可以参考[Spring Boot Static Content](https://github.com/spring-projects/spring-boot/blob/master/spring-boot-samples%2Fspring-boot-sample-web-static%2Fsrc%2Fmain%2Fjava%2Fsample%2Fweb%2Fstaticcontent%2FSampleWebStaticApplication.java)这个示范。
![](http://i.stack.imgur.com/QnNmy.png) 
直接将你的资源文件放置在resources/static目录下即可，然后直接访问http://localhost:8080/css/style.css即可。

