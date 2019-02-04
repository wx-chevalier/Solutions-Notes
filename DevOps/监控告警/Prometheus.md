# 基于 Prometheus 的线上应用监控

Prometheus 是一套开源的监控&报警&时间序列数据库的组合，起始是由 SoundCloud 公司开发的。随着发展，越来越多公司和组织接受采用 Prometheus，社区也十分活跃，他们便将它独立成开源项目，并且有公司来运作。google SRE 的书内也曾提到跟他们 BorgMon 监控系统相似的实现是 Prometheus。现在最常见的 Kubernetes 容器管理系统中，通常会搭配 Prometheus 进行监控。

Prometheus 的优势在于其易于安装使用，外部依赖较少；并且直接按照分布式、微服务架构模式进行设计，支持服务自动化发现与代码集成。Prometheus 能够自定义多维度的数据模型，内置强大的查询语句，搭配其丰富的社区扩展，能够轻松实现数据可视化。

# 安装与配置

# 数据模型与类型

Prometheus 从根本上存储的所有数据都是时间序列: 具有时间戳的数据流只属于单个度量指标和该度量指标下的多个标签维度。除了存储时间序列数据外，Prometheus 也可以利用查询表达式存储 5 分钟的返回结果中的时间序列数据。

## Metrics Name & Label

每条时间序列是由唯一的指标名称和一组标签 (key=value)的形式组成。指标名称 一般是给监测对像起一名字，例如 http*requests_total 这样，它有一些命名规则，可以包字母数字*之类的的。通常是以`应用名称开头_监测对像_数值类型_单位`这样。

- push_total

- userlogin_mysql_duration_seconds

- app_memory_usage_bytes

标签 就是对一条时间序列不同维度的识别了，例如 一个 http 请求用的是 POST 还是 GET，它的 endpoint 是什么，这时候就要用标签去标记了。最终形成的标识便是这样了

```yaml
http_requests_total{method="POST",endpoint="/api/tracks"}
```

针对 http_requests_total 这个 metrics name 无论是增加标签还是删除标签都会形成一条新的时间序列。查询语句就可以跟据上面标签的组合来查询聚合结果了。如果以传统数据库的理解来看这条语句，则可以考虑 http_requests_total 是表名，标签是字段，而 timestamp 是主键，还有一个 float64 字段是值了。

## 数据类型

### Counter: 计数

Counter 用于累计值，例如记录请求次数、任务完成数、错误发生次数等，该值一直增加，不会减少，重启进程后，会被重置。譬如：

```
http_response_total{method="GET",endpoint="/api/tracks"} 100
```

### Gauge: 常规数值

Gauge 常规数值，例如温度变化、内存使用变化，该值可变大可变小，重启进程后，该值会被重置。

```yaml
memory_usage_bytes{host="master-01"} 100 < 抓取值
memory_usage_bytes{host="master-01"} 30
memory_usage_bytes{host="master-01"} 50
memory_usage_bytes{host="master-01"} 80 < 抓取值
```

### Histogram: 柱状图

Histogram 可以理解为柱状图的意思，常用于跟踪事件发生的规模，例如：请求耗时、响应大小。它特别之处是可以对记录的内容进行分组，提供 count 和 sum 全部值的功能。

### Summary: 求和

Summary 和 Histogram 十分相似，常用于跟踪事件发生的规模，例如：请求耗时、响应大小。同样提供 count 和 sum 全部值的功能。
