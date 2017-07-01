// @flow
const chaiExpect = require("chai").expect;
import { _convertParameterInPath } from "../../src/swagger/paths";

describe("内部辅助函数", () => {
  it("将 Express 风格路径参数转化为 Swagger 风格", () => {
    chaiExpect(_convertParameterInPath("/user/:id?name=1")).to.equal(
      "/user/{id}?name=1"
    );
  });
});
