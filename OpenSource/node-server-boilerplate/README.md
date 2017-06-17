# Node Server Boilerplate

目前主要基于 Koa+Webpack+Babel+Swagger，将项目 git clone 到本地后，即可运行：

```$xslt
# 安装依赖
yarn install

# 启动服务器
npm start
```

- 查看根路径
```$xslt
http://localhost:8080/
```

- 查看用户信息(路径参数)
```$xslt
    # 这里使用了根路径 /api
    http://localhost:8080/api/user/2
```

- 查看任意其他路径(权限控制下会自动跳转回根路径)

```$xslt
    http://localhost:8080/not-found
```

- 查看静态资源处理
```$xslt
    http://localhost:8080/static/
```

- 查看 Swagger
```$xslt
    # 查看 Swagger 接口文档
    http://localhost:8080/swagger/
    # 查看 JSON 数据
    http://localhost:8080/swagger/api.json
```


# swagger-decorator：注解方式为 Koa2 应用自动生成 Swagger 文档

理想的项目开发流程。如果要让开发人员在更改接口的同时花费额外精力维护一份开发文档，可能对于我司这样的小公司而言存在着很大的代价与风险。

Single Source of Truth

笔者是习惯使用 Flow 进行静态类型检测，[JavaScript 编程样式指南](https://parg.co/bvM)

```$xslt
$ yarn add swagger-decorator

# 依赖于 Babel 的 transform-decorators-legacy 转换插件来使用 Decorator
$ yarn add transform-decorators-legacy -D
```


```javascript
import { wrappingKoaRouter } from "swagger-decorator";

...

const Router = require("koa-router");

const router = new Router();

wrappingKoaRouter(router, "localhost:8080", "/api", {
  title: "Node Server Boilerplate",
  info: "0.0.1",
  description: "Koa2, koa-router,Webpack"
});

//定义默认的根路由
router.get("/", async function(ctx, next) {
  ctx.body = { msg: "Node Server Boilerplate" };
});

//定义用户处理路由
router.scan(UserController);

```


```javascript
/**
 * Description 将 router 对象的方法进行封装
 * @param router 路由对象
 * @param host API 域名
 * @param basePath API 基本路径
 * @param info 其他的 Swagger 基本信息
 */
export function wrappingKoaRouter(
  router: Object,
  host: string = "localhost",
  basePath: string = "",
  info: Object = {}
) {}
```

```javascript

/**
* Description 扫描某个类中的所有静态方法，按照其注解将其添加到
* @param staticClass
*/
router.scan = function(staticClass: Function) {
    let methods = Object.getOwnPropertyNames(staticClass);
    
    // 移除前三个属性 constructor、name
    methods.shift();
    methods.shift();
    methods.shift();
    
    for (let method of methods) {
      router.all(staticClass[method]);
    }
};

```


```javascript
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

```

```javascript
// @flow

import { entityProperty } from "swagger-decorator";
/**
 * Description 用户实体类
 */
export default class User {
  // 编号
  @entityProperty({
    type: "integer",
    description: "user id, auto-generated",
    required: false
  })
  id: string = 0;

  // 姓名
  @entityProperty({
    type: "string",
    description: "user name, 3~12 characters",
    required: true
  })
  name: string = "name";

  // 朋友列表
  friends: [number] = [1];

  // 属性
  properties: {
    address: string
  } = {
    address: "address"
  };
}

```

swagger-decorator 会自动根据其默认值来推测类型

![](https://coding.net/u/hoteam/p/Cache/git/raw/master/2017/6/1/WX20170617-172651.png)

![](https://coding.net/u/hoteam/p/Cache/git/raw/master/2017/6/1/WX20170617-172707.png)


# Application Features

![](https://camo.githubusercontent.com/605ebdcd920c801b875307d04b797a8eb4c81391/687474703a2f2f692e696d6775722e636f6d2f464445735a45432e706e67)


## File Directory

## Router

### Auth

## Controller

### Serve Static Files

## Model

### Service

## Logger

这里建议使用[winston](https://github.com/winstonjs/winston)作为主要的日志记录工具。

# Development Features

## Swagger

## Build & Deploy

使用`npm run build`构建打包之后的文件,使用`npm run deploy`同时打包与部署项目。这里建议使用[pm2](https://github.com/Unitech/pm2)作为集群部署工具,可以使用`npm run deploy`直接编译并且启动具有四个实例的集群。关于pm2详细的命令为:
```
# General
$ npm install pm2 -g            # Install PM2
$ pm2 start app.js              # Start, Daemonize and auto-restart application (Node)
$ pm2 start app.py              # Start, Daemonize and auto-restart application (Python)
$ pm2 start npm -- start        # Start, Daemonize and auto-restart Node application

# Cluster Mode (Node.js only)
$ pm2 start app.js -i 4         # Start 4 instances of application in cluster mode
                                # it will load balance network queries to each app
$ pm2 reload all                # Zero Second Downtime Reload
$ pm2 scale [app-name] 10       # Scale Cluster app to 10 process

# Process Monitoring
$ pm2 list                      # List all processes started with PM2
$ pm2 monit                     # Display memory and cpu usage of each app
$ pm2 show [app-name]           # Show all informations about application

# Log management
$ pm2 logs                      # Display logs of all apps
$ pm2 logs [app-name]           # Display logs for a specific app
$ pm2 logs --json               # Logs in JSON format
$ pm2 flush
$ pm2 reloadLogs

# Process State Management
$ pm2 start app.js --name="api" # Start application and name it "api"
$ pm2 start app.js -- -a 34     # Start app and pass option "-a 34" as argument
$ pm2 start app.js --watch      # Restart application on file change
$ pm2 start script.sh           # Start bash script
$ pm2 start app.json            # Start all applications declared in app.json
$ pm2 reset [app-name]          # Reset all counbters
$ pm2 stop all                  # Stop all apps
$ pm2 stop 0                    # Stop process with id 0
$ pm2 restart all               # Restart all apps
$ pm2 gracefulReload all        # Graceful reload all apps in cluster mode
$ pm2 delete all                # Kill and delete all apps
$ pm2 delete 0                  # Delete app with id 0

# Startup/Boot management
$ pm2 startup                   # Generate a startup script to respawn PM2 on boot
$ pm2 save                      # Save current process list
$ pm2 resurrect                 # Restore previously save processes
$ pm2 update                    # Save processes, kill PM2 and restore processes
$ pm2 generate                  # Generate a sample json configuration file

# Deployment
$ pm2 deploy app.json prod setup    # Setup "prod" remote server
$ pm2 deploy app.json prod          # Update "prod" remote server
$ pm2 deploy app.json prod revert 2 # Revert "prod" remote server by 2

# Module system
$ pm2 module:generate [name]    # Generate sample module with name [name]
$ pm2 install pm2-logrotate     # Install module (here a log rotation system)
$ pm2 uninstall pm2-logrotate   # Uninstall module
$ pm2 publish                   # Increment version, git push and npm publish
```
![](https://github.com/unitech/pm2/raw/master/pres/pm2-list.png)
