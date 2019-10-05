# Tekton

Tekton 是一款 Kubernetes 原生的应用发布框架，主要用来构建 CI/CD 系统。它原本是 Knative 项目里面一个叫做 build-pipeline 的子项目，用来作为 knative-build 的下一代引擎。然而，随着 Kubernetes 社区里各种各样的需求涌入，这个子项目慢慢成长为一个通用的框架，能够提供灵活强大的能力去做基于 Kubernetes 的构建发布。

- Kubernetes 原生：流程和概念，尤其是面向用户的部分，需要融入到 Kubernetes 体系中。此外，最好能跟生态里的其他工具互相连通，成为生态的一环。

举个例子：Spinnaker 这个项目是很强大的，但它的设计初衷，是面向公有云进行应用交付用的（以虚拟机为运行时），Kubernetes 只是它所支持的一种 Provider，并且 Provider 还得用 Groovy 写集成插件。这就使得它跟 Kubernetes 的协作是比较别扭的。

- 灵活扩展：基本上所有工具都不能够满足我们复杂多变的业务需求。这些工具架构本身需要提供足够灵活的扩展性，来快速定制实现所需功能。

举个例子：Argo Rollout 本身的应用发布，是跟 Kubernetes 的 Workload （比如 Deployment ）耦合在一起的。这就不是一个很具备扩展性的做法。最简单的例子：对于复杂有状态应用来说，大多都是用 Operator 或者 OpenKruise 管理的，这时候 Argo Rollout 该怎么办呢？

- 轻量级：工具本身不能做得“太重”，即不能有太多的组件或太多的概念。小而轻的项目初期易上手、中期易交付、后期易维护。

举个例子：Spinnaker 虽然功能强大，但是这也就意味着它把所有的事情都帮你做了。而我们团队要发布的应用是复杂有状态的中间件应用， 是需要我们写自己的 Rollout Controller 来控制发布流程的。这个要基于 Spinnaker 来做，还得大量做二次开发了，于是原有的众多功能和组件反而成了负担。

- 白盒化：运行中的管道、步骤等需要“白盒化”，即对外暴露状态。这样才能跟前端工具联通，给用户展示实时状态信息。

举个例子：Tekton 其实只提供 Pipeline 这个一个功能，Pipeline 会被直接映射成 Kubernetes Pod 等 API 资源。而比如应用发布过程的控制，灰度和上线策略，都是我们自己编写 Kubernetes Controller 来实现的，这个可控度其实是我们比较喜欢的。另外，这种设计，也就意味着 Tekton 不会在 Kubernetes 上盖一个“大帽子”，比如我们想看发布状态、日志，就等是直接通过 Kubernetes 查看这个 Pipeline 对应的 Pod 的状态和日志，不需要再面对另外一个 API。