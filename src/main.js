import { createApp } from 'vue'
import App from './App.vue'
import router from './framework/router'
import init from './framework/init'
import { createPinia } from 'pinia'
import './framework/styles/main.less'

const pinia = createPinia()



init(()=>{
    const app = createApp(App)
    app.use(router).use(pinia)
    app.mount('#app')
    return app
})
