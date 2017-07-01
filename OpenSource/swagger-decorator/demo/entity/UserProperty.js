// @flow
import {entityProperty} from "../../src/entity/decorator";
export default class UserProperty {
  // 属性
  @entityProperty({
    type: ["string"],
    description: "user emails",
    required: false
  })
  emails = [];
}

