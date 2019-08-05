[![返回目录](https://i.postimg.cc/50XLzC7C/image.png)](https://github.com/wx-chevalier/Web-Series/)

# [Yarn](https://github.com/yarnpkg/yarn)

Yarn 是一个新的快速安全可信赖的可以替代 NPM 的依赖管理工具，笔者在自己过去无论是本机还是 CI 中经常会碰到 NPM 安装依赖失败的情形，防不胜防啊。Yarn 正式发布没几天已经迅速达到了数万赞，就可以知道大家苦 NPM 久已。笔者最早是在 [Facebook 的这篇吐槽文](https://code.facebook.com/posts/1840075619545360/yarn-a-new-package-manager-for-javascript/)中了解到 Yarn。Facebook 使用 NPM 与 npm.js 存放管理大量的依赖项目，不过随着依赖项数目与复杂度的增加，NPM 本身在一致性、安全性以及性能方面的弊端逐渐暴露。因此忍无可忍的 Facebook 重构了 Yarn 这个新型的可替换 NPM 客户端的依赖管理工具。Yarn 仍然基于 NPM Registry 作为主要的仓库，不过其提供了更快的安装速度与不同环境下的一致性保证。
![](https://coding.net/u/hoteam/p/Cache/git/raw/master/2016/10/2/1-6b1tRgneuFkZol6ZQqo-lQ.png)

## Features

- **Consistency:** Yarn 允许使用某个 lockfile 来保证团队中的所有人使用相同版本的 npm 依赖包，这一点会大大减少因为某个人系统本身问题而导致的 Bug。
- **Versatile Archives:** Yarn 还允许用户将 npm 包以*tar.gz*形式打包上传到版本控制系统中，这一点能够利用 NPM 包本身已经对不同版本的 Node 或者操作系统做了容错这一特性。
- **Offline:** Yarn 允许离线安装某些依赖，这点对于 CI 系统特别适用。CI 系统就不需要保证有稳定的网络连接，特别是在有墙的地方。
- **Speed:** Yarn 采用了新的算法来保证速度， [比 NPM 快到 2~7 倍](https://yarnpkg.com/en/compare)， 同时也允许使用离线包的方式本地安装依赖。

## Reference

- [yarn-a-new-package-manager-for-javascript](https://code.facebook.com/posts/1840075619545360/yarn-a-new-package-manager-for-javascript/)

- [yarn-a-new-program-for-installing-javascript-dependencies](https://blog.getexponent.com/yarn-a-new-program-for-installing-javascript-dependencies-44961956e728#.qf8fmeg4g)

- [npm-vs-yarn-cheat-sheet](https://shift.infinite.red/npm-vs-yarn-cheat-sheet-8755b092e5cc#.dcd5qeolm)

- [Yarn 能帮你解决的五件事](http://www.tuicool.com/articles/Yn2iU3Q)

# Quick Start

直接使用`npm i yarn -g`全局安装即可，这是笔者本机的运行结果图，速度与稳定性确实都快了不少：
![](https://coding.net/u/hoteam/p/Cache/git/raw/master/2016/10/2/9A18FA64-6871-4A55-B77D-7DAE78371DE5.png)

## Cheat

| NPM                        | YARN                      | 说明                                     |
| -------------------------- | ------------------------- | ---------------------------------------- |
| npm init                   | yarn init                 | 初始化某个项目                           |
| npm install/link           | yarn install/link         | 默认的安装依赖操作                       |
| npm install taco —save     | yarn add taco             | 安装某个依赖，并且默认保存到 package.    |
| npm uninstall taco —save   | yarn remove taco          | 移除某个依赖项目                         |
| npm install taco —save-dev | yarn add taco —dev        | 安装某个开发时依赖项目                   |
| npm update taco —save      | yarn upgrade taco         | 更新某个依赖项目                         |
| npm install taco --global  | yarn global add taco      | 安装某个全局依赖项目                     |
| npm publish/login/logout   | yarn publish/login/logout | 发布/登录/登出，一系列 NPM Registry 操作 |
| npm run/test               | yarn run/test             | 运行某个命令                             |

# npx

近日发布的 npm 5.2.0 版本中内置了伴生命令：npx，类似于 npm 简化了项目开发中的依赖安装与管理，该工具致力于提升开发者使用包提供的命令行的体验。npx 允许我们使用本地安装的命令行工具而不需要再定义 npm run-script，并且允许我们仅执行一次脚本而不需要再将其实际安装到本地；同时 npx 还允许我们以不同的 node 版本来运行指定命令、允许我们交互式地开发 node 命令行工具以及便捷地安装来自于 gist 的脚本。

在传统的命令执行中，我们需要将工具添加到 package.json 的 `scripts` 配置中，这种方式还需要我们以 `--` 方式传递参数；我们也可以使用 `alias npmx=PATH=$(npm bin):$PATH,` 或者 `./node_modules/.bin/mocha` 方式来执行命令，虽然都能达到目标，但不免繁杂了许多。而 npx 允许我们以 `npx mocha` 这样的方式直接运行本地安装的 mocha 命令。

![](https://coding.net/u/hoteam/p/Cache/git/raw/master/2017/6/1/1-A4HJT1FHQA_1_z3aMBc5mg.gif)

完整的 npx 命令提示如下：

```
从 npm 的可执行包执行命令
  npx [选项] <命令>[@版本] [命令的参数]...
  npx [选项] [-p|--package <包>]... <命令> [命令的参数]...
  npx [选项] -c '<命令的字符串>'
  npx --shell-auto-fallback [命令行解释器]

选项：
  --package, -p包安装的路径 [字符串]
  --cachenpm 缓存路径 [字符串]
  --install如果有包缺失，跳过安装[布尔] [默认值: true]
  --userconfig 当前用户的 npmrc 路径[字符串]
  --call, -c 像执行 `npm run-script` 一样执行一个字符串 [字符串]
  --shell, -s执行命令用到的解释器，可选 [字符串] [默认值: false]
  --shell-auto-fallback产生“找不到命令”的错误码
  [字符串] [可选值: "", "bash", "fish", "zsh"]
  --ignore-existing忽略 $PATH 或工程里已有的可执行文件，这会强制使 npx
 临时安装一次，并且使用其最新的版本 [布尔]
  --quiet, -q隐藏 npx 的输出，子命令不会受到影响[布尔]
  --npm为了执行内部操作的 npm 可执行文件 [字符串] [默认值:
 "/Users/apple/.nvm/versions/node/v8.1.3/lib/node_modules/npm/bin/npm-cli.js"]
  --version, -v显示版本号 [布尔]
  --help, -h 显示帮助信息 [布尔]
```

npx 还允许我们单次执行命令而不需要安装；在某些场景下有可能我们安装了某个全局命令行工具之后一直忘了更新，导致以后使用的时候误用了老版本。而使用 `npx create-react-app my-cool-new-app` 来执行 create-react-app 命令时，它会正常地帮我们创建 React 应用而不会实际安装 create-react-app 命令行。
我们还可以使用类似于 `$ npx -p node-bin@6 npm it` 的格式来指定 Node 版本，或者使用 `npx https://gist.github.com/zkat/4bc19503fe9e9309e2bfaa2c58074d32` 方式直接运行来自于 Gist 的脚本。
