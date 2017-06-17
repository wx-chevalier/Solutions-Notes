import UserModel from "../model/UserModel";
import UserService from "../service/UserService";
import {
  apiDescription,
  apiRequestMapping,
  apiResponse,
  bodyParameter,
  pathParameter,
  queryParameter
} from "swagger-decorator";
import User from "../entity/User";

/**
 * Description 用户相关控制器
 */
export default class UserController {
  @apiRequestMapping("get", "/users")
  @apiDescription("get all users list")
  @apiResponse(200, "get users successfully", [User])
  static async getUsers(ctx, next): [User] {
    ctx.body = [new User()];
  }

  @apiRequestMapping("get", "/user/:id")
  @apiDescription("get user object by id, only access self or friends")
  @pathParameter({
    name: "id",
    description: "user id",
    type: "integer"
  })
  @queryParameter({
    name: "tags",
    description: "user tags, for filtering users",
    required: false,
    type: "array",
    items: ["string"]
  })
  @apiResponse(200, "get user successfully", User)
  static async getUserByID(ctx, next): User {
    const user_id: string = ctx.params.id;

    //获取用户信息
    let userModel = new UserModel(this);

    //抓取用户信息
    let user_info = await userModel.getUserInfoByID(user_id);

    //设置返回数据
    ctx.body = {
      user_id,
      user_info,
      user_token: UserService.generateUserToken()
    };

    //等待以后是否有响应体
    await next();
  }

  @apiRequestMapping("post", "/user")
  @apiDescription("create new user")
  @bodyParameter({
    name: "user",
    description: "the new user object, must include user name",
    required: true,
    schema: User
  })
  @apiResponse(200, "create new user successfully", {
    status_code: "200"
  })
  static async postUser(): number {}
}
