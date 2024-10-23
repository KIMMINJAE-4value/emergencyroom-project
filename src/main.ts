import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import VueAxios from 'vue-axios'
import { createNaverMap } from 'vue3-naver-maps'

const app = createApp(App)

app.use(router)
app.use(VueAxios, axios)

app.use(createNaverMap, {
  clientId: import.meta.env.VITE_NAVER_API_CLIENT_ID,
  subModules: ['geocoder'],
})

app.mount('#app')
