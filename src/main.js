import { createApp } from 'vue'


import App from './App.vue'
import router from './router'
import pinia from './stores'
import '@/assets/main.scss'

const app = createApp(App)

/* app.use(createPinia()) */


app.use(router)
app.use(pinia)

app.mount('#app')
