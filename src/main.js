import babelpolyfill from 'babel-polyfill' // 解决 vuex requires a Promise polyfill in this browser 的问题
import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css' // 此路径会因版本不同而不同   import 'element-ui/lib/theme-default/index.css'
import VueRouter from 'vue-router'
import axios from 'axios' // 一个基于Promise 用于浏览器和 nodejs 的 HTTP 客户端
import store from './vuex/store'
import Vuex from 'vuex'
import './common/icon/iconfont.css' // 阿里图标库
import routes from './routes' // 路由
import NProgress from 'nprogress' // 轻量级进度条
import 'nprogress/nprogress.css' // 轻量级进度条样式
import Moment from 'moment'

Vue.use(Moment)
Vue.use(ElementUI)
Vue.use(VueRouter)
Vue.use(Vuex)

// 跨域携带cookie
axios.defaults.withCredentials = true

Vue.config.productionTip = false

Vue.prototype.imgService = 'http://192.168.43.152/ftp' // 图片显示url  
Vue.prototype.uploadService = 'http://192.168.43.152:8089/' //上传图片url

// 时间格式化
Vue.filter('dataFormat', function (inputstr, showsplit, showweek) {
     inputstr = inputstr + ""; //末尾加一个空格
    var date = "";
    var month = new Array();
    var week = new Array();

    month["Jan"] = 1; month["Feb"] = 2; month["Mar"] = 3; month["Apr"] = 4; month["May"] = 5; month["Jun"] = 6;
    month["Jul"] = 7; month["Aug"] = 8; month["Sep"] = 9; month["Oct"] = 10; month["Nov"] = 11; month["Dec"] = 12;
    week["Mon"] = "一"; week["Tue"] = "二"; week["Wed"] = "三"; week["Thu"] = "四"; week["Fri"] = "五"; week["Sat"] = "六"; week["Sun"] = "日";

    var str = inputstr.split(" ");

    date = str[5];
    date += showsplit + month[str[1]] + showsplit + str[2] + " " + str[3];
    if(showweek){
    date += " " + " 星期" + week[str[0]];
    }

    return date;
})
//自定义moment全局过滤器
Vue.filter('converTime',function(data,formatStr){  
    return Moment(data).format(formatStr);
})
// 时间格式化使用规则
// var a="Wed Mar 22 13:38:37 CST 2017";
//    var b=new Date(a);
//    var c=todate(a, "-", true);
//    var d=todate(a, "", false);
//
//    alert(b); //Thu Mar 23 2017 03:38:37 GMT+0800 (中国标准时间)
//    alert(c); //2017-3-22 星期三
//    alert(d); //2017322

const router = new VueRouter({
  routes
})

// url 拦截
router.beforeEach((to, from, next) => {
  if (to.path == '/login') {
    sessionStorage.removeItem('user');
  }
  let user = JSON.parse(sessionStorage.getItem('user'));
  if (!user && to.path != '/login') {
    next({ path: '/login' })
  } else if(user && to.path != '/login' && to.path != '/404' && to.path != '/'){
    let permis = user.userPerms
    let allow = true
    for (var i = 0,length = permis.length; i < length; i++) {
      let children = permis[i].children
      for (var j = 0,leng = children.length; j < leng; j++) {
        if(to.path === children[j].url) {
          allow = true
        }
      }
    }
    if (allow) {
      console.log('有权限进入' + to.path);
      next()
    } else {
      console.log('没有权限进入' + to.path);
      next({ path: '/404' })
    }
  } else {
    next()
  }
})
router.afterEach(transition => {
})


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
