// @flow

import { entityProperty } from "../../src/entity/decorator";
import UserProperty from "./UserProperty";
/**
 * Description 用户实体类
 */
export default class User {
  // 编号
  @entityProperty({
    type: "integer",
    description: "user id, auto-generated",
    required: false
  })
  id: string = 0;

  // 姓名
  @entityProperty({
    type: "string",
    description: "user name, 3~12 characters",
    required: true
  })
  name: string = "name";

  // 朋友列表
  @entityProperty({
    type: ["self"],
    description: "user friends, which is instance of self",
    required: false
  })
  friends: [User];

  // 属性
  @entityProperty({
    type: UserProperty,
    description: "user property",
    required: false
  })
  properties: {
    address: string
  } = new UserProperty();
}
