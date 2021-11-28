
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
    'element-tabs',
    [
      '@vssue/vuepress-plugin-vssue',
      {
        platform: 'github',
        // 其他的 Vssue 配置
        owner: 'fyhhub',
        repo: 'fyhhub.github.io',
        clientId: 'c31038f73d4704fa988c',
        clientSecret: '7d3a4b9d20632c4685b01cdcfaa05c5b0aaa52f5 ',
      }
    ]
  ],
  themeConfig: {
    sidebar: require('./sidebar').sidebar,
    nav: require('./sidebar').nav
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