<script setup>
import useCounterStore  from '../store/index.js'
import useCounterStoreFrmework from '@/framework/store'
import useDemoCountStore from '../../demo/store'
const store = useCounterStore()
const frameStore = useCounterStoreFrmework()
const demoStore = useDemoCountStore()


</script>

<template>
    <h1>demo2</h1>
    <div>store:{{ store.count }}</div>
    <div>frameStore:{{ frameStore.count }}</div>
    <div>demoStore:{{ demoStore.count }}</div>
    <div class="action">
        <button @click="store.increment">store increment</button>
        <button @click="frameStore.increment">frameStore increment</button>
        <button @click="demoStore.increment">demoStore increment</button>
    </div>
</template>