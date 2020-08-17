# RTMP

RTMP，Real-Time Messaging Protocol 是由 Adobe 推出的音视频流传递协议；它通过一种自定义的协议，来完成对指定直播流的播放和相关的操作。在 Web 上可以通过 MSE（MediaSource Extensions）来接入 RTMP，基本思路是根据 WebSocket 直接建立长连接进行数据的交流和监听。RTMP 协议根据不同的套层，也可以分为：

- 纯 RTMP: 直接通过 TCP 连接，端口为 1935

- RTMPS: RTMP + TLS/SSL，用于安全性的交流。

- RTMPE: RTMP + encryption。在 RTMP 原始协议上使用，Adobe 自身的加密方法

- RTMPT: RTMP + HTTP。使用 HTTP 的方式来包裹 RTMP 流，这样能直接通过防火墙。不过，延迟性比较大。

- RTMFP: RMPT + UDP。该协议常常用于 P2P 的场景中，针对延时有变态的要求。

# 协议

RTMP 内部是借由 TCP 长连接协议传输相关数据，所以，它的延时性非常低。并且，该协议灵活性非常好（所以，也很复杂），它可以根据 message stream ID 传输数据，也可以根据 chunk stream ID 传递数据。两者都可以起到流的划分作用。流的内容也主要分为：视频，音频，相关协议包等。

![RTMP 协议示范](https://user-images.githubusercontent.com/5803001/47570269-56bf3d80-d968-11e8-8e9c-4fc8a5e1a873.png)

# RTMP 代理

关于 RTMP 代理的协议规范。RTMP 是字节协议，第一个包是 c0，1 个字节，一般是 03 表示是明文的 RTMP。所以如果需要做 RTMP 代理，如果直接转发 RTMP 客户端的消息，是没法传递额外的信息的，譬如 HTTP 代理在 Header 中传递的 X-Real-IP，即客户端的 IP，就没法给 RTMP 的后端了。

因此，RTMP 的 Proxy 协议必须使用私有协议，c0 的意义必须改写了，譬如另外一个值表示是代理，后面跟随了一些协议信息，这个协议就是 RTMP Proxy 协议。

使用网络字节序，big-endian。在 C0 前插入代理的包，兼容 RTMP 标准协议。

标准 RTMP 协议如下：

```
C0,     1B, 03表示明文RTMP。后面是C1C2以及其他消息。
```

RTMP 代理协议如下：

```
F3,         1B，常量0xF3，表示RTMP代理协议。
Size,       2B, 表示代理数据的长度，即Size和C0之间的数据。
X-Real-IP,  4B, 表示客户端的真实IP。
C0,         1B，原始客户端的C0，方便代理直接转发客户端的数据。
```

> 备注：一般 Size 应该不超过 C0C1 长度，即`Size<=1537`。

例如，标准 RTMP 客户端的消息：

```
03            // 客户端的C0包，后面是C1C2，以及其他的消息。
```

或者，代理客户端发送的消息：

```
F3            // 表示是RTMP代理
00 04         // 表示Extra有4字节
C0 A8 01 67   // 表示客户端IP，C0.A8.01.67，即192.168.1.103
03            // 客户端原始的C0数据。从这个数据（包括它本身）开始，就是客户端发送的消息了，譬如C1C2。
```

RTMP 协议，譬如握手的 C0、C1、C2、S0、S1、S2，以及数据部分，都没有变更。
