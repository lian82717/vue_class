import Vue from 'vue'
import Router from 'vue-router'
import Dashboard from '@/components/Dashboard'
import Login from '@/components/pages/Login'
import Products from '@/components/pages/Products'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '*',
      redirect: 'login'
    },
    {
      path: '/login',
      name: '登入',
      component: Login
    },
    {
      path: '/admin',
      name: '後台',
      component: Dashboard,
      children: [
        {
          path: 'products',
          name: '產品',
          component: Products,
          meta: { requiresAuth: true },
        },
      ]
    },
  ]
})
