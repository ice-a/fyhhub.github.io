# loader原理

## 你不知道的loader配置

想要使用某个Loader，我们必须要配置好rule规则，常见的配置方法可能是这样的：
```js
{
  rules: [
    {
      test: /\.js/,
      use: [
        {
          loader: 'babel-loader',
          options: {
            // ...
          }
        }
      ]
    }
  ]
}
```

但是还有一些参数，大家可能很少用到过, 配置方法如下

::: details 所有配置
```js
<condition>: /regExp/
<condition>: function(arg) {}
<condition>: "starting"
<condition>: [<condition>] // or
<condition>: { and: [<condition>] }
<condition>: { or: [<condition>] }
<condition>: { not: [<condition>] }
<condition>: { test: <condition>, include: <condition>, exclude: <condition> }


<rule>: {
	resource: {
		test: <condition>,
		include: <condition>,
		exclude: <condition>,
	},
	resource: <condition>, -> resource.test
	test: <condition>, -> resource.test
	include: <condition>, -> resource.include
	exclude: <condition>, -> resource.exclude
	resourceQuery: <condition>,
  enforce: 'pre'
	compiler: <condition>,
	issuer: <condition>,
	use: "loader", -> use[0].loader
	loader: <>, -> use[0].loader
	loaders: <>, -> use
	options: {}, -> use[0].options,
	query: {}, -> options
	parser: {},
	use: [
		"loader" -> use[x].loader
	],
	use: [
		{
			loader: "loader",
			options: {}
		}
	],
	rules: [
		<rule>
	],
	oneOf: [
		<rule>
	]
}


webpack规范化后：

{
	resource: function(),
	resourceQuery: function(),
	compiler: function(),
	issuer: function(), // 引用了当前模块的模块路径
	use: [
		{
			loader: string,
			options: string,
			<any>: <any>
		}
	],
	rules: [<rule>],
	oneOf: [<rule>],
	<any>: <any>,
}
```
:::

上面有一些"没怎么见过的"属性需要解释一下

+ **\<condition\> 包含正则、方法、字符串等类型，用来匹配文件, 注意这里这么写只是用来代表类型的，没有实际用途**
  ```js
  <condition>: /regExp/
  <condition>: function(arg) {}
  <condition>: "starting"
  <condition>: [<condition>] // or
  <condition>: { and: [<condition>] }
  <condition>: { or: [<condition>] }
  <condition>: { not: [<condition>] }
  <condition>: { test: <condition>, include: <condition>, exclude: <condition> }
  ```

+ **resource: 匹配需要被loader编译的文件**

  ```js
  // 第一种写法
  resource: {
		test: <condition>,
		include: <condition>,
		exclude: <condition>,
	},

  // 第二种，相当于test
	resource: <condition>, -> resource.test

  // 第三种
	test: <condition>, -> resource.test
	include: <condition>, -> resource.include
	exclude: <condition>, -> resource.exclude
  ```


+ **resourceQuery: 用来匹配文件的参数**

  举个例子，想必大家都见过这样的路径吧
  ```js
  import { render, staticRenderFns } from "./app.vue?vue&type=template&id=5ef48958&scoped=true&"
  ```
  后面会有这么一段参数`?vue&type=template&id=5ef48958&scoped=true&`, 这其实是vue-loader会用的一些参数，
  **注意：如果使用了resourceQuery，文件路径上必须有参数！如果没有就不会匹配该loader**

+ **oneOf：配置会有多个loader, 但是只要匹配到一个loader，就不会继续匹配**
  ```js
  {
    oneOf: [
      {
        test: /\.js/,
        loader: 'babel-loader'
      },
      {
        test: /\.js/,
        loader: 'ts-loader' // 只会用到ts-loader
      }
    ]
  }
  ```
+ **enforce: 指定loader的执行顺序**
  ```js
  {
    // 不传默认为 normal loader
    enforce: 'pre' // or post
  }
  ```

## inline loader
什么是`inline loader`呢？简单来说，就是我们能在文件路径前面添加一些`loader`信息，不需要在配置文件配置，就可以让loader进行处理。

可以在 import 语句或任何 与 "import" 方法同等的引用方式 中指定 loader。使用 ! 将资源中的 loader 分开。每个部分都会**相对于当前目录**解析。

```js
import Styles from 'style-loader!css-loader?modules!./styles.css';
```

通过为内联 import 语句添加前缀，可以覆盖 配置 中的所有 loader, preLoader 和 postLoader：

+ 使用 ! 前缀，将禁用所有已配置的 **normal loader(普通 loader)**
  ```js
  import Styles from '!style-loader!css-loader?modules!./styles.css';
  ```

+ 使用 !! 前缀，将禁用所有已配置的 **loader（preLoader, loader, postLoader）**
  ```js
  import Styles from '!!style-loader!css-loader?modules!./styles.css';
  ```

+ 使用 -! 前缀，将禁用所有已配置的 **preLoader 和 loader，但是不禁用 postLoaders**
  ```js
  import Styles from '-!style-loader!css-loader?modules!./styles.css';
  ```

看到上面一些loader类型可能会比较疑惑，大家继续往后看


## loader的类型和执行顺序
我们常用的`loader`其实都可以称作`normal loader`，在webpack中其实loader有两种类型，分别为`pitch loader`和`normal loader`
他们都会有以下4种执行顺序。

+ **post**: enforce配置post
+ **inline**: 内联loader，下面会讲到
+ **normal**：默认的类型
+ **pre**: enforce配置pre

通过配置`enforce`可以设置我们loader的执行顺序执行顺序是这样的: 

+ **pitch loader** 执行顺序：**post -> inline -> normal -> pre**

+ **nomal loader** 执行顺序：**pre -> normal -> inline -> post**

从上面可以看出来，`inline loader`是在`normal loader`后面执行的。
那什么又是`pitch loader`呢.


## pitch loader
如何写一个pitch loader
```js
function loader(source) {

}

loader.pitch = function() {
  //
}

module.export = loader
```

我们知道`loader`是从后往前执行的，而 `pitch loader`刚好反着来，从前往后执行，但是只要`pitch loader`有返回值就不会继续后面loader的执行。流程大致如下

![loader](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1686bed630924ec7868acf4dcaae3db3~tplv-k3u1fbpfcp-watermark.awebp)



## 参考
[多图详解，一次性搞懂Webpack Loader](https://juejin.cn/post/6992754161221632030)