export const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('./LoginView.vue'),
  },
  {
    path: '/logout',
    name: 'logout',
    component: () => import('./LogoutView.vue'),
  },
]
