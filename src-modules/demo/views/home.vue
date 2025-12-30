
<template>
  <div class="page">
    <h2 class="title">TipTap 富文本编辑器</h2>
    <p class="desc">支持常用格式、列表、代码块、引用、链接与图片。</p>
    <tiptap />
  </div>
</template>
<script setup>
import Tiptap from '../components/Tiptap.vue'
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
