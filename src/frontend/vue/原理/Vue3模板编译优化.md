# Vue3模板编译优化

## 一、Block Tree

### PatchFlags优化
Diff算法无法避免新旧虚拟DOM中无用的比较操作，通过patchFlags来标记动态内容，可以实现快速diff算法

```html
<div>
  <h1>Hello Jiang</h1>
  <span>{{name}}</span>
</div>
```

此template经过模板编译会变成以下代码：

```js
const { createElementVNode: _createElementVNode, toDisplayString: _toDisplayString, createTextVNode: _createTextVNode, openBlock: _openBlock, createElementBlock: _createElementBlock } = Vue

return function render(_ctx, _cache, $props, $setup, $data, $options) {
  return (_openBlock(), _createElementBlock("div", null, [
    _createElementVNode("h1", null, "Hello Jiang"),
    _createTextVNode(),
    _createElementVNode("span", null, _toDisplayString(_ctx.name), 1 /* TEXT */)
  ]))
}
```

生成的虚拟DOM是：

```js
{
	type: "div",
  __v_isVNode: true,
  children:[
      {type: 'h1', props: null, key: null, …}
      {type: Symbol(), props: null, key: null, …}
    {type: 'span', props: null, key: null, …}
  ],
  dynamicChildren:[{type: 'span', children: _ctx.name, patchFlag: 1}]
}
```

此时生成的虚拟节点多出一个dynamicChildren属性。这个就是block的作用，block可以收集所有后代动态节点。这样后续更新时可以直接跳过静态节点，实现靶向更新

### 动态标识
```js
export const enum PatchFlags {
  TEXT = 1, // 动态文本节点
  CLASS = 1 << 1, // 动态class
  STYLE = 1 << 2, // 动态style
  PROPS = 1 << 3, // 除了class\style动态属性
  FULL_PROPS = 1 << 4, // 有key，需要完整diff
  HYDRATE_EVENTS = 1 << 5, // 挂载过事件的
  STABLE_FRAGMENT = 1 << 6, // 稳定序列，子节点顺序不会发生变化
  KEYED_FRAGMENT = 1 << 7, // 子节点有key的fragment
  UNKEYED_FRAGMENT = 1 << 8, // 子节点没有key的fragment
  NEED_PATCH = 1 << 9, // 进行非props比较, ref比较
  DYNAMIC_SLOTS = 1 << 10, // 动态插槽
  DEV_ROOT_FRAGMENT = 1 << 11, 
  HOISTED = -1, // 表示静态节点，内容变化，不比较儿子
  BAIL = -2 // 表示diff算法应该结束
}
```


### 靶向更新实现

```js
export { createVNode as createElementVNode }
let currentBlock = null
export function openBlock(){ // 创建block
  currentBlock = []
}
export function closeBlock(){ //关闭block
  currentBlock = null;
}
export function createElementBlock(type,props?,children?,patchFlag?){ // 创建block元素
  return setupBlock(createVNode(type,props,children,patchFlag))// 将动态元素挂载到block节点上
}
export function setupBlock(vnode){ 
  vnode.dynamicChildren = currentBlock;
  closeBlock();
  return vnode;
}
export function createTextVNode(text: ' ', flag = 0) { // 创建文本虚拟节点
  return createVNode(Text, null, text, flag)
}
export function toDisplayString(val){ // 就是JSON.stringify
  return isString(val)? val : val == null ? '' :isObject(val)? JSON.stringify(val): String(val);
}
```


```js
export const createVNode = (type,props,children = null,patchFlag =0)=>{
  // ...
  if(currentBlock && vnode.patchFlag > 0){
      currentBlock.push(vnode);
  }
  return vnode;
}
```

### 虚拟节点创建
```js
const Com = {
  setup(){
    let state = reactive({name:'jw'});
    setTimeout(() => {
      state.name = 'zf'
    }, 1000);
    return {
      ...toRefs(state)
    }
  },
  render(_ctx){
    return (openBlock(),createElementBlock('div',null,[
      createElementVNode("h1", null, "Hello Jiang"),
      createElementVNode("span", null, toDisplayString(_ctx.name), 1 /* TEXT */)
    ]))
  }
}
createRenderer(renderOptions).render(h(Com),document.getElementById('app'))
```

### 靶向更新
```js
const patchElement = (n1,n2) =>{ // 比较两个元素的差异
  let el = (n2.el = n1.el);
  const oldProps = n1.props || {}
  const newProps = n2.props || {}
  let {patchFlag} = n2;
  if(patchFlag){ // 单独处理标识属性
      if(patchFlag & PatchFlags.CLASS){
          if(oldProps.class !== newProps.class){
              hostPatchProp(el,'class',null,newProps.class);
          }
      }
      if (patchFlag & PatchFlags.TEXT) {
          if (n1.children !== n2.children) {
              hostSetElementText(el, n2.children)
          }
      }
  }else{ // 处理所有属性
      patchProps(oldProps,newProps,el);
  }
  if(n2.dynamicChildren){ // 比较动态节点
      patchBlockChildren(n1,n2);
  }else{
      patchChildren(n1,n2,el); 
  }
}
```

```js
function patchBlockChildren(n1,n2){
  for(let i = 0 ; i < n2.dynamicChildren.length;i++){
      patchElement(n1.dynamicChildren[i],n2.dynamicChildren[i]);
  }
}
```

由此可以看出性能被大幅度提升,从tree级别的比对，变成了线性结构比对。


