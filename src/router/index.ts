import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/verificador-pontos',
    name: 'verificador-pontos',
    component: () => import('../views/verificador_pontos/VerificadorPontos.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
