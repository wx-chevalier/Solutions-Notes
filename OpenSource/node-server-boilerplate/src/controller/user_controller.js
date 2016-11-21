import UserModel from '../model/user_model';
import UserService from '../service/user_service';
/**
 * Created by apple on 16/10/9.
 */

/**
 * @function 默认的用户Controller
 */

/**
 * @function 根据ID获取用户编号
 * @param next
 * @param user_id
 */
export function *get_user(next, user_id = this.params.id) {

  //获取用户信息
  let userModel = new UserModel(this);

  //抓取用户信息
  let user_info = yield userModel.getUserInfoByID(user_id);

  //设置返回数据
  this.body = {
    user_id,
    user_info,
    user_token: UserService.generateUserToken()
  };

  //等待以后是否有响应体
  yield next;

  console.log('get_user_controller end')
}
