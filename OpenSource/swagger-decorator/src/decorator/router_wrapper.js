// @flow
const path = require("path");

import {buildSwaggerJSON, innerAPIObject, swaggerJSON} from "../swagger/swagger";
import { swaggerHTML } from "../swagger/swagger.html";

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

    for (let method of methods) {
      router.all(staticClass[method]);
    }
  };

  methods.forEach((method: string) => {
    const originMethod = router[method];

    router[method] = function(pathOrFunction: string, func: Function) {
      if (pathOrFunction && typeof pathOrFunction === "string") {
        originMethod.call(router, pathOrFunction, func);
      } else {
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
