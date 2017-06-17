// @flow
import {
  innerAPIObject,
  innerEntityObject,
  swaggerJSON
} from "../swagger/swagger";
import { inferenceType } from "./type";

/**
 * Description 设置请求路径
 * @param method
 * @param path
 * @returns {Function}
 */
export function apiRequestMapping(method: string, path: string) {
  return function(target, key, descriptor) {
    let apiKey = `${target.name}-${key}`;

    // 设置请求方法
    descriptor.value.method = method;
    // 设置请求路径
    descriptor.value.path = path;

    innerAPIObject[apiKey] || (innerAPIObject[apiKey] = {});

    innerAPIObject[apiKey].requestMapping = {
      method,
      path
    };

    return descriptor;
  };
}

/**
 * Description 接口描述
 * @param description
 * @param produces
 * @returns {Function}
 */
export function apiDescription(
  description: string,
  produces: [string] = ["application/json"]
) {
  return function(target, key, descriptor) {
    let apiKey = `${target.name}-${key}`;

    innerAPIObject[apiKey] || (innerAPIObject[apiKey] = {});

    innerAPIObject[apiKey].description = {
      description,
      produces
    };

    return descriptor;
  };
}

/**
 * 路径参数
 * @param name
 * @param description
 * @param type
 * @returns {Function}
 */
export function pathParameter({
  name,
  description,
  type
}: {
  name: string,
  description: string,
  type: string
}) {
  return function(target, key, descriptor) {
    let apiKey = `${target.name}-${key}`;

    innerAPIObject[apiKey] || (innerAPIObject[apiKey] = {});

    innerAPIObject[apiKey].pathParameter ||
      (innerAPIObject[apiKey].pathParameter = []);

    innerAPIObject[apiKey].pathParameter.push({
      name,
      description,
      type,
      in: "path",
      required: true
    });

    return descriptor;
  };
}

/**
 * Description
 * @param name
 * @param description
 * @param required
 * @param type
 * @param items
 * @returns {Function}
 */
export function queryParameter({
  name,
  description,
  required,
  type,
  items
}: {
  name: string,
  description: string,
  required: boolean,
  type: any,
  items: any
}) {
  return function(target, key, descriptor) {
    let apiKey = `${target.name}-${key}`;

    innerAPIObject[apiKey] || (innerAPIObject[apiKey] = {});

    innerAPIObject[apiKey].queryParameter ||
      (innerAPIObject[apiKey].queryParameter = []);

    innerAPIObject[apiKey].queryParameter.push({
      name,
      description,
      required,
      type,
      items,
      in: "query"
    });

    return descriptor;
  };
}

/**
 * Description
 * @param name
 * @param description
 * @param required
 * @param schema
 * @returns {Function}
 */
export function bodyParameter({
  name,
  description,
  required,
  schema
}: {
  name: string,
  description: string,
  required: boolean,
  schema: any
}) {
  return function(target, key, descriptor) {
    let apiKey = `${target.name}-${key}`;

    innerAPIObject[apiKey] || (innerAPIObject[apiKey] = {});

    innerAPIObject[apiKey].bodyParameter ||
      (innerAPIObject[apiKey].bodyParameter = []);

    innerAPIObject[apiKey].bodyParameter.push({
      name,
      description,
      required,
      schema,
      in: "body"
    });

    // 根据传入的 Schema 构建定义
    _buildDefinitions(schema);

    return descriptor;
  };
}

/**
 * Description 设置请求响应
 * @param statusCode
 * @param description
 * @param schema
 * @returns {Function}
 */
export function apiResponse(
  statusCode: number,
  description: string,
  schema: any
) {
  return function(target, key, descriptor) {
    let apiKey = `${target.name}-${key}`;

    innerAPIObject[apiKey] || (innerAPIObject[apiKey] = {});

    innerAPIObject[apiKey].responses || (innerAPIObject[apiKey].responses = []);

    innerAPIObject[apiKey].responses.push({
      statusCode,
      description,
      schema
    });

    // 根据传入的 Schema 构建定义
    _buildDefinitions(schema);

    return descriptor;
  };
}

/**
 * Description 构建实例定义
 * @private
 */
function _buildDefinitions(schema: any) {
  swaggerJSON["definitions"] || (swaggerJSON["definitions"] = {});

  // 如果非类对象，直接返回
  if (!schema || !(typeof schema === "function")) {
    return;
  }

  let entityName = schema.name;

  let entityInstance = new schema();

  // 如果已经构建过，则直接返回
  if (swaggerJSON["definitions"][entityName]) {
    return;
  }

  let properties = Object.getOwnPropertyNames(entityInstance);

  // 遍历所有没有使用注解的属性
  for (let property of properties) {
    if (!(property in innerEntityObject[entityName].properties)) {
      // 这里进行类型推测

      innerEntityObject[entityName].properties[property] = {
        description: property,
        type: inferenceType(entityInstance[property])
      };
    }
  }

  swaggerJSON["definitions"][entityName] = Object.assign(
    {},
    innerEntityObject[entityName],
    {
      type: "object"
    }
  );
}
