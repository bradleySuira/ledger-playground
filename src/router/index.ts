import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
  {
    path: '',
    redirect: '/playground'
  },
  {
    path: '/playground',
    component: () => import ('../views/Playground/Playground.vue')
  },
  {
    path: '/bitcoin',
    component: () => import ('../views/Bitcoin/BitcoinTests.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
