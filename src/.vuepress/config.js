
const path = require('path')
module.exports = {
  title: 'fyhub’s blog',
  description: '博客',
  dest: path.resolve(__dirname, '../../docs'),
  base: '/',
  plugins: [
    'mermaidjs',
    '@vuepress/plugin-last-updated',
    'demo-block',
    'code-copy',
    'right-anchor',
    'element-tabs'
  ],
  themeConfig: {
    sidebar: require('./config/sidebar'),
    nav: require('./config/nav')
  },
  markdown: {
    lineNumbers: true
  },
  head: [
    ['script', { src: 'https://cdn.bootcdn.net/ajax/libs/react/17.0.2/umd/react.production.min.js', defer: true }],
    ['script', { src: 'https://cdn.bootcdn.net/ajax/libs/react-dom/17.0.2/umd/react-dom.production.min.js', defer: true }],
    ['script', { src: 'https://cdn.jsdelivr.net/npm/@babel/standalone/babel.min.js' }]
  ]
}