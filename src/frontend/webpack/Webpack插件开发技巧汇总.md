# Webpack插件开发技巧汇总



## 一、AST操作

### 1. 获取import或require依赖

```js
compiler.hooks.normalModuleFactory.tap('demo', (normalModuleFactory) => {
  normalModuleFactory.hooks.parser.for('javascript/auto').tap('demo', (parser) => {
    parser.hooks.import.tap('demo', (statement, source) => {
      // statement: ImportDeclaration节点
      // source 引用的模块
    })
    parser.hooks.call.for('require').tap('demo', (statement) => {
      // statement: CallExpression 调用表达式节点
    })
  })
})
```


## 二、模块

### 1. 自定义模块工厂

注意：**factorize钩子是webpack5新增的**

```js
normalModuleFactory.hooks.factorize.tapAsync('AutoExternalPlugin', (resolveData, callback) => {
  const { request } = resolveData
  // 当请求的模块是jquery  使用ExternalModule 创建模块
  if (request === 'jquery') {
    callback(null, new ExternalModule('$', 'window', 'jquery'))
  } else {
    callback(null)
  }
})
```
最后生成如下代码
```js
{
"jquery": ((module) => {
    "use strict";
    module.exports = window["$"];
  })
}

```

### 2. 获取三方模块的package.json内容

```js
compiler.hooks.compilation.tap(
  "demo",
  (compilation, { normalModuleFactory }) => {
    normalModuleFactory.hooks.module.tap(
      "demo",
      (module, data) => {
        const resolveData = data.resourceResolveData;
        if (
          resolveData &&
          resolveData.descriptionFileData
        ) {
          const pkg = resolveData.descriptionFileData;
          // 获取到package.json内容
        }
        return module;
      }
    );
  }
)
```



## 三、index.html操作

### 1. 插入标签

`htmlData`包含`assetTags`可自定义最终要生成的脚本或css文件

```js
compiler.hooks.compilation.tap('demo', (compilation) => {
  HtmlWebpackPlugin.getHooks(compilation).alterAssetTags.tap(
    'demo',
    (htmlData) => {
      // assetTags: { scripts: [], styles: [], meta: [] }
      const assetTags = htmlData.assetTags;
      return htmlData;
    }
  );
});
```
`assetTags`结构如下

```js
assetTags: {
  scripts: [
    {
      tagName: 'script',
      voidTag: false,
      meta: { plugin: 'html-webpack-plugin' },
      attributes: { defer: true, type: undefined, src: 'main.js' }
    }
  ],
  styles: [],
  meta: []
}
```


### 2. 生成资源标签前的回调

```js
compiler.hooks.compilation.tap('PreloadWebpackPlugin', (compilation) => {
  // 在准备生成资源标签之前执行
  HtmlWebpackPlugin.getHooks(compilation).beforeAssetTagGeneration.tapAsync('demo', (htmlData, callback) => {
    // 正常callback就好
    callback()
  })
})
```