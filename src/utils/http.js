'use strict'

import axios from 'axios'
import qs from 'qs'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // 轻量级进度条
import 'nprogress/nprogress.css' // 轻量级进度条样式
NProgress.configure({ease:'ease',speed:1500});


// // http request 拦截器
// axios.interceptors.request.use(
//   console.log(store.state.userInfo),
//   config => {
//     if (store.state.userInfo) {
//       config.headers.Authorization = `token ${store.state.userInfo}`
//     }
//     return config
//   },
//   err => {
//     return Promise.reject(err)
//   })
//
// // http response 拦截器
// axios.interceptors.response.use(
//   response => {
//     return response
//   },
//   error => {
//     if (error.response) {
//       switch (error.response.status) {
//         case 401:
//           // 401 清除token信息并跳转到登录页面
//           router.replace({
//             path: 'login',
//             query: {redirect: router.currentRoute.fullPath}
//           })
//       }
//     }
//     // console.log(JSON.stringify(error));//console : Error: Request failed with status code 402
//     return Promise.reject(error)
// })

// 请求超时拦截器
// axios.interceptors.request.use(config => {
//     return config
// }, error => {
//     return Promise.reject(error.response)
// })
//
// // 请求完成后的拦截器
// axios.interceptors.response.use(response => {
//     return response
// }, error => {
//     // 这里我们把错误信息扶正, 后面就不需要写 catch 了
//     return Promise.resolve(error.response)
// })

function checkStatus (response) {
  // loading
  // 如果http状态码正常，则直接返回数据
  if (response && (response.status === 200 || response.status === 304 || response.status === 400)) {
    return response
    // 如果不需要除了data之外的数据，可以直接 return response.data
  }
  // 异常状态下，把错误信息返回去
  NProgress.done(true)
  return {
    status: -404,
    msg: '无法连接到服务器'
  }
}

function checkCode (res) {
  // 如果code异常(这里已经包括网络错误，服务器错误，后端抛出的错误)，可以弹出一个错误提示，告诉用户
  if (res.status === -404) {
    Message({
      showClose: true,
      message: res.msg,
      type: 'error'
    })
  }
  if (res.data && (!res.data.success)) {
  }
  NProgress.done(true)
  return res
}

export default {
  post (url, data) {
    NProgress.inc()
    // NProgress.set(0.4)
    return axios({
      method: 'post',
      // baseURL: 'http://192.168.43.152:8089/',
	  baseURL: 'http://192.168.1.102:8089/',
      url,
      data: qs.stringify(data),
      timeout: 60000,
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
//      'Content-Type': "application/json;charset=UTF-8",
        'Access-Control-Max-Age': '1209600'
         // 'Access-Control-Allow-Headers': 'Authorization,Origin, X-Requested-With, Content-Type, Accept'
        // 'Access-Control-Allow-Methods': 'GET,POST'
      }
    }).then(
      (response) => {
        return checkStatus(response)
      }
    ).then(
      (res) => {
        return checkCode(res)
      }
    )
  },
  get (url, params) {
    return axios({
      method: 'get',
      // baseURL: 'http://192.168.43.152:8089/',
	  baseURL: 'http://192.168.1.102:8089/',
      url,
      params, // get 请求时带的参数
      timeout: 60000,
      headers: {
        'X-Requested-With': 'XMLHttpRequest'
        // 'Access-Control-Allow-Headers': 'Authorization,Origin, X-Requested-With, Content-Type, Accept'
        // 'Access-Control-Allow-Methods': 'GET,POST'
      }
    }).then(
      (response) => {
        return checkStatus(response)
      }
    ).then(
      (res) => {
        return checkCode(res)
      }
    )
  }
}
