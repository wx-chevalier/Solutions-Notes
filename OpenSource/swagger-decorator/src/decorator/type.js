// @flow

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
