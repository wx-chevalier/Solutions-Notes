[![返回目录](https://parg.co/Udx)](https://parg.co/UdT)

# WebSocket

HTTP 协议经过多年的使用，发现了一些不足，主要是性能方面的，包括：

* HTTP 的连接问题，HTTP 客户端和服务器之间的交互是采用请求 / 应答模式，在客户端请求时，会建立一个 HTTP 连接，然后发送请求消息，服务端给出应答消息，然后连接就关闭了。（后来的 HTTP1.1 支持持久连接）
* 因为 TCP 连接的建立过程是有开销的，如果使用了 SSL/TLS 开销就更大。
* 在浏览器里，一个网页包含许多资源，包括 HTML，CSS ， JavaScript，图片等等，这样在加载一个网页时要同时打开连接到同一服务器的多个连接。
* HTTP 消息头问题，现在的客户端会发送大量的 HTTP 消息头，由于一个网页可能需要 50-100 个请求，就会有相当大的消息头的数据量。
* HTTP 通信方式问题，HTTP 的请求 / 应答方式的会话都是客户端发起的，缺乏服务器通知客户端的机制，在需要通知的场景，如聊天室，游戏，客户端应用需要不断地轮询服务器。

而 SPDY 和 WebSocket 是从不同的角度来解决这些不足中的一部分。除了这两个技术，还有其他技术也在针对这些不足提出改进。 WebSocket 则提供使用一个 TCP 连接进行双向通讯的机制，包括网络协议和 API，以取代网页和服务器采用 HTTP 轮询进行双向通讯的机制。

本质上来说，WebSocket 是不限于 HTTP 协议的，但是由于现存大量的 HTTP 基础设施，代理，过滤，身份认证等等，WebSocket 借用 HTTP 和 HTTPS 的端口。

由于使用 HTTP 的端口，因此 TCP 连接建立后的握手消息是基于 HTTP 的，由服务器判断这是一个 HTTP 协议，还是 WebSocket 协议。 WebSocket 连接除了建立和关闭时的握手，数据传输和 HTTP 没丁点关系了。

WebSocket 也有自己一套帧协议。

**1) Why is the WebSockets protocol better?**

WebSockets is better for situations that involve low-latency communication especially for low latency for client to server messages. For server to client data you can get fairly low latency using long-held connections and chunked transfer. However, this doesn't help with client to server latency which requires a new connection to be established for each client to server message.

Your 48 byte HTTP handshake is not realistic for real-world HTTP browser connections where there is often several kilobytes of data sent as part of the request (in both directions) including many headers and cookie data. Here is an example of a request/response to using Chrome:

_Example request (2800 bytes including cookie data, 490 bytes without cookie data):_

```
GET / HTTP/1.1
Host: www.cnn.com
Connection: keep-alive
Cache-Control: no-cache
Pragma: no-cache
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
User-Agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.17 (KHTML, like Gecko) Chrome/24.0.1312.68 Safari/537.17
Accept-Encoding: gzip,deflate,sdch
Accept-Language: en-US,en;q=0.8
Accept-Charset: ISO-8859-1,utf-8;q=0.7,*;q=0.3
Cookie: [[[2428 byte of cookie data]]]
```

_Example response (355 bytes):_

```
HTTP/1.1 200 OK
Server: nginx
Date: Wed, 13 Feb 2013 18:56:27 GMT
Content-Type: text/html
Transfer-Encoding: chunked
Connection: keep-alive
Set-Cookie: CG=US:TX:Arlington; path=/
Last-Modified: Wed, 13 Feb 2013 18:55:22 GMT
Vary: Accept-Encoding
Cache-Control: max-age=60, private
Expires: Wed, 13 Feb 2013 18:56:54 GMT
Content-Encoding: gzip
```

Both HTTP and WebSockets have equivalent sized initial connection handshakes, but with a WebSocket connection the initial handshake is performed once and then small messages only have 6 bytes of overhead (2 for the header and 4 for the mask value). The latency overhead is not so much from the size of the headers, but from the logic to parse/handle/store those headers. In addition, the TCP connection setup latency is probably a bigger factor than the size or processing time for each request.

**2) Why was it implemented instead of updating HTTP protocol?**

