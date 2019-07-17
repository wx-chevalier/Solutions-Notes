![](https://i.postimg.cc/4xhqKLQj/image.png)

# 服务端开发实践与工程架构

在[某熊的技术之路指北 ☯](https://github.com/wx-chevalier/Developer-Zero-To-Mastery)中我们介绍过，本系列[服务端架构与实践](https://github.com/wx-chevalier/Backend-Series)与[深入浅出分布式基础架构](https://github.com/wx-chevalier/Distributed-Infrastructure-Series)这两个系列承载了笔者在泛服务端开发、运维相关工作中的知识沉淀。

# Nav | 导航

您可以通过以下任一方式阅读笔者的系列文章，涵盖了技术资料归纳、编程语言与理论、Web 与大前端、服务端开发与基础架构、云计算与大数据、数据科学与人工智能、产品设计等多个领域：

- 在 Gitbook 中在线浏览，直接点击链接即可前往对应的 Gitbook 浏览。

| [Awesome Lists](https://ngte-al.gitbook.io/i/) | [Awesome CheatSheets](https://ngte-ac.gitbook.io/i/) | [Awesome Interviews](https://github.com/wx-chevalier/Developer-Zero-To-Mastery/tree/master/Interview) | [Awesome RoadMaps](https://github.com/wx-chevalier/Developer-Zero-To-Mastery/tree/master/RoadMap) | [Awesome-CS-Books-Warehouse](https://github.com/wx-chevalier/Awesome-CS-Books-Warehouse) |
| ---------------------------------------------- | ---------------------------------------------------- | ----------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |


| [编程语言理论](https://ngte-pl.gitbook.io/i/) | [Java 实战](https://ngte-pl.gitbook.io/i/go/go) | [JavaScript 实战](https://ngte-pl.gitbook.io/i/javascript/javascript) | [Go 实战](https://ngte-pl.gitbook.io/i/go/go) | [Python 实战](https://ngte-pl.gitbook.io/i/python/python) | [Rust 实战](https://ngte-pl.gitbook.io/i/rust/rust) |
| --------------------------------------------- | ----------------------------------------------- | --------------------------------------------------------------------- | --------------------------------------------- | --------------------------------------------------------- | --------------------------------------------------- |


| [软件工程、算法与架构](https://ngte-se.gitbook.io/i/) | [现代 Web 开发基础与工程实践](https://ngte-web.gitbook.io/i/) | [大前端混合开发与数据可视化](https://ngte-fe.gitbook.io/i/) | [服务端开发模式与高可用架构](https://ngte-be.gitbook.io/i/) | [分布式基础架构](https://ngte-infras.gitbook.io/i/) | [数据科学，人工智能与深度学习](https://ngte-aidl.gitbook.io/i/) | [产品设计与用户体验](https://ngte-pd.gitbook.io/i/) |
| ----------------------------------------------------- | ------------------------------------------------------------- | ----------------------------------------------------------- | ----------------------------------------------------------- | --------------------------------------------------- | --------------------------------------------------------------- | --------------------------------------------------- |


- 前往 [xCompass https://wx-chevalier.github.io](https://wx-chevalier.github.io/home/#/search) 交互式地检索、查找需要的文章/链接/书籍/课程，或者关注微信公众号：某熊的技术之路。

![](https://i.postimg.cc/3RVYtbsv/image.png)

- 在下文的 [MATRIX 文章与代码矩阵 https://github.com/wx-chevalier/Developer-Zero-To-Mastery](https://github.com/wx-chevalier/Developer-Zero-To-Mastery) 中查看文章与项目的源代码。

| [服务端应用程序开发基础](./服务端基础) | [微服务与云原生](./微服务与云原生) | [深入浅出 Node.js 全栈架构](./Node) | [Spring Boot 5 与 Spring Cloud 微服务实践](./Spring) | [DevOps 与 SRE 实战](./DevOps) | [信息安全与渗透测试必知必会](./信息安全与渗透测试) | [测试与高可用保障](./测试与高可用保障) |
| -------------------------------------- | ---------------------------------- | ----------------------------------- | ---------------------------------------------------- | ------------------------------ | -------------------------------------------------- | -------------------------------------- |


# Preface | 前言

![mindmap](https://tva1.sinaimg.cn/large/007DFXDhgy1g4jlvqqryvj30u014o4qp.jpg)

信息技术从出现伊始到渐成主流，其发展历程经历了软件、开源、云三个阶段。从软件到开源，再到云，这也是信息技术的发展趋势。

![](https://i.postimg.cc/YS9Y9xYy/image.png)

在信息技术的大潮中，每一次通信模式的升级都会给这个世界的合作模式带来变革。随着互联网在 21 世纪初被大规模接入，互联网由基于流量点击赢利的单方面信息发布的 Web 1.0 业务模式，转变为由用户主导而生成内容的 Web2.0 业务模式。因此，互联网应用系统所需处理的访问量和数据量均疾速增长，后端技术架构也因此面临着巨大的挑战。Web 2.0 阶段的互联网后端架构大多经历了由 All in One 的单体式应用架构渐渐转为更加灵活的分布式应用架构的过程，而企业级架构由于功能复杂且并未出现明显的系统瓶颈，因此并未跟进。后端开发不再局限于单一技术栈，而是越来越明显地被划分为企业级开发和互联网开发。企业级开发和互联网开发的差别不仅在于技术栈差异，也在于工作模式不同，对质量的追求和对效率的提升成了两个阵营的分水岭，互联网架构追求更高的质量和效率。

随着智能手机的出现以及 4G 标准的普及，互联网应用由 PC 端迅速转向更加自由的移动端。移动设备由于携带方便且便于定位，因此在出行、网络购物、支付等方面彻底改变了现代人的生活方式。在技术方面，为了应对更加庞大的集群规模，单纯的分布式系统已经难于驾驭，因此技术圈开启了一个概念爆发的时代——SOA、DevOps、容器、CI/CD、微服务、Service Mesh 等概念层出不穷，而 Docker、Kubernetes、Mesos、SpringCloud、gRPC、Istio 等一系列产品的出现，标志着云时代已真正到来。

[![image.png](https://i.postimg.cc/Y2vPQ05k/image.png)](https://postimg.cc/G91zCL3S)

- UI 交互层：Windows UI、PC Web UI、移动 App UI、微信小程序 UI、摄像头视觉识别人机界面、语音交互人机界面

- 应用层：无数碎片化的、场景化的前台业务应用，如零售、采购、招聘、报销...

- 业务中台：协同平台（工作流引擎/消息引擎等）、应用组件（聚合支付/电子发票/电子合同/自动报税等等）、集成开发平台/定制开发平台/实施平台/运维平台，如零售中台、人力中台、财务中台....

- 数据与算法中台：数据库/NOSQL 数据库、大数据计算平台/数据仓库数据湖/可视化、人工智能 NLP/机器学习、大数据技术平台（如 Hadoop 和 Spark）、AI 技术引擎

- 中间件：微服务中间件、面向对象技术/组件技术/SOA、服务中间件/微服务中间件技术

- 基础设施层：云计算 IaaS（服务器、存储、网络、文件系统）、云 IaaS 平台

# 版权

<img src="https://img.shields.io/badge/License-CC%20BY--NC--SA%204.0-lightgrey.svg"/><img src="https://parg.co/bDm" />

笔者所有文章遵循 [知识共享 署名-非商业性使用-禁止演绎 4.0 国际许可协议](https://creativecommons.org/licenses/by-nc-nd/4.0/deed.zh)，欢迎转载，尊重版权。如果觉得本系列对你有所帮助，欢迎给我家布丁买点狗粮(支付宝扫码)~

![default](https://i.postimg.cc/y1QXgJ6f/image.png)
