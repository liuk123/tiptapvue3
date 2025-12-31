
<template>
  <div class="page">
    <h2 class="title">TipTap 富文本编辑器</h2>
    <p class="desc">支持常用格式、列表、代码块、引用、链接与图片。</p>
    <tiptap :provider="providerA" :ydoc="ydocA" :room="room"/>
    <tiptap :provider="providerB" :ydoc="ydocB" :room="room"/>
  </div>
</template>
<script setup>
import Tiptap from '../components/tiptap/Tiptap.vue'

import { HocuspocusProvider } from '@hocuspocus/provider'
import * as Y from 'yjs'

const appId = '7j9y6m10'
const room = `room.${new Date()
  .getFullYear()
  .toString()
  .slice(-2)}${new Date().getMonth() + 1}${new Date().getDate()}-ok`

// ydoc and provider for Editor A
const ydocA = new Y.Doc()
const providerA = new HocuspocusProvider({
  appId,
  name: room,
  document: ydocA,
  url: 'ws://127.0.0.1:1234',
  token: 'write',
  onAuthenticated: (provider) => {
    console.log('onAuthenticated1', provider)

  }

})

// ydoc and provider for Editor B
const ydocB = new Y.Doc()
const providerB = new HocuspocusProvider({
  appId,
  name: room,
  document: ydocB,
  url: 'ws://127.0.0.1:1234',
  token: 'write', // readonly
  onAuthenticated: (provider) => {
    console.log('onAuthenticated2', provider)

  }
})
</script>

<style scoped>
.page {
  max-width: 900px;
  margin: 0 auto;
  padding: 10px 16px;
}
.title {
  margin: 0 0 6px;
}
.desc {
  margin: 0 0 12px;
  color: #64748b;
}
</style>
<style lang="less">
  @import '../styles/tiptap.less';
</style>