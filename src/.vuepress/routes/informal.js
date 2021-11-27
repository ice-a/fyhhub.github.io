const { createRoutes } = require('../utils')

const generateRoutes = createRoutes('informal')

const informalEssay_development = generateRoutes('development', 1)
console.log('%c 🍰 informalEssay_development: ', 'font-size:20px;background-color: #3F7CFF;color:#fff;', informalEssay_development);
const informalEssay_reading_notes = generateRoutes('reading-notes', 1)
console.log('%c 🍛 informalEssay_reading_notes: ', 'font-size:20px;background-color: #ED9EC7;color:#fff;', informalEssay_reading_notes);


module.exports = {
  text: '随笔',
  link: '/informal/',
  order: 3,
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