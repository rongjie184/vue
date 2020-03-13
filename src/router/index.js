import Vue from 'vue'
import Router from 'vue-router'

const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

Vue.use(Router)

export default new Router({
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      if (from.meta.keepAlive) {
        from.meta.savedPosition = document.body.scrollTop;
      }
      return { x: 0, y: to.meta.savedPosition || 0 }
    }
  },
  routes: [{
    path: '/',
    redirect: { name: 'Login' }
  },
  {
    path: '/Login',
    name: 'Login',
    meta: { title: '登陆' },
    component: () =>
      import( /* webpackChunkName: "home" */ '@/page/home/Login')
  },
  {
    path: '/register',
    name: 'register',
    meta: { title: '注册账号' },
    component: () =>
      import( /* webpackChunkName: "home" */ '@/page/home/register')
  },
  {
    path: '/index',
    meta: { title: '首页' },
    component: () =>
      import( /* webpackChunkName: "home" */ '@/page/home/index'),
    children: [
      {
        path: '',
        meta: { title: '公告' },
        component: () =>
          import( /* webpackChunkName: "home" */ '@/page/home/Welcome')
      },
      /**  ---------问卷管理--------- */
      {
        path: 'psqManage',
        meta: { title: '问卷列表' },
        component: () =>
          import( /* webpackChunkName: "home" */ '@/page/psqManage/index')
      },
      {
        path: 'psqAdd',
        meta: { title: '问卷调查' },
        component: () =>
          import( /* webpackChunkName: "home" */ '@/page/psqManage/qsqAdd')
      },
      {
        path: 'psqShow/:id',
        meta: { title: '查看问卷' },
        props: true,
        component: () =>
          import( /* webpackChunkName: "home" */ '@/page/psqManage/qsqAdd')
      },
      {
        path: 'psqEdit/:edit_id',
        meta: { title: '修改问卷' },
        props: true,
        component: () =>
          import( /* webpackChunkName: "home" */ '@/page/psqManage/qsqAdd')
      },
      /**  ---------用户管理--------- */
      {
        path: 'userManage',
        meta: { title: '用户列表' },
        component: () =>
          import( /* webpackChunkName: "home" */ '@/page/userManage/index')
      },
      {
        path: 'userDetail',
        meta: { title: '用户详情' },
        component: () =>
          import( /* webpackChunkName: "home" */ '@/page/userManage/detail')
      },
      {
        path: 'editPass',
        meta: { title: '修改密码' },
        component: () =>
          import( /* webpackChunkName: "home" */ '@/page/userManage/editPass')
      },
      /**  ---------smo管理--------- */
      {
        path: 'smoManage',
        meta: { title: 'SMO列表' },
        component: () =>
          import( /* webpackChunkName: "home" */ '@/page/smoManage/index')
      },
      /**  ---------研究中心管理--------- */
      {
        path: 'instManage',
        meta: { title: '研究中心列表' },
        component: () =>
          import( /* webpackChunkName: "home" */ '@/page/instManage/index')
      },
      {
        path: 'deptManage',
        meta: { title: '科室管理' },
        component: () =>
          import( /* webpackChunkName: "home" */ '@/page/instManage/dept')
      },
      /**  ---------项目管理--------- */
      {
        path: 'projectManage',
        meta: { title: '项目管理' },
        component: () =>
          import( /* webpackChunkName: "home" */ '@/page/projectManage/index')
      },
      {
        path: 'addProject',
        meta: { title: '添加项目' },
        component: () =>
          import( /* webpackChunkName: "home" */ '@/page/projectManage/add')
      },
      {
        path: 'ItemDetail',
        meta: { title: '项目信息' },
        component: () =>
          import( /* webpackChunkName: "home" */ '@/page/projectManage/detail')
      },
      /**  ---------crc--------- */
      {
        path: 'crcList',
        meta: { title: 'CRC列表' },
        component: () =>
          import( /* webpackChunkName: "home" */ '@/page/crcManage/index')
      },
      {
        path: 'crcAdd',
        meta: { title: '添加CRC' },
        component: () =>
          import( /* webpackChunkName: "home" */ '@/page/crcManage/crc_add')
      },
      {
        path: 'crcEdit/:id',
        meta: { title: '修改CRC' },
        props: true,
        component: () =>
          import( /* webpackChunkName: "home" */ '@/page/crcManage/crc_add')
      },
      {
        path: 'crcInfo/:id',
        meta: { title: 'CRC详情' },
        props: true,
        component: () =>
          import( /* webpackChunkName: "home" */ '@/page/crcManage/crc_info')
      },
      {
        path: 'crcEvaluateDesc/:id',
        meta: { title: 'CRC评价详情' },
        props: true,
        component: () =>
          import( /* webpackChunkName: "home" */ '@/page/crcManage/crc_evaluate_desc')
      },
      /**  ---------crc评价管理--------- */
      {
        path: 'evaluation',
        meta: { title: 'CRC评价管理' },
        component: () =>
          import( /* webpackChunkName: "home" */ '@/page/evaluation_manage/index')
      },
      {
        path: 'addEvaluation',
        meta: { title: '添加评价' },
        component: () =>
          import( /* webpackChunkName: "home" */ '@/page/evaluation_manage/addEvaluation')
      },
      {
        path: 'editEvaluation/:id',
        meta: { title: '编辑评价' },
        props: true,
        component: () =>
          import( /* webpackChunkName: "home" */ '@/page/evaluation_manage/addEvaluation')
      },
      {
        path: 'showEvaluation/:id',
        meta: { title: '评价详情' },
        props: true,
        component: () =>
          import( /* webpackChunkName: "home" */ '@/page/evaluation_manage/editEvaluation')
      },
      {
        path: 'dataManage',
        meta: { title: '数据管理' },
        component: () =>
          import( /* webpackChunkName: "home" */ '@/page/data_statistics/index')
      },
      {
        path: "*",
        name: 'Error',
        component: () =>
          import( /* webpackChunkName: "home" */ '@/page/error_page/404')
      },
    ]
  },
  {
    path: "*",
    name: 'Error',
    component: () =>
      import( /* webpackChunkName: "home" */ '@/page/error_page/404')
  }
  ]
})