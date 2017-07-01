// @flow
import { innerEntityObject } from "../singleton";
import { buildDefinitions } from "../swagger/definitions";

/**
 * Description 生成实体类的唯一标识，这里首先默认使用实体类名作为唯一标识
 * @param target
 * @param key
 * @param descriptor
 */
export function generateEntityUUID(target, key, descriptor) {
  return target.constructor.name;
}

/**
 * Description 创建某个属性的描述
 * @param type 基础类型 self - 表示为自身
 * @param description 描述
 * @param required 是否为必要参数
 * @param defaultValue 默认值
 * @param pattern
 * @param primaryKey 是否为主键
 * @returns {Function}
 */
export function entityProperty({
  // 生成接口文档需要的参数
  type = "string",
  description = "",
  required = false,
  defaultValue = undefined,

  // 进行校验所需要的参数
  pattern = undefined,

  // 进行数据库连接需要的参数
  primaryKey = false
}) {
  return function(target, key, descriptor) {
    let entityUUID = generateEntityUUID(target, key, descriptor);

    // 确保实体键存在
    _ensure(entityUUID, key);

    let valueObject = innerEntityObject[entityUUID]["properties"][key];

    // 判断是否为自身
    if (type === "self") {
      valueObject.type = target.constructor;
    } else if (Array.isArray(type) && type[0] === "self") {
      valueObject.type = [target.constructor];
    } else {
      valueObject.type = type;

      // 这里动态编译关联的定义项目，需要根据输入的是否为数组来动态提取出具体的实体类或者对象
      Array.isArray(type) ? buildDefinitions(type[0]) : buildDefinitions(type);
    }

    // 设置描述
    valueObject.description = description;

    // 如果是必须属性，则添加到列表中
    if (required) {
      innerEntityObject[entityUUID]["required"].push(key);

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

/**
 * Description 初始化存储对象
 * @param entityUUID 实体唯一标识，目前也就是实体名
 * @param property 当前的属性名
 * @private
 */
function _ensure(entityUUID, property) {
  innerEntityObject[entityUUID] || (innerEntityObject[entityUUID] = {});

  innerEntityObject[entityUUID]["required"] ||
    (innerEntityObject[entityUUID]["required"] = []);

  innerEntityObject[entityUUID]["properties"] ||
    (innerEntityObject[entityUUID]["properties"] = {});

  innerEntityObject[entityUUID]["properties"][property] ||
    (innerEntityObject[entityUUID]["properties"][property] = {});
}
