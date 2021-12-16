/*
 * @lc app=leetcode.cn id=491 lang=javascript
 *
 * [491] 递增子序列
 */

// @lc code=start
/**
 * @param {number[]} nums
 * @return {number[][]}
 */
var findSubsequences = function(nums) {
  const res = []
  function fn(startIndex, path) {
    path.length > 1 && res.push([...path])
    const used = new Set()
    for (let i = startIndex;i < nums.length;i++) {
      // 同层已经使用过 || (不是递增)
      if (used.has(nums[i]) || (path.length && nums[i] < path[path.length - 1])) {
        continue
      }
      used.add(nums[i])
      fn(i + 1, path.concat(nums[i]));
    }
  }
  fn(0, [])
  return res
};
// @lc code=end

