/*
 * @lc app=leetcode.cn id=47 lang=javascript
 *
 * [47] 全排列 II
 */

// @lc code=start
/**
 * @param {number[]} nums
 * @return {number[][]}
 */
var permuteUnique = function(nums) {
  const res = []
  nums.sort((a, b) => a - b)
  function fn(path, used) {
    if (path.length === nums.length) {
      res.push([...path])
      return
    }
    for (let i = 0;i < nums.length;i++) {
      if (i > 0 && nums[i] === nums[i - 1] && !used[i - 1]) {
        continue
      }
      if (!used[i]) {
        used[i] = true
        fn(path.concat(nums[i]), used)
        used[i] = false
      }
    }
  }
  fn([], [])
  return res
};
// @lc code=end


// @after-stub-for-debug-begin
module.exports = permuteUnique;
// @after-stub-for-debug-end