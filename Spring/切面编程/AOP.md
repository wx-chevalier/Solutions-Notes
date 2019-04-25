# Introduction

在切面编程的开发中，我们经常会碰到以下几个概念：Aspect、Pointcut、JoinPoint、Advice 以及 Advisor。首先，Advisor 可以认为是 Advice 与 Pointcut 的集合，用于在 Spring 1.2 之前的一些内置的概念，在 Spring 1.2 之后主要使用@AspectJ 以及 Annotation 进行切面配置，大概示意如下：
![](http://i.stack.imgur.com/zLOlc.gif)
一个标准的 Advisor 大概如下所示：

```
public interface PointcutAdvisor {
 Pointcut getPointcut();
 Advice getAdvice();
}

1public interface PointcutAdvisor {


2 Pointcut getPointcut();


3 Advice getAdvice();


4}
```

在最新的 Aspect 与 Pointcut 的结合概念为：
![](http://i.stack.imgur.com/k32oZ.jpg)
**Joinpoint:** A joinpoint is a _candidate_ point in the **Program Execution** of the application where an aspect can be plugged in. This point could be a method being called, an exception being thrown, or even a field being modified. These are the points where your aspect’s code can be inserted into the normal flow of your application to add new behavior.

**Advice:** This is an object which includes API invocations to the system wide concerns representing the action to perform at a joinpoint specified by a point.

**Pointcut:** A pointcut defines at what joinpoints, the associated Advice should be applied. Advice can be applied at any joinpoint supported by the AOP framework. Of course, you don’t want to apply all of your aspects at all of the possible joinpoints. Pointcuts allow you to specify where you want your advice to be applied. Often you specify these pointcuts using explicit class and method names or through regular expressions that define matching class and method name patterns. Some AOP frameworks allow you to create dynamic pointcuts that determine whether to apply advice based on runtime decisions, such as the value of method parameters.

The following image can help you understand Advice, PointCut, Joinpoints. ![enter image description here](http://i.stack.imgur.com/J7Hrh.png)

## Reference
