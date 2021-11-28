const { createRoutes } = require('../utils')

const generateRoutes = createRoutes('informal')

const informalEssay_development = generateRoutes('development', 1)
const informalEssay_reading_notes = generateRoutes('reading-notes', 1)


module.exports = {
  text: '随笔',
  link: '/informal/',
  order: 19,
  routes: [
    {
      title: '业务开发',
      collapsable: true,
      children: informalEssay_development
    },
    {
      title: '读书笔记',
      collapsable: true,
      children: informalEssay_reading_notes
    }
  ]
}