/*
 * @lc app=leetcode.cn id=90 lang=javascript
 *
 * [90] 子集 II
 */

// @lc code=start
/**
 * @param {number[]} nums
 * @return {number[][]}
 */
var subsetsWithDup = function(nums) {
  const res = []
  let sortNums = nums.sort((a, b) => {
    return a - b
  })
  function fn(index, path) {
    res.push([...path])
    if (index > sortNums.length - 1) {
      return
    }
    for (let i = index;i < sortNums.length;i++) {
      // 如果在一层中，有重复元素，跳过
      if (i > index && sortNums[i] === sortNums[i - 1]) continue
      fn(i + 1, path.concat(sortNums[i]))
    }
  }
  fn(0, [])
  return res
};
// @lc code=end


// @after-stub-for-debug-begin
module.exports = subsetsWithDup;
// @after-stub-for-debug-end