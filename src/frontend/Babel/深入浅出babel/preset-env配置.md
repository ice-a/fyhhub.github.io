# preset-env配置

## @babel/preset-env的配置

这个包的配置比较多，首先我们要指定的是 targets，也就是 browserslist 的 query，这个同样可以在 .browserslistrc 的配置文件中指定（别的工具也可能用到）。

### targets
targets 配啥呢？

可以配 query 或者直接指定环境版本（query 的结果也是环境版本）。

环境有这些：

chrome, opera, edge, firefox, safari, ie, ios, android, node, electron

可以指定 query：
```js
{
  "targets": "> 0.25%, not dead"
}
```
也可以直接指定环境版本；
```js
{
  "targets": {
    "chrome": "58",
    "ie": "11"
  }
}
```
要指定支持 es module 的环境，可以使用 query，也可以使用 esmodules option。

```js
{
  "targets": {
    "esmodules": true
  }
}
```

### include & exclude
通过 targets 的指定，babel 会自动引入一些插件，但当需要手动指定要 include 或者 exclude 什么插件的时候可以使用这个 option。

不过这个只是针对 transform plugin，对于 proposal plugin，要在 plugins的 option 单独引入。

一般情况下并不需要单独 include 啥，用 babel 根据 targets 自动引入的 transform plugin 即可，只是有一些特殊场景下可能会用到。

### modules

targets 是指定目标环境，modules 是指定目标模块规范，取值有 amd、umd、systemjs、commonjs (cjs)、auto、false。

+ amd、umd、systemjs、commonjs (cjs) 这四个分别指定不同的目标模块规范

+ false 是不转换模块规范

+ auto 则是自动探测，默认值也是这个。

其实一般这个 option 都是 bundler 来设置的，因为 bundler 负责模块转换，自然知道要转换成什么模块规范。我们平时就用默认值 auto 即可。

类似 babel parser 可以设置 moduleType 为 unambiguous，让 babel 根据是否包含 import / export 语法来自动设置为具体的值。 这个 auto 也是一样，会根据探测到的目标环境支持的模块规范来做转换。依据是在 transform 的时候传入的 caller 数据。
```js
babel.transformFileSync("example.js", {
  caller: {
    name: "my-custom-tool",
    supportsStaticESM: true,
  },
});
```
比如在调用 transformFile 的 api 的时候传入了 caller 是支持 esm 的，那么在 targets 的 modules 就会自动设置为 esm。


### debug
debug 这个参数配置比较简单，就是 true 或者 false，但是意义却很大。我们知道 babel 会根据 targets 支持的特性来过滤 transform plugins 和 polyfills（core-js）。想知道最终使用的 transform plugin 和引入的 core-js 模块是否对，那就可以把 debug 设为 true，这样在控制台打印这些数据。

比如
```js
const sourceCode = `
  import "core-js";
  new Array(5).fill('111');
`;
const { code, map } = babel.transformSync(sourceCode, {
  filename: 'a.mjs',
  targets: {
      browsers: 'Chrome 45',
  },
  presets: [
    ['@babel/env', {
      debug: true,
      useBuiltIns: 'usage',
      corejs: 3
    }]
  ]
});
```
设置 debug 为 true，会打印 targets 和根据 tragets 过滤出的的 plugin 和 preset：

```js
@babel/preset-env: `DEBUG` option

Using targets:
{
  "chrome": "45"
}

Using modules transform: auto

Using plugins:
  proposal-numeric-separator { chrome < 75 }
  proposal-logical-assignment-operators { chrome < 85 }
  proposal-nullish-coalescing-operator { chrome < 80 }
  proposal-optional-chaining { chrome }
  proposal-json-strings { chrome < 66 }
  proposal-optional-catch-binding { chrome < 66 }
  transform-parameters { chrome < 49 }
  proposal-async-generator-functions { chrome < 63 }
  proposal-object-rest-spread { chrome < 60 }
  transform-dotall-regex { chrome < 62 }
  proposal-unicode-property-regex { chrome < 64 }
  transform-named-capturing-groups-regex { chrome < 64 }
  transform-async-to-generator { chrome < 55 }
  transform-exponentiation-operator { chrome < 52 }
  transform-function-name { chrome < 51 }
  transform-arrow-functions { chrome < 47 }
  transform-classes { chrome < 46 }
  transform-object-super { chrome < 46 }
  transform-for-of { chrome < 51 }
  transform-sticky-regex { chrome < 49 }
  transform-unicode-regex { chrome < 50 }
  transform-spread { chrome < 46 }
  transform-destructuring { chrome < 51 }
  transform-block-scoping { chrome < 49 }
  transform-new-target { chrome < 46 }
  transform-regenerator { chrome < 50 }
  proposal-export-namespace-from { chrome < 72 }
  transform-modules-commonjs
  proposal-dynamic-import
corejs3: `DEBUG` option

Using targets: {
  "chrome": "45"
}

Using polyfills with `usage-global` method:
regenerator: `DEBUG` option

Using targets: {
  "chrome": "45"
}

Using polyfills with `usage-global` method:

  When setting `useBuiltIns: 'usage'`, polyfills are automatically imported when needed.
  Please remove the direct import of `core-js` or use `useBuiltIns: 'entry'` instead.

[/Users/zhaixuguang/code/research/babel/a.mjs]
Based on your code and targets, the corejs3 polyfill did not add any polyfill.

[/Users/zhaixuguang/code/research/babel/a.mjs]
Based on your code and targets, the regenerator polyfill did not add any polyfill.
```

用到了哪些插件一目了然，开发时可以开启这个配置项。

## 从注入到抽离
preset-env 会在使用到新特性的地方注入 helper 到 AST 中，并且会引入用到的特性的 polyfill （corejs + regenerator），这样会导致两个问题：

+ 重复注入 helper 的实现，导致代码冗余
+ polyfill 污染全局环境

解决这两个问题的思路就是抽离出来，然后作为模块引入，这样多个模块复用同一份代码就不会冗余了，而且 polyfill 是模块化引入的也不会污染全局环境。

这个逻辑是在 @babel/plugin-transform-runtime 包里实现的。它可以把直接注入全局的方式改成模块化引入。

preset-env 的时候是全局引入的, 当引入 @babel/plugin-transform-runtime 就可以模块化引入, 这样就不再污染全局环境了

## babel7 的问题
`@babel/plugin-transform-runtime`无法实现`targets`，会导致环境已经支持的特性，重复导入。

因为 babel 中插件的应用顺序是：先 plugin 再 preset，plugin 从左到右，preset 从右到左，这样 plugin-transform-runtime 是在 preset-env 前面的。等 @babel/plugin-transform-runtime 转完了之后，再交给 preset-env 这时候已经做了无用的转换了。而 @babel/plugin-transform-runtime 并不支持 targets 的配置，就会做一些多余的转换和 polyfill。

这个问题在 babel8 中得到了解决。

