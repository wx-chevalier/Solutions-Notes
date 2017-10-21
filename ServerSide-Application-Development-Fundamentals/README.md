


![](https://cdn-images-1.medium.com/max/2000/1*xhBXGvGwX3Y-wv20rQIrng.jpeg)


# 服务端应用程序开发基础


# 前言



基于HTTP协议的Web API是时下最为流行的一种分布式服务提供方式。无论是在大型互联网应用还是企业级架构中，我们都见到了越来越多的SOA或RESTful的Web API。为什么Web API如此流行呢？我认为很大程度上应归功于简单有效的HTTP协议。HTTP协议是一种分布式的面向资源的网络应用层协议，无论是服务器端提供Web服务，还是客户端消费Web服务都非常简单。再加上浏览器、Javascript、AJAX、JSON以及HTML5等技术和工具的发展，互联网应用架构设计表现出了从传统的PHP、JSP、ASP.NET等服务器端动态网页向Web API + RIA（富互联网应用）过渡的趋势。Web API专注于提供业务服务，RIA专注于用户界面和交互设计，从此两个领域的分工更加明晰。在这种趋势下，Web API设计将成为服务器端程序员的必修课。然而，正如简单的Java语言并不意味着高质量的Java程序，简单的HTTP协议也不意味着高质量的Web API。要想设计出高质量的Web API，还需要深入理解分布式系统及HTTP协议的特性。



# 目录



- [HTTP 协议]()
    
- [HTTP 概述]()：HTTP 的前世今生

    
- [HTTP 请求]()：请求方法、跨域协议

    
- [HTTP 响应]()：响应码

    
- [HTTP 缓存]()：



- 常用 Web 通信协议
    - HTTPS

    - HTTP2

    - WebSocket



- Web 应用服务器
    - Apache

    - Nginx

    
- [Caddy]()



- RESTful 接口
    - Reactive Abstract Resource Flow



- GraphQL 查询语言


- 远程服务调用 RPC


- 服务端应用程序架构概述


    - SOA



- 微服务架构
    
- [基于 Docker Swarm 的微服务编排与监控]()



- Service Mesh


- DevOps 与 SRE


- 集群配置


- 持续交付



- 服务端监控



- 服务端安全保障


- 高可用架构



    - 压力测试



    - 负载均衡



    - 缓存



    - 服务降级



    - 服务容错



- 应用设计模式


    - 权限认证

    

    - 定时任务




