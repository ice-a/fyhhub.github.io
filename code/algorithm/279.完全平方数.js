/*
 * @lc app=leetcode.cn id=279 lang=javascript
 *
 * [279] 完全平方数
 */

// @lc code=start
/**
 * @param {number} n
 * @return {number}
 */
var numSquares = function(n) {
  const dp = new Array(n + 1).fill(Number.MAX_VALUE)
  dp[0] = 0
  // 遍历背包
  for (let i = 0;i <= n;i++) {
    // 遍历物品
    for (let j = 1;j * j <= i;j++) {
      dp[i] = Math.min(dp[i - j * j] + 1, dp[i])
    }
  }
  return dp[n]
};
// @lc code=end

