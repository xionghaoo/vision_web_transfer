import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // {
    //   path: '/',
    //   name: 'Home',
    //   component: HomeView
    // },
    // {
    //   path: '/humanVideoList',
    //   name: 'HumanVideoList',
    //   component: () => import('../views/HumanVideoList.vue')
    // },
    {
      path: '/',
      name: 'Home',
      component: () => import('../views/VisionPage.vue')
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('../views/Login.vue')
    },
  ]
})

export default router
