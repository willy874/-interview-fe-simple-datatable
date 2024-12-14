import { createApp } from 'vue'
import { VueQueryPlugin } from '@tanstack/vue-query'
import App from './App.vue'
import router from './router'
import { envPlugin } from '@/libs/env'
import { componentPlugin } from '@/features/components'

export const app = () => {
  const app = createApp(App)
  app.use(envPlugin)
  app.use(componentPlugin)
  app.use(VueQueryPlugin, {
    queryClientConfig: {
      defaultOptions: {
        queries: {
          retry: 1
        }
      }
    }
  })
  app.use(router)
  app.mount('#app')
}
