# LVS

LVS有如下的组成部分：

- Direct Server（以下简称DS）：前端暴露给客户端进行负载均衡的服务器。

- Virtual Ip地址（以下简称VIP）：DS暴露出去的IP地址，做为客户端请求的地址。

- Direct Ip地址（以下简称DIP）：DS用于与Real Server交互的IP地址。

- Real Server（以下简称RS）：后端真正进行工作的服务器，可以横向扩展。

- Real IP地址（以下简称RIP）：RS的地址。

- Client IP地址（以下简称CIP）：Client的地址。

![](https://tva3.sinaimg.cn/large/007DFXDhgy1g5us7zazn4j30ly0f03zb.jpg)

客户端进行请求时，流程如下：

- 使用VIP地址访问DS，此时的地址二元组为<src:CIP,dst:VIP>。

- DS根据自己的负载均衡算法，选择一个RS将请求转发过去，在转发过去的时候，修改请求的源IP地址为DIP地址，让RS看上去认为是DS在访问它，此时的地址二元组为<src:DIP,dst:RIP A>。

- RS处理并且应答该请求，这个回报的源地址为RS的RIP地址，目的地址为DIP地址，此时的地址二元组为<src:RIP A,dst:DIP>。

- DS在收到该应答包之后，将报文应答客户端，此时修改应答报文的源地址为VIP地址，目的地址为CIP地址，此时的地址二元组为<src:VIP,dst:CIP>。