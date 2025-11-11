import { defineStore } from 'pinia'
import { computed, ref } from 'vue'


const useCounterStoreFrmework = defineStore('counter1', ()=>{
    const count = ref(0)
    const doubleCount = computed(()=>count.value*2)
    function increment(){
        count.value++
    }
    return {
        count,
        doubleCount,
        increment
    }
})
export default useCounterStoreFrmework