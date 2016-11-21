/**
 * Created by apple on 16/10/9.
 */
var koa = require('koa');
import router from './router';
import auth from './util/auth';
import logger from './util/logger';
import header from './util/header';
var argv = require('minimist')(process.argv.slice(2));
var app = koa();

//注入全局变量
app.context.db = {
  select: function (callback) {
    //模拟三秒时延
    setTimeout(callback({'user_name': 'robocaap'}), 3000);
  }
};

//设置请求与响应的通用头
header(app);

// logger

//设置日志记录工具
logger(app);

//配置认证信息
auth(app);

// 设置路由配置信息
app
  .use(router.routes())
  .use(router.allowedMethods());

// 定义默认的监听地址
// 判断是否有输入监听地址
let domain = argv.domain || '0.0.0.0';

// 判断是否有输入监听端口
let port = argv.port || 8080;

//封装最后的完整的地址
var applicationUrl = 'http://' + domain + ':' + port;

//打印监听端口
console.log(applicationUrl);

// Start the web server
app.listen(port);