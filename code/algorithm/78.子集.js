/*
 * @lc app=leetcode.cn id=78 lang=javascript
 *
 * [78] 子集
 */

// @lc code=start
/**
 * @param {number[]} nums
 * @return {number[][]}
 */
var subsets = function(nums) {
  const res = []
  function fn(index, path) {
    res.push([...path])
    if (index >= nums.length) {
      return
    }
    for (let i = index;i < nums.length;i++) {
      const next = path.concat(nums[i])
      fn(i + 1, next)
    }
  }
  fn(0, [])
  return res
};
// @lc code=end

