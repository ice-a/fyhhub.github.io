# 五、parser的历史

前面我们学习了 babel 的 parser 和 AST，babel 的 parser 是基于 acorn 扩展而来的，而 acorn 也不是最早的 js parser，js parser 的历史是怎样的？ 各种 parser 之间的关系是什么样的呢？这节我们来梳理一下。

## JS parser的历史

### SpiderMonkey 和 estree 标准
在 nodejs 出现之后，前端可以用 nodejs 来做一些工程化的事情，也就有了对 js parser 的需求，当时 Mozilla 在 MDN 上公布了 SpiderMonkey（c++ 写的 js 引擎）的 parser api 和 AST 标准，所以当时最早的 JS parser ---- esprima 就是基于 SpiderMonkey 的 AST 标准来实现的，后来形成了 estree 标准。 当时很多的前端领域的工具都基于 esprima。

但是到了 2015 年之后，es 标准一年一个版本，而 esprima 的更新速度跟不上，它跟不上也就导致了依赖它的一系列工具都跟不上，所以 eslint 就 fork 了一份 esprima，做了一些扩展，来自己实现新语法的 parse，这就是 espree，它依然是 estree 标准的。

但是到了 2015 年之后，es 标准一年一个版本，而 esprima 的更新速度跟不上，它跟不上也就导致了依赖它的一系列工具都跟不上，所以 eslint 就 fork 了一份 esprima，做了一些扩展，来自己实现新语法的 parse，这就是 espree，它依然是 estree 标准的。

### acorn

后面出现了 acorn，也是 estree 标准的实现，但是他的速度比 esprima 快，而且支持插件，可以通过插件扩展语法支持。正是速度快加上支持插件让很多工具都转而使用 acorn。

eslint 的 parser ---- espree 本来是 fork 自 esprima，但后来 espree 2.0 基于 acorn 重新实现了，也使用 acorn 的插件机制来扩展语法。

babel parser(babylon) 也是基于 acorn，并且对 AST 节点和属性都做了扩展，也提供了一些支持 typescript、jsx、flow 的插件（就是我们可以在 @babel/parser 的 plugins 里面指定的那些）。