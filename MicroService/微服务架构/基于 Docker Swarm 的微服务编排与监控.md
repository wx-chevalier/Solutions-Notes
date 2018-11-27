[![返回目录](https://parg.co/Udx)](https://parg.co/UdT)

![](https://coding.net/u/hoteam/p/Cache/git/raw/master/2017/8/1/Microservices.png)

# 基于 Docker Swarm 的(简单)微服务编排与治理

本文更多着眼于应用层的微服务架构，对于存储层/虚拟化层则另文讨论目前正在着手进行 K8s 迁移

应用服务本身尽可能无状态化

我司只有不到二十位开发人员，尚无专业的运维或者 SRE，希望以最小的代价满足应用部署与线上监控的目标。

使用 Docker 进行自动化部署，使用 Docker Swarm 进行集群管理与自动负载均衡，使用 Portainer 进行界面化的容器管理与监控，使用 Declarative Crawler 进行应用级别的监控。

涉及到静态页面、Node.js 、 Java、Python

使用 Caddy 作为反向代理与请求路口，使用 Jenkins 作为持续集成构建服务，使用 MySQL/TiDB 作为核心关系型数据库，使用 Redis 作为缓存数据库，使用 ElasticSearch/Kibana 作为搜索引擎支撑，使用 Presto 作为跨数据库查询层，使用 FileBeat 进行日志搜集，使用 Kafka / Kafka Streaming 作为消息队列以及简易流计算工具。

在早期的基础设施架构中我们只是做了 RAID，然后使用 Xen 对物理服务器进行了虚拟化操作，在虚拟机层面进行了容灾备份。除了专门的数据存储服务器以及反向代理服务器是由统一管理，其他各个产品线的应用都是由开发人员自己登陆可用的服务器进行部署；对于同一台机器需要部署多个应用的情况，我们是使用 tmux 开启多个 Session，这种模式对于调试还是非常友好的。这就导致了本身基础设施的混乱，以及应用的不可控；譬如尚未做隔离的情况下，某个应用的崩溃或者误操作可能会导致其所在的虚拟机崩溃，最终导致该虚拟机承载的其他服务或者其他依赖服务连锁崩溃。

另一个笔者发现，在这种朴素的模式中，往往部署所需要的配置是直接后来服务器增加到了十余台，线上应用的可用性与整个 IT 资源的可控性却感觉越发地低了。

- 构建与部署剥离
- 开发人员尽量避免直接登录服务器
- 运维配置、脚本同样入库管理

Next Step: Try K8s &Terraform & Rancher

![](https://camo.githubusercontent.com/36bc60e2ccb6ae78a757a5c5a7214a23514b20ff/68747470733a2f2f706172672e636f2f555a73)

# 环境配置

也可以使用 Ansible 等自动化工具进行批量配置

# 基础架构

## Docker 集群

## 状态(分布式数据存储)服务

```sh
#!/bin/bash


REDIS_CONFIG='port 6379
cluster-enabled yes
cluster-config-file nodes.conf
cluster-node-timeout 5000
appendonly yes'


network=mynet


docker service create --name redis \
  --network $network \
  --replicas=6 \
  -e REDIS_CONFIG="$REDIS_CONFIG" \
  -e REDIS_CONFIG_FILE="/usr/local/etc/redis/redis.conf" \
  redis:3.2.6-alpine sh -c 'mkdir -p $(dirname $REDIS_CONFIG_FILE) && echo "$REDIS_CONFIG" > $REDIS_CONFIG_FILE && cat $REDIS_CONFIG_FILE && redis-server $REDIS_CONFIG_FILE'


sleep 2
docker service ps redis --no-trunc


# run the redis-trib.rb script  (the docker inspect runs on the host and the echo output is passed the along to the ruby container)
docker run -it --rm --net $network ruby sh -c "\
  gem install redis --version 3.2 \
  && wget http://download.redis.io/redis-stable/src/redis-trib.rb \
  && ruby redis-trib.rb create --replicas 1 \
  \$(getent hosts tasks.redis | awk '{print \$1 \":6379\"}') "
```

```
./redis.sh
```

```sh
docker run -it --rm --net mynet redis:3.2.6 redis-cli -c -h redis -p 6379

10.0.0.7:6379> set mykey1 1
OK
10.0.0.7:6379> set mykey2 2
-> Redirected to slot [14119] located at 10.0.0.6:6379
OK
10.0.0.6:6379> set mykey3 3
-> Redirected to slot [9990] located at 10.0.0.4:6379
OK
10.0.0.4:6379> get mykey1
-> Redirected to slot [1860] located at 10.0.0.7:6379
"1"
10.0.0.7:6379> get mykey2
-> Redirected to slot [14119] located at 10.0.0.6:6379
"2"
10.0.0.6:6379> get mykey3
-> Redirected to slot [9990] located at 10.0.0.4:6379
"3"
10.0.0.4:6379>
```

## Serverless

使用 [faas](https://github.com/alexellis/faas) 工具

```sh
# 抓取代码库
git clone https://github.com/alexellis/faas


# 执行 Stack 安装
./deploy_stack.sh


# docker-composer.yml
version: "3"

services:



# Core API services are pinned, HA is provided for functions.

    gateway:

        volumes:

            - "/var/run/docker.sock:/var/run/docker.sock"

        ports:

            - 8080:8080

        image: functions/gateway:0.6.1

        networks:

            - functions

        environment:

            dnsrr: "true"  # Temporarily use dnsrr in place of VIP while issue persists on PWD

        deploy:

            placement:

                constraints: [node.role == manager]
```

```
root@ubuntu-176:/tmp/faas# docker stack ps func

ID                  NAME                  IMAGE                                   NODE                DESIRED STATE       CURRENT STATE                    ERROR               PORTS

ehg6btnb78g3        func_nodeinfo.1       functions/nodeinfo:latest               ubuntu-177          Running             Preparing 2 minutes ago

od9h1nhdyejc        func_alertmanager.1   functions/alertmanager:latest           Ubuntu-11           Running             Preparing 2 minutes ago

cn43a00rhp9l        func_hubstats.1       alexellis2/faas-dockerhubstats:latest   Ubuntu-15           Running             Running about a minute ago

u59bj7p586m4        func_prometheus.1     functions/prometheus:latest             Ubuntu-11           Running             Preparing 2 minutes ago

yt9gmyhccrcu        func_echoit.1         functions/alpine:health                 ubuntu-178          Running             Running about a minute ago

vy5wsgr50z61        func_gateway.1        functions/gateway:0.6.1                 Ubuntu-11           Running             Preparing 2 minutes ago

y42uhzjsikoo        func_decodebase64.1   functions/alpine:health                 ubuntu-77.14        Running             Running less than a second ago

xen7wn6timqz        func_base64.1         functions/alpine:health                 Ubuntu-11           Running             Preparing 2 minutes ago

kcz0sym9jqu6        func_webhookstash.1   functions/webhookstash:latest           ubuntu-179          Running             Running 24 seconds ago

3udkdbip8c4p        func_wordcount.1      functions/alpine:health                 Ubuntu-15           Running             Running 2 minutes ago

st0c4ibfze83        func_markdown.1       alexellis2/faas-markdownrender:latest   Ubuntu-11           Running             Running about a minute ago



root@ubuntu-176:/tmp/faas# docker stack services func

ID                  NAME                MODE                REPLICAS            IMAGE                                   PORTS

3wniopfhdykt        func_echoit         replicated          1/1                 functions/alpine:health

6he8cqjmb0jm        func_decodebase64   replicated          1/1                 functions/alpine:health

d6f9xlqdbwe8        func_webhookstash   replicated          1/1                 functions/webhookstash:latest

en5at93ev76k        func_gateway        replicated          1/1                 functions/gateway:0.6.1                 *:8080->8080/tcp

nsfmi41aphbj        func_base64         replicated          1/1                 functions/alpine:health

qngwiey9b8ek        func_nodeinfo       replicated          1/1                 functions/nodeinfo:latest

s6i49lq9epas        func_prometheus     replicated          0/1                 functions/prometheus:latest             *:9090->9090/tcp

skkmxt2bx4je        func_wordcount      replicated          1/1                 functions/alpine:health

ty5rbwoozz6e        func_hubstats       replicated          1/1                 alexellis2/faas-dockerhubstats:latest

xne9dph1xcit        func_alertmanager   replicated          0/1                 functions/alertmanager:latest           *:9093->9093/tcp

xvwb9uuvqemo        func_markdown       replicated          1/1                 alexellis2/faas-markdownrender:latest
```

# 服务网关

可以参考笔者的[清新脱俗的 Web 服务器 Caddy](https://zhuanlan.zhihu.com/p/25850060) 一文。

# DevOps

DevOps 包含了 CI 应用服务部署与更新与 Monitor & Alert 监控与告警两部分

构建与部署剥离

使用 ELK 进行日志处理，使用 Prometheus 进行线上应用实时监控
