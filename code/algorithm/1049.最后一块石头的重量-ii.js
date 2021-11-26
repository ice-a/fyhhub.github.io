/*
 * @lc app=leetcode.cn id=1049 lang=javascript
 *
 * [1049] 最后一块石头的重量 II
 */

// @lc code=start
/**
 * @param {number[]} stones
 * @return {number}
 */
var lastStoneWeightII = function(stones) {
  const dp = new Array(30 * 100).fill(0);
  const sum = stones.reduce((a, b) => a + b)
  const target = Math.floor(sum / 2)
  for (let i = 0;i < stones.length;i++) {
    for (let j = target;j >= stones[i];j--) {
      dp[j] = Math.max(dp[j], dp[j - stones[i]] + stones[i])
    }
  }
  console.table(dp)
  return sum - dp[target] - dp[target]
};
// @lc code=end

