# Spring Boot 请求处理

# Controller

# @RestController

Spring 4.0 引入了 @RestController，这是一个控制器的专用版本，它是一个方便的注释，除了添加 @Controller 和 @ResponseBody 注释之外什么都不做。 通过使用 @RestController 注释注释控制器类，您不再需要将 @ResponseBody 添加到所有请求映射方法。@ResponseBody 注释默认处于活动状态。

![](https://resources.cloud.genuitec.com/wp-content/uploads/2015/09/4.x-diagram.png)

```java
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
