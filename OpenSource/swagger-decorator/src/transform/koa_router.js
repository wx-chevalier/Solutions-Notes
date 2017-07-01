// @flow
const path = require("path");
const debug = require("debug")("koa_router");

import { buildSwaggerJSON } from "../swagger/paths";
import { swaggerJSON } from "../swagger/template/swagger.json";
import { swaggerHTML } from "../swagger/template/swagger.html";

const methods = [
  "get",
  "post",
  "put",
  "delete",
  "head",
  "options",
  "del",
  "all"
];

/**
 * Description 将 router 对象的方法进行封装
 * @param router 路由对象
 * @param host API 域名
 * @param basePath API 基本路径
 * @param info 其他的 Swagger 基本信息
 */
export function wrappingKoaRouter(
  router: Object,
  host: string = "localhost",
  basePath: string = "",
  info: Object = {}
) {
  // 修复 SwaggerObject
  if (!!info) {
    for (let key of Object.keys(info)) {
      swaggerJSON["info"][key] = info[key];
    }
  }

  swaggerJSON.host = host;

  swaggerJSON.basePath = basePath;

  // 设置静态请求
  router.get("/swagger", (ctx, next) => {
    ctx.body = swaggerHTML("/swagger/api.json");
  });

  // 设置 api.json 的请求
  router.get("/swagger/api.json", function(ctx, next) {
    buildSwaggerJSON();
    ctx.body = swaggerJSON;
  });

  /**
   * Description 扫描某个类中的所有静态方法，按照其注解将其添加到
   * @param staticClass
   */
  router.scan = function(staticClass: Function) {
    let methods = Object.getOwnPropertyNames(staticClass);

    // 移除前三个属性 constructor、name
    methods.shift();
    methods.shift();
    methods.shift();

    // 遍历该类中的所有方法
    for (let method of methods) {
      // 添加权限校验
      router.use(
        basePath + staticClass[method].path,
        validate(staticClass[method])
      );

      // 使用该类中的所有方法
      router.all(staticClass[method]);
    }
  };

  // Hook router 中的方法
  methods.forEach((method: string) => {
    const originMethod = router[method];

    router[method] = function(pathOrFunction: string, func: Function) {
      // 如果 pathOrFunction 为字符串，则表示为正常调用
      if (pathOrFunction && typeof pathOrFunction === "string") {
        originMethod.call(router, pathOrFunction, func);
      } else {
        // 这里对于路径函数进行判断
        if (!pathOrFunction.method || !pathOrFunction.path) {
          return;
        }

        // 这里执行对于路由对象的注册
        router[pathOrFunction.method].call(
          router,
          // 注意，这里仅自定义注解才添加前缀
          basePath + pathOrFunction.path,
          pathOrFunction
        );
      }
    };
  });
}

/**
 * Description 从请求路径、请求体中剥离出参数并且进行校验
 * - params 路径参数 ctx.params
 * - query 查询参数 ctx.query
 * - body ctx.request.body 使用 koa-body 中间件（https://github.com/dlau/koa-body）
 * @param decoratedFunction 传入的经过注解的函数
 */
function validate(decoratedFunction: Function): Function {
  return async (ctx, next) => {
    debug(ctx.query);
    debug(ctx.params);
    debug(ctx.request.body);

    // 进行路径参数校验

    await next();
  };
}
