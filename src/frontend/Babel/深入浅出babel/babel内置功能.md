# babel内置功能
babel最开始的名字叫 6to5, 意思是做es6 到 es5的`语法转换`和`api转换`, 在后面的4.0改名为babel。那么babel是如何实现这两种转换呢？

## babel插件的标准
babel对于代码的转换，大致可以分为两种，`语法转换`和`api转换`。

通过`syntax transform`和`api polyfill`, 我们就能把高版本的js语法和api转为低版本。

例如我们使用`async, await`语法，其实是一种语法糖，又或者`...{}` 解构也是一种语法。

而像`new Array(10).fill(0)`，或者`[].includes`等js高版本语法，就需要`polyfill`进行实现。

### es spec

我们知道，`TC39` 是制定 ` 语言标准`的组织，每年都会公布加入到语言标准的特性，es2015、es2016、es2017 等。这些是我们要转换的语言特性范围。
javascript
在`babel6`的时候，我们想要支持es2016, 就需要安装`preset-es2016`, 想使用es2015， 就需要安装`preset-es2015`
在`babel7`时，想要支持不同标准的语法或api, 我们只需要安装`preset-env`

### proposal (提议)
我们可以回想到，在babel6的时期我们经常会看到，有如下配置
```js
{
  "presets": ["@babel/preset-stage-0"]
}
```
其实这是为了实现不同阶段语言特性，语言特性从提出到标准会经过几个过程。

+ stage 0 - Strawman: 只是一个想法，可能用 babel plugin 实现

  ```js
  // stage-0 囊括了 1,2,3 的所有插件，另外再添加了
  transform-do-expressions
  transform-function-bind
  ```
+ stage 1 - Proposal: 值得继续的建议

  ```js
  // stage-1 则是囊括了 2 和 3 插件，另外增加了
  transform-class-constructor-call (Deprecated)
  transform-export-extensions
  ```
+ stage 2 - Draft: 建立 spec
  ```js
  // 同理，他拥有 3 的插件，还有
  syntax-dynamic-import
  transform-class-properties
  ```
+ stage 3 - Candidate: 完成 spec 并且在浏览器实现
  ```js
  // 拥有的插件
  transform-object-rest-spread
  transform-async-generator-functions
  ```
+ stage 4 - Finished: 会加入到下一年的 es20xx spec

还没有加入到标准的语言特性，会被babel实现的，例如`可选链`，安装`@babel/plugin-proposal-optional-chaining`插件。

我们发现插件是以`@babel/plugin-proposal`开头。babel6 的时候有 babel-stage-x 的 preset，分别放不同阶段的特性，但是这个preset是变化的（每年都在变），比较难以维护，所以 babel7 以后就改成 plugin-proposal-xxx 了。

