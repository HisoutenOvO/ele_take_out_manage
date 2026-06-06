import { createRouter, createWebHistory } from 'vue-router'
import { ElMessage } from 'element-plus'

import LoginView from '../views/login/index.vue'
import LayoutView from '../views/layout/index.vue'
import CategoryView from '../views/category/index.vue'
import DishView from '../views/dish/index.vue'
import OrdersView from '../views/orders/index.vue'
import ShopView from '../views/shop/index.vue'
import ShopDetailView from '../views/shopDetail/index.vue'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            name: '',
            component: LayoutView,
            children: [
                { path: '/category', name: 'category', component: CategoryView },
                { path: '/dish', name: 'dish', component: DishView },
                { path: '/orders', name: 'orders', component: OrdersView },
                { path: '/shop', name: 'shop', component: ShopView },
                { path: '/shopDetail', name: 'shopDetail', component: ShopDetailView }
            ]
        },
        {
            path: '/login',
            name: 'login',
            component: LoginView,
            meta: { noAuth: true }
        }
    ]
})

// 全局前置守卫
router.beforeEach((to, from, next) => {
    if (to.meta.noAuth) {
        next()
        return
    }

    const token = localStorage.getItem('token')
    if (token) {
        next()
    } else {
        ElMessage.warning('登录已超时，请重新登录')
        next('/login')
    }
})

export default router