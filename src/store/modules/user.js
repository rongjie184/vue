

import { getNavlist, login } from "@/api/default.js";
import { get_role } from "@/api/evaluate_manage.js";
import { setStore, getStore } from "common/js/session.js";
// state
const state = {
  reSign: false,
  userName: getStore({ name: 'userName' }),
  lastTime: getStore({ name: 'lastTime' }),
  role: {},
  navList: [],
  urlList: {
    '8': '/index/psqManage',
    '9': '/index/psqAdd',
    '10': '/index/userManage',
    '12': '/index/editPass',
    '13': '/index/smoManage',
    '14': '/index/instManage',
    '16': '/index/projectManage',
    '18': '/index/crcList',
    '19': '/index/crcAdd',
    '20': '/index/evaluation',
    '24': '/index/dataManage',
    '25': '/index/deptManage',
  },
  // 要缓存的页面的name列表。
  urlArr: [
    // "MemberManage",
    'psqManage',
    'userManage',
    'smoManage',
    'instManage',
    'projectManage',
    'crcList',
    'evaluation',
  ],
  // 当前需要保存的页面
  aliveUrl: 'index',
}
// mutations
const mutations = {
  SET_ALIVEURL(state, data) {
    state.aliveUrl = data
  },
  SET_NAVLIST(state, data) {
    state.navList = data
  },
  SET_RESIGN(state, data) {
    state.reSign = data
  },
  SET_USERNAME(state ,data) {
    state.userName = data
  },
  SET_LASTTIME(state ,data) {
    state.lastTime = data
  },
  SET_ROLE(state ,data) {
    state.role = data
  }
}
// actions
const actions = {
  getNavlist({ commit, state }) {
    getNavlist().then(res => {
      if (res.err_no == 408) {
        commit('SET_RESIGN', true)
        return
      } else {
        commit('SET_RESIGN', false)
      }
      let list = res.data.map(item => {
        item.child.forEach(item2 => {
          item2.url = state.urlList[item2.id] || 'none'
        });
        return item
      })
      commit('SET_NAVLIST', list)
    });
  },
  getUserRole({ commit, state }){
    get_role().then(res=>{
      commit('SET_ROLE', res.data)
    })
  }
}
// getters
const getters = {
  reSign: state => state.reSign,
  navList: state => state.navList
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}