
import * as VueRouter from "vue-router"


const Home = { template: '<div>/demo/hello</div>' }

const routes = [
  { path: '/', component: Home },
]

const router = VueRouter.createRouter({
  history: VueRouter.createWebHashHistory(),
  routes,
})


export default router