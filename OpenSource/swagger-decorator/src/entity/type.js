// @flow

/**
 * Description 根据输入的实体类类型与内置的实体对象推测出实体属性
 * @param EntityClass
 * @param innerEntityObject
 * @returns {*}
 */
export function inferenceEntityProperties(EntityClass, innerEntityObject) {
  let entityName = EntityClass.name;

  let entityInstance = new EntityClass();

  // 对象包含的自有属性
  let propertyNames = Object.getOwnPropertyNames(entityInstance);

  // 获取内置对象中定义的 Properties
  let properties = Object.assign(
    {},
    innerEntityObject[entityName]
      ? innerEntityObject[entityName].properties
      : {}
  );

  // 遍历所有没有使用注解的属性
  for (let propertyName of propertyNames) {
    if (
      innerEntityObject[entityName] &&
      !(propertyName in innerEntityObject[entityName].properties)
    ) {
      // 这里进行类型推测

      properties[propertyName] = {
        // 描述即为属性名
        description: propertyName,
        // 推导类型
        type: inferenceType(entityInstance[propertyName]),
        // 设置默认值
        defaultValue: entityInstance[propertyName]
      };
    } else {
      // 判断是否有默认取值
      properties[propertyName].defaultValue !== undefined ||
        (properties[propertyName].defaultValue = entityInstance[propertyName]);
    }
  }

  return properties;
}

/**
 * Description 类型推测
 * @param obj
 * @returns {*}
 */
export function inferenceType(obj: any) {
  if (Array.isArray(obj)) {
    return "array";
  } else {
    return typeof obj;
  }
}
