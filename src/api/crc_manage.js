import jsonp from './jsonp'
import { setStore } from '../common/js/session';

// crc列表
export const crc_list = (data = {}) => {
  return jsonp("/index.php/admin/crc_manage/crc_list", data).then((res) => {
    return Promise.resolve(res)
  })
}
// 添加crc
export const add_crc = (data = {}) => {
  return jsonp("/index.php/admin/crc_manage/add_crc", data).then((res) => {
    return Promise.resolve(res)
  })
}
export const del_crc = (data = {}) => {
  return jsonp("/index.php/admin/crc_manage/del_crc", data).then((res) => {
    return Promise.resolve(res)
  })
}
// 编辑crc
export const edit_crc = (data = {}) => {
  return jsonp("/index.php/admin/crc_manage/edit_crc", data).then((res) => {
    return Promise.resolve(res)
  })
}
// crc详情
export const crc_info = (data = {}) => {
  return jsonp("/index.php/admin/crc_manage/crc_info", data).then((res) => {
    return Promise.resolve(res)
  })
}
// crc修改时详情
export const crc_edit_info = (data = {}) => {
  return jsonp("/index.php/admin/crc_manage/crc_einfo", data).then((res) => {
    return Promise.resolve(res)
  })
}
// crc评价详情
export const crc_pingjia_info = (data = {}) => {
  return jsonp("/index.php/admin/crc_manage/crc_pinfo", data).then((res) => {
    return Promise.resolve(res)
  })
}
// 下载模版
export const down_template = (data = {}) => {
  return jsonp("/index.php/admin/crc_manage/down_template", data).then((res) => {
    return Promise.resolve(res)
  })
}
// 批量导入crc
export const crc_import = (data = {}) => {
  return jsonp("/index.php/admin/crc_manage/crc_import", data).then((res) => {
    return Promise.resolve(res)
  })
}
// 导出crc
export const crc_export = (data = {}) => {
  return jsonp("/index.php/admin/crc_manage/crc_export", data).then((res) => {
    return Promise.resolve(res)
  })
}
// crc年龄列表
export const crc_age = (data = {}) => {
  return jsonp("/index.php/admin/crc_manage/crc_age", data).then((res) => {
    return Promise.resolve(res)
  })
}
// crc创建证书
export const create_finish_certificate = (data = {}) => {
  return jsonp("/index.php/admin/crc_manage/create_finish_certificate", data).then((res) => {
    return Promise.resolve(res)
  })
}
//select-crc列表
export const select_crc_list = (data = {}) => {
  return jsonp("/index.php/admin/evaluate/get_crc_list", data).then((res) => {
    return Promise.resolve(res)
  })
}