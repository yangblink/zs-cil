### 快速开始

- `npm install -g @zsdev/zs-cli`
- `zs ci` 根据问答填写相关内容
- git项目根目录下会生成`.gitlab-ci.yml`文件
- 默认develop为自动构建触发分支
```shell
$ cd git项目
$ npm install -g @zsdev/zs-cli
$ zs ci
? .gitlab-ci.yml文件已存在,是否覆盖? Yes
? 请输入150机器相对于D:/web的部署路径(选填): /test/path
? 请输入阿里云101部署路径: /opt/xxx/xxx
? 请输入机器人webhook地址(选填): http://you-hook
? 请输入项目地址(选填): [测试项目](http://xxx)
? 请输入项目构建路径: dist
```

### 配置介绍

如下文件保存为`.gitlab-ci.yml`放置于git项目的根目录下,填写对应参数
- `DEPLOY_WINDOWS_150_PATH` 内网150配置的nginx地址，需要相对于D:/web路径，如没有则不填
- `DEPLOY_ALIYUN_101_PATH` 阿里云配置的部署地址，如没有则不填
- `ROBOT_URL` 群聊机器人webhook,企业微信->群聊->右上角更多->群机器人获取 选填
- `PROJECT_DIR` 项目的发布地址,群聊机器人会在部署完成后把该内容发布到群中，支持markdown
- `BUILD_PATH` 默认为dist, 如果打包后的文件夹为public请求改为public,其他同

> 确保你当前分支为develop,如果不是请替换或增加对应Job下的develop,  develop请全局搜索`.gitlab-ci.yml`文件
> 默认构建命令为`npm run build`,如果不是请修改`build_dev`里对应的`script`

