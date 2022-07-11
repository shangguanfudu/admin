import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: () => import('@/views/Login') },
  {
    path: '/home',
    redirect: '/home/user',
    component: () => import('@/views/Home'),
    children: [
      {
        path: 'user',
        name: 'user',
        component: () => import('@/views/User')
      },
      {
        path: 'roles',
        name: 'roles',
        component: () => import('@/views/Roles')
      },
      {
        path: 'rights',
        name: 'rights',
        component: () => import('@/views/Rights')
      },
      {
        path: 'goods',
        name: 'goods',
        component: () => import('@/views/Goods')
      },
      {
        path: 'goods/add',
        name: 'addgood',
        component: () => import('@/views/AddGood')
      },
      {
        path: 'params',
        name: 'params',
        component: () => import('@/views/Params')
      },
      {
        path: 'categories',
        name: 'categories',
        component: () => import('@/views/Categories')
      },
      {
        path: 'orders',
        name: 'orders',
        component: () => import('@/views/Orders')
      },
      {
        path: 'report',
        name: 'report',
        component: () => import('@/views/Report')
      }
    ]
  }

]

const router = new VueRouter({
  routes
})

export default router
