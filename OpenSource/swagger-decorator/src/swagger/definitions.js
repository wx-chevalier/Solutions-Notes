// @flow

import { swaggerJSON } from "./template/swagger.json";
import { inferenceEntityProperties } from "../entity/type";
import { innerEntityObject } from "../singleton";
/**
 * Description 构建实例定义
 * @private
 */
export function buildDefinitions(Class: any) {
  // 初始化 Swagger JSON 中的 definitions 字段
  swaggerJSON["definitions"] || (swaggerJSON["definitions"] = {});

  // 如果非类对象，直接返回
  if (!Class || !(typeof Class === "function")) {
    return;
  }

  // 类型名
  let entityName = Class.name;

  // 如果已经构建过，则直接返回
  if (swaggerJSON["definitions"][entityName]) {
    return;
  }

  // 从实体类中推导出属性定义
  let properties = inferenceEntityProperties(Class, innerEntityObject);

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
