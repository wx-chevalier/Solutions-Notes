// @flow
const debug = require("debug")("sequelize");
const Sequelize = require("sequelize");

import { inferenceEntityProperties } from "../entity/type";
import { innerEntityObject } from "../singleton";

/**
 * Description 构造 Sequelize 模型
 * @param EntityClass 实体类
 * @param manuelDefinition 其他自定义的模型定义
 * @param mappingCamelCaseToUnderScore: 是否需要将 CamelCase 映射到 UnderScore
 */
export function generateSequelizeModel(
  EntityClass,
  manuelDefinition,
  {
    mappingCamelCaseToUnderScore = false
  }: {
    mappingCamelCaseToUnderScore: boolean
  } = {}
) {
  // 获取当前内部对象
  let properties = inferenceEntityProperties(EntityClass, innerEntityObject);

  // 获取当前目标对象的属性

  let sequelizeDefinition: {
    [string]: any
  } = {};

  for (let property in Object.keys(properties)) {
    let sequelizeProperty: string;

    // 判断是否需要进行格式转换
    if (mappingCamelCaseToUnderScore) {
      sequelizeProperty = property.replace(/([A-Z])/g, function($1) {
        return "_" + $1.toLowerCase();
      });
    } else {
      sequelizeProperty = property;
    }

    // 为当前属性生成相关联的 Sequelize 说明
    sequelizeDefinition[sequelizeProperty] = Object.assign(
      {},
      {
        type: _mapType(properties[property].type),
        defaultValue: properties[property].defaultValue
      },
      manuelDefinition[property]
    );
  }

  // 调试模式下打印生成的 Sequelize 模型定义
  debug(sequelizeDefinition);

  return sequelizeDefinition;
}

/**
 * Description 映射数据类型
 * @param type
 * @returns {*}
 * @private
 */
function _mapType(type: string) {
  if (type === "integer") {
    return Sequelize.INTEGER;
  } else if (type === "string") {
    return Sequelize.STRING;
  } else if (type === "boolean") {
    return Sequelize.BOOLEAN;
  } else if (type === "dateTime" || type === "date") {
    return Sequelize.DATE;
  } else if (type === "object" || type === "array") {
    return Sequelize.STRING;
  }
}
