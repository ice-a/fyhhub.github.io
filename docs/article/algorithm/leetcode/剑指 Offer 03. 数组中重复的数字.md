# [剑指 Offer 03. 数组中重复的数字](https://leetcode-cn.com/problems/shu-zu-zhong-zhong-fu-de-shu-zi-lcof/)
```js
/**
 * @param {number[]} nums
 * @return {number}
 */
var findRepeatNumber = function(nums) {
  const map = {}
  for (let i = 0;i < nums.length;i++) {
    if (!map[nums[i]]) {
      map[nums[i]] = true
    } else {
      return nums[i]
    }
  }
};
```