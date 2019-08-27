# 基于 Prometheus 的线上应用监控

Prometheus 是一套开源的监控、报警、时间序列数据库的组合，起始是由 SoundCloud 公司开发的。随着发展，越来越多公司和组织接受采用 Prometheus，社区也十分活跃，他们便将它独立成开源项目，并且有公司来运作。google SRE 的书内也曾提到跟他们 BorgMon 监控系统相似的实现是 Prometheus。现在最常见的 Kubernetes 容器管理系统中，通常会搭配 Prometheus 进行监控。

Prometheus 的优势在于其易于安装使用，外部依赖较少；并且直接按照分布式、微服务架构模式进行设计，支持服务自动化发现与代码集成。Prometheus 能够自定义多维度的数据模型，内置强大的查询语句，搭配其丰富的社区扩展，能够轻松实现数据可视化。

![](https://i.postimg.cc/g0SDCRhK/image.png)

# 链接

- https://mp.weixin.qq.com/s/0vZLCZBPFfOMNqubpQUrbg https://mp.weixin.qq.com/s/0vZLCZBPFfOMNqubpQUrbg