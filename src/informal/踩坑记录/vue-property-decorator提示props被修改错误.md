# vue-property-decorator提示props被修改错误

## 问题

@Prop使用正确，使用default指定的默认值，但是还是报错误

```js
[Vue warn]: Avoid mutating a prop directly since the value will be overwritten whenever the parent component re-renders.
```


## 解决方案
tsconfig.json增加以下参数
[issues地址](https://github.com/kaorun343/vue-property-decorator/issues/393)

```json
{
  "compilerOptions": {
    "useDefineForClassFields": false
  },
}
```