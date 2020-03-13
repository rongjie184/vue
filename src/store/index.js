
import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'
import getters from './getters'
// import createLogger from '../../../src/plugins/logger'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  strict: true,
  modules: {
    user
  },
  getters
  // strict: debug,
  // plugins: debug ? [createLogger()] : []
})