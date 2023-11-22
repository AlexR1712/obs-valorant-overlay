import { createRouter, createWebHistory } from 'vue-router'
import Home from './pages/Home.vue'
import Overlay from './pages/Overlay.vue'

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        path: '/overlay/valorant',
        name: 'Overlay',
        component: Overlay
    }
]

const router = createRouter({ history: createWebHistory(), routes })
export default router