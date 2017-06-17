/**
 * Created by apple on 16/10/9.
 */

import UserController from "./controller/UserController";
import { serveStatic } from "./controller/StaticController";
import { wrappingKoaRouter } from "swagger-decorator";
const Router = require("koa-router");

const router = new Router();

wrappingKoaRouter(router, "localhost:8080", "/api", {
  title: "Node Server Boilerplate",
  info: "0.0.1",
  description: "Koa2, koa-router,Webpack"
});

//定义默认的根路由
router.get("/", async function(ctx, next) {
  ctx.body = { msg: "Node Server Boilerplate" };
});

//定义用户处理路由
router.scan(UserController);

//定义全局静态文件支持路由
router.get("/static/*", serveStatic("./static"));

//默认导出路由配置
export default router;
