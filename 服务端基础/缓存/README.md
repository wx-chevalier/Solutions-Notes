[![返回目录](https://i.postimg.cc/WzXsh0MX/image.png)](https://parg.co/UdT)

# 缓存

缓存是软件系统中常见的组成部分，我们往往会从系统层、应用层、网络层、用户层等不同的维度去提高缓存机制与策略：

![](https://i.postimg.cc/Tw8DdwYZ/image.png)

客户端缓存也被称为“浏览器缓存”，下载数据的客户端，浏览器，应用程序，其他服务等可以跟踪下载的内容，如果该数据有任何过期时间，则 ETag 为最后一个请求允许条件、请求数据是否已更改等。网络层缓存中，类似于 [Varnish](https://www.varnish-cache.org/) 或 [Squid](http://www.squid-cache.org/) 拦截看起来相同的请求（基于各种可配置标准），尽早直接从内存中返回响应，而不是点击应用程序服务器。 这允许应用服务器花费更多时间处理其他流量。应用层缓存则是 Memcache，Redis 等软件可以在您的应用程序中实现，以缓存数据存储查询等各种内容，这样可以更快地生成响应。

# 链接

- https://mp.weixin.qq.com/s/jdOVzGTyi_6mgK7Gkr4yMA
