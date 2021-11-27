const { createRoutes } = require('../utils')

const generateRoutes = createRoutes('frontend')


// ====================================文章======================================
const network = generateRoutes('network')
const rollup = generateRoutes('rollup')
const webpack = generateRoutes('webpack')

const javascript_advanced = generateRoutes('javascript/advanced')
const javascript_design = generateRoutes('javascript/design')
const javascript_async = generateRoutes('javascript/async')
const javascript_interview = generateRoutes('javascript/interview')

const vue_vue2_interview = generateRoutes('vue/vue2-interview')
const vue_vue3_interview = generateRoutes('vue/vue3-interview')
const vue_principle = generateRoutes('vue/principle')
const vue_vue_router = generateRoutes('vue/vue-router')

const react_source = generateRoutes('react/source')
const react_essay = generateRoutes('react/essay')

const microFe_principle = generateRoutes('micro-fe/principle')

const engineering_scaffolding = generateRoutes('engineering/scaffolding')
const engineering = generateRoutes('engineering', 1)

const performance = generateRoutes('performance', 1)
const performance_network = generateRoutes('performance/network')
const performance_webpack = generateRoutes('performance/webpack')

const node = generateRoutes('node', 1);

const vscode = generateRoutes('vscode', 1);


const css = generateRoutes('css', 1);

module.exports = {
  text: '前端',
  link: '/frontend/',
  order: 1,
  routes: [
    {
      title: 'Javascript',
      collapsable: true,
      children: [
        {
          title: 'JS进阶',
          collapsable: true,
          children: javascript_advanced
        },
        {
          title: '异步编程',
          collapsable: true,
          children: javascript_async
        },
        {
          title: '设计模式',
          collapsable: true,
          children: javascript_design
        },
        {
          title: '面试题',
          collapsable: true,
          children: javascript_interview
        }
      ]
    },
    {
      title: '网络',
      collapsable: true,
      children: network
    },
    {
      title: 'rollup',
      collapsable: true,
      children: rollup
    },
    {
      title: 'webpack',
      collapsable: true,
      children: webpack
    },
    {
      title: 'Vue',
      collapsable: true,
      children: [
        {
          title: 'Vue2 面试题',
          collapsable: true,
          children: vue_vue2_interview
        },
        {
          title: 'Vue3 面试题',
          collapsable: true,
          children: vue_vue3_interview
        },
        {
          title: '原理',
          collapsable: true,
          children: vue_principle
        },
        {
          title: 'Vue-Router',
          collapsable: true,
          children: vue_vue_router
        }
      ]
    },
    {
      title: 'React',
      collapsable: true,
      children: [
        {
          title: '随笔',
          collapsable: true,
          children: react_essay
        },
        {
          title: '源码',
          collapsable: true,
          children: react_source
        }
      ]
    },
    {
      title: '微前端',
      collapsable: true,
      children: [
        {
          title: '原理',
          collapsable: true,
          children: microFe_principle
        }
      ]
    },
    {
      title: '前端性能优化实践',
      collapsable: true,
      children: [
        {
          title: '网络优化',
          collapsable: true,
          children: performance_network
        },
        {
          title: 'webpack优化',
          collapsable: true,
          children: performance_webpack
        }
      ]
    },
    {
      title: '前端工程化',
      collapsable: true,
      children: [
        {
          title: '脚手架',
          collapsable: true,
          // path: '/article/engineering/scaffolding/', // 添加完整路径时 分类可以有README
          children: engineering_scaffolding
        },
        ...engineering
      ]
    },
    {
      title: 'Node',
      collapsable: true,
      children: [
        ...node
      ]
    },
    {
      title: 'VSCode',
      collapsable: true,
      children: [
        ...vscode
      ]
    },
    {
      title: 'CSS',
      collapsable: true,
      children: [
        ...css
      ]
    },
  ]
}