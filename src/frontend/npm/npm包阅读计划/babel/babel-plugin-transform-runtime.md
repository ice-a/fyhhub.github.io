# @babel/plugin-transform-runtime

## 插件初始化

1. 获取需要加载的运行时模块名


+ 配置corejs3：必须安装@babel/runtime-corejs3
+ 配置corejs2: 必须安装@babel/runtime-corejs2
+ 不配置corejs: 加载@babel/runtime（仅支持helper的模块化，切换到preset-env的corejs配置）

```js
const moduleName = injectCoreJS3 ? "@babel/runtime-corejs3" : injectCoreJS2 ? "@babel/runtime-corejs2" : "@babel/runtime";
const HEADER_HELPERS = ["interopRequireWildcard", "interopRequireDefault"];
```

2. 获取模块路径

```js
// 获取模块路径
const modulePath = (0, _getRuntimePath.default)(moduleName, dirname, absoluteRuntime);
```



3. 继承`babel-plugin-polyfill-corejsx`插件和`babel-plugin-polyfill-regenerator`插件

```js
function createCorejsPlgin(plugin, options, regeneratorPlugin) {
  return (api, _, filename) => {
    return Object.assign({}, plugin(api, options, filename), {
      inherits: regeneratorPlugin
    });
  };
}

function createRegeneratorPlugin(options) {
  if (!useRuntimeRegenerator) return undefined;
  return (api, _, filename) => {
    return pluginRegenerator(api, options, filename);
  };
}


return {
  inherits: injectCoreJS2 ? createCorejsPlgin(pluginCorejs2, {
      method: "usage-pure",
      absoluteImports: absoluteRuntime ? modulePath : false,
      [pluginsCompat]: {
        runtimeVersion,
        useBabelRuntime: modulePath,
        ext: ""
      }
    }, createRegeneratorPlugin({
      method: "usage-pure",
      absoluteImports: absoluteRuntime ? modulePath : false,
      [pluginsCompat]: {
        useBabelRuntime: modulePath
      }
    })) : injectCoreJS3 ? createCorejsPlgin(pluginCorejs3, {
      method: "usage-pure",
      version: 3,
      proposals,
      absoluteImports: absoluteRuntime ? modulePath : false,
      [pluginsCompat]: {
        useBabelRuntime: modulePath,
        ext: ""
      }
    }, createRegeneratorPlugin({
      method: "usage-pure",
      absoluteImports: absoluteRuntime ? modulePath : false,
      [pluginsCompat]: {
        useBabelRuntime: modulePath
      }
    })) : createRegeneratorPlugin({
      method: "usage-pure",
      absoluteImports: absoluteRuntime ? modulePath : false,
      [pluginsCompat]: {
        useBabelRuntime: modulePath
      }
    }),
}
```


4. 重写helper生成方法，拦截polyfill代码生成

`transform-runtime`实现了自己的`helperGenerator`方法

```js
pre(file) {
  if (!useRuntimeHelpers) return;
  file.set("helperGenerator", name => {
    if (file.availableHelper && !file.availableHelper(name, runtimeVersion)) {
      return;
    }

    const isInteropHelper = HEADER_HELPERS.indexOf(name) !== -1;
    const blockHoist = isInteropHelper && !(0, _helperModuleImports.isModule)(file.path) ? 4 : undefined;
    const helpersDir = esModules && file.path.node.sourceType === "module" ? "helpers/esm" : "helpers";
    let helperPath = `${modulePath}/${helpersDir}/${name}`;
    if (absoluteRuntime) helperPath = (0, _getRuntimePath.resolveFSPath)(helperPath);
    return addDefaultImport(helperPath, name, blockHoist, true);
  });
  const cache = new Map();

  function addDefaultImport(source, nameHint, blockHoist, isHelper = false) {
    const cacheKey = (0, _helperModuleImports.isModule)(file.path);
    const key = `${source}:${nameHint}:${cacheKey || ""}`;
    let cached = cache.get(key);

    if (cached) {
      cached = _core.types.cloneNode(cached);
    } else {
      // 使用 @babel/helper-module-imports 创建一个导入
      cached = (0, _helperModuleImports.addDefault)(file.path, source, {
        importedInterop: isHelper && supportsCJSDefault ? "compiled" : "uncompiled",
        nameHint,
        blockHoist
      });
      cache.set(key, cached);
    }

    return cached;
  }
}
```

当`babel-core`生成`polyfill代码`时, 如果存在`helperGenerator`就使用这个generator

```js
  addHelper(name) {
    const declar = this.declarations[name];
    if (declar) return cloneNode(declar);
    const generator = this.get("helperGenerator");
    // transform-runtime 在此处拦截 实现了自己的generator
    if (generator) {
      const res = generator(name);
      if (res) return res;
    }
    // 省略代码...
  }
```

