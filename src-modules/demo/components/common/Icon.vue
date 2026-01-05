<template>
  <span class="icon" :style="{ '--t-icon': `url(${src})` }" v-if="src">
  </span>
</template>

<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  name: { type: String, required: true },
})

const src = require(`../../assets/icons/${props.name || ''}.svg`)

</script>

<style scoped lang="less">
.icon {
  position: relative;
  display: inline-block;
  inline-size: 1em;
  block-size: 1em;
  font-size: 1.5rem;
  flex-shrink: 0;
  vertical-align: middle;
  box-sizing: border-box;
  mask: var(--t-icon) no-repeat center/contain;


  &::after,
  &[insIcons]::after {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    content: '';
    background: currentColor;
  }
}
</style>
