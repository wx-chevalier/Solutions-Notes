// @flow

import {
  apiDescription,
  apiRequestMapping,
  apiResponse,
  bodyParameter,
  pathParameter,
  queryParameter
} from "../../src/decorator/api_decorator";
import User from "../entity/User";
import UserControllerDoc from "./UserControllerDoc";

/**
 * Description 用户相关控制器
 */
export default class UserController extends UserControllerDoc {

  @apiRequestMapping("get", "/users")
  @apiDescription("get all users list")
  static async getUsers(ctx, next): [User] {
    ctx.body = [new User()];
  }

  @apiRequestMapping("get", "/user/:id")
  @apiDescription("get user object by id, only access self or friends")
  static async getUserByID(ctx, next): User {
    ctx.body = new User();
  }

  @apiRequestMapping("post", "/user")
  @apiDescription("create new user")
  static async postUser(): number {
    ctx.body = {
      statusCode: 200
    };
  }
}
