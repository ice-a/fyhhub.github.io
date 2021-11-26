# React源码读后思考

## React Hook为什么不能写在条件判断中

+ **初次渲染**

`react`在初始时执行hook的过程中会为每个hook创建对应的hook对象,并将每个hook形成一条链表。

```js
function mountWorkInProgressHook() {
  var hook = {
    memoizedState: null,
    baseState: null,
    baseQueue: null,
    queue: null,
    next: null
  };
  // 形成链表的过程
  if (workInProgressHook === null) {
    // This is the first hook in the list
    currentlyRenderingFiber$1.memoizedState = workInProgressHook = hook;
  } else {
    // Append to the end of the list
    workInProgressHook = workInProgressHook.next = hook;
  }

  return workInProgressHook;
}
```

+ **组件更新时**

组件更新后，会从链表头部开始，取当前`react hook`对应的`hook对象`

可以发现它是根据初次渲染的hook链表来依次读取的hook对象，一旦有条件判断，那可能产生不可预计的后果

```js
function updateWorkInProgressHook() {
  // This function is used both for updates and for re-renders triggered by a
  // render phase update. It assumes there is either a current hook we can
  // clone, or a work-in-progress hook from a previous render pass that we can
  // use as a base. When we reach the end of the base list, we must switch to
  // the dispatcher used for mounts.
  var nextCurrentHook; // 获取上次更新的hook
  // 第一个hook
  if (currentHook === null) {
    var current = currentlyRenderingFiber$1.alternate;
    // 存在上次更新产生的hook
    if (current !== null) {
      nextCurrentHook = current.memoizedState;
    } else {
      nextCurrentHook = null;
    }
  } else {
    // 获取下一个hook
    nextCurrentHook = currentHook.next;
  }

  var nextWorkInProgressHook; // 当前更新产生的hook

  if (workInProgressHook === null) {
    nextWorkInProgressHook = currentlyRenderingFiber$1.memoizedState;
  } else {
    nextWorkInProgressHook = workInProgressHook.next;
  }

  if (nextWorkInProgressHook !== null) {
    // There's already a work-in-progress. Reuse it.
    workInProgressHook = nextWorkInProgressHook;
    nextWorkInProgressHook = workInProgressHook.next;
    currentHook = nextCurrentHook;
  } else {
    // Clone from the current hook.
    if (!(nextCurrentHook !== null)) {
      {
        throw Error( "Rendered more hooks than during the previous render." );
      }
    }

    currentHook = nextCurrentHook;
    var newHook = {
      memoizedState: currentHook.memoizedState,
      baseState: currentHook.baseState,
      baseQueue: currentHook.baseQueue,
      queue: currentHook.queue,
      next: null
    };

    if (workInProgressHook === null) {
      // This is the first hook in the list.
      currentlyRenderingFiber$1.memoizedState = workInProgressHook = newHook;
    } else {
      // Append to the end of the list.
      workInProgressHook = workInProgressHook.next = newHook;
    }
  }

  return workInProgressHook;
}
```

+ **例子**

如果第二个`hook`在num1为1时才创建，这时候获取到的hook将会是第三个`hook`的`hook对象`！
```js
function App() {
  // 第一个hook
  const [num1, setNum1] = useState(0)
  let state

  // 第二个hook
  if (num1 > 1) {
    state = useState(0) // eslint-disable-line
  }

  // 第三个hook
  const [num2, setNum2] = useState(0)
  return (
    <div className="parent">
      <button onClick={() => setNum1(2)}>{num1}{num2}</button>
    </div>
  )
}
```




## React更新被高优先级打断是如何恢复的