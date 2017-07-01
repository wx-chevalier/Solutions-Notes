// @flow

/**
 * Description 从实体类中生成对象，并且进行数据校验；注意，这里会进行递归生成，即对实体类对象同样进行生成
 * @param EntityClass
 * @param data
 * @param ignore true 则是不进行数据校验
 */
export function generateEntity(
  EntityClass: Function,
  data: {
    [string]: any
  },
  ignore = false
): Object {}
