// @flow

const Koa = require("koa");
import router from "./router";

const app = new Koa();

// 设置路由配置信息
app.use(router.routes()).use(router.allowedMethods());

// 启动 Web 服务器
app.listen(3001);
