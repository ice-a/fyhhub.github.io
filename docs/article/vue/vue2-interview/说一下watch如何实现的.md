# 说一下watch如何实现的

## 核心答案
1. 不管任何形式的watch最终都会调用`$watch`
2. $watch依赖响应式系统的`Watcher`，首先会创建一个`user watcher`, 初始化时会调用getter，触发响应式变量依赖收集
3. 当修改响应式变量，触发setter，最终会调用用户回调