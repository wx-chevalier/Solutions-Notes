> 本文从属于笔者[Web-Develop-Introduction-And-Best-Practices](https://github.com/wxyyxc1992/Web-Develop-Introduction-And-Best-Practices)中的[NodeJS 入门与最佳实践](https://github.com/wxyyxc1992/Web-Develop-Introduction-And-Best-Practices/tree/master/Server/NodeJS)

# [Yarn](https://github.com/yarnpkg/yarn)

Yarn是一个新的快速安全可信赖的可以替代NPM的依赖管理工具，笔者在自己过去无论是本机还是CI中经常会碰到NPM安装依赖失败的情形，防不胜防啊。Yarn正式发布没几天已经迅速达到了数万赞，就可以知道大家苦NPM久已。笔者最早是在[Facebook的这篇吐槽文](https://code.facebook.com/posts/1840075619545360/yarn-a-new-package-manager-for-javascript/)中了解到Yarn。Facebook使用NPM与npm.js存放管理大量的依赖项目，不过随着依赖项数目与复杂度的增加，NPM本身在一致性、安全性以及性能方面的弊端逐渐暴露。因此忍无可忍的Facebook重构了Yarn这个新型的可替换NPM客户端的依赖管理工具。Yarn仍然基于NPM Registry作为主要的仓库，不过其提供了更快的安装速度与不同环境下的一致性保证。


## Features
- **Consistency:** Yarn允许使用某个lockfile来保证团队中的所有人使用相同版本的npm依赖包，这一点会大大减少因为某个人系统本身问题而导致的Bug。
- **Versatile Archives:** Yarn还允许用户将npm包以*tar.gz*形式打包上传到版本控制系统中，这一点能够利用NPM包本身已经对不同版本的Node或者操作系统做了容错这一特性。
- **Offline:** Yarn允许离线安装某些依赖，这点对于CI系统特别适用。CI系统就不需要保证有稳定的网络连接，特别是在有墙的地方。
- **Speed:** Yarn采用了新的算法来保证速度， [比NPM快到2~7倍](https://yarnpkg.com/en/compare)， 同时也允许使用离线包的方式本地安装依赖。

## Reference
- [yarn-a-new-package-manager-for-javascript](https://code.facebook.com/posts/1840075619545360/yarn-a-new-package-manager-for-javascript/)
- [yarn-a-new-program-for-installing-javascript-dependencies](https://blog.getexponent.com/yarn-a-new-program-for-installing-javascript-dependencies-44961956e728#.qf8fmeg4g)
- [npm-vs-yarn-cheat-sheet](https://shift.infinite.red/npm-vs-yarn-cheat-sheet-8755b092e5cc#.dcd5qeolm)

# Quick Start
直接使用`npm i yarn -g`全局安装即可，这是笔者本机的运行结果图，速度与稳定性确实都快了不少：
![](https://coding.net/u/hoteam/p/Cache/git/raw/master/2016/10/2/9A18FA64-6871-4A55-B77D-7DAE78371DE5.png)

## Cheat

| NPM                        | YARN                      | 说明                         |
| -------------------------- | ------------------------- | -------------------------- |
| npm init                   | yarn init                 | 初始化某个项目                    |
| npm install/link           | yarn install/link         | 默认的安装依赖操作                  |
| npm install taco —save     | yarn add taco             | 安装某个依赖，并且默认保存到package.     |
| npm uninstall taco —save   | yarn remove taco          | 移除某个依赖项目                   |
| npm install taco —save-dev | yarn add taco —dev        | 安装某个开发时依赖项目                |
| npm update taco —save      | yarn upgrade taco         | 更新某个依赖项目                   |
| npm install taco --global  | yarn global add taco      | 安装某个全局依赖项目                 |
| npm publish/login/logout   | yarn publish/login/logout | 发布/登录/登出，一系列NPM Registry操作 |
| npm run/test               | yarn run/test             | 运行某个命令                     |






