/**
 * Created by apple on 16/10/9.
 */
/**
 * @function 设置默认的权限检测
 * @param app
 */
export default function auth(app) {
  app.use(function*(next) {

    //判断是否为根路径或者静态资源路径
    if (this.request.url === '/' || this.request.url.indexOf('static') > -1 || this.request.url.indexOf('user') > -1) {
      yield next
    } else {
      this.redirect('/')
    }

    yield next;
  });
}