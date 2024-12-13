import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { envPlugin } from './libs/env'

const app = createApp(App)

app.use(envPlugin)
app.use(router)

app.mount('#app')