There are efforts to re-engineer the HTTP protocol to achieve better performance and lower latency such as [SPDY](http://en.wikipedia.org/wiki/SPDY), [HTTP 2.0](http://en.wikipedia.org/wiki/HTTP_2.0) and [QUIC](https://en.wikipedia.org/wiki/QUIC). This will improve the situation for normal HTTP requests, but it is likely that WebSockets and/or WebRTC DataChannel will still have lower latency for client to server data transfer than HTTP protocol (or it will be used in a mode that looks a lot like WebSockets anyways).

**Update**:

Here is a framework for thinking about web protocols:

* **TCP**: low-level, bi-directional, full-duplex, and guaranteed order transport layer. No browser support (except via plugin/Flash).
* **HTTP 1.0**: request-response transport protocol layered on TCP. The client makes one full request, the server gives one full response, and then the connection is closed. The request methods (GET, POST, HEAD) have specific transactional meaning for resources on the server.
* **HTTP 1.1**: maintains the request-response nature of HTTP 1.0, but allows the connection to stay open for multiple full requests/full responses (one response per request). Still has full headers in the request and response but the connection is re-used and not closed. HTTP 1.1 also added some additional request methods (OPTIONS, PUT, DELETE, TRACE, CONNECT) which also have specific transactional meanings. However, as noted in the [introduction](http://tools.ietf.org/html/draft-ietf-httpbis-http2-01#section-1) to the HTTP 2.0 draft proposal, HTTP 1.1 pipelining is not widely deployed so this greatly limits the utility of HTTP 1.1 to solve latency between browsers and servers.
* **Long-poll**: sort of a "hack" to HTTP (either 1.0 or 1.1) where the server does not response immediately (or only responds partially with headers) to the client request. After a server response, the client immediately sends a new request (using the same connection if over HTTP 1.1).
* **HTTP streaming**: a variety of techniques (multipart/chunked response) that allow the server to send more than one response to a single client request. The W3C is standardizing this as [Server-Sent Events](http://en.wikipedia.org/wiki/Server-sent_events) using a `text/event-stream` MIME type. The browser API (which is fairly similar to the WebSocket API) is called the EventSource API.
* **Comet/server push**: this is an umbrella term that includes both long-poll and HTTP streaming. Comet libraries usually support multiple techniques to try and maximize cross-browser and cross-server support.
* **WebSockets**: a transport layer built-on TCP that uses an HTTP friendly Upgrade handshake. Unlike TCP, which is a streaming transport, WebSockets is a message based transport: messages are delimited on the wire and are re-assembled in-full before delivery to the application. WebSocket connections are bi-directional, full-duplex and long-lived. After the initial handshake request/response, there is no transactional semantics and there is very little per message overhead. The client and server may send messages at any time and must handle message receipt asynchronously.
* **SPDY**: a Google initiated proposal to extend HTTP using a more efficient wire protocol but maintaining all HTTP semantics (request/response, cookies, encoding). SPDY introduces a new framing format (with length-prefixed frames) and specifies a way to layering HTTP request/response pairs onto the new framing layer. Headers can be compressed and new headers can be sent after the connection has been established. There are real world implementations of SPDY in browsers and servers.
* **HTTP 2.0**: has similar goals to SPDY: reduce HTTP latency and overhead while preserving HTTP semantics. The current draft is derived from SPDY and defines an upgrade handshake and data framing that is very similar the the WebSocket standard for handshake and framing. An alternate HTTP 2.0 draft proposal (httpbis-speed-mobility) actually uses WebSockets for the transport layer and adds the SPDY multiplexing and HTTP mapping as an WebSocket extension (WebSocket extensions are negotiated during the handshake).
* **WebRTC/CU-WebRTC**: proposals to allow peer-to-peer connectivity between browsers. This may enable lower average and maximum latency communication because as the underlying transport is SDP/datagram rather than TCP. This allows out-of-order delivery of packets/messages which avoids the TCP issue of latency spikes caused by dropped packets which delay delivery of all subsequent packets (to guarantee in-order delivery).
* **QUIC**: is an experimental protocol aimed at reducing web latency over that of TCP. On the surface, QUIC is very similar to TCP+TLS+SPDY implemented on UDP. QUIC provides multiplexing and flow control equivalent to HTTP/2, security equivalent to TLS, and connection semantics, reliability, and congestion control equivalentto TCP. Because TCP is implemented in operating system kernels, and middlebox firmware, making significant changes to TCP is next to impossible. However, since QUIC is built on top of UDP, it suffers from no such limitations. QUIC is designed and optimised for HTTP/2 semantics.

**References**:
