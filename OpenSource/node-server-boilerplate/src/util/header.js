/**
 * Created by apple on 16/10/9.
 */

/**
 * @function 设置请求与响应的通用头部数据
 * @param app
 */
export default function header(app) {

  // x-response-time

  app.use(function *(next) {
    var start = new Date;
    yield next;
    var ms = new Date - start;
    this.set('X-Response-Time', ms + 'ms');
  });

}