const { createRoutes } = require('../utils')

const generateRoutes = createRoutes('basic')

const network = generateRoutes('network')


module.exports = {
  text: '计算机基础',
  link: '/basic/',
  order: 3,
  routes: [
    {
      title: '计算机网络',
      collapsable: true,
      children: network
    }
  ]
}