# 说一下nextTick如何实现的

## 核心答案
nextTick利用了浏览器事件循环机制，vue为了避免频繁的操作DOM,采用异步的方式更新DOM。这些异步操作会通过nextTick函数将这些操作以cb的形式放到任务队列中（以微任务优先），当每次tick结束之后就会去执行这些cb，更新DOM。

宏任务script - 微任务 - dom渲染 - web Worker - 宏任务

例如更新num++ 执行一千次，不可能每次都更新一次dom,会有非常大的性能损耗，那么可以把更新放到最后一次来做，将更新任务放到异步队列, 做到批量更新


nextTick会根据浏览器兼容性，依次降级使用不同方案
+ Promise
+ MutationObserver
+ setImmediate
+ setTimeout