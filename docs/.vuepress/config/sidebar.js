const glob = require('glob')
const path = require('path')
const generateArticleRoutes = (dir, deep = 2) => {
  const fullPath = path.resolve(__dirname, `../../article/${dir}`)
  const deepMap = {
    1: '/*.md',
    2: '/**/*.md'
  };
  try {
    const files = glob.sync(fullPath + deepMap[deep])
    if (files && files.length) {
      return files.filter(p => !p.includes('README')).map(p => p.slice(p.indexOf(`/article/${dir}`)))
    } else {
      return []
    }
  } catch(e) {
    console.error('解析目录，生成路由配置失败！', e);
  }
}

const algorithm_daily = generateArticleRoutes('algorithm/daily')
const algorithm_binaryTree = generateArticleRoutes('algorithm/binaryTree')
const algorithm_offer = generateArticleRoutes('algorithm/offer')
const algorithm_leetcode = generateArticleRoutes('algorithm/leetcode')
const algorithm_dynamic = generateArticleRoutes('algorithm/dynamic')
const network = generateArticleRoutes('network')
const rollup = generateArticleRoutes('rollup')
const webpack = generateArticleRoutes('webpack')

const javascript_advanced = generateArticleRoutes('javascript/advanced')
const javascript_design = generateArticleRoutes('javascript/design')
const javascript_async = generateArticleRoutes('javascript/async')
const javascript_interview = generateArticleRoutes('javascript/interview')

const informalEssay_development = generateArticleRoutes('informalEssay/development')
const informalEssay_reading_notes = generateArticleRoutes('informalEssay/reading-notes')

const vue_vue2_interview = generateArticleRoutes('vue/vue2-interview')
const vue_vue3_interview = generateArticleRoutes('vue/vue3-interview')
const vue_principle = generateArticleRoutes('vue/principle')
const vue_vue_router = generateArticleRoutes('vue/vue-router')

const react_source = generateArticleRoutes('react/source')
const react_essay = generateArticleRoutes('react/essay')

const microFe_principle = generateArticleRoutes('micro-fe/principle')

const engineering_scaffolding = generateArticleRoutes('engineering/scaffolding')
const engineering = generateArticleRoutes('engineering', 1)

const performance = generateArticleRoutes('performance', 1)
const performance_network = generateArticleRoutes('performance/network')
const performance_webpack = generateArticleRoutes('performance/webpack')

const node = generateArticleRoutes('node', 1);

const vscode = generateArticleRoutes('vscode', 1);


const css = generateArticleRoutes('css', 1);

module.exports = {
  '/article/': [
    {
      title: '算法',
      collapsable: true,
      sidebarDepth: 1,
      children: [
        {
          title: '每日算法',
          collapsable: true,
          children: algorithm_daily
        },
        {
          title: '二叉树',
          collapsable: true,
          children: algorithm_binaryTree
        },
        {
          title: '剑指offer',
          collapsable: true,
          children: algorithm_offer
        },
        {
          title: 'leetcode',
          collapsable: true,
          children: algorithm_leetcode
        },
        {
          title: '动态规划',
          collapsable: true,
          children: algorithm_dynamic
        }
      ]
    },
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
      title: '随笔',
      collapsable: true,
      children: [
        {
          title: '业务开发',
          children: informalEssay_development
        },
        {
          title: '读书笔记',
          children: informalEssay_reading_notes
        }
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
