// @flow
import { _convertParameterInPath } from "../../src/swagger/swagger";

describe("", () => {
  expect(_convertParameterInPath("/user/:id?name=1")).equal(
    "/user/{id}?name=1"
  );
});
