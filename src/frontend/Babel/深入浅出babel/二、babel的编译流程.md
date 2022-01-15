# 二、babel的编译流程

babel 是 source to source 的转换，整体编译流程分为三步：
+ parse：通过 parser 把源码转成抽象语法树（AST）
+ transform：遍历 AST，调用各种 transform 插件对 AST 进行增删改
+ generate：把转换后的 AST 打印成目标代码，并生成 sourcemap

![image.png](http://tva1.sinaimg.cn/large/006vSZ9Ugy1gxzlhlt63kj31ua0ii78b.jpg)

转成 AST 之后就可以通过修改 AST 的方式来修改代码，这一步会遍历 AST 并进行各种增删改，这一步也是 `babel 最核心的部分`。


## parse

parse 阶段的目的是把源码字符串转换成机器能够理解的 AST，这个过程分为词法分析、语法分析。

例如有这样一段代码
```js
let name = 'babel'
```
首先需要将它分成一个个单词，`let`, `name`, `=`, `'babel'`, 这是词法分析的过程。

之后把这些token，进行递归的组装，生成AST, 这是语法分析的过程。

![image.png](http://tva1.sinaimg.cn/large/006vSZ9Ugy1gxzlp0mj9sj32360pi7b2.jpg)


## transform
transform阶段会对parse阶段产生的ast节点进行增删改查。

## generate
会将ast生成目标代码，并生成`sourcemap`

## 总结
我们简单了解了babel对代码的编译流程，通过了解这个流程，能够为后面babel相关知识的学习打下基础