![Spinnaker 题图](https://s2.ax1x.com/2019/10/30/K4GzrD.md.png)

# Spinnaker

Spinnaker 是 Netflix 的开源项目，是一个持续交付平台，它定位于将产品快速且持续的部署到多种云平台上。Spinnaker 通过将发布和各个云平台解耦，来将部署流程流水线化，从而降低平台迁移或多云品台部署应用的复杂度，它本身内部支持 Google、AWS EC2、Microsoft Azure、Kubernetes 和 OpenStack 等云平台，并且它可以无缝集成其他持续集成（CI）流程，如 git、Jenkins、Travis CI、Docker registry、cron 调度器等。简而言之，Spinnaker 是致力于提供在多种平台上实现开箱即用的集群管理和部署功能的平台。

# 功能特性

Spinnaker 主要包含两大块内容，集群管理和部署管理。

## 集群管理

![Spinnaker 集群管理](https://i.postimg.cc/jdCPHsh9/image.png)

集群管理主要用于管理云上的资源，它分为以下几个块：

- Server Group：服务组，是资源管理单位，识别可部署组件和基础配置设置，它并且关联了一个负载均衡器和安全组，当部署完毕后，服务组就相当于一组运行中的软件实例集合，如（VM 实例，Kubernetes pods）。

- Cluster：集群，由用户定义的，对服务组的逻辑分组。

- Applications：应用，是对集群的逻辑分组。

- Load Balancer：负载均衡，用于将外部网络流量重定向到服务组中的机器实例，还可以指定一系列规则，用来对服务组中的机器实例做健康监测。

- Security Group：安全组，定义了网络访问权限，由 IP、端口和通信协议组成的防火墙规则。

## 部署管理

部署管理功能用于创建一个持续交付流程，它可分为管道和阶段两大部分：

- 管道：部署管理的核心是管道，在 Spinnaker 的定义中，管道由一系列的阶段（stages）组成。管道可以人工触发，也可以配置为自动触发，比如由 Jenkins Job 完成时、Docker Images 上传到仓库时，CRON 定时器、其他管道中的某一阶段。同时，管道可以配置参数和通知，可以在管道一些阶段上执行时发送邮件消息。Spinnaker 已经内置了一些阶段，如执行自定义脚本、触发 Jenkins 任务等。

![部署管道](https://i.postimg.cc/hG8dDhSJ/image.png)

- 阶段：阶段在 Spinnaker 中，可以作为管道的一个自动构建模块的功能组成。我们可以随意在管道中定义各个阶段执行顺序。Spinnaker 提供了很多阶段供我们选择使用，比如执行发布（Deploy）、执行自定义脚本 (script)、触发 Jenkins 任务 (jenkins)等，功能很强大。

- 部署策略：Spinnaker 支持精细的部署策略，比如 红/黑（蓝/绿）部署，多阶段环境部署，滚动红/黑策略，canary 发布等。用户可以为每个环境使用不同部署策略，比如，测试环境可以使用红/黑策略，生产环境使用滚动红/黑策略，它封装好了必须的步骤，用户不需要复杂操作，就可以实现企业级上线。

![部署策略](https://i.postimg.cc/P5YLyNv6/image.png)

# Spinnaker 架构组件

![组件与角色](https://i.postimg.cc/zGYT67cN/image.png)

- **Deck**：面向用户 UI 界面组件，提供直观简介的操作界面，可视化操作发布部署流程。
- **API**： 面向调用 API 组件，我们可以不使用提供的 UI，直接调用 API 操作，由它后台帮我们执行发布等任务。
- **Gate**：是 API 的网关组件，可以理解为代理，所有请求由其代理转发。
- **Rosco**：是构建 beta 镜像的组件，需要配置 Packer 组件使用。
- **Orca**：是核心流程引擎组件，用来管理流程。
- **Igor**：是用来集成其他 CI 系统组件，如 Jenkins 等一个组件。
- **Echo**：是通知系统组件，发送邮件等信息。
- **Front50**：是存储管理组件，需要配置 Redis、Cassandra 等组件使用。
- **Cloud driver** 是它用来适配不同的云平台的组件，比如 Kubernetes，Google、AWS EC2、Microsoft Azure 等。
- **Fiat** 是鉴权的组件，配置权限管理，支持 OAuth、SAML、LDAP、GitHub teams、Azure groups、 Google Groups 等。

![组件间数据交互](https://i.postimg.cc/mZ1Fkd2f/image.png)

以上组件除了核心组件外，一些组价可选择配置是否启动，比如不做权限管理的话，Fiat 就可以不启动，不集成其他 CI 的话，那就可以不启动 Igor 组件等。这些都可以在配置文件中配置，下边会说到。Development 版本，各个组件独立服务运行，有各自的服务端口，且各个组件都有自己的独立的项目 GitHub 地址。
