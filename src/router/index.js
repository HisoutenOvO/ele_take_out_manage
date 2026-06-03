import {createRouter, createWebHistory} from 'vue-router'

import LoginView from '../views/login/index.vue'
import LayoutView from '../views/layout/index.vue'

const router = createRouter(
    {
        history: createWebHistory(),
        routes: [{
            path: '/',
            name: '',
            component: LayoutView,
            // redirect: '/login',
            children: [
            ]
        },
//与上面子路由的父路由同级
            {path: '/login', name: 'login', component: LoginView}
        ]
    }
)


export default router