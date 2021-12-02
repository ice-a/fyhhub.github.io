# CSS画三角形

::: demo [react]
```js
export default function App() {
  return (
    <div>
      <div className="triangle"></div>
    </div>
  )
}
App.__style__ = `
.triangle {
  width: 0;
  height: 0;
  border-style:solid;
  /* 上 右 左 边框宽度50 下 0 */
  border-width: 0 50px 50px 50px;
  /* 上 右 左 透明色 */
  border-color: transparent transparent #d9534f transparent;
}
`
```
:::


```css
.triangle {
  width: 0;
  height: 0;
  border-style:solid;
  /* 上 右 左 边框宽度50 下 0 */
  border-width: 0 50px 50px 50px;
  /* 上 右 左 透明色 */
  border-color: transparent transparent #d9534f transparent;
}
```