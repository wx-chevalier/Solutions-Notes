# 点击劫持

点击劫持(ClickJacking)是一种视觉上的欺骗手段。大概有两种方式，一是攻击者使用一个透明的 iframe，覆盖在一个网页上，然后诱使用户在该页面上进行操作，此时用户将在不知情的情况下点击透明的 iframe 页面；二是攻击者使用一张图片覆盖在网页，遮挡网页原有位置的含义。

对网站设置 X-Frame-Options 的 http 头可以阻止一个网站被加载到标签。具体为设置值为：

- DENY 时，禁止在任何的网页中加载此页面
- SAMEORIGIN 时，只允许在同一域名页面的 中展示
- ALLOW-FROM uri 时，允许制定 Uri 的页面的中展示

# 链接

- https://kebingzao.com/2018/05/05/web-forbidden-iframe-embed/
