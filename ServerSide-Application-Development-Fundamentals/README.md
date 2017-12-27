![](https://cdn-images-1.medium.com/max/2000/1*xhBXGvGwX3Y-wv20rQIrng.jpeg)

# 服务端应用程序开发基础

# 前言

基于 HTTP 协议的 Web API 是时下最为流行的一种分布式服务提供方式。无论是在大型互联网应用还是企业级架构中，我们都见到了越来越多的 SOA 或 RESTful 的 Web API。为什么 Web API 如此流行呢？我认为很大程度上应归功于简单有效的 HTTP 协议。HTTP 协议是一种分布式的面向资源的网络应用层协议，无论是服务器端提供 Web 服务，还是客户端消费 Web 服务都非常简单。再加上浏览器、Javascript、AJAX、JSON 以及 HTML5 等技术和工具的发展，互联网应用架构设计表现出了从传统的 PHP、JSP、ASP.NET 等服务器端动态网页向 Web API + RIA（富互联网应用）过渡的趋势。Web API 专注于提供业务服务，RIA 专注于用户界面和交互设计，从此两个领域的分工更加明晰。在这种趋势下，Web API 设计将成为服务器端程序员的必修课。然而，正如简单的 Java 语言并不意味着高质量的 Java 程序，简单的 HTTP 协议也不意味着高质量的 Web API。要想设计出高质量的 Web API，还需要深入理解分布式系统及 HTTP 协议的特性。

## 参考

## 版权

![](https://parg.co/bDY) ![](https://parg.co/bDm)

笔者所有文章遵循 [知识共享 署名-非商业性使用-禁止演绎 4.0 国际许可协议](https://creativecommons.org/licenses/by-nc-nd/4.0/deed.zh)，欢迎转载，尊重版权。如果觉得本系列对你有所帮助，欢迎给我家布丁买点狗粮（支付宝扫码）~

![](https://github.com/wxyyxc1992/OSS/blob/master/2017/8/1/Buding.jpg?raw=true)

# 目录

* [GraphQL](https://github.com/wxyyxc1992/ServerSideApplication-Development-And-System-Architecture/ServerSide-Application-Development-Fundamentals/GraphQL/Index.md)
  * [介绍与对比](https://github.com/wxyyxc1992/ServerSideApplication-Development-And-System-Architecture/blob/master/ServerSide-Application-Development-Fundamentals/GraphQL/%E4%BB%8B%E7%BB%8D%E4%B8%8E%E5%AF%B9%E6%AF%94.md):
* [HTTP](https://github.com/wxyyxc1992/ServerSideApplication-Development-And-System-Architecture/ServerSide-Application-Development-Fundamentals/HTTP/Index.md)
  * [HTTP 响应](https://github.com/wxyyxc1992/ServerSideApplication-Development-And-System-Architecture/blob/master/ServerSide-Application-Development-Fundamentals/HTTP/HTTP%20%E5%93%8D%E5%BA%94.md):
  * [HTTP 概述](https://github.com/wxyyxc1992/ServerSideApplication-Development-And-System-Architecture/blob/master/ServerSide-Application-Development-Fundamentals/HTTP/HTTP%20%E6%A6%82%E8%BF%B0.md):
  * [HTTP 缓存](https://github.com/wxyyxc1992/ServerSideApplication-Development-And-System-Architecture/blob/master/ServerSide-Application-Development-Fundamentals/HTTP/HTTP%20%E7%BC%93%E5%AD%98.md):
  * [HTTP 请求](https://github.com/wxyyxc1992/ServerSideApplication-Development-And-System-Architecture/blob/master/ServerSide-Application-Development-Fundamentals/HTTP/HTTP%20%E8%AF%B7%E6%B1%82.md):
* [Nginx](https://github.com/wxyyxc1992/ServerSideApplication-Development-And-System-Architecture/ServerSide-Application-Development-Fundamentals/Nginx/Index.md)
  * [OpenResty](https://github.com/wxyyxc1992/ServerSideApplication-Development-And-System-Architecture/blob/master/ServerSide-Application-Development-Fundamentals/Nginx/OpenResty.md): OpenResty: 基于 Nginx 的全功能 Web 应用服务器
  * [初窥与部署](https://github.com/wxyyxc1992/ServerSideApplication-Development-And-System-Architecture/blob/master/ServerSide-Application-Development-Fundamentals/Nginx/%E5%88%9D%E7%AA%A5%E4%B8%8E%E9%83%A8%E7%BD%B2.md): Nginx 初窥与部署
  * [配置详解](https://github.com/wxyyxc1992/ServerSideApplication-Development-And-System-Architecture/blob/master/ServerSide-Application-Development-Fundamentals/Nginx/%E9%85%8D%E7%BD%AE%E8%AF%A6%E8%A7%A3.md): Nginx 配置详解与生产环境实践
* [REST](https://github.com/wxyyxc1992/ServerSideApplication-Development-And-System-Architecture/ServerSide-Application-Development-Fundamentals/REST/Index.md)
  * [RESTful 接口](https://github.com/wxyyxc1992/ServerSideApplication-Development-And-System-Architecture/blob/master/ServerSide-Application-Development-Fundamentals/REST/RESTful%20%E6%8E%A5%E5%8F%A3.md):
* [常用 Web 通信协议](https://github.com/wxyyxc1992/ServerSideApplication-Development-And-System-Architecture/ServerSide-Application-Development-Fundamentals/%E5%B8%B8%E7%94%A8%20Web%20%E9%80%9A%E4%BF%A1%E5%8D%8F%E8%AE%AE/Index.md)
  * [HTTP2](https://github.com/wxyyxc1992/ServerSideApplication-Development-And-System-Architecture/blob/master/ServerSide-Application-Development-Fundamentals/%E5%B8%B8%E7%94%A8%20Web%20%E9%80%9A%E4%BF%A1%E5%8D%8F%E8%AE%AE/HTTP2.md):
  * [HTTPS](https://github.com/wxyyxc1992/ServerSideApplication-Development-And-System-Architecture/blob/master/ServerSide-Application-Development-Fundamentals/%E5%B8%B8%E7%94%A8%20Web%20%E9%80%9A%E4%BF%A1%E5%8D%8F%E8%AE%AE/HTTPS.md):
  * [WebSocket](https://github.com/wxyyxc1992/ServerSideApplication-Development-And-System-Architecture/blob/master/ServerSide-Application-Development-Fundamentals/%E5%B8%B8%E7%94%A8%20Web%20%E9%80%9A%E4%BF%A1%E5%8D%8F%E8%AE%AE/WebSocket.md):
* [应用服务器](https://github.com/wxyyxc1992/ServerSideApplication-Development-And-System-Architecture/ServerSide-Application-Development-Fundamentals/%E5%BA%94%E7%94%A8%E6%9C%8D%E5%8A%A1%E5%99%A8/Index.md)
  * [Apache](https://github.com/wxyyxc1992/ServerSideApplication-Development-And-System-Architecture/blob/master/ServerSide-Application-Development-Fundamentals/%E5%BA%94%E7%94%A8%E6%9C%8D%E5%8A%A1%E5%99%A8/Apache.md):
  * [Caddy](https://github.com/wxyyxc1992/ServerSideApplication-Development-And-System-Architecture/blob/master/ServerSide-Application-Development-Fundamentals/%E5%BA%94%E7%94%A8%E6%9C%8D%E5%8A%A1%E5%99%A8/Caddy.md): 清新脱俗的 Web 服务器 Caddy
  * [Index](https://github.com/wxyyxc1992/ServerSideApplication-Development-And-System-Architecture/blob/master/ServerSide-Application-Development-Fundamentals/%E5%BA%94%E7%94%A8%E6%9C%8D%E5%8A%A1%E5%99%A8/Index.md): Web 应用服务器
* [应用设计模式](https://github.com/wxyyxc1992/ServerSideApplication-Development-And-System-Architecture/ServerSide-Application-Development-Fundamentals/%E5%BA%94%E7%94%A8%E8%AE%BE%E8%AE%A1%E6%A8%A1%E5%BC%8F/Index.md)
  * [定时任务](https://github.com/wxyyxc1992/ServerSideApplication-Development-And-System-Architecture/blob/master/ServerSide-Application-Development-Fundamentals/%E5%BA%94%E7%94%A8%E8%AE%BE%E8%AE%A1%E6%A8%A1%E5%BC%8F/%E5%AE%9A%E6%97%B6%E4%BB%BB%E5%8A%A1.md):
* [微服务架构](https://github.com/wxyyxc1992/ServerSideApplication-Development-And-System-Architecture/ServerSide-Application-Development-Fundamentals/%E5%BE%AE%E6%9C%8D%E5%8A%A1%E6%9E%B6%E6%9E%84/Index.md)
  * [基于 Docker Swarm 的微服务编排与监控](https://github.com/wxyyxc1992/ServerSideApplication-Development-And-System-Architecture/blob/master/ServerSide-Application-Development-Fundamentals/%E5%BE%AE%E6%9C%8D%E5%8A%A1%E6%9E%B6%E6%9E%84/%E5%9F%BA%E4%BA%8E%20Docker%20Swarm%20%E7%9A%84%E5%BE%AE%E6%9C%8D%E5%8A%A1%E7%BC%96%E6%8E%92%E4%B8%8E%E7%9B%91%E6%8E%A7.md): 基于 Docker Swarm 的微服务编排、监控与 Serverless 平台搭建
  * [微服务理念](https://github.com/wxyyxc1992/ServerSideApplication-Development-And-System-Architecture/blob/master/ServerSide-Application-Development-Fundamentals/%E5%BE%AE%E6%9C%8D%E5%8A%A1%E6%9E%B6%E6%9E%84/%E5%BE%AE%E6%9C%8D%E5%8A%A1%E7%90%86%E5%BF%B5.md):
* [权限控制](https://github.com/wxyyxc1992/ServerSideApplication-Development-And-System-Architecture/ServerSide-Application-Development-Fundamentals/%E6%9D%83%E9%99%90%E6%8E%A7%E5%88%B6/Index.md)
  * [JWT](https://github.com/wxyyxc1992/ServerSideApplication-Development-And-System-Architecture/blob/master/ServerSide-Application-Development-Fundamentals/%E6%9D%83%E9%99%90%E6%8E%A7%E5%88%B6/JWT.md):
  * [RBAC](https://github.com/wxyyxc1992/ServerSideApplication-Development-And-System-Architecture/blob/master/ServerSide-Application-Development-Fundamentals/%E6%9D%83%E9%99%90%E6%8E%A7%E5%88%B6/RBAC.md):
  * [单点登录](https://github.com/wxyyxc1992/ServerSideApplication-Development-And-System-Architecture/blob/master/ServerSide-Application-Development-Fundamentals/%E6%9D%83%E9%99%90%E6%8E%A7%E5%88%B6/%E5%8D%95%E7%82%B9%E7%99%BB%E5%BD%95.md):
* [高可用架构](https://github.com/wxyyxc1992/ServerSideApplication-Development-And-System-Architecture/ServerSide-Application-Development-Fundamentals/%E9%AB%98%E5%8F%AF%E7%94%A8%E6%9E%B6%E6%9E%84/Index.md)
  * [压力测试](https://github.com/wxyyxc1992/ServerSideApplication-Development-And-System-Architecture/blob/master/ServerSide-Application-Development-Fundamentals/%E9%AB%98%E5%8F%AF%E7%94%A8%E6%9E%B6%E6%9E%84/%E5%8E%8B%E5%8A%9B%E6%B5%8B%E8%AF%95.md):
  * [服务容错](https://github.com/wxyyxc1992/ServerSideApplication-Development-And-System-Architecture/blob/master/ServerSide-Application-Development-Fundamentals/%E9%AB%98%E5%8F%AF%E7%94%A8%E6%9E%B6%E6%9E%84/%E6%9C%8D%E5%8A%A1%E5%AE%B9%E9%94%99.md):
  * [服务降级](https://github.com/wxyyxc1992/ServerSideApplication-Development-And-System-Architecture/blob/master/ServerSide-Application-Development-Fundamentals/%E9%AB%98%E5%8F%AF%E7%94%A8%E6%9E%B6%E6%9E%84/%E6%9C%8D%E5%8A%A1%E9%99%8D%E7%BA%A7.md):
  * [缓存](https://github.com/wxyyxc1992/ServerSideApplication-Development-And-System-Architecture/blob/master/ServerSide-Application-Development-Fundamentals/%E9%AB%98%E5%8F%AF%E7%94%A8%E6%9E%B6%E6%9E%84/%E7%BC%93%E5%AD%98.md):
  * [负载均衡](https://github.com/wxyyxc1992/ServerSideApplication-Development-And-System-Architecture/blob/master/ServerSide-Application-Development-Fundamentals/%E9%AB%98%E5%8F%AF%E7%94%A8%E6%9E%B6%E6%9E%84/%E8%B4%9F%E8%BD%BD%E5%9D%87%E8%A1%A1.md):
