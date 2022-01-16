# Vite源码阅读笔记


## 主流程

### 初始化阶段

1. `resolveConfig`解析配置文件与默认配置合并
```js

```

2. `resolveHttpsConfig`解析`https`配置
3. 使用`http`模块创建Server，并初始化一些`middlewares`
4. `createWebSocketServer`创建WebSocket，主要用于hmr
5. `createPluginContainer` 创建插件容器，用于覆盖rollup的插件hook实现
6. 生成server配置
7. 监听文件变化，例如文件删除，修改，增加等



## Hook执行

### 1. configureServer

执行插件：
+ cssPlugin

  ```js
  configureServer(_server) {
    server = _server
  }
  ```

+ esbuildPlugin

  ```js
  configureServer(_server) {
    server = _server
    server.watcher
      .on('add', reloadOnTsconfigChange)
      .on('change', reloadOnTsconfigChange)
      .on('unlink', reloadOnTsconfigChange)
  }
  ```

+ importAnalysisPlugin

  ```js
  configureServer(_server) {
    server = _server
  }
  ```

+ preAliasPlugin

  ```js
  configureServer(_server) {
    server = _server
  }
  ```

+ resolvePlugin

  ```js
  configureServer(_server) {
    server = _server
  }
  ```


### 2. buildStart

执行插件：
+ assetPlugin

  ```js
  buildStart() {
    assetCache.set(config, new Map())
    emittedHashMap.set(config, new Set())
  }
  ```

+ cssPlugin

  ```js
  buildStart() {
    // Ensure a new cache for every build (i.e. rebuilding in watch mode)
    moduleCache = new Map<string, Record<string, string>>()
    cssModulesCache.set(config, moduleCache)

    removedPureCssFilesCache.set(config, new Map<string, RenderedChunk>())
  }
  ```

+ dataURIPlugin

  ```js
  buildStart() {
    resolved = {}
  }
  ```

+ htmlInlineScriptProxyPlugin

  ```js
  buildStart() {
    htmlProxyMap.set(config, new Map())
  }
  ```



## 优化依赖