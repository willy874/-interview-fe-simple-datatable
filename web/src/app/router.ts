import { createRouter, createWebHistory } from 'vue-router'
import { routes as authRoutes } from '@/features/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      redirect: '/products',
    },
    ...authRoutes,
    {
      path: '/products',
      name: 'products',
      component: () => import('../features/product/ProductView.vue'),
    },
  ],
})

export default router
