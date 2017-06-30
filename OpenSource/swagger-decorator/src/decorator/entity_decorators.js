// @flow
import { innerEntityObject } from "../swagger/swagger";
import { _buildDefinitions } from "./api_decorator";
/**
 * Description 初始化存储对象
 * @param target
 * @param key
 * @private
 */
function _ensure(target, key) {
  let entityKey = target.constructor.name;

  innerEntityObject[entityKey] || (innerEntityObject[entityKey] = {});

  innerEntityObject[entityKey]["required"] ||
    (innerEntityObject[entityKey]["required"] = []);

  innerEntityObject[entityKey]["properties"] ||
    (innerEntityObject[entityKey]["properties"] = {});

  innerEntityObject[entityKey]["properties"][key] ||
    (innerEntityObject[entityKey]["properties"][key] = {});
}

/**
 * Description 创建某个属性的描述
 * @param type 基础类型
 * @param description 描述
 * @param required 是否为必要参数
 * @param defaultValue 默认值
 * @param primaryKey 是否为主键
 * @returns {Function}
 */
export function entityProperty({
  // 生成接口文档需要的参数
  type = "string",
  description = "",
  required = false,
  defaultValue = undefined,

  // 进行数据库连接需要的参数
  primaryKey = false
}) {
  return function(target, key, descriptor) {
    _ensure(target, key);

    let valueObject =
      innerEntityObject[target.constructor.name]["properties"][key];

    if (type === "self") {
      valueObject.type = target.constructor;
    } else if (Array.isArray(type) && type[0] === "self") {
      valueObject.type = [target.constructor];
    } else {
      valueObject.type = type;

      // 这里动态编译关联的定义项目
      Array.isArray(type)
        ? _buildDefinitions(type[0])
        : _buildDefinitions(type);
    }

    valueObject.description = description;

    // 如果是必须属性，则添加到列表中
    if (required) {
      innerEntityObject[target.constructor.name]["required"].push(key);

      // 对应地不允许为空
      valueObject.allowNull = false;
    } else {
      // 允许为空
      valueObject.allowNull = true;
    }

    // 设置其他属性
    valueObject.defaultValue = defaultValue;
    valueObject.primaryKey = primaryKey;

    return descriptor;
  };
}
