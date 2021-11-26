const express = require('express')
const app = express()
const path = require('path')
const fs = require('fs')
app.use('/article', express.static(path.resolve(__dirname, '../docs/.vuepress/dist/article')))
app.use('/assets', express.static(path.resolve(__dirname, '../docs/.vuepress/dist/assets')))
app.use('/public', express.static(path.resolve(__dirname, '../docs/.vuepress/public')))

app.get('/', function(_req, res) {
  res.sendFile(require('path').join(__dirname, '../docs/.vuepress/dist/index.html'))
})

app.post('/deploy', function(_req, res) {
  console.log(_req);
  const child_process = require('child_process')
  child_process.exec('cd ' + path.resolve(__dirname, '../'))
  child_process.exec('git pull git@e.coding.net:fanyihui/fyhub/fyh-blog.git master')
  child_process.exec('npm i')
  const dist = path.resolve(__dirname, './docs/.vuepress/dist');
  if (fs.existsSync(dist)) {
    child_process.exec('rm -rf ' + dist);
  }
  child_process.exec('npm run build')
  res.end()
})


app.listen(3000, () => {
  console.log('http://localhost:3000')
})
