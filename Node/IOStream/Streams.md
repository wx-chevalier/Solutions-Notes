# Node.js Streams

> - [Node.js Streams by Example](https://medium.com/@chris_neave/node-js-streams-by-example-9019398a258)

Streams 是 Node.js 的核心概念之一，其允许开发者专注于事件驱动的 IO 处理；目前 Streams 也不仅仅局限于 Node.js 平台，正在逐步登陆到各大主流浏览器中。

Streams are implemented using a standard set of interfaces comprised of functions and events. Many objects provided as part of the Node.js standard library implement the stream interfaces. For example, there are objects in the “fs” package for reading from and writing to files using the stream interfaces. Every HTTP request is a readable stream where responses are writable streams.
