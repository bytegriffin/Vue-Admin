import Vue from 'vue'
import Router from 'vue-router'

const Login = () => import(/* webpackChunkName: "home_login_welcome" */ '../components/Login.vue')
const Home = () => import(/* webpackChunkName: "home_login_welcome" */ '../components/Home.vue')
const Welcome = () => import(/* webpackChunkName: "home_login_welcome" */ '../components/Welcome.vue')

const Users = () => import(/* webpackChunkName: "user_right_role" */ '../components/user/Users.vue')
const Rights = () => import(/* webpackChunkName: "user_right_role" */ '../components/power/Rights.vue')
const Roles = () => import(/* webpackChunkName: "user_right_role" */ '../components/power/Roles.vue')

Vue.use(Router)

const router = new Router({
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login },
    {
      path: '/home',
      component: Home,
      redirect: '/welcome',
      children: [
        { path: '/welcome', component: Welcome },
        { path: '/users', component: Users },
        { path: '/rights', component: Rights },
        { path: '/roles', component: Roles }
      ]
    }
  ]
})
// 添加路由导航守卫beforeEach：当客户端的token值为空时，应该返回登录页面重新登录
// to 将要访问的路径 from 从哪个路径来 next 成功继续执行
// 注意：退出功能也是基于token，只需要将session中的token值清除掉，下列方法就会跳转到登录页面
// 如果请求的是本地静态地址，可以先注释掉下列代码，它只作用于动态请求
// router.beforeEach((to, from, next) => {
//   if (to.path === '/login') return next()
//   const tokenStr = window.sessionStorage.getItem('token')
//   if (!tokenStr) return next('/login')
//   next()
// })

export default router
