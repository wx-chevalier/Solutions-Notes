[![返回目录](https://parg.co/Udx)](https://parg.co/UdT)

# JWT 机制详解

JWT 是 Auth0 提出的通过对 JSON 进行加密签名来实现授权验证的方案。可以参考 [Backend-Boilerplate](https://github.com/wxyyxc1992/Backend-Boilerplate) 中 JWT 在于 Node.js/Java/Go 等常见服务端应用开发中的应用。

![image](https://user-images.githubusercontent.com/5803001/48563391-33682c80-e92f-11e8-9cb1-a855546837c9.png)

与前文介绍的基于 Session 的机制相比，使用 JWT 可以省去服务端读取 Session 的步骤，因此 JWT 是用来取代服务端的 Session 而非客户端 Cookie 的方案，也更符合 RESTful 的规范。这样但是对于客户端（或 App 端）来说，为了保存用户授权信息，仍然需要通过 Cookie 或 localStorage/sessionStorage 等机制进行本地保存。JWT 也可以被广泛用于微服务场景下各个服务的认证，免去重复中心化认证的繁琐。

## 组成结构

编码之后的 JWT 就是简单的字符串，包含又 `.` 分割的三部分：

![](https://cdn-images-1.medium.com/max/1600/1*0SEbHdFcVpaejejGA-1DDw.png)

```js
// 1. Header, 包括类别（typ）、加密算法（alg）；
{
  "alg": "HS256",
  "typ": "JWT"
}

// 2. Payload, 包括需要传递的用户信息；
{
  "sub": "1234567890",
  "name": "John Doe",
  "admin": true
}

// 3. Signature, 根据 alg 算法与私有秘钥进行加密得到的签名字串；这一段是最重要的敏感信息，只能在服务端解密；
HMACSHA256(
    base64UrlEncode(header) + "." +
    base64UrlEncode(payload),
    SECREATE_KEY
)
```

`eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9`

## 处理流程

在使用过程中，服务端通过用户登录验证之后，将 Header+Claim 信息加密后得到第三段签名，然后将签名返回给客户端，在后续请求中，服务端只需要对用户请求中包含的 JWT 进行解码，即可验证是否可以授权用户获取相应信息，其原理如下图所示：

![](https://cdn-images-1.medium.com/max/1600/1*44waelPu4JvYALzkvoh8zw.png)

以 [node/jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) 为例，我们可以使用字符串密钥，或者加载 cert 文件:

```js
const jwt = require('jsonwebtoken');
const token = jwt.sign({ foo: 'bar' }, 'shhhhh');

// sign with RSA SHA256
const cert = fs.readFileSync('private.key');
const token = jwt.sign({ foo: 'bar' }, cert, { algorithm: 'RS256' });

// 设置过期时间
jwt.sign(
  {
    exp: Math.floor(Date.now() / 1000) + 60 * 60,
    data: 'foobar'
  },
  'secret'
);
```

在进行内容读取时，我们可以直接解码 Payload 部分获取用户信息，也可以对签名内容进行验证：

```js
// 直接获取到 Payload 而忽略签名
var decoded = jwt.decode(token);

// 获取完整的 Payload 与 Header
var decoded = jwt.decode(token, { complete: true });
console.log(decoded.header);
console.log(decoded.payload);

// 同步校验 Token 是否有效
var decoded = jwt.verify(token, 'shhhhh');
console.log(decoded.foo); // bar

// 异步校验是否有效
jwt.verify(token, 'shhhhh', function(err, decoded) {
  console.log(decoded.foo); // bar
});
```

# Todos

- https://mp.weixin.qq.com/s/82kGtrI1QK7gkswtd-QsAQ

- https://mp.weixin.qq.com/s/j-Ap_30PO8bSFUY3Q_RHcg
