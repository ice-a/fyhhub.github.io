# React的diff算法

React中Diff算法的本质是对比，`current fiber`和`JSX对象`, 然后生成`workInProgress fiber`


## React diff的限制

+ 只对同级元素进行Diff。如果一个DOM节点在前后两次更新中`跨越了层级`，那么React`不会尝试复用`他。
+ 两个不同类型的元素会产生出不同的树。如果元素由`div变为p`，React会`销毁`div及其子孙节点，并新建p及其子孙节点。
+ 开发者可以通过 key prop来暗示哪些子元素在不同的渲染下能保持稳定


## 单节点的diff

### mount时
`current fiber`为Null

直接根据`jsx element`创建`workInProgress fiber`

### update时
`current fiber`存在


**遍历current fiber和兄弟节点**

+ `current fiber`和`jsx element`的key**相同**
  - 两者的节点type`相同`
    - 当前层级只有一个fiber, 需要删除其他多余的兄弟fiber
    - useFiber复用`current fiber`, 返回`workInProgress fiber`
  - 两者的节点type`不相同`
    - 标记删除该`current fiber`, 以及它所有的兄弟节点

+ `current fiber`和`jsx element`的key**不相同**
  只标记删除该`current fiber`


+ 如果以上对比后，还是没法复用，就使用`jsx element`创建新的`workInProgress fiber`



## 多节点的diff
Diff算法的整体逻辑会经历两轮遍历：

第一轮遍历：处理`更新`的节点。

第二轮遍历：处理剩下的`不属于更新`的节点

### 第一轮遍历