(window.webpackJsonp=window.webpackJsonp||[]).push([[118],{520:function(e,t,c){"use strict";c.r(t);var v=c(11),_=Object(v.a)({},(function(){var e=this,t=e.$createElement,c=e._self._c||t;return c("ContentSlotsDistributor",{attrs:{"slot-key":e.$parent.slotKey}},[c("h1",{attrs:{id:"说一下computed如何实现的"}},[c("a",{staticClass:"header-anchor",attrs:{href:"#说一下computed如何实现的"}},[e._v("#")]),e._v(" 说一下computed如何实现的")]),e._v(" "),c("h2",{attrs:{id:"核心答案"}},[c("a",{staticClass:"header-anchor",attrs:{href:"#核心答案"}},[e._v("#")]),e._v(" 核心答案")]),e._v(" "),c("p",[e._v("计算属性会在它使用到的响应式变量变化时，重新求值。在计算属性初始化时，会为其创建"),c("code",[e._v("computed watcher")]),e._v("。\n它重新求值的条件是"),c("code",[e._v("dirty")]),e._v("为"),c("code",[e._v("true")]),e._v(", 核心点在于，响应式变量收集的依赖，它最终会收集到"),c("code",[e._v("computed watcher")]),e._v("和"),c("code",[e._v("渲染watcher")]),e._v("，\n当修改某个响应式变量后，"),c("code",[e._v("computed watcher")]),e._v("会把"),c("code",[e._v("dirty")]),e._v("设置为"),c("code",[e._v("true")]),e._v(", "),c("code",[e._v("渲染watcher")]),e._v("会触发计算属性的getter, 重新求值。")]),e._v(" "),c("h2",{attrs:{id:"补充回答"}},[c("a",{staticClass:"header-anchor",attrs:{href:"#补充回答"}},[e._v("#")]),e._v(" 补充回答")]),e._v(" "),c("ol",[c("li",[c("p",[e._v("为每个computed创建watcher，并且lazy为true, watcher创建时不会进行求值")])]),e._v(" "),c("li",[c("p",[e._v("模板渲染时，触发computed的getter, "),c("code",[e._v("watcher.dirty")]),e._v("为"),c("code",[e._v("true")]),e._v("进行求值")])]),e._v(" "),c("li",[c("p",[e._v("求值过程中，使用到了响应式变量，触发响应式变量getter，收集依赖，此时依赖栈包含"),c("code",[e._v("computed watcher")]),e._v("和"),c("code",[e._v("渲染watcher")])])]),e._v(" "),c("li",[c("p",[e._v("响应式dep收集的依赖是"),c("code",[e._v("computed watcher")]),e._v(", 注意~不是"),c("code",[e._v("渲染watcher")]),e._v("，此时依赖栈包含"),c("code",[e._v("渲染watcher")])])]),e._v(" "),c("li",[c("p",[e._v("计算属性的deps数组收集 响应式变量的Dep对象")])]),e._v(" "),c("li",[c("p",[c("code",[e._v("computed watcher")]),e._v("通知所有的deps，去收集依赖, 此时收集的都是"),c("code",[e._v("渲染watcher")])])]),e._v(" "),c("li",[c("p",[e._v("这时候所有computed用到的响应式变量,其中收集的依赖都包含, "),c("code",[e._v("computed watcher")]),e._v("和"),c("code",[e._v("渲染watcher")])])])])])}),[],!1,null,null,null);t.default=_.exports}}]);