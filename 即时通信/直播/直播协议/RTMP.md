# RTMP

RTMP，Real-Time Messaging Protocol 是由 Adobe 推出的音视频流传递协议；它通过一种自定义的协议，来完成对指定直播流的播放和相关的操作。在 Web 上可以通过 MSE（MediaSource Extensions）来接入 RTMP，基本思路是根据 WebSocket 直接建立长连接进行数据的交流和监听。RTMP 协议根据不同的套层，也可以分为：

- 纯 RTMP: 直接通过 TCP 连接，端口为 1935

- RTMPS: RTMP + TLS/SSL，用于安全性的交流。

- RTMPE: RTMP + encryption。在 RTMP 原始协议上使用，Adobe 自身的加密方法

- RTMPT: RTMP + HTTP。使用 HTTP 的方式来包裹 RTMP 流，这样能直接通过防火墙。不过，延迟性比较大。

- RTMFP: RMPT + UDP。该协议常常用于 P2P 的场景中，针对延时有变态的要求。

RTMP 内部是借由 TCP 长连接协议传输相关数据，所以，它的延时性非常低。并且，该协议灵活性非常好（所以，也很复杂），它可以根据 message stream ID 传输数据，也可以根据 chunk stream ID 传递数据。两者都可以起到流的划分作用。流的内容也主要分为：视频，音频，相关协议包等。

![image](https://user-images.githubusercontent.com/5803001/47570269-56bf3d80-d968-11e8-8e9c-4fc8a5e1a873.png)
