import Vue from 'vue'
import App from './App.vue'
import router from './router'
// import './plugins/element.js'
import './assets/css/global.css'
import './assets/font/iconfont.css'
import NProgress from 'nprogress'
import axios from 'axios'

Vue.config.productionTip = false

// 服务请求的根路径, 默认是本地静态地址
axios.defaults.baseURL = 'http://localhost:8080/'
// 请求拦截器 每次请求都会带Authorization 参数
axios.interceptors.request.use(config => {
  NProgress.start() // 在request中展示进度条
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})

// 在response中结束进度条
axios.interceptors.response.use(config => {
  NProgress.done()
  return config
})

Vue.prototype.$http = axios

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
