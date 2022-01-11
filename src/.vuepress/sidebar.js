const path = require('path')
const fs = require('fs')

const nav = [
  { text: '首页', link: '/' },
  { text: '前端', link: '/frontend/' },
  { text: '算法', link: '/algorithm/' },
  { text: '计算机基础', link: '/basic/' },
  { text: '随笔', link: '/informal/' },
  { text: '面经', link: '/interview/' },
  { text: '留言板', link: '/comment/' }
]


let sideBarConfigArr = []
function generateSideBar(pathline, sideBarConfig, url, item) {
  // 获取路径下的所有文件和文件夹名称
  let mdDirs = fs.readdirSync(pathline)
  const hasReadme = mdDirs.some(e => e.includes('README'))
  mdDirs = mdDirs.filter(dir => !dir.startsWith('.'))

  // 如果当前目录没有readme 需要删掉父级path属性
  if (!hasReadme) {
    delete item.path
  }


  // 遍历
  mdDirs.forEach(dir => {
    // 获取当前文件或文件夹路径
    const fullpath = path.resolve(pathline, dir)
    const stats = fs.statSync(fullpath)

    // 如果是文件夹继续递归
    if (stats.isDirectory()) {
      const item = {
        title: dir,
        path: `${url}/${dir}/`.replace(/\/+/g, '/'),
        children: []
      }
      generateSideBar(path.resolve(pathline, dir), item.children, `${url}/${dir}/`.replace(/\/+/g, '/'), item)
      sideBarConfig.push(item)
    // 如果是个文件
    } else if (stats.isFile()) {
      // 如果是readme
      if (dir.includes('README')) {
        // sideBarConfig.push(url)
      } else {
        sideBarConfig.push(`${url}/${dir}`.replace(/\/+/g, '/'))
      }
    }
  });
}
generateSideBar(path.resolve(__dirname, '../../src'), sideBarConfigArr, '')

// 单独处理最顶层分类
sideBarConfigArr = sideBarConfigArr.reduce((config, item) => (config[item.path] = item.children, config), {})


module.exports = {
  sidebar: sideBarConfigArr,
  nav
}
