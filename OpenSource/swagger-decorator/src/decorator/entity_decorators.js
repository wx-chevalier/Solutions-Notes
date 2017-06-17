// @flow
import { innerEntityObject } from "../swagger/swagger";

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
 * @param type
 * @param description
 * @param required
 * @returns {Function}
 */
export function entityProperty({
  type = "string",
  description = "",
  required = false
}) {
  return function(target, key, descriptor) {

    _ensure(target, key);

    innerEntityObject[target.constructor.name]["properties"][key].type = type;

    innerEntityObject[target.constructor.name]["properties"][
      key
    ].description = description;

    // 如果是必须属性，则添加到列表中
    if (required) {
      innerEntityObject[target.constructor.name]["required"].push(key);
    }

    return descriptor;
  };
}
