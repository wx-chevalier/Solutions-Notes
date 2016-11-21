/**
 * Created by apple on 16/10/9.
 */

import { get_user } from './controller/user_controller';
const router = require('koa-router')();
const serve = require('./controller/static_controller');

//将所有API路径统一放置到api后缀中,方便代理服务器统一替换
const apiPrefix = (path)=>(`/api${path}`);

//定义默认的根路由
router.get('/', function *(next) {
  this.body = {msg: "Node Server Boilerplate"}
});

//定义用户处理路由
router.get(apiPrefix('/user/:id'), get_user);

//定义全局静态文件支持路由
router.get('/static/*', serve('./static'));

//默认导出路由配置
export default router;