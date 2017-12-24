



# Controll
# Request


![](https://resources.cloud.genuitec.com/wp-content/uploads/2015/09/SPRING-MVC.png) 


The following steps describe a typical Spring MVC REST workflow:The client sends a request to a web service in URI form.The request is intercepted by the DispatcherServlet which looks for Handler Mappings and its type.
• The Handler Mappings section defined in the application context file tells DispatcherServlet which strategy to use to find controllers based on the incoming request.
• Spring MVC supports three different types of mapping request URIs to controllers: annotation, name conventions and explicit mappings.Requests are processed by the Controller and the response is returned to the DispatcherServlet which then dispatches to the view. 
## HttpServletRequest
### Remote User
#### Remote IP
一般情况下`servletRequest.getRemoteAddr()`能够起作用，但是有些情况下该方法只会返回`127.0.0.1`，
## @Controller
### @RestController
Spring 4.0 introduced @RestController, a specialized version of the controller which is a convenience annotation that does nothing more than add the @Controller and @ResponseBody annotations. By annotating the controller class with @RestController annotation, you no longer need to add @ResponseBody to all the request mapping methods. The @ResponseBody annotation is active by default. Click here to learn more.


![](https://resources.cloud.genuitec.com/wp-content/uploads/2015/09/4.x-diagram.png) 


```
package com.example.spring.rest; 
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController; 
import com.example.spring.model.Employee; 
@RestController
@RequestMapping("employees")
public class EmployeeController { 
    Employee employee = new Employee(); 
    @RequestMapping(value = "/{name}", method = RequestMethod.GET, produces = "application/json")
    public Employee getEmployeeInJSON(@PathVariable String name) { 
   	 employee.setName(name);
   	 employee.setEmail("employee1@genuitec.com"); 
   	 return employee; 
    } 
    @RequestMapping(value = "/{name}.xml", method = RequestMethod.GET, produces = "application/xml")
    public Employee getEmployeeInXML(@PathVariable String name) { 
   	 employee.setName(name);
   	 employee.setEmail("employee1@genuitec.com"); 
   	 return employee; 
    } 
}
```
## RequestMapping
## RequestParams
- 查询参数
```public @ResponseBody String byParameter(@RequestParam("foo") String foo) {
    return "Mapped by path + method + presence of query parameter! (MappingController) - foo = "
           + foo;
}
```
```@Controller
public class MyController {

  @RequestMapping(value = "/myApp", method = { RequestMethod.POST, RequestMethod.GET })
  public String doSomething(@RequestParam(value = "name", defaultValue = "anonymous") final String name) {
  // Do something with the variable: name
  return "viewName";
  }

}
```
- 路径参数
```@RequestMapping(value="/mapping/parameter/{foo}", method=RequestMethod.GET)
public @ResponseBody String byParameter(@PathVariable String foo) {
    //Perform logic with foo
    return "Mapped by path + method + presence of query parameter! (MappingController)";
}
```
## Redirect
First:


```
    @RequestMapping(value = "/redirect", method = RequestMethod.GET)
    public void method(HttpServletResponse httpServletResponse) {
        httpServletResponse.setHeader("Location", projectUrl);
    }
```


Second:


```
    @RequestMapping(value = "/redirect", method = RequestMethod.GET)
    public ModelAndView method() {
            return new ModelAndView("redirect:" + projectUrl);


    }
```
# Response


# Asynchronous(异步)

> 
- [using-rx-java-observable](https://dzone.com/articles/using-rx-java-observable)

Spring应该包含了一个Container Thread，是由Servelet维护的一个线程池并且分配的。在我们目前的顺序编程模型下，除非返回一个请求，否则这个Thread会一直被挂起。而Spring自带的DeferrefResult方式，可以达到异步返回并且不会挂起Container Thread的效果。每次来一个请求都会分配给一个Container Thread。以上是笔者对于Spring中异步模式的基本理解，主要还是依靠Servlet 3.0中提供的异步的Servlet，因此，使用之前首先要在web.xml中配置支持异步：

``` xml
<servlet>
    <servlet-name>PurchaseServlet</servlet-name>
    <servlet-class>org.codecypher.PurchaseServlet</servlet-class>
    <async-supported>true</async-supported>
</servlet>
```

## Asynchronous Request Processing(异步请求处理)

> [官方文档](http://docs.spring.io/spring/docs/4.2.3.BUILD-SNAPSHOT/spring-framework-reference/htmlsingle/#mvc-ann-async) 


## JSONP
[Spring 4 MVC + JSONP Example with REST, @ResponseBody and ResponseEntity](http://www.concretepage.com/spring-4/spring-4-mvc-jsonp-example-with-rest-responsebody-responseentity)


# Authentic(验证)
## Captcha(验证码)
- JCaptcha ([http://jcaptcha.sourceforge.net/](http://jcaptcha.sourceforge.net/))
  - Bad community responds (bad API).
- SimpleCaptcha ([http://simplecaptcha.sourceforge.net/](http://simplecaptcha.sourceforge.net/))
  - Not maven based
  - Binary based (imaging.jar represents jhlabs of 2000, Internet gives me only latest com.jhlabs.filters:2.0.235 version)
- ReCaptcha ([http://www.google.com/recaptcha](http://www.google.com/recaptcha))
  - Hard to read
```  <dependencies>
    <dependency>
      <groupId>com.github.axet</groupId>
      <artifactId>kaptcha</artifactId>
      <version>0.0.9</version>
    </dependency>
  </dependencies>
```
```package com.example.controller;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

import com.google.code.kaptcha.servlet.KaptchaExtend;

@Controller
public class RegisterKaptchaController extends KaptchaExtend {

    @RequestMapping(value = "/captcha.jpg", method = RequestMethod.GET)
    public void captcha(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        super.captcha(req, resp);
    }

    @RequestMapping(value = "/register", method = RequestMethod.GET)
    public ModelAndView registerGet(@RequestParam(value = "error", required = false) boolean failed,
            HttpServletRequest request) {
        ModelAndView model = new ModelAndView("register-get");

        //
        // model MUST contain HTML with <img src="/captcha.jpg" /> tag
        //

        return model;
    }

    @RequestMapping(value = "/register", method = RequestMethod.POST)
    public ModelAndView registerPost(@RequestParam(value = "email", required = true) String email,
            @RequestParam(value = "password", required = true) String password, HttpServletRequest request) {
        ModelAndView model = new ModelAndView("register-post");

        if (email.isEmpty())
            throw new RuntimeException("email empty");

        if (password.isEmpty())
            throw new RuntimeException("empty password");

        String captcha = request.getParameter("captcha");

        if (!captcha.equals(getGeneratedKey(request)))
            throw new RuntimeException("bad captcha");

        //
        // eveyting is ok. proceed with your user registration / login process.
        //

        return model;
    }

}
```
```
 <!-- 配置验证码 -->
    <bean id="captchaProducer" class="com.google.code.kaptcha.impl.DefaultKaptcha">
        <property name="config">
            <bean class="com.google.code.kaptcha.util.Config">
                <constructor-arg>
                    <props>
                        <!-- 图片边框 -->
                        <prop key="kaptcha.border">no</prop>
                        <!-- 图片宽度 -->
                        <prop key="kaptcha.image.width">95</prop>
                        <!-- 图片高度 -->
                        <prop key="kaptcha.image.height">45</prop>
                        <!-- 验证码背景颜色渐变，开始颜色 -->
                        <prop key="kaptcha.background.clear.from">248,248,248</prop>
                        <!-- 验证码背景颜色渐变，结束颜色 -->
                        <prop key="kaptcha.background.clear.to">248,248,248</prop>
                        <!-- 验证码的字符 -->
                        <prop key="kaptcha.textproducer.char.string">0123456789abcdefghijklmnopqrstuvwxyz快过年了我想回家</prop>
                        <!-- 验证码字体颜色 -->
                        <prop key="kaptcha.textproducer.font.color">0,0,255</prop>
                        <!-- 验证码的效果，水纹 -->
                        <prop key="kaptcha.obscurificator.impl">com.google.code.kaptcha.impl.WaterRipple</prop>
                        <!-- 验证码字体大小 -->
                        <prop key="kaptcha.textproducer.font.size">35</prop>
                        <!-- 验证码字数 -->
                        <prop key="kaptcha.textproducer.char.length">4</prop>
                        <!-- 验证码文字间距 -->
                        <prop key="kaptcha.textproducer.char.space">2</prop>
                        <!-- 验证码字体 -->
                        <prop key="kaptcha.textproducer.font.names">new Font("Arial", 1, fontSize), new Font("Courier", 1, fontSize)</prop>
                        <!-- 不加噪声 -->
                        <prop key="kaptcha.noise.impl">com.google.code.kaptcha.impl.NoNoise</prop>
                    </props>
                </constructor-arg>
            </bean>
        </property>
    </bean>
```