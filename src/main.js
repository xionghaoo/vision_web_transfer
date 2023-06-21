import './assets/main.css'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// import * as Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'

const axiosInstance = axios.create({
    withCredentials: true,
})

const app = createApp(App)

app.config.globalProperties.$axios = { ...axiosInstance }

app.use(router)
app.use(ElementPlus)
app.use(VueAxios, axios)
app.mount('#app')

