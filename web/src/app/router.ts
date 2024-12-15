import { createRouter, createWebHistory } from 'vue-router'
import { routes as authRoutes } from '@/features/auth'
import { routes as productRoutes } from '@/features/product'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      redirect: '/products',
    },
    ...authRoutes,
    ...productRoutes
  ],
})

export default router
