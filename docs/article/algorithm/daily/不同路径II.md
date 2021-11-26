# 不同路径II
一个机器人位于一个 m x n 网格的左上角 （起始点在下图中标记为“Start” ）。

机器人每次只能向下或者向右移动一步。机器人试图达到网格的右下角（在下图中标记为“Finish”）。

现在考虑网格中有障碍物。那么从左上角到右下角将会有多少条不同的路径？

![示例](https://assets.leetcode.com/uploads/2018/10/22/robot_maze.png)

网格中的障碍物和空位置分别用 1 和 0 来表示。


**示例1：**

![示例](https://assets.leetcode.com/uploads/2020/11/04/robot1.jpg)
```
输入：obstacleGrid = [[0,0,0],[0,1,0],[0,0,0]]
输出：2
解释：
3x3 网格的正中间有一个障碍物。
从左上角到右下角一共有 2 条不同的路径：
1. 向右 -> 向右 -> 向下 -> 向下
2. 向下 -> 向下 -> 向右 -> 向右
```


## 思路
转移方程：
```js
if (obstacleGrid[i][j] === 1) continue
dp[i][j] = dp[i - 1][j] + dp[i][j - 1]
```


## 题解
```js {20,21}
/**
 * @param {number[][]} obstacleGrid
 * @return {number}
 */
var uniquePathsWithObstacles = function(obstacleGrid) {
  const m = obstacleGrid.length;
  const n = obstacleGrid[0].length;
  const dp = []
  for (let i = 0;i < m;i++) {
    dp.push([])
    for (let j = 0;j < n;j++) {
      dp[i][j] = 0
    }
  }
  for (let i = 0;i < m && obstacleGrid[i][0] === 0;i++) dp[i][0] = 1;
  for (let i = 0;i < n && obstacleGrid[0][i] === 0;i++) dp[0][i] = 1;

  for (let i = 1;i < m;i++) {
    for (let j = 1;j < n;j++) {
      if (obstacleGrid[i][j] === 1) continue
      dp[i][j] = dp[i - 1][j] + dp[i][j - 1]
    }
  }
  return dp[m - 1][n - 1]
};
```

::: tip
来源：力扣（LeetCode）</br>
著作权归领扣网络所有。商业转载请联系官方授权，非商业转载请注明出处。
:::