[![](https://i.postimg.cc/WzXsh0MX/image.png)](https://github.com/wx-chevalier/Backend-Series)

# 常用的性能监控

从系统、中间件、应用程序三个维度去考虑，在实际运行时，这三者往往是相辅相成、相互影响的。系统是为应用提供了运行时环境，系统如果存在瓶颈，将会导致应用/中间件的性能下降；而应用/中间件的不合理设计，也会体现在系统资源上。因此，分析瓶颈点时，需要我们结合从不同角度分析出的结果，抽出共性，得到最终的结论。

其次，建议先从应用层入手，分析图中标注的高频指标，抓出最重要的、最可疑的、最有可能导致性能的点，得到初步的结论后，再去系统层进行验证。这样做的好处是：很多性能瓶颈点体现在系统层，会是多变量呈现的，譬如，应用 GC 出现了异常，在应用层通过 JDK 自带的工具很容易观测到，但是体现在系统层上，可能会发现应用当前的 CPU、内存都不太正常，这就给我们的分析思路带来了困扰。

最后，如果瓶颈点在应用层和系统层均呈现出多变量分布，建议此时使用 JProfiler 等工具对应用进行 Profiling，获取应用的综合性能信息（注：Profiling 指的是在应用运行时，通过事件（Event-based）、统计抽样（Sampling Statistical）或植入附加指令（Byte-Code instrumentation）等方法，收集应用运行时的信息，来研究应用行为的动态分析方法）。譬如，可以对 CPU 进行抽样统计，结合各种符号表信息，得到一段时间内应用内的代码热点。

# Linux

性能工具(Linux Performance Tools-full)图出自系统性能专家 Brendan Gregg。该图从 Linux 内核的各个子系统出发，列出了我们在对各个子系统进行性能分析时，可使用的工具，涵盖了监测、分析、调优等性能优化的方方面面。除了这张全景图之外，Brendan Gregg 还单独提供了基准测试工具(Linux Performance Benchmark Tools)图、性能监测工具(Linux Performance Observability Tools)图等。

![Linux Performance Tools](https://s2.ax1x.com/2019/11/18/M6g2iq.png)

上图虽好，却对分析经验要求较高，适用性和完整性不是很好。笔者将具体的工具同性能指标结合了起来，同时从不同的层次去描述了性能瓶颈点的分布。下图中系统层的工具分为 CPU、内存、磁盘（含文件系统）、网络等部分，同时引入了 JDK、Trace、Dump 分析、Profiling 等常用的组件层和应用层中的工具。

![常用 Linux 性能监控命令](https://s2.ax1x.com/2019/11/18/McwFOI.png)

> 本部分仅列举出常用的命令，具体命令的使用请参考 [Linux 命令实践](https://github.com/wx-chevalier/Linux-Series)。

# 链接

- 参考[用十条命令在一分钟内检查 Linux 服务器性能](http://www.infoq.com/cn/news/2015/12/linux-performance)

- [How Do I Find The Largest Top 10 Files and Directories On a Linux / UNIX / BSD?](http://www.cyberciti.biz/faq/how-do-i-find-the-largest-filesdirectories-on-a-linuxunixbsd-filesystem/)

- https://zhuanlan.zhihu.com/p/68139649
