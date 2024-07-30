import { createRouter, createWebHistory } from 'vue-router'
import { userUserStore } from '@/stores' 
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/login' , component:() => import('@/views/login/LoginPage.vue')}, //登录页
    {
      path: '/',
      component: () => import('@/views/layout/LayoutContainer.vue'),
      redirect: '/article/manage',  //重定向至首页
      children:[
        {
          path: 'article/manage',
          component: () => import('@/views/article/ArticleManage.vue')
        },
        {
          path: 'article/channel',
          component: () => import('@/views/article/ArticleChannel.vue')
        },
        {
          path: 'user/profile',
          component: () => import('@/views/user/UserProfile.vue')
        },
        {
          path: 'user/avatar',
          component: () => import('@/views/user/UserAvatar.vue')
        },
        {
          path: 'user/password',
          component: () => import('@/views/user/UserPassword.vue')
        }
      ]
    }
  ]
})

//登录访问拦截 => 默认是拦截的
//根据返回值决定是放行还是拦截
//返回值：
//  1.undefined / true   直接放行
//  2.false 拦回from的地址页面
//  3.具体路径 或 路径对象  拦截到相应的地址
router.beforeEach((to) => {
  const userStore = userUserStore()
  if(!userStore.token && to.path !== '/login') return '/login'
  return true
}) 
 
export default router
