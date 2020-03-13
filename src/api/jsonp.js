import vue from 'vue'// Object.assign用到
import axios from 'axios'
import qs from "qs";
import { getStore, clearStore, setStore } from '../common/js/session';
import router from '../router'

let baseUrl = ''
const jsonp = (api, query = {}, method = "post") => {
  let option = {
    'emulateJSON': true,
    method: method,
    url: baseUrl + api
  };
  if (option.method.toLowerCase() === 'post' ||
  option.method.toLowerCase() === 'put' ||
  option.method.toLowerCase() === 'patch') {
    option.data = qs.stringify(query);
    // option.data = query;
  } else {
    option.params = Object.assign({}, query);
  }
  return new Promise((resolve, reject) => {
    axios.defaults.headers.Token = getStore({name:'token'})
    axios(option)
      .then((res) => {
        if (res.status >= 200 && res.status < 300) {
          switch (res.data.err_no) {
            // 401: token失效
            case 401:
              clearStore()
              router.replace({ path: '/login' })
              break;
            default:
              resolve(res.data);
              break
          }
        } else {
          reject(new Error(res.status));
        }
      }).catch(err=>{
        alert("部分链接存在错误")
      })
  });
};
export default jsonp;