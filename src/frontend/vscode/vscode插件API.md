# VSCode插件常用API


## vscode.window.showQuickPick
作用：快速选择弹框
```js
vscode.window.showQuickPick(items, options).then((select) => {
  console.log(select) // 选择结果
});
```


### 参数
+ **items**

```ts
Array<string>
// or
Array<{
  alwaysShow?: string // 始终显示该项
  description?: string // 描述
  detail?: string // 详情
  label?: string // 每一项的名称
  picked?: boolean是否被选中
}>
```

+ **options**
```ts
{
  canPickMany?: boolean // 是否多选
  ignoreFocusOut?: boolean // 是否在切换应用或离开 始终保持选择框的打开状态 （平板电脑始终是false）
  matchOnDescription?: boolean // 在输入框输入的时候  自动模糊匹配到下面的选项 （根据描述匹配）
  matchOnDetail?: boolean // 在输入框输入的时候  自动模糊匹配到下面的选项 （根据detail匹配）
  placeHolder?: string // 占位符
  title?: string // 标题
}
```
