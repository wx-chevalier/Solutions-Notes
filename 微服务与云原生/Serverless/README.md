![](https://i.postimg.cc/Yq5Mymft/image.png)

# Serverless

参考 CNCF 的定义，Serverless 是指构建和运行不需要服务器管理的应用程序的概念；而 AWS 官方对于 Serverless 的介绍是：服务器架构是基于互联网的系统，其中应用开发不使用常规的服务进程。相反，它们仅依赖于第三方服务（例如 AWS Lambda 服务），客户端逻辑和服务托管远程过程调用的组合。

Serverless 目前主要的落地形式为 BaaS 与 FaaS。BaaS 后端即服务，即是一些后端云服务，比如云数据库、对象存储、消息队列等。利用 BaaS，可以极大简化我们的应用开发难度。FaaS 函数即服务，则是暂存容器中运行的自定义代码，函数是无服务器架构中抽象语言运行时的最小单位。在 FaaS 中，用户主要为函数的运行时间付费，而不需要关心 CPU 或 RAM 或任何其他资源及其运维的负担。

![](https://i.postimg.cc/J4DRqQXT/image.png)

参考 BaaS 与 FaaS 的定义，我们可以知道 Serverless 的主要特点有：

- 事件驱动：函数在 FaaS 平台中，需要通过一系列的事件来驱动函数执行。

- 无状态：因为每次函数执行，可能使用的都是不同的容器，无法进行内存或数据共享。如果要共享数据，则只能通过第三方服务，比如 Redis 等。

- 无运维：使用 Serverless 我们不需要关心服务器，不需要关心运维。这也是 Serverless 思想的核心。

- 按实际使用计费：使用 Serverless 成本很低，因为我们只需要为每次函数的运行付费。函数不运行，则不花钱，也不会浪费服务器资源。

这些特征的本质，是用户对于云端应用开发，乃至于所谓云原生应用中的用户友好与低心智负担方向演讲的最直接途径，而这种简单、经济、可信赖的期许，也是云计算的初心。当然 Serverless 并不拘泥于 Function，而是应该多种部署形态并存，譬如以应用方式部署，则是遵循单一职责原则，但是能够触发多个事件；也可以在容器级别部署，能够包含任意语言、任意运行时，譬如 [Knative](https://github.com/knative) 这样的解法。在[微服务与云原生/Serverless](https://github.com/wxyyxc1992/Backend-Series/blob/master/%E5%BE%AE%E6%9C%8D%E5%8A%A1%E4%B8%8E%E4%BA%91%E5%8E%9F%E7%94%9F/Serverless/README.md#L17) 一节中我们也讨论了更多的 Serverless 落地模式。

从前端的视角来看，Serverless 也赋予了前端更多的自由与可能性，在服务端渲染，小程序开发的简单服务端支持，包括 BFF 接口聚合等方面都有很多的空间。

# Background | 背景

AWS Summit：现代化的架构是使用 AWS 的服务、Lambda 的功能，把它们连接在一起。没有中间层、没有应用层，也没有数据库层，它是一系列 web 服务连接在一起，由功能连接在一起，无需服务器，而安全、可靠性、规模、性能、成本管理这些事项由 AWS 做好。在 AWS 的观点里，我认为 Serverless 不是指 FaaS，而是指上面讲的这个现代化架构。"Everyone wants just to focus on business logic."

而这种上层应用服务能力向 Serverless 迁移的演进过程，必然还会伴随着整个云计算平台继续演进，这既包括了面向新应用服务的存储和网络方案，也可能会包括计费模型的变化。但最重要的，还是不断被优化的 Auto-scaling 能力和细粒度的资源隔离技术，只有它们才是确保 Serverless 能为用户带来价值的最有力保障。

UC Berkley 认为 Serverless 是 One Step Forward, Two Steps Back。关于 One Step Forward 的观点为带来的主要是云资源的弹性的使用。关于 Two Steps Back 的观点为：Function 的情况下，每个 Function 是独立的，Function 之间的交互是通过持久或临时的存储、事件驱动来完成，导致了完成交互的时间比以前慢了很多很多。并且通常分布式系统会依赖很多的类似 leader election 协议、数据一致性、事务机制等，而这些在目前的 FaaS 类型的平台里是很难去实现的。

软件发展到今天，多数企业的业务系统开始越来越复杂化，开发一个业务系统需要掌握和关注的知识点越来越多，并且系统中出现了越来越多的非业务的基础技术系统，例如分布式 cache 等等，在这种情况下，研发的门槛在上升，效率在下降，而 Serverless 思想我觉得很重要的就是用于解决研发门槛和效率的问题，让业务系统研发能更专注的关注在业务逻辑上（和 AWS 说的现代化架构的观点一致），而不仅仅是充分发挥云资源的弹性，按量付费降低成本那么简单。

核心的点就在于把业务系统开发时需要用到的各种基础技术产品都隐藏起来，并将要用到的一些基础技术进行归纳抽象，例如存储、服务交互。

Managed Services 里面当然包括 AWS S3，DynamoDB，SNS，SQS 等。这些 Managed Service 不仅在 Serverless 里面可以用，在 server program 里面也在用，但是很显然，这些丰富的 Managed Service 极大地促进了 Serverless ——可以让开发者在体感上完全去除 server 的概念。例如，虽然 Serverless 里面也可以用 RDS，但因为 RDS 后面你还需要自己管理 Server，因此总体的感觉依然是 Server based。
