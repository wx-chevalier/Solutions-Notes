

# Jetty 内部解析


![](http://www.eclipse.org/jetty/documentation/current/images/Jetty_DeployManager_DeploymentManager_Roles.png)
 


# ThreadPool:线程池的实现

> 
- [jetty线程池的实现](http://blog.csdn.net/pwlazy/article/details/7166395)


最近在项目中使用到了Jetty，想弄清楚Jetty在默认情况下会使用多少个线程来处理请求，看了一下源代码。
Jetty中的org.eclipse.jetty.server.Server类的默认构造函数如下：

    public Server(@Name("port")int port)
    {
        this((ThreadPool)null);
        ServerConnector connector=new ServerConnector(this);
        connector.setPort(port);
        setConnectors(new Connector[]{connector});
    }


可以看出，默认情况下，这个构造函数调用了另一个构造函数：
    public Server(@Name("threadpool") ThreadPool pool)
    {
        _threadPool=pool!=null?pool:new QueuedThreadPool();
        addBean(_threadPool);
        setServer(this);
    }

于是，这个QueuedThreadPool就是我们的线程池了。果断跟踪进去看一下，QueuedThreadPool有以下几个构造函数，可以看出，默认情况下，线程池中最少的线程数为8，而默认最大线程数为200，问题解决。

    public QueuedThreadPool()
    {
        this(200);
    }

    public QueuedThreadPool(@Name("maxThreads") int maxThreads)
    {
        this(maxThreads, 8);
    }

    public QueuedThreadPool(@Name("maxThreads") int maxThreads,  @Name("minThreads") int minThreads)
    {
        this(maxThreads, minThreads, 60000);
    }

    public QueuedThreadPool(@Name("maxThreads") int maxThreads,  @Name("minThreads") int minThreads, @Name("idleTimeout")int idleTimeout)
    {
        this(maxThreads, minThreads, idleTimeout, null);
    }

