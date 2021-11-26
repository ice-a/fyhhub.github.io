# React SSR如何保证在客户端渲染一次

在react 16前该方法生成的html内容的每一个DOM节点都有一个`data-react-id`属性，根节点会有一个`data-react-checksum`属性。
组件在服务端渲染后，在浏览器端还会渲染一次，来完成组件的交互等逻辑。渲染时，react在浏览器端会计算出组件的`data-react-checksum`属性值，如果发现和服务端计算的值一致，则不会进行客户端渲染。所以`data-react-checksum`属性的作用是为了完成组件的双端对比。

如果两个组件的props和DOM结构是相同的，那么计算出的该属性值就是一致的。

也可以换个角度来理解，当双端渲染的组件的props和DOM结构一致时，那么该组件只会渲染一次，客户端会采用服务端渲染的结果，仅作事件绑定等处理，这会让我们的应用有一个非常高效的初次加载体验。

[hydrate](https://react.docschina.org/docs/react-dom.html#hydrate)