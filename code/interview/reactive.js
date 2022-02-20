
const ITERATE_KEY = 'ITERATE_KEY'
function reactive(target) {
  return new Proxy(target, {
    get(target, key, receiver) {
      track(target, key)
      return Reflect.get(target, key, receiver)
    },
    has(target, key, receiver) {
      track(target, key)
      return Reflect.has(target, key, receiver)
    },
    set(target, key, newVal, receiver) {
      const oldValue = target[key]

      // 判断当前设置的属性 是否存在，如果存在说明是SET， 否则就是ADD新增属性
      const type = Object.prototype.hasOwnProperty.call(target, key) ? 'SET' : 'ADD'
      const res = Reflect.set(target, key, val, receiver)

      if (newVal !== oldValue && (oldValue === oldValue || newVal === newVal)) {
        trigger(target, key, type)
      }
      return res
    },
    // 删除属性
    deleteProperty(target, key) {
      const hadKey = Object.prototype.hasOwnProperty.call(target, key)
      const res = Reflect.deleteProperty(target, key)
      if (res && hadKey) {
        trigger(target, key, 'DELETE')
      }
      return res
    },
    ownKeys(target) {
      // 处理以下情况
      // effect(() => {
      //   for (const key in obj) {
      //     console.log(key)
      //   }
      // })
      track(target, ITERATE_KEY)
      return Reflect.ownKeys(target)
    }
  })
}