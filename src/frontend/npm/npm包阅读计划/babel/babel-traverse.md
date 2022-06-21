# @babel/traverse

本文基于babel插件通关秘籍实现`@babel/traverse`


[源码位置](https://github.com/QuarkGluonPlasma/babel-plugin-exercize/tree/master/exercize-babel/src/traverse)

## 一、维护可遍历的数据

```js
const astDefinationsMap = new Map();

astDefinationsMap.set('Program', {
    visitor: ['body']
});
astDefinationsMap.set('VariableDeclaration', {
    visitor: ['declarations']
});
astDefinationsMap.set('VariableDeclarator', {
    visitor: ['id', 'init']
});
astDefinationsMap.set('Identifier', {});
astDefinationsMap.set('NumericLiteral', {});
astDefinationsMap.set('FunctionDeclaration', {
    visitor: ['id', 'params', 'body']
});
astDefinationsMap.set('BlockStatement', {
    visitor: ['body']
});
astDefinationsMap.set('ReturnStatement', {
    visitor: ['argument']
});
astDefinationsMap.set('BinaryExpression', {
    visitor: ['left', 'right']
});
astDefinationsMap.set('ExpressionStatement', {
    visitor: ['expression']
});
astDefinationsMap.set('CallExpression', {
    visitor: ['callee', 'arguments']
});
```


## 二、递归遍历

```js
function traverse(node, visitors) {
  // 获取可遍历的属性
  const defination = astDefinationsMap.get(node.type);
  if (defination.visitor) {
    defination.visitor.forEach(key => {
      const prop = node[key];
      // 判断可遍历属性是不是数组，如果是数组就循环递归
      if (Array.isArray(prop)) {
        prop.forEach(childNode => {
          traverse(childNode, visitors);
        })
      } else {
        traverse(prop, visitors);
      }
    })
  }
}
```

1. 获取可遍历的属性
2. 判断可遍历属性是不是数组，如果是数组就循环递归
3. 不是数组就继续递归 traverse

## 三、enter和exit

```js {7,13,29}
function traverse(node, visitors) {
  const defination = astDefinationsMap.get(node.type);

  let visitorFuncs = visitors[node.type] || {};

  // 统一处理成enter
+  if(typeof visitorFuncs === 'function') {
    visitorFuncs = {
      enter: visitorFuncs
    }
  }

+  visitorFuncs.enter && visitorFuncs.enter(node);

  if (defination.visitor) {
    defination.visitor.forEach(key => {
      const prop = node[key];
      if (Array.isArray(prop)) { // 如果该属性是数组
          prop.forEach(childNode => {
            traverse(childNode, visitors);
          })
      } else {
          traverse(prop, visitors);
      }
    })
  }

  // 递归完后执行 exit
+  visitorFuncs.exit && visitorFuncs.exit(node);
}
```
enter和exit原理就是在递归的前和后执行。
::: tip
enter 阶段在遍历子节点之前，那么修改之后就可以立刻遍历子节点，而 exit 是在遍历结束之后了，所以不会继续遍历子节点。如果 enter 阶段修改了 AST 但是不想遍历新生成的子节点，可以用 `path.skip` 跳过遍历。
:::



## 四、实现path
先我们创建一个 path 的类，记录当前节点 node，父节点 parent 以及父节点的 path
```js
class NodePath {
  constructor(node, parent, parentPath) {
    this.node = node;
    this.parent = parent;
    this.parentPath = parentPath;
  }
}
```

然后在遍历的时候创建 path 对象，传入 visitor

```js {11,20,23,27}
function traverse(node, visitors, parent, parentPath) {
  const defination = astDefinationsMap.get(node.type);

  let visitorFuncs = visitors[node.type] || {};

  if(typeof visitorFuncs === 'function') {
    visitorFuncs = {
      enter: visitorFuncs
    }
  }
+  const path = new NodePath(node, parent, parentPath);

  visitorFuncs.enter && visitorFuncs.enter(path);

  if (defination.visitor) {
    defination.visitor.forEach(key => {
    const prop = node[key];
    if (Array.isArray(prop)) {
      prop.forEach(childNode => {
+        traverse(childNode, visitors, node, path);
      })
    } else {
+        traverse(prop, visitors, node, path);
    }
  })
  }
+  visitorFuncs.exit && visitorFuncs.exit(path);
}

```


## 五、实现path api
replaceWith 就是在父节点替换当前节点为另一个节点。但是我们现在并不知道当前节点在父节点的什么属性上，所以在遍历的时候要记录属性名的信息。

这里要记录两个属性 key 和 listkey，因为属性可以是数组，如果是数组的话就要知道是什么属性的什么下标，比如 params 的第 2 个元素，这时候 key 是 params 而 listkey 是 2。如果不是数组的话，listkey 为空。

```js {12,21,24}
module.exports = function traverse(node, visitors, parent, parentPath, key, listKey) {

    const defination = visitorKeys.get(node.type);
    let visitorFuncs = visitors[node.type] || {};

    if(typeof visitorFuncs === 'function') {
      visitorFuncs = {
        enter: visitorFuncs
      }
    }
    // 初始化时传入当前节点对应的key和index
+    const path = new NodePath(node, parent, parentPath, key, listKey);
    visitorFuncs.enter && visitorFuncs.enter(path);

    if (defination.visitor) {
      defination.visitor.forEach(key => {
        const prop = node[key];
        if (Array.isArray(prop)) {
          prop.forEach((childNode, index) => {
            // 这里传入key和index
+           traverse(childNode, visitors, node, path, key, index);
          })
        } else {
+         traverse(prop, visitors, node, path, key);
        }
      })
    }
    visitorFuncs.exit && visitorFuncs.exit(path);
}
```

path 也要做相应的改动：

```js {6,7}
class NodePath {
  constructor(node, parent, parentPath, key, listKey) {
    this.node = node;
    this.parent = parent;
    this.parentPath = parentPath;
+    this.key = key;
+    this.listKey = listKey;
  }
}
```

### path.replaceWith
```js
replaceWith(node) {
  if (this.listKey != undefined) {
    this.parent[this.key].splice(this.listKey, 1, node);
  } else {
    this.parent[this.key] = node
  }
}
```

### path.remove
```js
remove () {
  if (this.listKey != undefined) {
    this.parent[this.key].splice(this.listKey, 1);
  } else {
    this.parent[this.key] = null;
  }
}
```

### path.find、path.findParent

```js
findParent(callback) {
  let curPath = this.parentPath;
  while (curPath && !callback(curPath)) {
    curPath = curPath.parentPath;
  }
  return curPath;
}
find(callback) {
  let curPath = this;
  while (curPath && !callback(curPath)) {
      curPath = curPath.parentPath;
  }
  return curPath;
}
```

### path.skip
skip 的实现可以给节点加个标记，遍历的过程中如果发现了这个标记就跳过子节点遍历。

```js
skip() {
  this.node.__shouldSkip = true;
}
```

```js {14-17}
module.exports = function traverse(node, visitors, parent, parentPath, key, listKey) {

  const defination = visitorKeys.get(node.type);
  let visitorFuncs = visitors[node.type] || {};

  if(typeof visitorFuncs === 'function') {
      visitorFuncs = {
          enter: visitorFuncs
      }
  }
  const path = new NodePath(node, parent, parentPath, key, listKey);
  visitorFuncs.enter && visitorFuncs.enter(path);

  + if(node.__shouldSkip) {
  +    delete node.__shouldSkip;
  +    return;
  + }

  if (defination.visitor) {
      defination.visitor.forEach(key => {
          const prop = node[key];
          if (Array.isArray(prop)) { // 如果该属性是数组
              prop.forEach((childNode, index) => {
                  traverse(childNode, visitors, node, path, key, index);
              })
          } else {
              traverse(prop, visitors, node, path, key);
          }
      })
  }
  visitorFuncs.exit && visitorFuncs.exit(path);
}
```


## 六、实现Bingding和Scope

```js
class Binding {
  constructor(id, path, scope, kind) {
    this.id = id;
    this.path = path;
    this.referenced = false;
    this.referencePaths = [];
  }
}
```

```js
class Scope {
  constructor(parentScope, path) {
    this.parent = parentScope;
    this.bindings = {};
    this.path = path;
  }

  registerBinding(id, path) {
    this.bindings[id] = new Binding(id, path);
  }

  getOwnBinding(id) {
    return this.bindings[id];
  }

  getBinding(id) {
    // 获取当前作用域是否有该变量声明
    let res = this.getOwnBinding(id);
    // 没有就继续向父作用域查找
    if (res === undefined && this.parent) {
        res = this.parent.getOwnBinding(id);
    }
    return res;
  }

  hasBinding(id) {
    return !!this.getBinding(id);
  }
}
```

+ scope 中记录着 bindings，也就是声明，每个声明会记录在哪里声明的，被哪里引用的。
+ 遇到 block 节点，创建 scope 的时候，要遍历作用域中的所有声明（VariableDeclaraion、FunctionDeclaration），记录该 binding 到 scope 中。


在 NodePath 里面定义一个 scope 的 get 的方法
```js
get scope() {
  if (this.__scope) {
    return this.__scope;
  }
  const isBlock = this.isBlock();
  const parentScope = this.parentPath && this.parentPath.scope;
  // 如果当前节点是有作用域的，就创建一个Scope
  return this.__scope = isBlock ? new Scope(parentScope, this) : parentScope;
}
```

```js
isBlock() {
  return types.visitorKeys.get(this.node.type).isBlock;
}
```

我们在记录节点的遍历的属性的时候，也记录了该节点是否是 block：

```js
astDefinationsMap.set('Program', {
  visitor: ['body'],
  isBlock: true
});
astDefinationsMap.set('FunctionDeclaration', {
  visitor: ['id', 'params', 'body'],
  isBlock: true
});
```

scope 创建完成之后我们要扫描作用域中所有的声明，记录到 scope。这里要注意的是，因为遇到函数作用域要跳过遍历，因为它有自己独立的作用域。
```js
// Scope的 constructor 中初始化bingding
path.traverse({
  VariableDeclarator: (childPath) => {
      this.registerBinding(childPath.node.id.name, childPath);
  },
  FunctionDeclaration: (childPath) => {
      childPath.skip();
      this.registerBinding(childPath.node.id.name, childPath);
  }
});
```

记录完 binding 之后，再扫描所有引用该 binding 的地方，也就是扫描所有的 identifier。

这里要排除声明语句里面的 identifier，那个是定义变量不是引用变量。

```js
// Scope的 constructor 中获取是否引用
path.traverse({
  Identifier: childPath =>  {
    if (!childPath.findParent(p => p.isVariableDeclarator() || p.isFunctionDeclaration())) {
      const id = childPath.node.name;
      const binding = this.getBinding(id);
      if (binding) {
        binding.referenced = true;
        binding.referencePaths.push(childPath);
      }
    }
  }
});
```



## 思考

以后需要树状结构，想要操作其中的一些节点，可以维护`NodePath`的数据结构

```js
function traverse(parentPath, key, index) {

  // 建立父子关系，并存储子节点的索引和key
  const path = new NodePath(parentPath, key, index);

  // 递归逻辑

  parent[key].forEach((item, index) => {
    traverse(path, key, index)
  })
}
```

```js
class NodePath {
  constructor(parentPath, key, index) {
    this.parentPath = parentPath;
    this.key = key
    this.index = index
  }
}
```