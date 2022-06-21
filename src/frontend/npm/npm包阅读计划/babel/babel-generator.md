# @babel/generator

## 思路

递归遍历AST树，拼接字符串


## 代码生成

```js
class Printer {
  constructor (source, fileName) {
    // 记录生成的代码，不断拼接
    this.buf = '';
    this.printLine = 1;
    this.printColumn = 0;
  }

  addMapping(node) {
    // 待实现
  }

  // 增加一个空格
  space() {
    this.buf += ' ';
    this.printColumn ++;
  }

  // 换行
  nextLine() {
    this.buf += '\n';
    this.printLine ++;
    this.printColumn = 0;
  }

  // 遍历 Program下的节点，并调用相应的方法拼接
  Program (node) {
    this.addMapping(node);
    node.body.forEach(item => {
      // 执行对应节点的拼接方法
      this[item.type](item) + ';';
      // 行数+1
      this.printColumn ++;
      // 换行
      this.nextLine();
    });
  }

  // 遍历声明语句
  VariableDeclaration(node) {
      if(!node.declarations.length) {
        return;
      }
      this.addMapping(node);
      // let var const
      this.buf += node.kind;
      // 空格
      this.space();

      // 遍历变量名
      node.declarations.forEach((declaration, index) => {
        if (index != 0) {
          this.buf += ',';
          this.printColumn ++;
        }
        // 执行到 VariableDeclarator 拼接方法
        this[declaration.type](declaration);
      });
      // 添加分号
      this.buf += ';';
      // 列数+1
      this.printColumn ++;

  }
  VariableDeclarator(node) {
    this.addMapping(node);
    // 执行到 Identifier 拼接
    this[node.id.type](node.id);
    // 添加赋值
    this.buf += '=';
    // 列数+1
    this.printColumn ++;
    // 执行到 Identifier 或 NumericLiteral 等
    this[node.init.type](node.init);
  }
  Identifier(node) {
    this.addMapping(node);
    this.buf += node.name;
  }

  FunctionDeclaration(node) {
    this.addMapping(node);
    // 拼接函数
    this.buf += 'function ';
    this.buf += node.id.name;
    this.buf += '(';
    this.buf += node.params.map(item => item.name).join(',');
    this.buf += '){';
    this.nextLine();
    this[node.body.type](node.body);
    this.buf += '}';
    this.nextLine();
  }
  CallExpression(node) {
    this.addMapping(node);
    this[node.callee.type](node.callee);
    this.buf += '(';
    node.arguments.forEach((item, index) => {
        if(index > 0 ) this.buf += ', ';
        this[item.type](item);
    })
    this.buf += ')';
  }
  ExpressionStatement(node) {
    this.addMapping(node);

    this[node.expression.type](node.expression);
  }
  ReturnStatement(node) {
    this.addMapping(node);

    this.buf += 'return ';
    this[node.argument.type](node.argument); 
  }
  BinaryExpression(node) {
    this.addMapping(node);

    this[node.left.type](node.left);
    this.buf += node.operator;
    this[node.right.type](node.right);
  }
  BlockStatement(node) {
    this.addMapping(node);

    node.body.forEach(item => {
      this.buf += '    ';
      this.printColumn += 4;
      this[item.type](item);
      this.nextLine();
    });
  }
  NumericLiteral(node) {
    this.addMapping(node);
    this.buf += node.value;
  }
}
```


## 支持sourcemap

```js
const { SourceMapGenerator } = require('source-map');

class Printer {
  constructor (source, fileName) {
    this.buf = '';

    this.sourceMapGenerator = new SourceMapGenerator({
      file: fileName + ".map.json",
    });

    this.fileName = fileName;
    // 设置源码内容
    this.sourceMapGenerator.setSourceContent(fileName, source);

    this.printLine = 1;
    this.printColumn = 0;
  }

  addMapping(node) {
    if (node.loc) {
      // 添加一个映射关系
      this.sourceMapGenerator.addMapping({
        generated: {
          line: this.printLine, // 这里是转换后的行数
          column: this.printColumn // 这里是转换后的列数
        },
        source: this.fileName, // 文件名
        original: node.loc && node.loc.start // 转换前的起始位置
      })
    }
  }
}
```


最后，我们定义 `Generator 类`，在 generate 方法里面调用 printer 的打印逻辑来生成目标代码，并且调用 `this.sourceMapGenerator.toString()` 来生成 sourcemap。

```js
class Generator extends Printer{
  constructor(source, fileName) {
    super(source, fileName);
  }

  generate(node) {
    this[node.type](node);
    return {
      code: this.buf,
      map: this.sourceMapGenerator.toString()
    }
  }
}

```