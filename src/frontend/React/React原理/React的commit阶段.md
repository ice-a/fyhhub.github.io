# React的commit阶段

## flushPassiveEffects
在一开始，react会`异步执行`还没有执行的`useEffect回调` 和 `上次更新的useEffect的销毁函数`

## beforeMutation阶段

+ 首先进行dom的blur和focus相关操作
+ 执行`getSnapshotBeforeUpdate`
+ scheduleCallback`异步调度`, `flushPassiveEffects`会执行`useEffect回调` 和 `上次更新的useEffect的销毁函数`



## mutation阶段
+ 如果有直接的文本更新Effect Tag(`ContentReset`), 更新节点的文本内容
+ 如果存在`Ref`，更新ref
+ 如果存在`Placement`, 执行`commitPlacement`, 找到父节点dom，将节点插入。
+ 如果存在`PlacementAndUpdate`, 执行`commitPlacement`和`commitWork`
  - 找到父节点dom，将节点插入
  - 调用`useLayoutEffect的销毁函数`
  - 更新dom属性
+ 如果存在`Deletion`，执行`commitDeletion`
  - 删除dom
  - 删除fiber
  - 收集useEffect的销毁函数
  - 执行`componentWillUnmount`
  - 解绑ref


## layout阶段
+ 执行`useLayoutEffect回调`
+ 收集`useEffect的销毁函数`
+ 收集`useEffect的回调`
+ 执行`componentDidMount`
+ 执行`componentDidUpdate`
+ 执行`this.setState`的回调函数
+ 执行`ReactDOM.render`的回调函数



一段时间后。。。异步执行`useEffect的销毁函数和回调`

## useEffect和useLayoutEffect的区别

![image.png](http://tva1.sinaimg.cn/large/006vSZ9Ugy1gyfmj76zumj31110kjwjf.jpg)