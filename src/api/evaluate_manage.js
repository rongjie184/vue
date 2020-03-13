import jsonp from './jsonp'
import { setStore } from '../common/js/session';

// 研究机构列表
export const evaluate_list = (data = {}) => {
  return jsonp("/index.php/admin/evaluate/evaluate_list", data).then((res) => {
    return Promise.resolve(res)
  })
}
//select-crc列表
export const crc_list = (data = {}) => {
  return jsonp("/index.php/admin/evaluate/get_crc_list", data).then((res) => {
    return Promise.resolve(res)
  })
}
//select-评价类型列表
export const get_type_list = (data = {}) => {
  return jsonp("/index.php/admin/evaluate/type_list", data).then((res) => {
    return Promise.resolve(res)
  })
}
//添加评价
export const add_evaluate = (data = {}) => {
  return jsonp("/index.php/admin/evaluate/add_evaluate", data).then((res) => {
    return Promise.resolve(res)
  })
}
// 删除评价
export const del_evaluate = (data = {}) => {
  return jsonp("/index.php/admin/evaluate/del_eva", data).then((res) => {
    return Promise.resolve(res)
  })
}
//评价详情
export const evaluate_desc = (data = {}) => {
  return jsonp("/index.php/admin/evaluate/evaluate_desc", data).then((res) => {
    return Promise.resolve(res)
  })
}
//添加评价-select-smolist
export const get_smo_list = (data = {}) => {
  return jsonp("/index.php/admin/evaluate/get_smo_list", data).then((res) => {
    return Promise.resolve(res)
  })
}
//添加评价-select-smolist
export const get_crc_list = (data = {}) => {
  return jsonp("/index.php/admin/evaluate/crc_list", data).then((res) => {
    return Promise.resolve(res)
  })
}
//添加评价-select-smolist
export const get_project_list = (data = {}) => {
  return jsonp("/index.php/admin/evaluate/project_list", data).then((res) => {
    return Promise.resolve(res)
  })
}
//添加评价-smo 申述
export const add_explain = (data = {}) => {
  return jsonp("/index.php/admin/evaluate/add_explain", data).then((res) => {
    return Promise.resolve(res)
  })
}
//添加评价-smo 申述是否同意
export const is_agree_explain = (data = {}) => {
  return jsonp("/index.php/admin/evaluate/is_agree_explain", data).then((res) => {
    return Promise.resolve(res)
  })
}
//添加评价-研究中心,研究者进行反馈
export const feedback = (data = {}) => {
  return jsonp("/index.php/admin/evaluate/feedback", data).then((res) => {
    return Promise.resolve(res)
  })
}
//添加评价-研究中心,研究者进行反馈
export const get_role = (data = {}) => {
  return jsonp("/index.php/admin/evaluate/get_role", data).then((res) => {
    return Promise.resolve(res)
  })
}
//删除评价
export const evaluate_del = (data = {}) => {
  return jsonp("/index.php/admin/evaluate/evaluate_del", data).then((res) => {
    return Promise.resolve(res)
  })
}