![image.png](http://tva1.sinaimg.cn/large/006vSZ9Ugy1gy304ufppjj30c30a3abn.jpg)


### react、flow、typescript
只是转换 javascript 本身的 es spec 和 proposal 的特性特性并不够，现在我们开发的时候 jsx、typescript、flow 这些都是会用的，babel 肯定也得支持。

这些转换对应的 plugin 分别放在不同 preset 里： `preset-jsx、preset-typescript、preset-flow`


## 插件分类
插件可以分为 `syntax`, `transform`, `proposal`

### syntax plugin
syntax plugin 只是在 parserOptions 中放入一个 flag 让 parser 知道要 parse 什么语法，最终的 parse 逻辑还是 `babel parser（babylon）` 实现的。

一般 syntax plugin 都是这样的：
```js
import { declare } from "@babel/helper-plugin-utils";
export default declare(api => {
  api.assertVersion(7);

  return {
    name: "syntax-function-bind",

    manipulateOptions(opts, parserOpts) {
      parserOpts.plugins.push("functionBind");
    },
  };
});

```

`@bable/preset-env` 中的语法插件：

![image.png](http://tva1.sinaimg.cn/large/006vSZ9Ugy1gy30amok5xj30av09rabe.jpg)

### transform plugin
这种类型的插件，会转换ast，实现各种语言特性。但有时候需要`syntax plugin` 和 `transform plugin`一起使用。

例如我们想使用ts语法，那就需要`@babel/plugin-syntax-typescript` 在parseOption中增加`typescript`。
然后使用`@babel/plugin-transform-typescript` 对 typescript的ast做进一步的解析和转换。但是我们一般不会直接用这个插件。
而是使用`@babel/preset-typescript`。

![image.png](http://tva1.sinaimg.cn/large/006vSZ9Ugy1gy31tdqu0gj30be0gk0v4.jpg)

### proposal plugin
未加入语言标准的特性的 AST 转换插件叫 proposal plugin，其实他也是 transform plugin，但是为了和标准特性区分，所以这样叫。


总结一下:

**babel 的 plugin，包含 @babel/plugin-syntax-xxx, @babel/plugin-transform-xxx、@babel/plugin-proposal-xxx 3种。**


## helper
每个特性的实现用一个 babel 插件实现，当 babel 插件多了，自然会有一些共同的逻辑。这部分逻辑怎么共享呢？

babel 设计了插件之间共享逻辑的机制，就是 helper

helper 分为两种：
+ 一种是注入到 AST 的运行时用的全局函数, 对应`@babel/helpers`
![image.png](http://tva1.sinaimg.cn/large/006vSZ9Ugy1gy3236v5npj30c706cq3a.jpg)

+ 一种是操作 AST 的工具函数，比如变量提升这种通用逻辑, 对应如下npm包
![image.png](http://tva1.sinaimg.cn/large/006vSZ9Ugy1gy3240hrk1j30bs0dz40f.jpg)


### AST 运行时注入

什么叫做`AST`运行时呢？其实就是babel 的transform阶段，在遍历ast过程中，我们动态注入代码的AST节点。

例如我们在代码里面写class语法
```js
class Demo {}
```
经过ast注入，会被转换成

```js
function _classCallCheck(instance, Constructor) {
  //...
}

var Guang = function Guang() {
  _classCallCheck(this, Guang);
};
```
这里的`_classCallCheck`其实就是`helper`, 会被声明在代码作用域顶层。

这类 helper 数量比较多，babel7 有 80 多个，在插件里使用的话，直接调用 this.addHelper，会在顶层作用域声明对应的 helper，然后返回对应的 identifier。
```js
var transformObjectSetPrototypeOfToAssign = declare(function (api) {
    api.assertVersion(7);
    return {
      name: "transform-object-set-prototype-of-to-assign",
      visitor: {
        CallExpression: function CallExpression(path) {
          if (path.get("callee").matchesPattern("Object.setPrototypeOf")) {
            path.node.callee = this.addHelper("defaults");
          }
        }
      }
    };
});

```

你可能会发现这些函数在 `babel runtime` 里面也有同样的一份，没错，确实是一样的代码放在了两个位置。为什么会这样呢？ 因为一个是在编译期间注入到 AST 的，而另一个是在运行时 require 的，所以虽然都是转换用的工具函数，但要写两份。（后者是通过 `@babel/plugin-transform-runtime` 转换之后在运行时引入的）

### 操作 AST 的工具函数
```js
const importModule = require('@babel/helper-module-imports');

cosnt plugin = function ({ template }) {
    visitor: {
        Program(path) {
            const reactIdentifier = importModule.addDefault(path, 'lodash',{
                nameHint: '_'
            });
            path.node.body.push(template.ast(`const get = _.get`));
        }
    }
}
```
会在代码中加入模块引入和变量声明的代码

```js
var _ = _interopRequireDefault(require("lodash")).default;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const get = _.get;
```
我们借助 @babel/helper-module-imports 可以很轻松的引入一个模块，通过 named import、default import 或者 namespace import 的方式。

**小结：babel helpers 是用于 babel plugin 逻辑复用的一些工具函数，分为用于注入 runtime 代码的 helper 和用于简化 AST 操作 的 helper两种。第一种都在 @babel/helpers 包里，直接 this.addHelper(name) 就可以引入， 而第二种需要手动引入包和调用 api。**


## babel-runtime
`babel runtime` 里面放运行时加载的模块，会被打包工具打包到产物中，下面放着各种需要在 runtime 使用的函数，包括三部分：regenerator、corejs、helper。

+ corejs 这就是新的 api 的 polyfill，分为 2 和 3 两个版本，3 才实现了实例方法的polyfill
+ regenerator 是 facebook 实现的 aync 的 runtime 库，babel 使用 regenerator-runtime来支持实现 async await 的支持。
+ helper 是 babel 做语法转换时用到的函数，比如 _typeof、_extends 等

babel 做语法转换和 api 的 polyfill，需要自己实现一部分 runtime 的函数，就是 helper 部分，有的也没有自己实现，用的第三方的，比如 regenerator 是用的 facebook 的。api 的 polyfill 也是用的 core-js 的，babel 对它们做了整合。