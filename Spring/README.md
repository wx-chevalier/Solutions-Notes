![](https://s2.ax1x.com/2019/09/03/nFQaut.png)

# Spring 微服务实践

Spring 的设计目标是为我们提供一个一站式的轻量级应用开发平台，抽象了应用开发中遇到的共性问题。作为平台，它考虑到了企业应用资源的使用，比如数据的持久化、数据集成、事务处理、消息中间件、分布式式计算等高效可靠处理企业数据方法的技术抽象。开发过程中的共性问题，Spring 封装成了各种组件，而且 Spring 通过社区，形成了一个开放的生态系统，比如 Spring Security 就是来源于一个社区贡献。

使用 Spring 进行开发，对开发人员比较轻量，可以使用 POJO 和 Java Bean 的开发方式，使应用面向接口开发，充分支持了面向对象的设计方法。通过 IOC 容器减少了直接耦合，通过 AOP 以动态和非侵入的方式增加了服务的功能，为灵活选取不同的服务实现提供了基础，这也是 Spring 的核心。轻量级是相对于传统 J2EE 而言的，传统的 J2EE 开发，需要依赖按照 J2EE 规范实现的 J2EE 应用服务器，设计和实现时，需要遵循一系列的接口标准，这种开发方式耦合性高，使应用在可测试性和部署上都有影响，对技术的理解和要求相对较高。

![mindmap](https://i.postimg.cc/T2g6cQD1/image.png)

# Spring 历史

## 特性

- 轻量非侵入：从大小与开销两方面而言，Spring 都是非常轻量的，完整的 Spring 框架可以在一个大小仅有 1M 多的 JAR 文件里发布，并且 Spring 所需要的处理开销也是微不足道的。

- 控制反转：

- 面向切面：

- 容器：

- 框架：

## 配置方式

在 Spring 1.x 的时代，主要使用 XML 来配置 Bean，我们需要频繁的在开发的类和配置文件之间切换。到了在 Spring2.x 时代，随着 JDK1.5 带来的注解支持，Spring 提供了声明 Bean 的注解（@Component,@Service 等），大大减少了配置量。而从 Spring 3.x 以后，Spring 提供了更为丰富的 Java 配置的能力（@Configuration，@Bean）等。

## Spring Boot

![](https://s2.ax1x.com/2019/09/03/nFQxUO.png)

Spring Boot 充分利用了 JavaConfig 的配置模式以及“约定优于配置”的理念，能够极大的简化基于 Spring MVC 的 Web 应用和 REST 服务开发。Spring Boot 可以使得创建独立的产品级别的基于 Spring 的应用程序变得更加简单，使得能够做到开箱即用。Spring Boot 可以用于创建能够直接用 `java -jar` 命令运行的或者类似于传统的 war 部署方式的应用程序。同样也提供了所谓的 `spring scripts` 这样的命令行工具。

# 架构与生态圈

![Spring Framework Runtime](https://s2.ax1x.com/2019/09/03/nFNE40.png)

# About

## Copyright

<img src="https://img.shields.io/badge/License-CC%20BY--NC--SA%204.0-lightgrey.svg"/><img src="https://parg.co/bDm" />

笔者所有文章遵循 [知识共享 署名-非商业性使用-禁止演绎 4.0 国际许可协议](https://creativecommons.org/licenses/by-nc-nd/4.0/deed.zh)，欢迎转载，尊重版权。如果觉得本系列对你有所帮助，欢迎给我家布丁买点狗粮(支付宝扫码)~

![default](https://i.postimg.cc/y1QXgJ6f/image.png)

## Home & More | 延伸阅读

![](https://i.postimg.cc/CMDmg2SQ/image.png)

您可以通过以下导航来在 Gitbook 中阅读笔者的系列文章，涵盖了技术资料归纳、编程语言与理论、Web 与大前端、服务端开发与基础架构、云计算与大数据、数据科学与人工智能、产品设计等多个领域：

- 知识体系：《[Awesome Lists | CS 资料集锦](https://ngte-al.gitbook.io/i/)》、《[Awesome CheatSheets | 速学速查手册](https://ngte-ac.gitbook.io/i/)》、《[Awesome Interviews | 求职面试必备](https://github.com/wx-chevalier/Awesome-Interviews)》、《[Awesome RoadMaps | 程序员进阶指南](https://github.com/wx-chevalier/Awesome-RoadMaps)》、《[Awesome MindMaps | 知识脉络思维脑图](https://github.com/wx-chevalier/Awesome-MindMaps)》、《[Awesome-CS-Books | 开源书籍（.pdf）汇总](https://github.com/wx-chevalier/Awesome-CS-Books)》

- 编程语言：《[编程语言理论](https://ngte-pl.gitbook.io/i/)》、《[Java 实战](https://ngte-pl.gitbook.io/i/java/java)》、《[JavaScript 实战](https://ngte-pl.gitbook.io/i/javascript/javascript)》、《[Go 实战](https://ngte-pl.gitbook.io/i/go/go)》、《[Python 实战](https://ngte-pl.gitbook.io/i/python/python)》、《[Rust 实战](https://ngte-pl.gitbook.io/i/rust/rust)》

- 软件工程、模式与架构：《[编程范式与设计模式](https://ngte-se.gitbook.io/i/)》、《[数据结构与算法](https://ngte-se.gitbook.io/i/)》、《[软件架构设计](https://ngte-se.gitbook.io/i/)》、《[整洁与重构](https://ngte-se.gitbook.io/i/)》、《[研发方式与工具](https://ngte-se.gitbook.io/i/)》

* Web 与大前端：《[现代 Web 开发基础与工程实践](https://ngte-web.gitbook.io/i/)》、《[数据可视化](https://ngte-fe.gitbook.io/i/)》、《[iOS](https://ngte-fe.gitbook.io/i/)》、《[Android](https://ngte-fe.gitbook.io/i/)》、《[混合开发与跨端应用](https://ngte-fe.gitbook.io/i/)》

* 服务端开发实践与工程架构：《[服务端基础](https://ngte-be.gitbook.io/i/)》、《[微服务与云原生](https://ngte-be.gitbook.io/i/)》、《[测试与高可用保障](https://ngte-be.gitbook.io/i/)》、《[DevOps](https://ngte-be.gitbook.io/i/)》、《[Node](https://ngte-be.gitbook.io/i/)》、《[Spring](https://ngte-be.gitbook.io/i/)》、《[信息安全与渗透测试](https://ngte-be.gitbook.io/i/)》

* 分布式基础架构：《[分布式系统](https://ngte-infras.gitbook.io/i/)》、《[分布式计算](https://ngte-infras.gitbook.io/i/)》、《[数据库](https://ngte-infras.gitbook.io/i/)》、《[网络](https://ngte-infras.gitbook.io/i/)》、《[虚拟化与编排](https://ngte-infras.gitbook.io/i/)》、《[云计算与大数据](https://ngte-infras.gitbook.io/i/)》、《[Linux 与操作系统](https://ngte-infras.gitbook.io/i/)》

* 数据科学，人工智能与深度学习：《[数理统计](https://ngte-aidl.gitbook.io/i/)》、《[数据分析](https://ngte-aidl.gitbook.io/i/)》、《[机器学习](https://ngte-aidl.gitbook.io/i/)》、《[深度学习](https://ngte-aidl.gitbook.io/i/)》、《[自然语言处理](https://ngte-aidl.gitbook.io/i/)》、《[工具与工程化](https://ngte-aidl.gitbook.io/i/)》、《[行业应用](https://ngte-aidl.gitbook.io/i/)》

* 产品设计与用户体验：《[产品设计](https://ngte-pd.gitbook.io/i/)》、《[交互体验](https://ngte-pd.gitbook.io/i/)》、《[项目管理](https://ngte-pd.gitbook.io/i/)》

* 行业应用：《[行业迷思](https://github.com/wx-chevalier/Business-Series)》、《[功能域](https://github.com/wx-chevalier/Business-Series)》、《[电子商务](https://github.com/wx-chevalier/Business-Series)》、《[智能制造](https://github.com/wx-chevalier/Business-Series)》

此外，你还可前往 [xCompass](https://wx-chevalier.github.io/home/#/search) 交互式地检索、查找需要的文章/链接/书籍/课程；或者在 [MATRIX 文章与代码索引矩阵](https://github.com/wx-chevalier/Developer-Zero-To-Mastery)中查看文章与项目源代码等更详细的目录导航信息。最后，你也可以关注微信公众号：『**某熊的技术之路**』以获取最新资讯。
