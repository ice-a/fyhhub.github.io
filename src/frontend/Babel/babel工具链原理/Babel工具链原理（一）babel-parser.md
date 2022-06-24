# Babel工具链原理（一）babel-parser

## 前言

`@babel/parser`作为babel最核心的库，是我们学习babel最重要的一部分，对于后面插件的学习都很有帮助。本文将通过各种示例，帮大家理解babel-laoder在babel工具链中的作用。

## 使用
首先我们先学习下如何使用`@babel/parser`

下面是一个简单用法
```js
require("@babel/parser").parse("code", {
  sourceType: "module",
  plugins: [
    // enable jsx and flow syntax
    "jsx",
    "flow",
  ],
});
```

## 选项配置

|选项|说明|简介|
|---|---|---|
|allowImportExportEverywhere|默认情况下，导入和导出声明只能出现在程序的顶层。如果将此选项设置为true，则可以在允许语句的任何位置使用它们|允许任何地方写import|
|allowAwaitOutsideFunction|默认情况下，仅允许在异步函数内部或在启用topLevelAwait插件时，在模块的顶级范围内使用await，可以将该值设置为true|允许顶层await|
|allowReturnOutsideFunction|默认情况下，函数外的return语句会引发错误。将此设置为true，不会报错|允许函数外面写return|
|allowSuperOutsideMethod|默认情况下，在类和方法之外不允许使用。将此设置为true，不会报错|允许其他地方写super|
|allowUndeclaredExports|默认情况下，导出未在当前模块作用域中声明的标识符将引发错误。设置为true后将不会报错|允许导出一个未声明的变量|
|attachComment|默认情况下，Babel将注释附加到相邻的AST节点。如果此选项设置为false，则不会附加注释。当输入代码有许多注释时，它可以提供高达30%的性能改进@babel/eslint解析器将为您设置它。不建议在Babel transform中使用attachComment:false，因为这样做会删除输出代码中的所有注释|是否保留注释|
|createParenthesizedExpressions|当此选项设置为true时，如果给表达式节点包了一层圆括号，会被保留，如果设置为false，表达式的括号不会保留|是否保留包裹表达式的圆括号|
|errorRecovery|默认情况下，Babel在发现一些无效代码时总是抛出错误。当此选项设置为true时，它将存储解析错误并尝试继续解析无效的输入文件。生成的AST将具有一个errors属性，表示所有解析错误的数组。请注意，即使启用此选项，@babel/parser也可能抛出不可恢复的错误|是否出现错误后，不停止解析|
|plugins|包含要启用的插件的数组|插件数组|
|sourceType|指示应在其中解析代码的模式。可以是“script”、“module”或“unambiguous”之一。默认为“script”。“unambiguous”将使@babel/parser根据ES6导入或导出语句的存在尝试猜测。带有ES6导入和导出的文件被视为“module”，否则为“script”。|解析代码模式，推荐unambiguous|
|sourceFilename|将输出AST节点与其源文件名关联。从多个输入文件的AST生成代码和源映射时非常有用|ast节点携带当前解析的文件名称|
|startColumn|默认情况下，解析的代码被视为从第1行第0列开始。您可以提供一个列编号，以供选择。用于与其他源工具集成。|可以选择从哪一列开始解析|
|startLine|默认情况下，解析的代码被视为从第1行第0列开始。您可以提供一个行号，以供选择。用于与其他源工具集成。|可以选择从哪一行开始解析|
|strictMode|默认情况下，ECMAScript代码仅在“use strict”时解析为strict；指令存在，或者如果解析的文件是ECMAScript模块。将此选项设置为true以始终在严格模式下解析文件|解析的文件都会加上use strict|
|ranges|向每个节点添加范围属性：[node.start，node.end]|给ast节点添加range|
|tokens|将所有已解析的令牌添加到文件节点上的令牌属性|为File Ast节点上的tokens属性，添加所有token|


其中，大家注意一下`plugins`这个属性配置，babel语法插件很多都通过这个字段实现。




## babel是如何支持不同语法的？

首先我们有如下代码, 我们写了一段`typescript语法`, 并用parser编译

```js
const parser = require('@babel/parser')

const ast = parser.parse(`
  const a: number = 1
`, {
  plugins: []
})
f
console.log(ast);
```

但是结果并不是我们想要的那样，而是报了语法错误

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/341db69269124e038ecfddc2c81ea560~tplv-k3u1fbpfcp-watermark.image?)

然后我们再加一个配置

```js
const parser = require('@babel/parser')

const ast = parser.parse(`
  const a: number = 1
`, {
  plugins: ['typescript']
})

console.log(ast);
```

发现可以正常打印结果了

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8c5fe0e0bb214ed1956ca9b8b6f5281e~tplv-k3u1fbpfcp-watermark.image?)

**其实`@babel/parser`在支持不同语法时，需要我们手动添加`plugins`来进行支持，但是我们开发项目并不会去添加各种语法插件，那babel是如何帮我们添加的呢？**

我们打开`node_modules/@babel目录`,可以发现里面有一部分插件是这样的


![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/20c21fb73df644cf91b32cbc909a439d~tplv-k3u1fbpfcp-watermark.image?)


我们打开`plugin-syntax-top-level-await`，看下源码实现


![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1f8d5ced6f6f464690b7bbe123e3a5f5~tplv-k3u1fbpfcp-watermark.image?)


源码实现非常简单，只是在parser选项添加了一个`topLevelAwait`,用于开启`top-level-await`。



然后~

我们再来安装下`@babel/preset-typescript`, 发现它竟然帮助我们安装了一个`plugin-syntax-typescript`插件


![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/43104f7560004b9d8a0b8dcaee304fff~tplv-k3u1fbpfcp-watermark.image?)



![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ab3bde681d5941bdb59dba63ebb95124~tplv-k3u1fbpfcp-watermark.image?)

源码一样非常简单，还贴心的帮我们支持了jsx和flow~


## 总结



+ `@babel/parser`基于acron做了进一步扩展，实现了很多语法
+ `@babel/parser`提供了语法支持
+ `plugin-syntax-xxx` 语法插件增加了`@babel/parser`的`plugins`配置