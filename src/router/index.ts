import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import VerificadorPontos from '../views/verificador_pontos/VerificadorPontos.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    redirect: '/verificador-pontos'
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
