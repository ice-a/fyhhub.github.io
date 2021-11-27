const { createRoutes } = require('../utils')

const generateRoutes = createRoutes('algorithm')



const algorithm_daily = generateRoutes('daily', 1)
const algorithm_binaryTree = generateRoutes('binaryTree', 1)
const algorithm_offer = generateRoutes('offer', 1)
const algorithm_leetcode = generateRoutes('leetcode', 1)
const algorithm_dynamic = generateRoutes('dynamic', 1)

module.exports = {
  text: '算法',
  link: '/algorithm/',
  order: 2,
  routes: [
    {
      title: '每日算法',
      collapsable: true,
      children: algorithm_daily
    },
    {
      title: '二叉树',
      collapsable: true,
      children: algorithm_binaryTree
    },
    {
      title: '剑指offer',
      collapsable: true,
      children: algorithm_offer
    },
    {
      title: 'leetcode',
      collapsable: true,
      children: algorithm_leetcode
    },
    {
      title: '动态规划',
      collapsable: true,
      children: algorithm_dynamic
    }
  ]
}