/**
 * Created by apple on 16/10/9.
 */
/**
 * @function 设置默认的日志工具
 * @param app
 */
export default function logger(app) {
  app.use(function *(next) {
    var start = new Date;
    yield next;
    var ms = new Date - start;
    console.log('%s %s - %s', this.method, this.url, ms);
  });
}