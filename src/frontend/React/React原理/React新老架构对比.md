# React新老架构对比

## 老架构
React15架构可以分为两层：
+ `Reconciler（协调器）`: 负责找出变化的组件
+ `Renderer（渲染器）`: 负责将变化的组件渲染到页面上

缺点：`组件更新和渲染，都会递归更新子组件，当层级很深时，超过16ms, 页面就会卡顿`


## 新架构
React16架构可以分为三层：

+ `Scheduler（调度器）`: 调度任务的优先级，高优任务优先进入Reconciler
+ `Reconciler（协调器）`: 负责找出变化的组件
+ `Renderer（渲染器）`: 负责将变化的组件渲染到页面上


### Scheduler

想要知道什么时候浏览器有空闲时间，其实也有部分浏览器实现了相关的API, 那就是`requestIdleCallback`, 但是它有几个缺点
+ 浏览器兼容性
+ 触发频率不稳定，受很多因素影响。比如当我们的浏览器切换tab后，之前tab注册的`requestIdleCallback`触发的频率会变得很低

基于以上原因，React实现了功能更完备的`requestIdleCallback polyfill`，这就是`Scheduler`