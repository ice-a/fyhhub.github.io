# 深入浅出Vite阅读笔记

## Vite的优势

1. 模块化方面：不需要考虑各种模块规范，都统一转成ESM
2. 模块编译方面：webpack冷启动需要递归打包依赖树，vite基于浏览器esm，能做到按需加载和编译。
3. 基于ESBuild：提前将三方模块打包编译，并且天然支持TSX/JSX的编译
4. 基于Rollup的插件机制：vite基于rollup的插件机制，扩展性更强，能直接复用rollup的各种插件


**利用浏览器原生 ES 模块的支持，实现开发阶段的 Dev Server，进行模块的按需加载，而不是先整体打包再进行加载。相比 Webpack 这种必须打包再加载的传统构建模式，Vite 在开发阶段省略了繁琐且耗时的打包过程，这也是它为什么快的一个重要原因。**

**一个import对应一个请求**



## 为什么Vite打包前要执行tsc

**这里的作用主要是用来做类型检查**

```json
{
  "compilerOptions": {
    // 省略其他配置
    // 1. noEmit 表示只做类型检查，而不会输出产物文件
    // 2. 这行配置与 tsc --noEmit 命令等效
    "noEmit": true,
  },
}
```


## 配置预处理器

```js
pnpm i sass -D
```

```js
// vite.config.ts
import { normalizePath } from 'vite';
// 如果类型报错，需要安装 @types/node: pnpm i @types/node -D
import path from 'path';

// 全局 scss 文件的路径
// 用 normalizePath 解决 window 下的路径问题
const variablePath = normalizePath(path.resolve('./src/variable.scss'));


export default defineConfig({
  // css 相关的配置
  css: {
    preprocessorOptions: {
      scss: {
        // additionalData 的内容会在每个 scss 文件的开头自动注入
        additionalData: `@import "${variablePath}";`
      }
    }
  }
```

## 配置CSS Module
```js
// vite.config.ts
export default {
  css: {
    modules: {
      // 一般我们可以通过 generateScopedName 属性来对生成的类名进行自定义
      // 其中，name 表示当前文件名，local 表示类名
      generateScopedName: "[name]__[local]___[hash:base64:5]"
    },
    preprocessorOptions: {
      // 省略预处理器配置
    }

  }
}
```


## 配置postcss
```js
pnpm i autoprefixer -D
```

```js
// vite.config.ts 增加如下的配置
import autoprefixer from 'autoprefixer';

export default {
  css: {
    // 进行 PostCSS 配置
    postcss: {
      plugins: [
        autoprefixer({
          // 指定目标浏览器
          overrideBrowserslist: ['Chrome > 40', 'ff > 31', 'ie 11']
        })
      ]
    }
  }
}
```


## CSS 原子化框架

### 1. Windi CSS 接入

```
pnpm i windicss vite-plugin-windicss -D
```

```js
// vite.config.ts
import windi from "vite-plugin-windicss";

export default {
  plugins: [
    // 省略其它插件
    windi()
  ]
}


// main.tsx
// 用来注入 Windi CSS 所需的样式，一定要加上！
import "virtual:windi.css";
```


### 2. Tailwind CSS

```js
pnpm install -D tailwindcss postcss autoprefixer
```

```js
// tailwind.config.js
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

// postcss.config.js
// 从中你可以看到，Tailwind CSS 的编译能力是通过 PostCSS 插件实现的
// 而 Vite 本身内置了 PostCSS，因此可以通过 PostCSS 配置接入 Tailwind CSS 
// 注意: Vite 配置文件中如果有 PostCSS 配置的情况下会覆盖掉 post.config.js 的内容!
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```
接着在项目的入口 CSS 中引入必要的样板代码:
```less
@tailwind base;
@tailwind components;
@tailwind utilities;
```