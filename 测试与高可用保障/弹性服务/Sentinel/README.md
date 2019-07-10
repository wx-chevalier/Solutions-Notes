![](https://user-images.githubusercontent.com/9434884/43697219-3cb4ef3a-9975-11e8-9a9c-73f4f537442d.png)

# Sentinel

Sentinel 是对资源调用的控制组件，主要涵盖授权、限流、降级、调用统计等功能模块。Sentinel 接入方式简单，默认适配 Dubbo，Web Url，DAO 等接入端；适用于流量控制、熔断降级、热点限流、系统保护等场景。Sentinel 还提供了非常灵活的规则配置机制，规则组合多样，更改即时生效；并且 Sentinel 损耗可控，单机 4W QPS 时性能损耗只有 2.4%。

Sentinel 往往部署在服务的前端，为服务提供了代理调用的形式：

![](https://i.postimg.cc/SqpLNB5C/image.png)

Sentinel 有两个基础概念:资源和策略，对特定的资源采取不同的控制策略，起到保障应用稳定性的作用。Sentinel 提供了多个默认切入点覆盖了大部分使用场景，保证对应用的低侵入性；同时也支持硬编码或者自定义 AOP 的方式来支持特定的使用需求。Sentinel 提供了全面的运行状态监控，实时监控资源的调用情况（QPS、RT、限流降级等信息）。Sentinel 的限流策略是应用在单机的，在具体应用层生效。

![](https://i.postimg.cc/0QCKRtmZ/image.png)

# 保护策略

## 热点保护

热点保护是为了避免某些热点 Key 的访问拖垮目标服务。

![](https://i.postimg.cc/2yZpLtw7/image.png)

## 系统保护

系统保护是为了保护整个系统指标处于安全的水位，这里的系统指标包括了 LOAD，单机总 RT，单机总线程数，单机总 QPS 等。当监控到系统指标超过阈值的时候，则拒绝入口流量。

![](https://i.postimg.cc/ZR1p4f5d/image.png)

# 链接

- https://www.alibabacloud.com/blog/hystrix-vs--sentinel-a-tale-of-two-circuit-breakers-part-1_594755?spm=a2c65.11461447.0.0.3cac17c68zYhzw

- https://www.atatech.org/articles/59390?flag_data_from=
