# 三、babel的AST

## AST 可视化查看工具

[astexplorer.net](https://astexplorer.net/)

## AST 的公共属性

+ `type`: AST 节点的类型
+ `start、end、loc`: start 和 end 代表该节点对应的源码字符串的开始和结束下标，不区分行列。而 loc 属性是一个对象，有 line 和 column 属性分别记录开始和结束行列号。
+ `leadingComments、innerComments、trailingComments`: 表示开始的注释、中间的注释、结尾的注释，因为每个 AST 节点中都可能存在注释，而且可能在开始、中间、结束这三种位置，通过这三个属性来记录和 Comment 的关联。
  - 例如eslint可以检查当前方法是否写了注释，并给一定的提醒

+ `extra`：记录一些额外的信息，用于处理一些特殊情况。比如 StringLiteral 修改 value 只是值的修改，而修改 extra.raw 则可以连同单双引号一起修改。
  - 例如eslint配置了单引号，通过fix，可以把双引号自动改成单引号

## 总结

通过上面的讲解，我们大概了解的`AST`的 基本结构和公共属性，通过后面的`api`学习，我们即将可以编写一些简单的代码转换工具