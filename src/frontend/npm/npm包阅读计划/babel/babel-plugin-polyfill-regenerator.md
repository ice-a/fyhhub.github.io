# babel-plugin-polyfill-regenerator

**作用：为代码添加regenerator-runtime/runtime.js的导入代码**

```js
var _default = (0, _helperDefinePolyfillProvider.default)(({
  debug
}, options) => {
  const {
    [runtimeCompat]: {
      useBabelRuntime
    } = {}
  } = options;
  const pureName = useBabelRuntime ? `${useBabelRuntime}/regenerator` : "regenerator-runtime";
  return {
    name: "regenerator",
    polyfills: ["regenerator-runtime"],

    usageGlobal(meta, utils) {
      if (isRegenerator(meta)) {
        debug("regenerator-runtime");
        // 注入全局import
        utils.injectGlobalImport("regenerator-runtime/runtime.js");
      }
    },

    usagePure(meta, utils, path) {
      if (isRegenerator(meta)) {
        // 注入全局require
        path.replaceWith(utils.injectDefaultImport(pureName, "regenerator-runtime"));
      }
    }
  };
});

exports.default = _default;

const isRegenerator = meta => meta.kind === "global" && meta.name === "regeneratorRuntime";
```