### BlockTree
为什么我们还要提出blockTree的概念？ 只有block不就挺好的么？ 问题出在block在收集动态节点时是忽略虚拟DOM树层级的。
```js
<div>
  <p v-if="flag">
      <span>{{a}}</span>
  </p>
  <div v-else>
      <span>{{a}}</span>
  </div>
</div>
```

这里我们知道默认根节点是一个block节点，如果要是按照之前的套路来搞，这时候切换flag的状态将无法从p标签切换到div标签。 解决方案：就是将不稳定的结构也作为block来进行处理


### 不稳定结构
所谓的不稳结构就是DOM树的结构可能会发生变化。不稳定结构有哪些呢？ （v-if/v-for/Fragment）


#### v-if
```js
<div>
  <div v-if="flag">
      <span>{{a}}</span>
  </div>
  <div v-else>
      <p><span>{{a}}</span></p>
  </div>
</div>
```

编译后的结果:

```js
return function render(_ctx, _cache, $props, $setup, $data, $options) {
  return (_openBlock(), _createElementBlock("div", null, [
    (_ctx.flag)
      ? (_openBlock(), _createElementBlock("div", { key: 0 }, [
          _createElementVNode("span", null, _toDisplayString(_ctx.a), 1 /* TEXT */)
        ]))
      : (_openBlock(), _createElementBlock("div", { key: 1 }, [
          _createElementVNode("p", null, [
            _createElementVNode("span", null, _toDisplayString(_ctx.a), 1 /* TEXT */)
          ])
        ]))
  ]))
}
```

```js
Block(div)
	Blcok(div,{key:0})
	Block(div,{key:1})
```
父节点除了会收集动态节点之外，也会收集子block。 更新时因key值不同会进行删除重新创建

#### v-for
随着v-for变量的变化也会导致虚拟DOM树变得不稳定

```html
<div>
    <div v-for="item in fruits"></div>
</div>
```

```js
return function render(_ctx, _cache, $props, $setup, $data, $options) {
  return (_openBlock(), _createElementBlock("div", null, [
    (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(_ctx.fruits, (item) => {
      return (_openBlock(), _createElementBlock("div"))
    }), 256 /* UNKEYED_FRAGMENT */))
  ]))
}
```

::: tip
可以试想一下，如果不增加这个block，前后元素不一致是无法做到靶向更新的。因为dynamicChildren中还有可能有其他层级的元素。同时这里还生成了一个Fragment，因为前后元素个数不一致，所以称之为不稳定序列
:::


#### 稳定Fragment

```html
<div>
  <div v-for="item in 3"></div>
</div>
```

```html
<div>hello world</div>
<p>Jiang wen</p>
```


## 二、静态提升
当静态节点较少时，会被提升至最顶层，下次不用重复创建

```js
<div>
  <div>123</div>
  <div>123</div>
  <div>123</div>
  <div>
    {{ name }}
  </div>
</div>
```
```js
import { createElementVNode as _createElementVNode, toDisplayString as _toDisplayString, openBlock as _openBlock, createElementBlock as _createElementBlock } from "vue"

const _hoisted_1 = /*#__PURE__*/_createElementVNode("div", null, "123", -1 /* HOISTED */)
const _hoisted_2 = /*#__PURE__*/_createElementVNode("div", null, "123", -1 /* HOISTED */)
const _hoisted_3 = /*#__PURE__*/_createElementVNode("div", null, "123", -1 /* HOISTED */)

export function render(_ctx, _cache, $props, $setup, $data, $options) {
  return (_openBlock(), _createElementBlock("div", null, [
    _hoisted_1,
    _hoisted_2,
    _hoisted_3,
    _createElementVNode("div", null, _toDisplayString(_ctx.name), 1 /* TEXT */)
  ]))
}
```

#### 预字符串化
当静态节点超过10个会被字符串化

```js
<div>
  <div>123</div>
  <div>123</div>
  <div>123</div>
  <div>123</div>
  <div>123</div>
  <div>123</div>
  <div>123</div>
  <div>123</div>
  <div>123</div>
  <div>123</div>
  <div>
    {{ name }}
  </div>
</div>
```

```js
import { createElementVNode as _createElementVNode, toDisplayString as _toDisplayString, createStaticVNode as _createStaticVNode, openBlock as _openBlock, createElementBlock as _createElementBlock } from "vue"

const _hoisted_1 = /*#__PURE__*/_createStaticVNode("<div>123</div><div>123</div><div>123</div><div>123</div><div>123</div><div>123</div><div>123</div><div>123</div><div>123</div><div>123</div>", 10)

export function render(_ctx, _cache, $props, $setup, $data, $options) {
  return (_openBlock(), _createElementBlock("div", null, [
    _hoisted_1,
    _createElementVNode("div", null, _toDisplayString(_ctx.name), 1 /* TEXT */)
  ]))
}

```


## 三、事件缓存

```html
<div>
  <div @click="() => {}">
    {{ name }}
  </div>
</div>
```

```js
import { toDisplayString as _toDisplayString, createElementVNode as _createElementVNode, openBlock as _openBlock, createElementBlock as _createElementBlock } from "vue"

export function render(_ctx, _cache, $props, $setup, $data, $options) {
  return (_openBlock(), _createElementBlock("div", null, [
    _createElementVNode("div", {
      onClick: _cache[0] || (_cache[0] = () => {}) // 此处缓存
    }, _toDisplayString(_ctx.name), 1 /* TEXT */)
  ]))
}
```