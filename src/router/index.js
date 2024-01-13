import * as VueRouter from 'vue-router';
import VisionPage from "@/views/VisionPage.vue";

const router = VueRouter.createRouter({
  history: VueRouter.createWebHashHistory(),
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
      component: VisionPage
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('../views/Login.vue')
    },
  ]
})

export default router
