# 四、babel的api

我们知道 babel 的编译流程分为三步：`parse、transform、generate`，每一步都暴露了一些 api 出来。

+ `parse 阶段`有@babel/parser，功能是把源码转成 AST

+ `transform 阶段`有 @babel/traverse，可以遍历 AST，并调用 visitor 函数修改 AST，修改 AST 自然涉及到 AST 的判断、创建、修改等，这时候就需要 @babel/types 了，当需要批量创建 AST 的时候可以使用 @babel/template 来简化 AST 创建逻辑。

+ `generate 阶段`会把 AST 打印为目标代码字符串，同时生成 sourcemap，需要 @babel/generate 包

+ 中途遇到错误想打印代码位置的时候，使用 `@babel/code-frame` 包

+ babel 的整体功能通过 `@babel/core` 提供，基于上面的包完成 babel 整体的编译流程，并实现插件功能。

我们主要学习的就是 @babel/parser，@babel/traverse，@babel/generator，@babel/types，@babel/template 这五个包的 api 的使用。

## [@babel/parser](https://www.babeljs.cn/docs/babel-parser)

### 示例
```js
require("@babel/parser").parse("code", {
  // parse in strict mode and allow module declarations
  sourceType: "module",

  plugins: [
    // enable jsx and flow syntax
    "jsx",
    "flow",
  ],
});
```


### API

`babelParser.parse(code, [options])`

`babelParser.parseExpression(code, [options])`

### Options
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


## [@babel/traverse](https://www.babeljs.cn/docs/babel-traverse)

### 示例
```js
import * as parser from "@babel/parser";
import traverse from "@babel/traverse";

const code = `function square(n) {
  return n * n;
}`;

const ast = parser.parse(code);

traverse(ast, {
  enter(path) {
    if (path.isIdentifier({ name: "n" })) {
      path.node.name = "x";
    }
  },
});
```

```js
traverse(ast, {
  FunctionDeclaration: function(path) {
    path.node.id.name = "x";
  },
});
```


path 是遍历过程中的路径，会保留上下文信息，有很多属性和方法，这些属性和方法是获取当前节点以及它的关联节点的

+ `path.node` 指向当前 AST 节点
+ `path.get、path.set` 获取和设置当前节点属性的 path
+ `path.parent` 指向父级 AST 节点
+ `path.getSibling、path.getNextSibling、path.getPrevSibling` 获取兄弟节点
+ `path.find` 从当前节点向上查找节点

这个属性可以获取作用域的信息

+ `path.scope` 获取当前节点的作用域信息

isXxx、assertXxx 系列方法可以用于判断 AST 类型

+ `path.isXxx` 判断当前节点是不是 xx 类型
+ `path.assertXxx` 判断当前节点是不是 xx 类型，不是则抛出异常

这些方法可以对 AST 进行增删改
+ `path.insertBefore、path.insertAfter` 插入节点
+ `path.replaceWith、path.replaceWithMultiple、replaceWithSourceString` 替换节点
+ `path.remove` 删除节点

这俩方法可以跳过一些遍历
+ `path.skip` 跳过当前节点的子节点的遍历
+ `path.stop` 结束后续遍历

## [@babel/generator](https://www.babeljs.cn/docs/babel-generator)

### 示例
```js
import { parse } from "@babel/parser";
import generate from "@babel/generator";

const code = "class Example {}";
const ast = parse(code);

const output = generate(
  ast,
  {
    /* options */
  },
  code
);
```


### Options
|选项|说明|
|---|---|
|auxiliaryCommentAfter|添加注释到生成代码的最后|
|auxiliaryCommentBefore|添加注释到生成代码的最前|
|comments|生成的代码是否包含注释|
|compact|生成的代码是否包含多于的空格|
|concise|设置为true可减少空白（但不如opts.compact）|
|decoratorsBeforeExport|decoratorsBeforeExport为false， `export @decorator class Bar {}`, decoratorsBeforeExport为true,<br/>`@decorator`<br/>`export class Foo {}`|
|filename|用于警告消息中|
|minified|是否压缩|
|retainFunctionParens|保留函数表达式周围的参数（可用于更改引擎解析行为）|
|retainLines|尝试在输出代码中使用与源代码中相同的行号（有助于保留堆栈跟踪）|
|shouldPrintComment|是一个函数，参数可以接收注释内容，如果函数返回true，就会保留注释，否则删除，类似comments选项|
|sourceMaps|是否生成sourceMap|
|sourceRoot|设置sourcemap url相对根路径|

## [@babel/types](https://www.babeljs.cn/docs/babel-types)

遍历 AST 的过程中需要创建一些 AST 和判断 AST 的类型，这时候就需要 @babel/types 包。

举例来说，如果要创建IfStatement就可以调用
```js
t.ifStatement(test, consequent, alternate);
```

## [@babel/template](https://www.babeljs.cn/docs/babel-template)

通过 `@babel/types` 创建 AST 还是比较麻烦的，要一个个的创建然后组装，如果 AST 节点比较多的话需要写很多代码，这时候就可以使用 `@babel/template` 包来批量创建。

```js
const ast = template(code, [opts])(args);
const ast = template.ast(code, [opts]);
const ast = template.program(code, [opts]);
```

## [@babel/code-frame](https://www.babeljs.cn/docs/babel-code-frame)


### 示例

```js
import { codeFrameColumns } from "@babel/code-frame";

const rawLines = `class Foo {
  constructor()
}`;
const location = { start: { line: 2, column: 16 } };

const result = codeFrameColumns(rawLines, location, {
  /* options */
});

console.log(result);
```

```shell
  1 | class Foo {
> 2 |   constructor()
    |                ^
  3 | }
```

## [@babel/core](https://www.babeljs.cn/docs/babel-core)
前面的包是完成某一部分的功能的，而 `@babel/core` 包则是基于它们完成整个编译流程，从源码到目标代码，生成 `sourcemap`。

```js
transformSync(code, options); // => { code, map, ast }
transformFileSync(filename, options); // => { code, map, ast }
transformFromAstSync(
  parsedAst,
  sourceCode,
  options
); // => { code, map, ast }
```

注意：`transformXxx` 的 api，已经被标记为过时了，后续会删掉，不建议用，直接用 `transformXxxSync 和 transformXxxAsync`。

@babel/core 包还有一个 `createConfigItem` 的 api，用于 plugin 和 preset 的封装。