# @babel/preset-env

## 一、插件筛选

1. 获取目标环境配置

```js
// 需要转换的目标环境 如果为true 就全部转换
const transformTargets = forceAllTransforms || hasUglifyTarget ? {} : targets;
```

2. 收集需要排除的插件 和 polyfill

```js
// 指定包含的插件，比如配置targets之后，有些插件被排除了，但是我就是想用这个插件
// 指定要包含的corejs polyfill语法，例如es.map, es.set等
const include = transformIncludesAndExcludes(optionsInclude);
```

3. 收集需要排除的插件 和 polyfill

```js
// 指定排除的插件，比如配置targets之后，有些插件被包含了，但是我想排除它
// 指定要排除的corejs polyfill语法，例如es.map, es.set等
const exclude = transformIncludesAndExcludes(optionsExclude);
```

4. 根据targets配置，获取所有需要用到的插件

```js
// shippedProposals：是否跳过提案的插件
// 获取所有插件对应的环境
const compatData = getPluginList(shippedProposals, bugfixes);
```


5. 判断是否支持exportNamespaceFrom

```js
// 传入插件对应支持的环境、需要包含的插件、需要排除的插件
// 判断目标环境是否支持 ExportNamespaceFrom
const shouldSkipExportNamespaceFrom = modules === "auto" && (api.caller == null ? void 0 : api.caller(supportsExportNamespaceFrom)) || modules === false && !(0, _helperCompilationTargets.isRequired)("proposal-export-namespace-from", transformTargets, {
  compatData,
  includes: include.plugins,
  excludes: exclude.plugins
});
```

6. 获取插件模块名

```js
// 一般来讲 只要modules不配置auto 都会默认加入
// proposal-dynamic-import
// proposal-export-namespace-from
// syntax-top-level-await
const modulesPluginNames = getModulesPluginNames({
  modules,
  transformations: _moduleTransformations.default,
  shouldTransformESM: modules !== "auto" || !(api.caller != null && api.caller(supportsStaticESM)),
  shouldTransformDynamicImport: modules !== "auto" || !(api.caller != null && api.caller(supportsDynamicImport)),
  shouldTransformExportNamespaceFrom: !shouldSkipExportNamespaceFrom,
  shouldParseTopLevelAwait: !api.caller || api.caller(supportsTopLevelAwait)
});
```


7. 根据targets、include、exclude获取最终的插件列表

```js
const pluginNames = (0, _helperCompilationTargets.filterItems)(compatData, include.plugins, exclude.plugins, transformTargets, modulesPluginNames, (0, _getOptionSpecificExcludes.default)({
  loose
}), _shippedProposals.pluginSyntaxMap);
```

8. 删除部分插件

```js
(0, _filterItems.removeUnnecessaryItems)(pluginNames, _overlappingPlugins); // 删除不必要的插件
(0, _filterItems.removeUnsupportedItems)(pluginNames, api.version); // 删除不支持的插件
```


## 二、获取polyfill所需插件

根据一些配置生成polyfill插件，用于注入运行时的polyfill

```js
// 获取polyfill插件
const polyfillPlugins = getPolyfillPlugins({
  useBuiltIns,
  corejs,
  polyfillTargets: targets,
  include: include.builtIns,
  exclude: exclude.builtIns,
  proposals,
  shippedProposals,
  regenerator: pluginNames.has("transform-regenerator"),
  debug
});
```
::: details getPolyfillPlugins

```js
const getPolyfillPlugins = ({
  useBuiltIns,
  corejs,
  polyfillTargets,
  include,
  exclude,
  proposals,
  shippedProposals,
  regenerator,
  debug
}) => {
  const polyfillPlugins = [];

  if (useBuiltIns === "usage" || useBuiltIns === "entry") {
    const pluginOptions = {
      method: `${useBuiltIns}-global`,
      version: corejs ? corejs.toString() : undefined,
      targets: polyfillTargets,
      include,
      exclude,
      proposals,
      shippedProposals,
      debug
    };
    // 判断是否配置corejs
    if (corejs) {
      if (useBuiltIns === "usage") {
        if (corejs.major === 2) {
          // 添加 babel-plugin-polyfill-corejs2 和 babel-polyfill 插件
          polyfillPlugins.push([pluginCoreJS2, pluginOptions], [_babelPolyfill.default, {
            usage: true
          }]);
        } else {
          // 添加 babel-plugin-polyfill-corejs3 插件 和 babel-polyfill 插件
          polyfillPlugins.push([pluginCoreJS3, pluginOptions], [_babelPolyfill.default, {
            usage: true,
            deprecated: true
          }]);
        }
        // 添加 babel-plugin-polyfill-regenerator 插件
        if (regenerator) {
          polyfillPlugins.push([pluginRegenerator, {
            method: "usage-global",
            debug
          }]);
        }
      } else {
        if (corejs.major === 2) {
          // babel-polyfill 插件（全局引入）、babel-plugin-polyfill-corejs2插件
          // 注意插件执行顺序，先执行的babel-polyfill
          polyfillPlugins.push([_babelPolyfill.default, {
            regenerator
          }], [pluginCoreJS2, pluginOptions]);
        } else {
          // 添加 babel-plugin-polyfill-corejs3 插件 和 babel-polyfill 插件
          polyfillPlugins.push([pluginCoreJS3, pluginOptions], [_babelPolyfill.default, {
            deprecated: true
          }]);

          // 如果不需要regenerator 仍然也会被push进去，因为useBuiltIns不是usage, 说明需要全量引入
          if (!regenerator) {
            polyfillPlugins.push([_regenerator.default, pluginOptions]);
          }
        }
      }
    }
  }

  return polyfillPlugins;
};
```
:::


