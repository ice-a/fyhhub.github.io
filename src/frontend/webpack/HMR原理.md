# HMR原理

![image.png](http://tva1.sinaimg.cn/large/006vSZ9Ugy1gwpywu1c5tj30md0n945o.jpg)

## Server

1. 调用`webpack`获取compiler对象
2. 更改config的entry属性 (entryOption hook)，增加client/index.js和hot/dev-server.js
3. 监听done钩子，编译完成后会把`hash`发送给客户端， 并发送一个ok
4. webpack-dev-middleware 修改文件系统，这样webpack编译后的文件会直接写到内存中。
5. 创建Server
6. 创建Socket, 在建立完连接后，会先向客户端发送一个初始hash

## client
1. 当接收到 type 为 hash 消息后会将 hash 值暂存起来，当接收到 type 为 ok 的消息后对应用执行 reload 操作
2. 在 reload 操作中，webpack-dev-server/client 会根据 hot 配置决定是刷新浏览器还是对代码进行热更新（HMR）
3. 发送`webpackHotUpdate`消息，调用`webpack/lin/dev-server`, 发送ajax请求，是否有更新的文件。如果有就用过jsonp请求最新的模块代码