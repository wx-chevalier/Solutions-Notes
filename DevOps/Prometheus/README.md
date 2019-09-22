# 基于 Prometheus 的线上应用监控

Prometheus 是一套开源的监控、报警、时间序列数据库的组合；它的灵感来自谷歌的Borgmon，一个实时的时间序列监控系统，Borgmon 使用这些时间序列数据来识别问题并发出警报。Prometheus 最初由前谷歌SRE Matt T. Proud开发，并转为一个研究项目。在Proud加入SoundCloud之后，他与另一位工程师Julius Volz合作开发了Prometheus。后来其他开发人员陆续加入了这个项目，并在SoundCloud内部继续开发，最终于2015年1月公开发布。

起始是由 SoundCloud 公司开发的。随着发展，越来越多公司和组织接受采用 Prometheus，社区也十分活跃，他们便将它独立成开源项目，并且有公司来运作。google SRE 的书内也曾提到跟他们 BorgMon 监控系统相似的实现是 Prometheus。现在最常见的 Kubernetes 容器管理系统中，通常会搭配 Prometheus 进行监控。

Prometheus 的优势在于其易于安装使用，外部依赖较少；并且直接按照分布式、微服务架构模式进行设计，支持服务自动化发现与代码集成。Prometheus 能够自定义多维度的数据模型，内置强大的查询语句，搭配其丰富的社区扩展，能够轻松实现数据可视化。

![](https://i.postimg.cc/g0SDCRhK/image.png)

# 链接

- https://mp.weixin.qq.com/s/0vZLCZBPFfOMNqubpQUrbg https://mp.weixin.qq.com/s/0vZLCZBPFfOMNqubpQUrbg