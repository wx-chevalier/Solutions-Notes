[![](https://i.postimg.cc/WzXsh0MX/image.png)](https://github.com/wx-chevalier/Backend-Series)

# Flume

Flume NG 是一个分布式、可靠、可用的系统，它能够将不同数据源的海量日志数据进行高效收集、聚合、移动，最后存储到一个中心化数据存储系统中。由原来的 Flume OG 到现在的 Flume NG，进行了架构重构，并且现在 NG 版本完全不兼容原来的 OG 版本。经过架构重构后，Flume NG 更像是一个轻量的小工具，非常简单，容易适应各种方式日志收集，并支持 failover 和负载均衡。Flume 初始的发行版本目前被统称为 Flume OG(original generation )，属于 Cloudera。但随着 Flume 功能的扩展，Flume OG 代码工程臃肿、核心组件设计不合理、核心配置不标准等缺点暴露出来，尤其是在 Flume OG 的最后一个发行版本 0.94.0 中，日志传输不稳定的现象尤为严重，为了解决这些问题，2011 年 10 月 22 号，Cloudera 完成了 Flume-728，对 Flume 进行了里程碑式的改动：重构核心组件、核心配置以及代码架构，重构后的版本统称为 Flume NG(next generation )；改动的另一原因是将 Flume 纳入 apache 旗下，Cloudera Flume 改名为 Apache Flume。

## Features

flume 的数据流由事件 (Event) 贯穿始终。事件是 Flume 的基本数据单位，它携带日志数据 ( 字节数组形式 ) 并且携带有头信息，这些 Event 由 Agent 外部的 Source 生成，当 Source 捕获事件后会进行特定的格式化，然后 Source 会把事件推入 ( 单个或多个 )Channel 中。你可以 把 Channel 看作是一个缓冲区，它将保存事件直到 Sink 处理完该事件。Sink 负责持久化日志或者把事件推向另一个 Source。

- 可靠性当节点出现故障时，日志能够被传送到其他节点上而不会丢失。Flume 提供了三种级别的可靠性保障，从强到弱依次分别为：end-to-end (收到数据 agent 首先将 event 写到磁盘上，当数据传送成功后，再删除；如果数据发送失败，可以重新发送。)，Store on failure (这也是 scribe 采用的策略，当数据接收方 crash 时，将数据写到本地，待恢复后，继续发送)， Besteffort(数据发送到接 收方后，不会进行确认)。
- 可恢复性还是靠 Channel。推荐使用 FileChannel，事件持久化在本地文件系统里 ( 性能较差 )。
