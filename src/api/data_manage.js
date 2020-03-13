import jsonp from './jsonp'
import { setStore } from '../common/js/session';

// 研究机构列表
export const get_inst = (data = {}) => {
  return jsonp("/index.php/admin/register/get_inst", data).then((res) => {
    return Promise.resolve(res)
  })
}
// 科室机构列表
export const get_dept = (data = {}) => {
  return jsonp("/index.php/admin/register/get_dept", data).then((res) => {
    return Promise.resolve(res)
  })
}
// 不同年龄段CRC人数分布统计中，根据中心科室获取研究者列表-select
export const get_researcher_list = (data = {}) => {
  return jsonp("/index.php/admin/DataStatistics/get_researcher_list", data).then((res) => {
    return Promise.resolve(res)
  })
}
// SMO公司列表
export const get_smo = (data = {}) => {
  return jsonp("/index.php/admin/register/get_smo", data).then((res) => {
    return Promise.resolve(res)
  })
}
// SMO公司列表
export const get_years_list = (data = {}) => {
  return jsonp("/index.php/admin/DataStatistics/get_years_list", data).then((res) => {
    return Promise.resolve(res)
  })
}
// 概况统计研究者总数
export const get_general_num = (data = {}) => {
  return jsonp("/index.php/admin/DataStatistics/general_num", data).then((res) => {
    return Promise.resolve(res)
  })
}
// 不同年龄段CRC人数分布统计，CRC人数统计图数据条形表-柱图1
export const get_crc_num = (data = {}) => {
  return jsonp("/index.php/admin/DataStatistics/get_crc_num", data).then((res) => {
    return Promise.resolve(res)
  })
}
// CRC从业时间人数统计条形表-柱图2
export const get_workyears = (data = {}) => {
  return jsonp("/index.php/admin/DataStatistics/workyears", data).then((res) => {
    return Promise.resolve(res)
  })
}
// CRC从业时间人数统计圆形百分比图-饼图1
export const get_workyears_percentage = (data = {}) => {
  return jsonp("/index.php/admin/DataStatistics/workyears_percentage", data).then((res) => {
    return Promise.resolve(res)
  })
}
// SMO的CRC人数统计-柱图3
export const get_smocrc_people_num = (data = {}) => {
  return jsonp("/index.php/admin/DataStatistics/smocrc_people_num", data).then((res) => {
    return Promise.resolve(res)
  })
}
// crc科室统计-柱图4
export const get_crc_dept_distribution = (data = {}) => {
  return jsonp("/index.php/admin/DataStatistics/crc_dept_distribution", data).then((res) => {
    return Promise.resolve(res)
  })
}
// crc评价类型-柱图5
export const get_crc_evaluate = (data = {}) => {
  return jsonp("/index.php/admin/DataStatistics/crc_evaluate", data).then((res) => {
    return Promise.resolve(res)
  })
}
// crc证书统计-柱图6
export const get_certificate = (data = {}) => {
  return jsonp("/index.php/admin/DataStatistics/certificate", data).then((res) => {
    return Promise.resolve(res)
  })
}
// SMO的CRC人数统计-线图1
export const get_crc_grade = (data = {}) => {
  return jsonp("/index.php/admin/DataStatistics/crc_grade", data).then((res) => {
    return Promise.resolve(res)
  })
}