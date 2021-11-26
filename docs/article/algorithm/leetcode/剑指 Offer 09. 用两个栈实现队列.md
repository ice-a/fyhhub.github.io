# [剑指 Offer 09. 用两个栈实现队列](https://leetcode-cn.com/problems/yong-liang-ge-zhan-shi-xian-dui-lie-lcof/submissions/)



## 思路
[【此时你需要两个薯片桶】有点意思的设计题](https://leetcode-cn.com/problems/yong-liang-ge-zhan-shi-xian-dui-lie-lcof/solution/ci-shi-ni-xu-yao-liang-ge-shu-pian-tong-z0jxf/)

## 题解
```js
var CQueue = function() {
  this.stack1 = []
  this.stack2 = []
};

/** 
 * @param {number} value
 * @return {void}
 */
CQueue.prototype.appendTail = function(value) {
  // 1桶 倒入 2桶
  while(this.stack1.length) {
    this.stack2.push(this.stack1.pop())
  }
  // 1桶队添加元素
  this.stack1.push(value)

  // 2桶 倒回 1桶
  while(this.stack2.length) {
    this.stack1.push(this.stack2.pop())
  }
  return this.stack1
};

/**
 * @return {number}
 */
CQueue.prototype.deleteHead = function() {
  return this.stack1.pop() || -1
};

/**
 * Your CQueue object will be instantiated and called as such:
 * var obj = new CQueue()
 * obj.appendTail(value)
 * var param_2 = obj.deleteHead()
 */
```