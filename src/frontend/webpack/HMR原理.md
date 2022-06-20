# HMR原理

![1608382424775.png](https://ae01.alicdn.com/kf/Hdde49d41b1fa4436bdc2e776fa6533b2C.png)

## 服务器部分
|步骤|代码位置|
|---|---|
|1.启动webpack-dev-server服务器|https://github.com/webpack/webpack-dev-server/blob/v3.7.2/bin/webpack-dev-server.js#L83|
|2.创建webpack实例|https://github.com/webpack/webpack-dev-server/blob/v3.7.2/bin/webpack-dev-server.js#L89|
|3.创建Server服务器|https://github.com/webpack/webpack-dev-server/blob/v3.7.2/bin/webpack-dev-server.js#L107|
|**4.更改config的entry属性**|https://github.com/webpack/webpack-dev-server/blob/v3.7.2/lib/Server.js#L57|
|entry添加dev-server/client/index.js|https://github.com/webpack/webpack-dev-server/blob/v3.7.2/lib/utils/addEntries.js#L22|
|entry添加webpack/hot/dev-server.js|https://github.com/webpack/webpack-dev-server/blob/v3.7.2/lib/utils/addEntries.js#L30|
|5. setupHooks|https://github.com/webpack/webpack-dev-server/blob/v3.7.2/lib/Server.js#L122|
|**6. 添加webpack的done事件回调**|https://github.com/webpack/webpack-dev-server/blob/v3.7.2/lib/Server.js#L183|
|编译完成向websocket客户端推送消息，最主要信息还是新模块的hash值，后面的步骤根据这一hash值来进行模块热替换	|https://github.com/webpack/webpack-dev-server/blob/v3.7.2/lib/Server.js#L178|
|7.创建express应用app	|https://github.com/webpack/webpack-dev-server/blob/v3.7.2/lib/Server.js#L169|
|8. 添加webpack-dev-middleware中间件	|https://github.com/webpack/webpack-dev-server/blob/v3.7.2/lib/Server.js#L208|
|以watch模式启动webpack编译，文件系统中某一个文件发生修改，webpack 监听到文件变化，根据配置文件对模块重新编译打包	|https://github.com/webpack/webpack-dev-middleware/blob/v3.7.2/index.js#L41|
|**设置文件系统为内存文件系统**	|https://github.com/webpack/webpack-dev-middleware/blob/v3.7.2/index.js#L65|
|**返回一个中间件，负责返回生成的文件**	|https://github.com/webpack/webpack-dev-middleware/blob/v3.7.2/lib/middleware.js#L20|
|app中使用webpack-dev-middlerware返回的中间件	|https://github.com/webpack/webpack-dev-server/blob/v3.7.2/lib/Server.js#L128|
|9. 创建http服务器并启动服务|https://github.com/webpack/webpack-dev-server/blob/v3.7.2/lib/Server.js#L135|
|**10. 使用sockjs在浏览器端和服务端之间建立一个 websocket 长连接**|https://github.com/webpack/webpack-dev-server/blob/v3.7.2/lib/Server.js#L745|
|创建socket服务器并监听connection事件|https://github.com/webpack/webpack-dev-server/blob/v3.7.2/lib/servers/SockJSServer.js#L33|


## 客户端部分
|步骤|代码位置|
|---|---|
|1.连接websocket服务器|https://github.com/webpack/webpack-dev-server/blob/v3.7.2/client-src/default/socket.js#L25|
|2.websocket客户端监听事件|https://github.com/webpack/webpack-dev-server/blob/v3.7.2/client-src/default/socket.js#L53|
|监听hash事件，保存此hash值|https://github.com/webpack/webpack-dev-server/blob/v3.7.2/client-src/default/index.js#L55|
|3.监听ok事件，执行reloadApp方法进行更新|https://github.com/webpack/webpack-dev-server/blob/v3.7.2/client-src/default/index.js#L93|
|4. 在reloadApp中会进行判断，是否支持热更新，如果支持的话发射webpackHotUpdate事件,如果不支持则直接刷新浏览器	|https://github.com/webpack/webpack-dev-server/blob/v3.7.2/client-src/default/utils/reloadApp.js#L7|
|5. 在webpack/hot/dev-server.js会监听webpackHotUpdate事件|https://github.com/webpack/webpack/blob/v4.39.1/hot/dev-server.js#L55|
|6. 在check方法里会调用module.hot.check方法|https://github.com/webpack/webpack/blob/v4.39.1/hot/dev-server.js#L13|
|7. 调用hotDownloadManifest，向 server 端发送 Ajax 请求，服务端返回一个 Manifest文件(lastHash.hot-update.json)，该 Manifest 包含了本次编译hash值 和 更新模块的chunk名|https://github.com/webpack/webpack/blob/v4.39.1/lib/HotModuleReplacement.runtime.js#L180|
|8. 调用JsonpMainTemplate.runtime的hotDownloadUpdateChunk方法通过JSONP请求获取到最新的模块代码|https://github.com/webpack/webpack/blob/v4.39.1/lib/web/JsonpMainTemplate.runtime.js#L14|
|9. 补丁JS取回来后会调用JsonpMainTemplate.runtime.js的webpackHotUpdate方法|https://github.com/webpack/webpack/blob/v4.39.1/lib/web/JsonpMainTemplate.runtime.js#L8|
|10. 然后会调用HotModuleReplacement.runtime.js的hotAddUpdateChunk方法动态更新模块代码|https://github.com/webpack/webpack/blob/v4.39.1/lib/HotModuleReplacement.runtime.js#L222|
|11.然后调用hotApply方法进行热更新|https://github.com/webpack/webpack/blob/v4.39.1/lib/HotModuleReplacement.runtime.js#L257  https://github.com/webpack/webpack/blob/v4.39.1/lib/HotModuleReplacement.runtime.js#L278|
|12.从缓存中删除旧模块|https://github.com/webpack/webpack/blob/v4.39.1/lib/HotModuleReplacement.runtime.js#L510|
|13.执行accept的回调|https://github.com/webpack/webpack/blob/v4.39.1/lib/HotModuleReplacement.runtime.js#L569|