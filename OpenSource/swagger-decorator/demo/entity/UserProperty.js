// @flow
import {entityProperty} from "../../src/decorator/entity_decorators";
export default class UserProperty {
  // 属性
  @entityProperty({
    type: ["string"],
    description: "user emails",
    required: false
  })
  emails = [];
}

