<template>
  <bubble-menu :editor="editor" :tippy-options="{ duration: 100 }" :should-show="shouldShowTextMenu" v-if="editor"
    class="bubble-menu">
    <button @click="editor.chain().focus().toggleBold().run()" :class="{ 'is-active': editor.isActive('bold') }">
      Bold
    </button>
    <button @click="editor.chain().focus().toggleItalic().run()" :class="{ 'is-active': editor.isActive('italic') }">
      Italic
    </button>
    <button @click="editor.chain().focus().toggleStrike().run()" :class="{ 'is-active': editor.isActive('strike') }">
      Strike
    </button>
    <button @click="editor.chain().focus().toggleCode().run()" :class="{ 'is-active': editor.isActive('code') }">
      Code
    </button>
    <button @click="setLink" :class="{ 'is-active': editor.isActive('link') }">
      Link
    </button>
  </bubble-menu>

  <bubble-menu :editor="editor" :tippy-options="{ duration: 100 }" :should-show="shouldShowImageMenu" v-if="editor"
    class="bubble-menu">
    <button @click="editImage" class="bubble-menu-btn">
      更换图片
    </button>
    <button @click="setLink" :class="{ 'is-active': editor.isActive('link') }" class="bubble-menu-btn">
      {{ editor.isActive('link') ? '修改链接' : '添加链接' }}
    </button>
  </bubble-menu>

  <bubble-menu v-if="editor" :editor="editor"
    :should-show="() => editor.isActive('bulletList') || editor.isActive('orderedList')"
    :get-referenced-virtual-element="() =>getListVirtualElement(['bulletList', 'orderedList'])" :options="{ placement: 'top-start', offset: 8 }">
    <div class="bubble-menu">
      <button type="button" @click="toggleListType">Toggle list type</button>
    </div>
  </bubble-menu>


  <floating-menu :editor="editor" v-if="editor">
    <div class="floating-menu">
      <button @click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
        :class="{ 'is-active': editor.isActive('heading', { level: 1 }) }">
        H1
      </button>
      <button @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
        :class="{ 'is-active': editor.isActive('heading', { level: 2 }) }">
        H2
      </button>
      <button @click="editor.chain().focus().toggleBulletList().run()"
        :class="{ 'is-active': editor.isActive('bulletList') }">
        Bullet list
      </button>
    </div>
  </floating-menu>
</template>

<script setup>
import { BubbleMenu, FloatingMenu } from '@tiptap/vue-3/menus'
import { findParentNode, posToDOMRect } from '@tiptap/core'
import { defineProps } from 'vue'

const props = defineProps({
  editor: {
    type: Object,
    required: true,
  },
})

const shouldShowTextMenu = ({ editor, view, state, from, to }) => {
  // 不显示在空选区
  if (from === to) {
    return false
  }

  // 如果选中了图片，不显示文本菜单
  if (editor.isActive('image')) {
    return false
  }

  return true
}

const shouldShowImageMenu = ({ editor }) => {
  return editor.isActive('image')
}

const editImage = () => {
  const url = window.prompt('请输入图片地址', props.editor.getAttributes('image').src)
  if (url && url.trim()) {
    props.editor.chain().focus().setImage({ src: url }).run()
  }
}

const setLink = () => {
  const previousUrl = props.editor.getAttributes('link').href
  const url = window.prompt('请输入链接地址', previousUrl)

  // cancelled
  if (url === null) {
    return
  }

  // empty
  if (url === '') {
    const chain = props.editor.chain().focus()

    if (!props.editor.isActive('image')) {
      chain.extendMarkRange('link')
    }

    chain.unsetLink().run()
    return
  }

  // update link
  const chain = props.editor.chain().focus()

  if (!props.editor.isActive('image')) {
    chain.extendMarkRange('link')
  }

  chain.setLink({ href: url }).run()
}

const getListVirtualElement = (nodeNames) => {
  const editor = props.editor
  const parentNode = findParentNode(node => nodeNames.includes(node.type.name))(
    editor.state.selection,
  )
  if (parentNode) {
    const domRect = posToDOMRect(editor.view, parentNode.start, parentNode.start + parentNode.node.nodeSize)
    return {
      getBoundingClientRect: () => domRect,
      getClientRects: () => [domRect],
    }
  }
  return null
}
const toggleListType = () => {
  const editor = props.editor
  const chain = editor.chain().focus()
  if (editor.isActive('bulletList')) {
    chain.toggleOrderedList()
  } else {
    chain.toggleBulletList()
  }
  chain.run()
}
</script>
