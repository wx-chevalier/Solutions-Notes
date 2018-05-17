# 简单 HTTP 服务器

# 再谈 NPM

随着 JavaScript 项目的成长，如果你不小心处理的话，他们往往会变得难以管理。我们发现自己常常陷入的一些问题： 当在创建新的页面时发现，很难重用或测试之前写的代码。当我们更深处地研究这些问题，我们发现根本原因是无效的依赖管理造成的。比如，脚本 A 依赖脚本 B，并且脚本 B 又依赖脚本 C，当 C 没有被正确引入时，整个依赖链就无法正常工作了。经过对 AMD 的进一步探索，我们已经基本确定，组织严密的 JavaScript 一般都呈现以下五个特点：

* 始终声明我们的依赖
* 为第三方代码库添加 shim(垫片)
* 定义跟调用应该分离
* 依赖应该异步加载
* 模块不应依赖全局变量

用 npm link 替代 npm install。npm link [package-name]命令的原理是，去 [prefix]/lib/node_modules/下检索是否已经全局安装了当前的 package，如果是，则直接用软链接的方法在本地路径指向全局 package。如果没检索到，则会先在全局路径下安装该 package，再去建立软链接。npm 获取全局路径的命令是：npm config get prefix。需要注意的是，有 package.json 的路径下，不要类比 npm install，就这么执行 npm link。此时 npm link 会把当前路径作为一个本地 package，在全局路径下创建一个软链接。由此可知，npm link 并不会像 npm install 一样，读取 package.json 中的依赖并自动配置。

# createServer

```
const http = require("http");
const url = require("url");
const path = require("path");
const fs = require("fs");
const port = process.argv[2] || 8033;

const server = http.createServer(function (request, response) {

    const uri = url.parse(request.url).pathname;
    let filename = path.join(process.cwd(), uri);

    fs.exists(filename, function (exists) {
        if (!exists) {
            response.writeHead(404, {"Content-Type": "text/plain"});
            console.log('node.js: 404 Not Found');
            response.write("404 Not Found\n");
            response.end();
            return;
        }

        if (fs.statSync(filename).isDirectory()) filename += '/index.html';

        fs.readFile(filename, "binary", function (err, file) {
            if (err) {
                response.writeHead(500, {"Content-Type": "text/plain"});
                response.write(err + "\n");
                response.end();
                return;
            }

            response.writeHead(200);
            response.write(file, "binary");
            response.end();
        });
    });
}).listen(parseInt(port, 10));

console.log("Static file server running at\n  => http://localhost:" + port + "/");
```

# 在 Chrome 中调试 NodeJS 应用

NodeJS 在 6.3.0 版本之后允许使用 Chrome 来调试 NodeJS 应用，从而方便了开发者进行断点调试与单步运行，以及对堆栈信息进行查看。安装好 node 之后我们可以使用`--inspect`选项来运行应用：

```
node --inspect index.js
```

我们也可以选择直接从第一行代码开始进行断点调试：

```
node --inspect --debug-brk index.js
```

运行上述命令之后，控制台中会返回该应用对应的 Chrome 开发工具链接，譬如：

```
chrome-devtools://devtools/bundled/inspector.html?experiments=true&v8only=true&ws=127.0.0.1:9229/69beb5d3-2b1c-4513-aa4b-78d1eb1865ea
```

在 Chrome 中直接打开该链接，即可开始调试： ![](https://coding.net/u/hoteam/p/Cache/git/raw/master/2017/1/3/QQ20170125-0123.png)

# 基于 WebSocket 的实时通信

# HTTP/2

In HTTP/1 the client sends a request to the server, which replies with the requested content, usually with an HTML file that contains links to many assets (.js, .css, etc. files). As the browser processes this initial HTML file, it starts to resolve these links and makes separate requests to fetch them. The problem with the current approach is that the user has to wait while the browser parses responses, discovers links and fetches assets. This delays rendering and increases load times. There are workarounds like inlining some assets, but it also makes the initial response bigger and slower.

![](https://blog-assets.risingstack.com/2017/08/http_1-in-nodejs.png)

This is where HTTP/2 Server Push capabilities come into the picture as the server can send assets to the browser before it has even asked for them.

![](https://blog-assets.risingstack.com/2017/08/http2-in-nodejs.png)

```
const http2 = require('http2')

const server = http2.createSecureServer(

  { cert, key },

  onRequest

)

function push (stream, filePath) {

  const { file, headers } = getFile(filePath)

  const pushHeaders = { [HTTP2_HEADER_PATH]: filePath }

  stream.pushStream(pushHeaders, (pushStream) => {

    pushStream.respondWithFD(file, headers)

  })

}

function onRequest (req, res) {

  // Push files with index.html

  if (reqPath === '/index.html') {

    push(res.stream, 'bundle1.js')

    push(res.stream, 'bundle2.js')

  }

  // Serve file

  res.stream.respondWithFD(file.fileDescriptor, file.headers)

}
```

```
<html>

<body>

  <h1>HTTP2 Push!</h1>

</body>

  <script src="bundle1.js"/></script>

  <script src="bundle2.js"/></script>

</html>
```

[http2-push-example](https://github.com/RisingStack/http2-push-example)
