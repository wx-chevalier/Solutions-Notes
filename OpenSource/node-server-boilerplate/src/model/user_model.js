/**
 * Created by apple on 16/10/9.
 */

import Model from './model';

/**
 * @function 用户模型层
 */
export default class UserModel extends Model {

  /**
   * @function 默认构造函数
   * @param context
   */
  constructor(context) {
    super(context);
  }

  /**
   * @function 根据编号获取用户信息
   * @param id
   */
  getUserInfoByID(id) {

    return new Promise((resolve, reject)=> {

      this.context.db.select((userInfo)=> {
        resolve(userInfo);
      })

    })

  }


}