# TS类型挑战

## 普通难度

### 1. Pick
```ts
type MyPick<T, K extends keyof T> = {
  [key in K]: T[key]
}
```

### 2. Readonly
```ts
type MyReadonly<T> = {
  readonly [key in keyof T]: T[key]
}
```

### 3. 元组转换为对象

```ts
const tuple = ['tesla', 'model 3', 'model X', 'model Y'] as const
type result = TupleToObject<typeof tuple> // expected { tesla: 'tesla', 'model 3': 'model 3', 'model X': 'model X', 'model Y': 'model Y'}
```

```ts
type TupleToObject<T extends readonly any[]> = {
  [P in T[number]]: P
}
```

### 4. 第一个元素
```ts
type arr1 = ['a', 'b', 'c']
type arr2 = [3, 2, 1]

type head1 = First<arr1> // expected to be 'a'
type head2 = First<arr2> // expected to be 3
```

```ts
type First<T extends any[]> = T extends [] ? never : T[0]

// or

type First<T extends any[]> = T extends [infer U, ...infer rest] ? U : never;
```

### 5. 获取元组长度
```ts
type tesla = ['tesla', 'model 3', 'model X', 'model Y']
type spaceX = ['FALCON 9', 'FALCON HEAVY', 'DRAGON', 'STARSHIP', 'HUMAN SPACEFLIGHT']

type teslaLength = Length<tesla> // expected 4
type spaceXLength = Length<spaceX> // expected 5
```

```ts
type Length<T extends readonly any[]> = T['length']
```


### 6. Exclude
```ts
type MyExclude<T, U> = T extends U ? never : T
```
### 7. Awaited
```
假如我们有一个 Promise 对象，这个 Promise 对象会返回一个类型。在 TS 中，我们用 Promise<T> 中的 T 来描述这个 Promise 返回的类型。请你实现一个类型，可以获取这个类型。
比如：`Promise<ExampleType>`，请你返回 ExampleType 类型。
```

```ts
type MyAwaited<T> = T extends Promise<infer U>
  ? U extends Promise<infer E>
    ? MyAwaited<E>
    : U
  : never
```