+ 存在corejs配置
  - **useBuiltIns: usage**

    - 如果配置core-js@3

      + 添加 babel-plugin-polyfill-corejs2
      + 添加 babel-polyfill 插件 (@babel/preset-env/lib/polyfills/babel-polyfill.js)

    - 如果配置core-js@2
      + 添加 babel-plugin-polyfill-corejs2
      + 添加 babel-polyfill 插件 (@babel/preset-env/lib/polyfills/babel-polyfill.js)

    - 如果配置 transform-regenerator
      + 添加 babel-plugin-polyfill-regenerator 插件

  - **useBuiltIns: entry | false**

    - 如果配置core-js@3

      + 添加 babel-plugin-polyfill-corejs2
      + 添加 babel-polyfill 插件 (@babel/preset-env/lib/polyfills/babel-polyfill.js)

    - 如果配置core-js@2
      + 添加 babel-plugin-polyfill-corejs2
      + 添加 babel-polyfill 插件 (@babel/preset-env/lib/polyfills/babel-polyfill.js)

    - 如果没有配置 transform-regenerator 插件
      + 添加 regenerator 插件删除 regenerator 导入（@babel/preset-env/lib/polyfills/regenerator.js）










## 三、@babel/preset-env/lib/polyfills/regenerator.js

**作用：如果代码不需要支持 regenerator 就使用这个插件，删除 regenerator 的导入代码**

```js
function isRegeneratorSource(source) {
  return source === "regenerator-runtime/runtime" || source === "regenerator-runtime/runtime.js";
}

// 作用：如果代码不需要支持 regenerator 就使用这个插件，删除 regenerator 的导入代码
function _default() {
  const visitor = {
    ImportDeclaration(path) {
      // 如果代码中存在 import 'regenerator-runtime/runtime'  就直接删除该import
      if (isRegeneratorSource((0, _utils.getImportSource)(path))) {
        this.regeneratorImportExcluded = true;
        path.remove();
      }
    },

    Program(path) {
      path.get("body").forEach(bodyPath => {
        // 如果是 require('regenerator-runtime/runtime') 就直接删除该import
        if (isRegeneratorSource((0, _utils.getRequireSource)(bodyPath))) {
          this.regeneratorImportExcluded = true;
          bodyPath.remove();
        }
      });
    }

  };
  return {
    name: "preset-env/remove-regenerator",
    visitor,

    pre() {
      this.regeneratorImportExcluded = false;
    },

    post() {
      if (this.opts.debug && this.regeneratorImportExcluded) {
        let filename = this.file.opts.filename;

        if (process.env.BABEL_ENV === "test") {
          filename = filename.replace(/\\/g, "/");
        }

        console.log(`\n[${filename}] Based on your targets, regenerator-runtime import excluded.`);
      }
    }

  };
}
```



## 四、@babel/preset-env/lib/polyfills/babel-polyfill.js

作用：将代码里的`@babel/polyfill`导入替换成 core-js和regenerator 的导入
```js
function _default({
  template
}, {
  regenerator,
  deprecated,
  usage
}) {
  return {
    name: "preset-env/replace-babel-polyfill",
    visitor: {
      ImportDeclaration(path) {
        const src = (0, _utils.getImportSource)(path);
        // 如果是按需引入 并且代码里面写了 import '@babel/polyfill' 就删掉这个代码
        if (usage && (0, _utils.isPolyfillSource)(src)) {
          console.warn(NO_DIRECT_POLYFILL_IMPORT.replace("SPECIFIER", src));

          // core-js3 不会删除import
          if (!deprecated) path.remove();

        } else if (src === "@babel/polyfill") {
          if (deprecated) {
            console.warn(BABEL_POLYFILL_DEPRECATION);

          // 替换 import '@babel/polyfill'
          } else if (regenerator) {
            path.replaceWithMultiple(template.ast`
              import "core-js";
              import "regenerator-runtime/runtime.js";
            `);
          } else {
            path.replaceWith(template.ast`
              import "core-js";
            `);
          }
        }
      },

      Program(path) {
        path.get("body").forEach(bodyPath => {
          const src = (0, _utils.getRequireSource)(bodyPath);

          if (usage && (0, _utils.isPolyfillSource)(src)) {
            console.warn(NO_DIRECT_POLYFILL_IMPORT.replace("SPECIFIER", src));
            if (!deprecated) bodyPath.remove();
          } else if (src === "@babel/polyfill") {
            if (deprecated) {
              console.warn(BABEL_POLYFILL_DEPRECATION);
            } else if (regenerator) {
              bodyPath.replaceWithMultiple(template.ast`
                require("core-js");
                require("regenerator-runtime/runtime.js");
              `);
            } else {
              bodyPath.replaceWith(template.ast`
                require("core-js");
              `);
            }
          }
        });
      }

    }
  };
}
```