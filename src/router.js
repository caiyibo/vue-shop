import Vue from 'vue'
import Router from 'vue-router'
import Login from './components/Login.vue'
import Home from './components/Home.vue'
import Welcome from './components/Welcome.vue'
import Users from './components/user/User.vue'

Vue.use(Router)

const router = new Router({
  routes: [
    {path:'/',redirect: '/login'},
    {path: '/login', component: Login },
    {path: '/home',
     component: Home,
     redirect:'/welcome',
     children:[
      {path:'/welcome',component:Welcome},
      {path:'/users',component:Users}
    ]}
  ]
})

//挂载路由导航守卫
router.beforeEach((to,from,next) =>{
  //to表示将要访问的路径
  //from 代表从哪个路径跳转而来
  //next  是一个函数 表示放行
  //方式一：next() 直接放行
  //方式二：next('/login') 强制跳转
  if(to.path === '/login') return next();
  //获取token
  const tokenstr = window.sessionStorage.getItem('token')
  //如果没有token 强制跳转到登录页面
  if(!tokenstr) return next('/login')
  next()
})

export default router