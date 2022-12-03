![题图](https://pic.imgdb.cn/item/638b122516f2c2beb1b3717a.jpg)

# 服务端开发实践与工程架构

在[某熊的技术之路指北 ☯](https://github.com/wx-chevalier/Developer-Zero-To-Mastery)中我们介绍过，本系列[服务端架构与实践](https://github.com/wx-chevalier/Backend-Series)与[深入浅出分布式基础架构](https://github.com/wx-chevalier/Distributed-Infrastructure-Series)这两个系列承载了笔者在泛服务端开发、运维相关工作中的知识沉淀。

# Introduction | 前言

```
System = Backend + Frontend + Architecture + Engineering
```

过去数十年间，信息技术的浪潮深刻地改变了这个社会的通信、交流与协作模式，我们熟知的互联网也经历了基于流量点击赢利的单方面信息发布的 Web 1.0 业务模式，转变为由用户主导而生成内容的 Web 2.0 业务模式；在可见的将来随着 3D 相关技术的落地，互联网应用系统所需处理的访问量和数据量必然会再次爆发性增长。

![服务衍化](https://i.postimg.cc/YS9Y9xYy/image.png)

在分布式系统的背景下，企业架构也由早期的单体式应用架构渐渐转为更加灵活的分布式应用架构，经历了单体分层架构、SOA 服务化架构、微服务架构、云原生架构等不同架构模式的变迁。后端开发不再局限于单一技术栈，并且为了应对更加庞大的集群规模，单纯的分布式系统已经难于驾驭，因此技术圈开启了一个概念爆发的时代：SOA、DevOps、容器、CI/CD、微服务、Service Mesh 等概念层出不穷，而 Docker、Kubernetes、Mesos、Spring Cloud、gRPC、Istio 等一系列产品的出现，标志着云时代已真正到来。

本系列着眼于服务端应用层的相关内容，包含了服务端基础、微服务与云原生、DevOps、测试与高可用保障等内容。

[![image.png](https://i.postimg.cc/Y2vPQ05k/image.png)](https://postimg.cc/G91zCL3S)

- UI 交互层：Windows UI、PC Web UI、移动 App UI、微信小程序 UI、摄像头视觉识别人机界面、语音交互人机界面；

- 应用层：无数碎片化的、场景化的前台业务应用，如零售、采购、招聘、报销等；

- 业务中台：协同平台（工作流引擎/消息引擎等）、应用组件（聚合支付/电子发票/电子合同/自动报税等等）、集成开发平台/定制开发平台/实施平台/运维平台，如零售中台、人力中台、财务中台等；

- 数据与算法中台：数据库/NOSQL 数据库、大数据计算平台/数据仓库数据湖/可视化、人工智能 NLP/机器学习、大数据技术平台（如 Hadoop 和 Spark）、AI 技术引擎；

- 中间件：微服务中间件、面向对象技术/组件技术/SOA、服务中间件/微服务中间件技术；

- 基础设施层：云计算 IaaS（服务器、存储、网络、文件系统）、云 IaaS 平台；

![mindmap](https://i.postimg.cc/VvfCTYff/image.png)

# Nav | 关联导航

- 如果你想了解具体的开发框架，可以参阅 [Spring Series](https://wx-chevalier.github.io/Spring-Series/#/)、[Node Series](https://wx-chevalier.github.io/Node-Series/#/)。

- 如果你想了解微服务架构相关，请参阅 [MicroService-Series](https://github.com/wx-chevalier/MicroService-Series)。

# About

## Copyright & More | 延伸阅读

<img src="https://img.shields.io/badge/License-CC%20BY--NC--SA%204.0-lightgrey.svg"/><img src="https://parg.co/bDm" />

笔者所有文章遵循 [知识共享 署名-非商业性使用-禁止演绎 4.0 国际许可协议](https://creativecommons.org/licenses/by-nc-nd/4.0/deed.zh)，欢迎转载，尊重版权。您还可以前往 [NGTE Books](https://wx-chevalier.github.io/books/) 主页浏览包含知识体系、编程语言、软件工程、模式与架构、Web 与大前端、服务端开发实践与工程架构、分布式基础架构、人工智能与深度学习、产品运营与创业等多类目的书籍列表：

[![NGTE Books](https://s2.ax1x.com/2020/01/18/19uXtI.png)](https://wx-chevalier.github.io/books/)
