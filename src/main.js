// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import _ from 'lodash'
import * as filters from 'common/js/filters' // 全局filter
import VueClipboard from 'vue-clipboard2'
VueClipboard.config.autoSetContainer = true
Vue.use(VueClipboard)

// 

import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'

Vue.use(Antd)
// 
Vue.prototype._ = _

Vue.config.productionTip = false

//加载过滤器
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})
// 路由是否缓存
router.beforeEach((to, from, next) => {
  let urlArr = store.state.user.urlArr
  let name = to.fullPath.slice(7)
  if (urlArr.indexOf(name)!=-1) {
    store.commit('user/SET_ALIVEURL', name)
  }
  next()
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
