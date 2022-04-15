## 实现html-parser

:::: tabs
::: tab index.html
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body>

  <script src="./index.js"></script>
  <script>
    compileToFunction(`
    <div id="app">
      <div class="test">
        {{ name }}
        <p v-if="show"></p>
      </div>
    </div>
    `)
  </script>
</body>
</html>
```
:::

::: tab index.js
```js
/**
 * 
 * @param {string} html html
 */
function parseHTML(html) {
  const ELEMENT_TYPE = 1
  const TEXT_TYPE = 3
  const stack = []
  let currentParent
  let root

  function createASTElement(tag, attrs) {
    return {
      tag,
      type: ELEMENT_TYPE,
      children: [],
      attrs,
      parent: null
    }
  }

  function start(tag, attrs) {
    const node = createASTElement(tag, attrs)
    if (!root) {
      root = node
    }

    // 建立父子关系
    if (currentParent) {
      node.parent = currentParent
      currentParent.children.push(node)
    }

    stack.push(node)
    currentParent = node
  }

  function end() {
    stack.pop()
    currentParent = stack[stack.length - 1]
  }

  function chars(text) {
    currentParent.children.push({
      type: TEXT_TYPE,
      text,
      parent: currentParent
    })
  }

  function advance(n) {
    html = html.substring(n)
  }

  function parseStartTag() {
    const start = html.match(startTagOpen)
    // 匹配到开始标签
    if (start) {
      const match = {
        tagName: start[1],
        attrs: []
      }
      advance(start[0].length)

      let attr
      let end
      // 如果没有匹配到结束标签就一直循环 把属性一些东西删掉
      while(!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
        advance(attr[0].length)
        // 记录属性
        match.attrs.push({
          name: attr[1],
          value: attr[3] || attr[4] || attr[5]
        })
      }
      // 最后再把标签闭合删掉 >
      end && advance(end[0].length)

      return match
    }

    return false;
  }

  while(html) {

    // textEnd === 0 说明是开始标签或结束标签
    // textEnd > 0 说明是文本的结束位置
    let textEnd = html.indexOf('<')

    if (textEnd === 0) {
      // 开始标签的匹配
      const startTagMatch = parseStartTag()
      if (startTagMatch) {
        start(startTagMatch.tagName, startTagMatch.attrs)
        continue
      }

      const endTagMatch = html.match(endTag)
      if (endTagMatch) {
        advance(endTagMatch[0].length)
        end(endTagMatch[1])
        continue
      }
    } else if (textEnd > 0){
      // 截取文本内容
      let txt = html.substring(0, textEnd)
      if (txt) {
        chars(txt)
        advance(txt.length)
      }
    }
  }
  return root
}

function compileToFunction(template) {
  let ast = parseHTML(template.trim())
  console.log('%c 🍧 ast: ', 'font-size:20px;background-color: #42b983;color:#fff;', ast);
}
```
:::

::::