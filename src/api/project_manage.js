import jsonp from './jsonp'
import { setStore } from '../common/js/session';
// 下载模版
export const down_project_template = (data = {}) => {
  return jsonp("/index.php/admin/item/down_template", data).then((res) => {
    return Promise.resolve(res)
  })
}
// 项目导入
export const project_import = (data = {}) => {
  return jsonp("/index.php/admin/item/item_import", data).then((res) => {
    return Promise.resolve(res)
  })
}