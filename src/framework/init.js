import registModule from './registModule'
import router from './router'

export default function (v){
    registModule({ router }).then(v)
}