# 路由与参数

# 路由

## 路径匹配

@RequestMapping 是 Spring MVC 中最常用的注解之一，`org.springframework.web.bind.annotation.RequestMapping` 被用于将某个请求映射到具体的处理类或者方法中：

```java
// @RequestMapping with Class
@Controller
@RequestMapping("/home")
public class HomeController {}

// @RequestMapping with Method
@RequestMapping(value="/method0")
@ResponseBody
public String method0(){
    return "method0";
}

// @RequestMapping with Multiple URI
@RequestMapping(value={"/method1","/method1/second"})
@ResponseBody
public String method1(){
    return "method1";
}

// @RequestMapping with HTTP Method
@RequestMapping(value="/method3", method={RequestMethod.POST,RequestMethod.GET})
@ResponseBody
public String method3(){
    return "method3";
}

// @RequestMapping default method
@RequestMapping()
@ResponseBody
public String defaultMethod(){
    return "default method";
}

// @RequestMapping fallback method
@RequestMapping("*")
@ResponseBody
public String fallbackMethod(){
    return "fallback method";
}

// @RequestMapping headers
@RequestMapping(value="/method5", headers={"name=pankaj", "id=1"})
@ResponseBody
public String method5(){
    return "method5";
}

// 表示将功能处理方法将生产 json 格式的数据，此时根据请求头中的 Accept 进行匹配，如请求头 Accept:application/json 时即可匹配;
@RequestMapping(value = "/produces", produces = "application/json")
@RequestMapping(produces={"text/html", "application/json"})
```

# 参数注入

## 路径参数

路径参数即指处理请求的 Uri 部分，不含 queryString 部分，当使用 @RequestMapping URI template 样式映射时，即 `someUrl/{paramId}`，这时的 paramId 可通过 @Pathvariable 注解绑定它传过来的值到方法的参数上。

```java
@Controller
@RequestMapping("/owners/{ownerId}")
public class RelativePathUriTemplateController {

  @RequestMapping("/pets/{petId}")
  public void findPet(@PathVariable String ownerId, @PathVariable String petId, Model model) {    
    // implementation omitted
  }
}
```

上面代码把 URI template 中变量 ownerId 的值和 petId 的值，绑定到方法的参数上。若方法参数名称和需要绑定的 Uri Template 中变量名称不一致，需要在@PathVariable("name") 指定 Uri Template 中的名称。

## 请求头

Request Header 部分的注解包括了 @RequestHeader 与 @CookieValue，@RequestHeader 注解，可以把 Request 请求 header 部分的值绑定到方法的参数上。这是一个 Request  的 header 部分：

```s
Host                    localhost:8080
Accept                  text/html,application/xhtml+xml,application/xml;q=0.9
Accept-Language         fr,en-gb;q=0.7,en;q=0.3
Accept-Encoding         gzip,deflate
Accept-Charset          ISO-8859-1,utf-8;q=0.7,*;q=0.7
Keep-Alive              300
```

可以通过如下方式来获取对应的参数值：

```java
@RequestMapping("/displayHeaderInfo.do")
public void displayHeaderInfo(@RequestHeader("Accept-Encoding") String encoding,
                              @RequestHeader("Keep-Alive") long keepAlive)  {

  //...

}
```

上面的代码，把 request header 部分的 Accept-Encoding 的值，绑定到参数 encoding 上了，Keep-Alive header 的值绑定到参数 keepAlive 上。@CookieValue  可以把 Request header 中关于 cookie 的值绑定到方法的参数上。例如有如下 Cookie 值：

``` 
JSESSIONID=415A4AC178C59DACE0B2C9CA727CDD84
```

参数绑定的代码：

```java
@RequestMapping("/displayHeaderInfo.do")
public void displayHeaderInfo(@CookieValue("JSESSIONID") String cookie)  {
  //...
}
```

即把 JSESSIONID 的值绑定到参数 cookie 上。

## 请求体

@RequestParam 常用来处理简单类型的绑定，类似于通过 Request.getParameter()  获取的 String 可直接转换为简单类型的情况，简单类型的转换操作由 ConversionService 配置的转换器来完成。它可以处理 get  方式中 queryString 的值，也可以处理 post 方式中 body data 的值；用来处理 Content-Type 为`application/x-www-form-urlencoded`编码的内容，提交方式 GET、POST。

```java
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

该注解有两个属性： value、required； value 用来指定要传入值的 id 名称，required 用来指示参数是否必须绑定；因为配置有 FormHttpMessageConverter，所以也可以用来处理 `application/x-www-form-urlencoded` 的内容，处理完的结果放在一个 MultiValueMap<String, String>里，这种情况在某些特殊需求下使用，详情查看 FormHttpMessageConverter api;

```java
@RequestMapping(value = "/something", method = RequestMethod.PUT)
public void handle(@RequestBody String body, Writer writer) throws IOException {
  writer.write(body);
}
```

## @SessionAttributes 与 @ModelAttribute

该注解用来绑定 HttpSession 中的 attribute 对象的值，便于在方法中的参数里使用。该注解有 value、types 两个属性，可以通过名字和类型指定要使用的 attribute 对象；

```java
@Controller
@RequestMapping("/editPet.do")
@SessionAttributes("pet")
public class EditPetForm {
    // ...
}
```

该注解有两个用法，一个是用于方法上，一个是用于参数上；

- 用于方法上时：通常用来在处理@RequestMapping 之前，为请求绑定需要从后台查询的 model；

- 用于参数上时：用来通过名称对应，把相应名称的值绑定到注解的参数 bean 上；

## HttpServletRequest & HttpServletResponse

```java
@Autowired HttpServletRequest request;
```

注意，HttpServletResponse 无法使用自动注入进行插入，如果需要获取该对象，可以在具体的 Controller 方法中加入 HttpServletResponse 这个参数，譬如：

```java
public DeferredResult<String> autologin(
        @PathVariable String user_id,//路徑參數,在统一的鉴权的Aspect中完成替换
        @RequestParam("requestData") String requestData,//請求數據,
        HttpServletResponse response//固定写法，把HttpServletResponse放在最后
)
```

这样的话就可以在 AOP 中获取到 response 对象。
