
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
    'right-anchor',
    'element-tabs',
    'flowchart', // https://flowchart.vuepress.ulivz.com/#usage
    [
      '@vssue/vuepress-plugin-vssue',
      {
        platform: 'github',
        owner: 'fyhhub',
        repo: 'fyhhub.github.io',
        clientId: 'c31038f73d4704fa988c',
        clientSecret: '7d3a4b9d20632c4685b01cdcfaa05c5b0aaa52f5',
      }
    ]
  ],
  themeConfig: {
    lastUpdated: '最后更新时间',
    sidebar: require('./sidebar').sidebar,
    nav: require('./sidebar').nav
  },
  markdown: {
    lineNumbers: true
  },
  head: [
    ['script', { src: 'https://cdn.bootcdn.net/ajax/libs/react/17.0.2/umd/react.production.min.js', defer: true }],
    ['script', { src: 'https://cdn.bootcdn.net/ajax/libs/react-dom/17.0.2/umd/react-dom.production.min.js', defer: true }],
    ['script', { src: 'https://cdn.jsdelivr.net/npm/@babel/standalone/babel.min.js', defer: true }],
    ['script', {} , `
      var hm1
      (function() {
        hm1 = document.createElement("script");
        hm1.src = "https://www.googletagmanager.com/gtag/js?id=G-BWGLYWG03M";
        var s1 = document.getElementsByTagName("script")[0]; 
        s1.parentNode.insertBefore(hm1, s1);
      })();
      hm1.onload = function() {
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-BWGLYWG03M');
      }
    `]
  ]
}