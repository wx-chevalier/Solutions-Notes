[![返回目录](https://parg.co/Udx)](https://parg.co/UdT)

# 缓存

# Cache

- **Client Caching:** Also referred to as "browser caching", the client, browser, app, other service, etc. downloading the data can keep track of what was downloaded when, if that data had any expire time, ETags for the last request to allow for conditional request if data has changed, etc.
- **Network Caching:** Tools like [Varnish](https://www.varnish-cache.org/) or [Squid](http://www.squid-cache.org/) intercept requests that look the same (based on various configurable criteria), returning a response early straight out of memory, instead of hitting the application server. This allows allows the application server to spend more time handling other traffic.
- **Application Caching:** Software like Memcache, Redis, etc. can be implemented in your application, to cache various things like datastore queries, which should make responses quicker to generate.

# 缓存设计

## 查询

![](http://mmbiz.qpic.cn/mmbiz/sXiaukvjR0RAfYKRMKDBqZYPpwLjSbUkcRXUxLTHpK4CBc2RPnlusmOeNMCHHgJKBPhnESdujkNcRFoWkJSibY2A/640?wx_fmt=png&wxfrom=5&wx_lazy=1)

## 更新 / 删除

![](http://mmbiz.qpic.cn/mmbiz/sXiaukvjR0RAfYKRMKDBqZYPpwLjSbUkcia4GzH8UH09octde8VpkS5nrcJ4FOYguAL5HRaYSbodbDSoK1qnbpgw/640?wx_fmt=png&wxfrom=5&wx_lazy=1)

![](http://mmbiz.qpic.cn/mmbiz/sXiaukvjR0RAfYKRMKDBqZYPpwLjSbUkcOchXO2vU7bMgWM8zG6qrzMVI5ZtxjSj099xIIoG4NcocMUAKq3DIKg/640?wx_fmt=png&wxfrom=5&wx_lazy=1)

### DB 和缓存一致性

答：当修改了数据库后，有没有及时修改缓存。这种问题，以前有过实践，修改数据库成功，而修改缓存失败的情况，最主要就是缓存服务器挂了。而因为网络问题引起的没有及时更新，可以通过重试机制来解决。而缓存服务器挂了，请求首先自然也就无法到达，从而直接访问到数据库。那么我们在修改数据库后，无法修改缓存，这时候可以将这条数据放到数据库中，同时启动一个异步任务定时去检测缓存服务器是否连接成功，一旦连接成功则从数据库中按顺序取出修改数据，依次进行缓存最新值的修改。

# 缓存问题

## 缓存穿透

我们在项目中使用缓存通常都是先检查缓存中是否存在，如果存在直接返回缓存内容，如果不存在就直接查询数据库然后再缓存查询结果返回。这个时候如果我们查 询的某一个数据在缓存中一直不存在，就会造成每一次请求都查询 DB，这样缓存就失去了意义，在流量大时，可能 DB 就挂掉了。要是有人利用不存在的 key 频繁攻击我们的应用，这就是漏洞。

有一个比较巧妙的作法是，可以将这个不存在的 key 预先设定一个值。

比如，"key" , “&&” 。

在返回这个 && 值的时候，我们的应用就可以认为这是不存在的 key，那我们的应用就可以决定是否继续等待继续访问，还是放弃掉这次操作。如果继续等待访问，过一个时间轮询点后，再次请求这个 key，如果取到的值不再是 &&，则可以认为这时候 key 有值了，从而避免了透传到数据库，从而把大量的类似请求挡在了缓存之中。

## 缓存并发

有时候如果网站并发访问高，一个缓存如果失效，可能出现多个进程同时查询 DB，同时设置缓存的情况，如果并发确实很大，这也可能造成 DB 压力过大，还有缓存频繁更新的问题。

我现在的想法是对缓存查询加锁，如果 KEY 不存在，就加锁，然后查 DB 入缓存，然后解锁；其他进程如果发现有锁就等待，然后等解锁后返回数据或者进入 DB 查询。

这种情况和刚才说的预先设定值问题有些类似，只不过利用锁的方式，会造成部分请求等待。

## 缓存失效

引起这个问题的主要原因还是高并发的时候，平时我们设定一个缓存的过期时间时，可能有一些会设置 1 分钟啊，5 分钟这些，并发很高时可能会出在某一个时间同时生成了很多的缓存，并且过期时间都一样，这个时候就可能引发一当过期时间到后，这些缓存同时失效，请求全部转发到 DB，DB 可能会压力过重。

那如何解决这些问题呢？

其中的一个简单方案就时讲缓存失效时间分散开，比如我们可以在原有的失效时间基础上增加一个随机值，比如 1-5 分钟随机，这样每一个缓存的过期时间的重复率就会降低，就很难引发集体失效的事件。

# 链接

- https://mp.weixin.qq.com/s/jdOVzGTyi_6mgK7Gkr4yMA