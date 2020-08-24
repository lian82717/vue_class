import Vue from 'vue'
import Router from 'vue-router'
import Dashboard from '@/components/Dashboard'
import Login from '@/components/pages/Login'
import Products from '@/components/pages/Products'
import OrderList from '@/components/pages/OrderList'
import Coupon from '@/components/pages/Coupon'
import CustomOrder from '@/components/pages/CustomOrder'

Vue.use(Router)

const originalPush = Router.prototype.push
Router.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}

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
          name: '產品列表',
          component: Products,
          meta: { requiresAuth: true },
        },
        {
          path: 'order_list',
          name: '訂單列表',
          component: OrderList,
          meta: { requiresAuth: true },
        },
        {
          path: 'coupon',
          name: '優惠券',
          component: Coupon,
          meta: { requiresAuth: true },
        },
      ]
    },
    {
      path: '/',
      name: '模擬後台',
      component: Dashboard,
      children: [
        {
          path: 'custom_order',
          name: '模擬訂單',
          component: CustomOrder,
        }
      ]
    }
  ]
})
