# Linux 性能监控

性能工具(Linux Performance Tools-full)图出自系统性能专家 Brendan Gregg。该图从 Linux 内核的各个子系统出发，列出了我们在对各个子系统进行性能分析时，可使用的工具，涵盖了监测、分析、调优等性能优化的方方面面。除了这张全景图之外，Brendan Gregg 还单独提供了基准测试工具(Linux Performance Benchmark Tools)图、性能监测工具(Linux Performance Observability Tools)图等。

![Linux Performance Tools](https://s2.ax1x.com/2019/11/18/M6g2iq.png)

上图虽好，却对分析经验要求较高，适用性和完整性不是很好。笔者将具体的工具同性能指标结合了起来，同时从不同的层次去描述了性能瓶颈点的分布。下图中系统层的工具分为 CPU、内存、磁盘（含文件系统）、网络等部分，同时引入了 JDK、Trace、Dump 分析、Profiling 等常用的组件层和应用层中的工具。

![常用 Linux 性能监控命令](https://s2.ax1x.com/2019/11/18/McwFOI.png)

# 命令清单

> 本部分仅列举出常用的命令，具体命令的使用请参考
