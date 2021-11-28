const { createRoutes } = require('../utils')

const generateRoutes = createRoutes('comment')

module.exports = {
  text: '留言板',
  link: '/comment/',
  order: 20,
  routes: [
  ]
}