<script setup>
import useCounterStore  from '../store/index.js'
import useCounterStoreFrmework from '@/framework/store'
const store = useCounterStore()
const frameStore = useCounterStoreFrmework()


</script>

<template>
    <h1>demo</h1>
    <div>store:{{ store.count }}</div>
    <div>frameStore:{{ frameStore.count }}</div>
    <div class="action">
        <button @click="store.increment">increment</button>
        <button @click="frameStore.increment">increment</button>
    </div>
</template>