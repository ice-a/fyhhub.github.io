const glob = require('glob')
const path = require('path')

const createRoutes = (title) => {
  const generateRoutes = (dir, deep = 2) => {
    const fullPath = path.resolve(__dirname, `../${title}/${dir}`)
    const deepMap = {
      1: '/*.md',
      2: '/**/*.md'
    };
    try {
      const rule = path.join(fullPath, deepMap[deep]);
      const files = glob.sync(rule)
      if (files && files.length) {
        return files.filter(p => !p.includes('README')).map(p => p.slice(p.indexOf(`/${title}/${dir}`)))
      } else {
        return []
      }
    } catch(e) {
      console.error('解析目录，生成路由配置失败！', e);
    }
  }
  return generateRoutes
}

module.exports.createRoutes = createRoutes