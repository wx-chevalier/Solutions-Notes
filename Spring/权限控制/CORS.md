# CORS

[CORS, Cross-Origin Resource Sharing](https://parg.co/reV) 是常用的跨域请求访问协议，允许您指定授权的跨域请求类型，而不是使用基于 IFRAME 或 JSONP 的安全性较低且功能较弱的变通方法。Spring MVC 的 HandlerMapping 内建支持了 CORS 协议，它能够检查给定请求和处理程序的 CORS 配置并采取进一步操作：直接处理预检请求，同时拦截，验证简单和实际的 CORS 请求，并设置所需的 CORS 响应头。

我们可以使用 CrossOrigin 注解在类级别或者方法级别的注解来标识跨域访问：

```java
@CrossOrigin(maxAge = 3600)
@RestController
@RequestMapping("/account")
public class AccountController {

    @CrossOrigin("http://domain2.com")
    @GetMapping("/{id}")
    public Account retrieve(@PathVariable Long id) {
        // ...
    }

    @DeleteMapping("/{id}")
    public void remove(@PathVariable Long id) {
        // ...
    }
}
```

我们也可以在全局的配置中添加 CORS 统一配置：

```java
@Configuration
@EnableWebMvc
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {

        registry.addMapping("/api/**")
            .allowedOrigins("http://domain2.com")
            .allowedMethods("PUT", "DELETE")
            .allowedHeaders("header1", "header2", "header3")
            .exposedHeaders("header1", "header2")
            .allowCredentials(true).maxAge(3600);

        // Add more mappings...
    }
}
```
