# WebRTC 实战

WebRTC API 旨在允许 JavaScript 应用程序创建包含音频和视频流以及用于任意数据的数据通道的实时连接。创建这些连接以直接链接两个用户的浏览器，而不必要求任何支持 WebRTC 协议的中间服务器。WebRTC 还提供了 getUserMedia() 方法来访问麦克风和相机数据。

## WebRTC vs WebSockets

There is one significant difference: Websockets works via TCP, WebRTC works via UDP. In fact, WebRTC is SRTP protocol with some addutional features like STUN, ICE, DTLS etc and internal VoIP features such as Adaptive Jitter Buffer, AEC, AGC etc.

So, Websocket is designed for reliable communication. It is good choise if you want to send any data that must be sent reliably.

When you use WebRTC, the transmitted stream is unreliable. Some packets can be lost in the network. It is bad if you send critical data, for example for financial processing, the same issuee is ideally suitable when you send audio or video stream where some frames can be lost without any noticeable quality issues.

If you want to send data channel via WebRTC, you should have some forward error correction algorithm to restore data if a data frame was lost in the network.

# TBD

- https://mp.weixin.qq.com/s/BcvsFP8N-IZ9bxgX_FAECw
