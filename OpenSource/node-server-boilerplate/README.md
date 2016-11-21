# Node Server Boilerplate

目前主要基于Koa+Webpack+Babel+Swagger.

## Install

> PS:因为笔者不想开太多的Github Repository,所以把一些小的开源项目以NPM包的方式进行发布,请大家谅解。


```
npm i node-server-boilerplate
mv node_modules/node-server-boilerplate node-server-boilerplate
mv node_modules node-server-boilerplate
cd node-server-boilerplate
npm link
npm start
```

- 查看根路径

http://localhost:8080/

- 查看用户信息(路径参数)

http://localhost:8080/user/2

- 查看任意其他路径(权限控制下会自动跳转回根路径)

http://localhost:8080/aaa

- 查看Swagger Docs(静态资源处理)

http://localhost:8080/static/docs/

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
