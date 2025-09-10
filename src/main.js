import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import '@fortawesome/fontawesome-free/js/all'


createApp(App).use(router).mount('#app')

// const app = createApp(App)
// app.use(router)
// app.mount('#app')
