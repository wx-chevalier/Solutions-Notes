// @flow
const pathToRegexp = require("path-to-regexp");

export const innerAPIObject = {};

export const innerEntityObject = {};

// 标志是否编译完毕
let hasBuilt = false;

/**
 * Description 构建 Swagger JSON 文件
 */
export function buildSwaggerJSON() {
  if (hasBuilt) {
    return;
  }

  // 初始化请求路径
  swaggerJSON["paths"] = {};

  // 遍历所有的内部对象
  for (let key of Object.keys(innerAPIObject)) {
    let value = innerAPIObject[key];

    // 将 :parameter 替换为 {parameter}
    let requestPath = _convertParameterInPath(value.requestMapping.path);

    swaggerJSON["paths"][requestPath] = {};

    swaggerJSON["paths"][requestPath][value.requestMapping.method] = {};

    let apiDoc = swaggerJSON["paths"][requestPath][value.requestMapping.method];

    // 构建基本描述
    apiDoc.description = value.description.description;

    apiDoc.produces = value.description.produces;

    apiDoc.parameters = [];

    // 构建路径参数
    if (value.pathParameter) {
      for (let param of value.pathParameter) {
        apiDoc.parameters.push({
          ...param,
          collectionFormat: "csv"
        });
      }
    }

    // 构建查询参数
    if (value.queryParameter) {
      for (let param of value.queryParameter) {
        apiDoc.parameters.push({
          ...param,
          items: {
            type: param.items && param.items.length > 0
              ? param.items[0]
              : undefined
          },
          collectionFormat: "csv"
        });
      }
    }

    // 构建请求体参数
    if (value.bodyParameter) {
      for (let param of value.bodyParameter) {
        apiDoc.parameters.push({
          ...param,
          schema: _convertSchema(param.schema)
        });
      }
    }

    apiDoc.responses = {};

    // 构建返回值
    if (value.responses) {
      for (let resp of value.responses) {
        apiDoc.responses[resp.statusCode] = {
          description: resp.description,
          schema: _convertSchema(resp.schema)
        };
      }
    }
  }

  hasBuilt = true;
}

export function _convertSchema(schema: any) {
  let convertedSchema;

  if (Array.isArray(schema) && schema.length > 0) {
    convertedSchema = {
      type: "array",
      items: {
        $ref: `#/definitions/${schema[0].name}`
      }
    };
  }

  if (typeof schema === "function") {
    convertedSchema = {
      $ref: `#/definitions/${schema.name}`
    };
  }

  return convertedSchema;
}

/**
 * Description
 * @param path
 * @private
 */
export function _convertParameterInPath(path: String) {
  let segments = [];

  const re = pathToRegexp(path, segments);

  if (segments.length === 0) {
    return path;
  } else {
    let convertedPath = path;

    for (let segment of segments) {
      convertedPath = convertedPath.replace(
        new RegExp(`${segment.prefix}:${segment.name}`, "g"),
        `${segment.prefix}{${segment.name}}`
      );
    }

    return convertedPath;
  }
}

// 初始化 SwaggerJSON 配置
export const swaggerJSON = JSON.parse(
  `
    {
      "swagger": "2.0",
      "info": {
        "version": "1.0.0",
        "title": "Swagger Petstore",
        "description": "A sample API that uses a petstore as an example to demonstrate features in the swagger-2.0 specification",
        "termsOfService": "http://swagger.io/terms/",
        "contact": {
          "name": "Swagger API Team"
        },
        "license": {
          "name": "MIT"
        }
      },
      "host": "petstore.swagger.io",
      "basePath": "/api",
      "schemes": [
        "http"
      ],
      "consumes": [
        "application/json"
      ],
      "produces": [
        "application/json"
      ]
    }
    `
);
