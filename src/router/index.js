import * as VueRouter from 'vue-router';
import VisionPage from "@/views/VisionPage.vue";

const router = VueRouter.createRouter({
  history: VueRouter.createWebHistory(),
  routes: [
    {
      path: '/:page*',
      name: 'Home',
      component: VisionPage
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('../views/Login.vue')
    },
    {
      path: '/cozeAuth',
      name: 'CozeAuthPage',
      component: () => import('../views/CozeAuthPage.vue')
    },
  ]
})

export default router
