import { createRouter, createWebHistory } from 'vue-router'
import Home from './pages/Home.vue'
import Overlay from './pages/Overlay.vue'
import OverlayCustom from './pages/OverlayCustom.vue'

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
    },
    {
        path: '/overlay/valorant/custom',
        name: 'Overlay 2',
        component: OverlayCustom
    }
]

const router = createRouter({ history: createWebHistory(), routes })
export default router