const path = require('path')
const fs = require('fs')

const sidebar = {}
const nav = [
  { text: '首页', link: '/' }
]

let configList = []
const dirs = fs.readdirSync(path.resolve(__dirname, './routes'))
dirs.forEach(dir => {
  const fullPath = path.resolve(__dirname, './routes', dir)
  try {
    configList.push(require(fullPath))
  } catch (e) {
    throw new Error('配置未导出: ' + fullPath)
  }
})
configList.sort((a, b) => (a.order || 0) - (b.order || 0))
configList.forEach(config => {
  sidebar[config.link] = config.routes;
  nav.push({
    text: config.text,
    link: config.link
  })
})
console.log('%c 🍌 nav: ', 'font-size:20px;background-color: #FFDD4D;color:#fff;', nav);


module.exports = {
  sidebar,
  nav
}
