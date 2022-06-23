# @babel/parser

`parser` 的功能是把源码转成 AST，支持各种语法的 parse。

**babel 的 parser 并不是从零自己实现的，而是基于 acron 做了扩展。**

babel 实现了 jsx、typescript、flow 等语法插件的扩展，并且修改了一些 AST，比如 Literal 扩展为了 StringLitreal、NumericLiteral 等。
本文不做源码分析，太复杂！