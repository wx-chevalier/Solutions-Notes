# README

常用的直播协议包括了 HLS, RTMP 与 HTTP-FLV 这三种，其对比如下：

| 协议     | 优势                   | 缺陷                | 延迟性   |
| -------- | ---------------------- | ------------------- | -------- |
| HLS      | 支持性广               | 延时巨高            | 10s 以上 |
| RTMP     | 延时性好，灵活         | 量大的话，负载较高  | 1s 以上  |
| HTTP-FLV | 延时性好，游戏直播常用 | 只能在手机 APP 播放 | 2s 以上  |

# HTTP-FLV

RTMP 是直接将流的传输架在 RTMP 协议之上，而 HTTP-FLV 是在 RTMP 和客户端之间套了一层转码的过程，即：

![image](https://user-images.githubusercontent.com/5803001/47570314-735b7580-d968-11e8-9b7e-7c42d830afc9.png)

每个 FLV 文件是通过 HTTP 的方式获取的，所以，它通过抓包得出的协议头需要使用 chunked 编码：

```
Content-Type:video/x-flv
Expires:Fri, 10 Feb 2017 05:24:03 GMT
Pragma:no-cache
Transfer-Encoding:chunked
```
