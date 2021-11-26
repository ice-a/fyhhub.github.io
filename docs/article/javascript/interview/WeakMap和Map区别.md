# WeakMap和Map区别

1. WeakMap只接受key为对象
2. WeakMap的key所引用的对象是弱引用，只要对象其他引用被删除，就会被垃圾回收机制回收
3. WeakMap没有size属性，因为成员数量不稳定
4. 没有clear方法
5. 不能遍历