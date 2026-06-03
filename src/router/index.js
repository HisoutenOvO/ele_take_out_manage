import {createRouter, createWebHistory} from 'vue-router'

import LoginView from '../views/login/index.vue'
import LayoutView from '../views/layout/index.vue'
import CategoryView from '../views/category/index.vue'
import DishView from '../views/dish/index.vue'
import OrdersView from '../views/orders/index.vue'
import ShopView from '../views/shop/index.vue'
import ShopDetailView from '../views/shopDetail/index.vue'

const router = createRouter(
    {
        history: createWebHistory(),
        routes: [{
            path: '/',
            name: '',
            component: LayoutView,
            // redirect: '/login',
            children: [
                {path: '/category', name: 'category', component: CategoryView},
                {path: '/dish', name: 'dish', component: DishView},
                {path: '/orders', name: 'orders', component: OrdersView},
                {path: '/shop', name: 'shop', component: ShopView},
                {path: '/shopDetail', name: 'shopDetail', component: ShopDetailView}
            ]
        },
            //与上面子路由的父路由同级
            {path: '/login', name: 'login', component: LoginView}
        ]
    }
)


export default router