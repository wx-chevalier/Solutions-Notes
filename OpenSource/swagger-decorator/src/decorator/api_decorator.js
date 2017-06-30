// @flow
import {
  innerAPIObject,
  innerEntityObject,
  swaggerJSON
} from "../swagger/swagger";
import { inferenceEntityProperties, inferenceType } from "../entity/type";

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

    _initializeInnerAPIObject(target, key, descriptor);

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

    _initializeInnerAPIObject(target, key, descriptor);

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

    _initializeInnerAPIObject(target, key, descriptor);

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

    _initializeInnerAPIObject(target, key, descriptor);

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

    _initializeInnerAPIObject(target, key, descriptor);

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

    _initializeInnerAPIObject(target, key, descriptor);

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

function _initializeInnerAPIObject(target, key, descriptor) {
  let apiKey = `${target.name}-${key}`;

  if (!innerAPIObject[apiKey]) {
    innerAPIObject[apiKey] = {};
    innerAPIObject[apiKey].instance = {
      target,
      key,
      descriptor
    };
  }
}

/**
 * Description 构建实例定义
 * @private
 */
export function _buildDefinitions(schema: any) {
  swaggerJSON["definitions"] || (swaggerJSON["definitions"] = {});

  // 如果非类对象，直接返回
  if (!schema || !(typeof schema === "function")) {
    return;
  }

  // 类型名
  let entityName = schema.name;

  // 如果已经构建过，则直接返回
  if (swaggerJSON["definitions"][entityName]) {
    return;
  }

  let properties = inferenceEntityProperties(schema, innerEntityObject);

  // 重构 properties
  for (let propertyName of Object.keys(properties)) {
    let property = properties[propertyName];

    // 截止到这里 type 在还是存放的原始用户输入的数据
    if (Array.isArray(property.type)) {
      let originType = property.type;

      property.type = "array";

      let realType = originType[0];

      property.items = typeof realType === "function"
        ? {
            $ref: `#/definitions/${originType[0].name}`
          }
        : {
            type: `${originType[0]}`
          };
    }

    // 如果为函数类型
    if (typeof property.type === "function") {
      let originType = property.type;

      property.type = "object";
      property["$ref"] = `#/definitions/${originType.name}`;
    }

    // 重定义默认属性
    property["default"] = property.defaultValue;

    // 移除不必要的属性
    delete property["primaryKey"];
    delete property["allowNull"];
    delete property["defaultValue"];
  }

  // 设置原属性的定义
  swaggerJSON["definitions"][entityName] = Object.assign(
    {},
    innerEntityObject[entityName],
    {
      properties,
      type: "object"
    }
  );
}
