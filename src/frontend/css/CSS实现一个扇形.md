# CSS实现一个扇形
::: demo [react]
```js
export default function App() {
  return (
    <div>
      <div className="sector"></div>
    </div>
  )
}
App.__style__ = `
.sector {
  width: 0;
  height: 0;
  border: 100px solid transparent;
  border-top-color: red;
  border-radius: 50%;
}
`
```
:::


```css
.sector {
  width: 0;
  height: 0;
  border: 100px solid transparent;
  border-top-color: red;
  border-radius: 50%;
}
```