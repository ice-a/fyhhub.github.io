# lerna使用

## lerna核心操作

不知道的命令，建议lerna xx -h
+ **项目初始化**
  1. `npm init -y`初始化
  2. `npm i lerna -D`
  3. `lerna init`

+ **创建package**
  1. `lerna create` 创建package
  2. `lerna add` 安装依赖
  3. `lerna link` 链接依赖


+ **开发和测试**
  1. `lerna exec` 执行shell脚本
  2. `lerna run` 执行`npm scripts`
  3. `lerna clean` 清空所有依赖node_modules
  4. `lerna bootstrap` 重装依赖

+ **发布上线**
  1. `lerna version` 提升版本号
  2. `lerna changed` 查看当前版本与上版本的所有变更
  3. `lerna diff` 查看diff
  4. `lerna publish` 发布


### 注意点

+ lerna link：有两个库`A`和`B`,如果`A`引用`B包`, 需要在`A`的package.json中的`dependencies`提前声明好，然后再执行`lerna link`
+ lerna exec: `lerna exec -- rm -rf node_modules`是在每个packages中执行的，而不是项目根目录



## lerna分析

**本地开发依赖最佳实践**
```json
{
  "dependencies": {
    "@leek-cli-dev/utils": "file:../utils"  // 通过file: 可以让我们不需要npm link 直接可以本地开发
  }
}
```
