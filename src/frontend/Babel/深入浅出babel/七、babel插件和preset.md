# 七、babel插件和preset

## 1. plugin

### plugin使用

babel插件有三种注册方式，当使用数组形式时，第二个参数是插件的配置参数

```json
{
  "plugins": ["pluginA", ["pluginB"], ["pluginC", {/* options */}]]
}
```

### plugin的写法

:::: tabs

::: tab 第一种
第一种，可以是一个函数

```js
export default function(api, options, dirname) {
  return {
    inherits: parentPlugin,
    manipulateOptions(options, parserOptions) {
        options.xxx = '';
    },
    pre(file) {
      this.cache = new Map();
    },
    visitor: {
      StringLiteral(path, state) {
        this.cache.set(path.node.value, 1);
      }
    },
    post(file) {
      console.log(this.cache);
    }
  };
}
```
:::

::: tab 第二种

第二种，可以直接返回一个对象

```js
export default plugin =  {
    pre(state) {
      this.cache = new Map();
    },
    visitor: {
      StringLiteral(path, state) {
        this.cache.set(path.node.value, 1);
      }
    },
    post(state) {
      console.log(this.cache);
    }
};
```

:::

::: tab 第三种

第三种，使用`@babel/helper-plugin-utils`中的`declare`注册插件

```js
const { declare } = require('@babel/helper-plugin-utils')
module.exports = declare(() => {
  return {
    inherits: parentPlugin,
    manipulateOptions(options, parserOptions) {
        options.xxx = '';
    },
    pre(file) {
      this.cache = new Map();
    },
    visitor: {
      StringLiteral(path, state) {
        this.cache.set(path.node.value, 1);
      }
    },
    post(file) {
      console.log(this.cache);
    }
  };
})
```
:::

::::


**参数**:

+ `api`: 包含了各种 babel 的 api，比如 types、template 等，这些包就不用在插件里单独单独引入了，直接取来用就行。
+ `options`: babel插件传入的参数配置
+ `dirname`: 目录名

**返回对象**：
+ `inherits`：指定继承某个插件，和当前插件的 options 合并，通过 Object.assign 的方式
+ `visitor`：指定 traverse 时调用的函数
+ `pre 和 post`： 分别在遍历前后调用，可以做一些插件调用前后的逻辑，比如可以往 file（表示文件的对象，在插件里面通过 state.file 拿到）中放一些东西，在遍历的过程中取出来
+ `manipulateOptions`: 用于修改 options，是在插件里面修改配置的方式，比如 syntaxt plugin一般都会修改 parser options

## 2. preset
plugin只能实现单个转换功能，当我们需要的功能特别多的时候，preset就起到了批量导入的作用，其实preset就是plugin的一层封装

![image.png](http://tva1.sinaimg.cn/large/006vSZ9Ugy1gy0klqfklij30pk0jrwmi.jpg)

而有了 preset 之后就不再需要知道用到了什么插件，只需要选择合适的 preset

### preset的写法
preset 格式和 plugin 一样，也是可以是一个对象，或者是一个函数，函数的参数也是一样的 api 和 options，区别只是 preset 返回的是配置对象，包含 plugins、presets 等配置。

```js
export default function(api, options) {
  return {
    plugins: ['pluginA'],
    presets: [['presetsB', { options: 'bbb'}]]
  }
}
```
或者直接是一个对象

```js
export default obj = {
  plugins: ['pluginA'],
  presets: [['presetsB', { options: 'bbb'}]]
}
```

### 3. 如何注册插件


#### @babel/core注册

```js
babel.transformSync("code();", {
  plugin: [userPlugin]
});
```

#### .babelrc注册
```json
{
  "plugins": [
    "/user/desktop/plugin.js" // 插件完整路径
  ]
}
```


### 4.插件和preset执行顺序

`插件:` **从前到后**

`preset:` **从后往前**