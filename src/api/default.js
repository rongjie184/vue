import jsonp from './jsonp'
import { setStore } from '../common/js/session';
// 登录
export const login = (data = {}) => {
  return jsonp("/index.php/admin/login/checklogin", data).then((res) => {
    setStore({ name: "token", content: res.data.token })
    setStore({ name: "lastTime", content: res.data.last_login_time })
    setStore({ name: "userName", content: res.data.uname })
    return Promise.resolve(res)
  })
}
// 注销
export const logout = (data) => {
  return jsonp("/index.php/admin/login/login_out", data).then((res) => {
    return Promise.resolve(res)
  })
}
//注册
export const regsiter = (data) => {
  return jsonp("/index.php/admin/register/register_do", data)
}
/* -------------------- 修改密码  ------------------------*/
//验证 邮箱/验证码
export const checkCode = (data) => {
  return jsonp("/index.php/admin/login/checkcode", data)
}
//发送验证码
export const sendCode = (data) => {
  return jsonp("/index.php/admin/login/sendcode", data)
}
//修改密码
export const updatePass = (data) => {
  return jsonp("/index.php/admin/login/updatepass_do", data)
}
// 
// 获取用户信息
export const get_user_info = (data) => {
  return jsonp("/index.php/admin/userinfo/get_user_info", data).then((res) => {
    return Promise.resolve(res)
  })
}
// 获取用户信息
export const edit_user_info = (data) => {
  return jsonp("/index.php/admin/userinfo/edit_user_info", data).then((res) => {
    return Promise.resolve(res)
  })
}
// 获取用户信息
export const edit_user_password = (data) => {
  return jsonp("/index.php/admin/userinfo/edit_user_password", data).then((res) => {
    return Promise.resolve(res)
  })
}
// 获取个人导航列表
export const getNavlist = (data = {}) => {
  return jsonp("/index.php/admin/menulist/userlist", data).then((res) => {
    return Promise.resolve(res)
  })
}
//公告列表
export const remindlist = () => {
  return jsonp("/index.php/admin/menulist/remindlist")
}
//公告列表
export const remindAll = (data) => {
  return jsonp("/index.php/admin/menulist/remind_allread",data)
}
//公告列表
export const remindRead = (data) => {
  return jsonp("/index.php/admin/menulist/remind_read",data)
}
/* -------------------- 用户管理  ------------------------*/
//用户角色列表
export const getRoleList = () => {
  return jsonp("/index.php/admin/register/get_role")
}
//研究机构列表
export const getInst = () => {
  return jsonp("/index.php/admin/register/get_inst")
}
//研究机构列表
export const getSmo = () => {
  return jsonp("/index.php/admin/register/get_smos")
}
//科室列表
export const getDept = (data) => {
  return jsonp("/index.php/admin/register/get_dept",data)
}
//停启用
export const editState = (data) => {
  return jsonp("/index.php/admin/user_manage/edit_state",data)
}
//用户列表
export const getUserList = (data) => {
  return jsonp("/index.php/admin/user_manage/user_list", data)
}
//添加用户
export const addUser = (data) => {
  return jsonp("/index.php/admin/user_manage/add_user_do", data)
}
//用户信息
export const getUserInfo = (data) => {
  return jsonp("/index.php/admin/user_manage/get_user_info", data)
}
//编辑用户
export const editUser = (data) => {
  return jsonp("/index.php/admin/user_manage/edit_user_do", data)
}
//修改密码
export const editPass = (data) => {
  return jsonp("/index.php/admin/user_manage/edit_pass", data)
}
/* -------------------- 问卷管理  ------------------------*/
//问卷列表
export const questionList = (data) => {
  return jsonp("/index.php/admin/questionnaire/list", data)
}
//问卷列表
export const getNotice = (data) => {
  return jsonp("/index.php/admin/questionnaire/get_notice", data)
}
//问卷题目
export const getTitle = (data) => {
  return jsonp("/index.php/admin/questionnaire/get_title", data)
}
//发送问卷
export const postAnswer = (data) => {
  return jsonp("/index.php/admin/questionnaire/add", data)
}
//修改问卷
export const editAnswer = (data) => {
  return jsonp("/index.php/admin/questionnaire/edit", data)
}
//获取已有问卷
export const getAnswue = (data) => {
  return jsonp("/index.php/admin/questionnaire/view", data)
}
/* -------------------- smo列表  ------------------------*/
//smo列表
export const smoList = (data) => {
  return jsonp("/index.php/admin/inst/smo_list", data)
}
//smo状态
export const smoStatus = (data) => {
  return jsonp("/index.php/admin/inst/change_smo_status", data)
}
//新建smo
export const createSmo = (data) => {
  return jsonp("/index.php/admin/inst/create_smo",data)
}
//批量删除 
export const delsmo = (data) => {
  return jsonp("/index.php/admin/inst/del_smo",data)
}
/* -------------------- 研究中心管理  ------------------------*/
//中心列表
export const instList = (data) => {
  return jsonp("/index.php/admin/inst/inst_list",data)
}
//中心状态
export const instStatus = (data) => {
  return jsonp("/index.php/admin/inst/change_inst_status",data)
}
//新建中心
export const createInst = (data) => {
  return jsonp("/index.php/admin/inst/create_inst",data)
}
//批量删除中心
export const delInst = (data) => {
  return jsonp("/index.php/admin/inst/del_inst",data)
}
//科室列表
export const deptList = (data) => {
  return jsonp("/index.php/admin/inst/dept_list",data)
}
//科室状态
export const deptStatus = (data) => {
  return jsonp("/index.php/admin/inst/change_dept_status",data)
}
//新建科室
export const createDept = (data) => {
  return jsonp("/index.php/admin/inst/create_dept",data)
}
//批量删除科室
export const delDept = (data) => {
  return jsonp("/index.php/admin/inst/del_dept",data)
}
/* -------------------- 项目管理  ------------------------*/
//获取试验类型
export const getTestType = (data) => {
  return jsonp("/index.php/admin/item/get_test_type",data)
}
//获取试验类型
export const getTestStage = (data) => {
  return jsonp("/index.php/admin/item/get_test_stage",data)
}
//研究中心
export const getInstList = (data) => {
  return jsonp("/index.php/admin/item/get_inst_list",data)
}
//crc列表
export const getCrcList = (data) => {
  return jsonp("/index.php/admin/item/get_crc_list",data)
}
//研究者
export const getreList = (data) => {
  return jsonp("/index.php/admin/item/get_researcher_list",data)
}
//新建项目
export const createItem = (data) => {
  return jsonp("/index.php/admin/item/create",data)
}
//项目列表
export const itemList = (data) => {
  return jsonp("/index.php/admin/item/list",data)
}
//项目列表
export const getItemInfo = (data) => {
  return jsonp("/index.php/admin/item/get_items",data)
}
//删除项目
export const delItem = (data) => {
  return jsonp("/index.php/admin/item/del_item",data)
}
//修改项目
export const updateItem = (data) => {
  return jsonp("/index.php/admin/item/update",data)
}
//添加人员功能select列表
export const user_role = (data) => {
  return jsonp("/index.php/admin/user_manage/user_role",data)
}