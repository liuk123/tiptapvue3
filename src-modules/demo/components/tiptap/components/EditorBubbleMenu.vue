<template>
  <bubble-menu :editor="editor" :tippy-options="{ duration: 100 }" :should-show="shouldShowTextMenu" v-if="editor"
    class="bubble-menu">
    <button @click="editor.chain().focus().toggleBold().run()" :class="{ 'is-active': editor.isActive('bold') }">
      <Icon :name="toolsIcons.fontStyleBold" :size="18" />
    </button>
    <button @click="editor.chain().focus().toggleItalic().run()" :class="{ 'is-active': editor.isActive('italic') }">
      <Icon :name="toolsIcons.fontStyleItalic" :size="18" />
    </button>
    <button @click="editor.chain().focus().toggleStrike().run()" :class="{ 'is-active': editor.isActive('strike') }">
      <Icon :name="toolsIcons.fontStyleStrike" :size="18" />
    </button>
    <button @click="editor.chain().focus().toggleCode().run()" :class="{ 'is-active': editor.isActive('code') }">
      <Icon :name="toolsIcons.code" :size="18" />
    </button>
    <button @click="setLink" :class="{ 'is-active': editor.isActive('link') }">
      <Icon :name="toolsIcons.link" :size="18" />
    </button>
  </bubble-menu>

  <bubble-menu :editor="editor" :tippy-options="{ duration: 100 }" :should-show="shouldShowImageMenu" v-if="editor"
    class="bubble-menu">
    <button @click="editImage" class="bubble-menu-btn">
      <Icon :name="toolsIcons.image" :size="18" />
    </button>
    <button @click="setLink" :class="{ 'is-active': editor.isActive('link') }" class="bubble-menu-btn">
      <Icon :name="toolsIcons.imageExtension.link" :size="18" />
    </button>
  </bubble-menu>

  <bubble-menu :editor="editor" :tippy-options="{ duration: 100 }" :should-show="shouldShowColumnMenu" v-if="editor"
    class="bubble-menu">
    <div style="display:flex;align-items:center;gap:8px;padding:2px 4px;">
      <template v-if="editor.isActive('columns')">
        <label>列</label>
        <button @click="decreaseCols">-</button>
        <button @click="increaseCols">+</button>
        <label>行</label>
        <button @click="decreaseRows">-</button>
        <button @click="increaseRows">+</button>
      </template>
      <label>背景</label>
      <input type="color" :value="columnBackground" @input="onColumnColor($event.target.value)" />
    </div>
  </bubble-menu>

  <bubble-menu v-if="editor" :editor="editor"
    :should-show="() => editor.isActive('bulletList') || editor.isActive('orderedList')"
    :get-referenced-virtual-element="() => getListVirtualElement(['bulletList', 'orderedList'])"
    :options="{ placement: 'top-start', offset: 8 }">
    <div class="bubble-menu">
      <button type="button" @click="toggleListType">Toggle list type</button>
    </div>
  </bubble-menu>


  <floating-menu :editor="editor" v-if="editor">
    <div class="floating-menu">
      <button @click="editor.chain().focus().toggleHeading({ level: 1 }).run()" title="标题1"
        :class="{ 'is-active': editor.isActive('heading', { level: 1 }) }">

        <Icon :name="toolsIcons.heading1" :size="18" />
      </button>
      <button @click="editor.chain().focus().toggleHeading({ level: 2 }).run()" title="标题2"
        :class="{ 'is-active': editor.isActive('heading', { level: 2 }) }">
        <Icon :name="toolsIcons.heading2" :size="18" />
      </button>
      <button @click="editor.chain().focus().toggleHeading({ level: 3 }).run()" title="标题3"
        :class="{ 'is-active': editor.isActive('heading', { level: 3 }) }">
        <Icon :name="toolsIcons.heading3" :size="18" />
      </button>
      <button @click="editor.chain().focus().toggleHeading({ level: 4 }).run()" title="标题4"
        :class="{ 'is-active': editor.isActive('heading', { level: 4 }) }">
        <Icon :name="toolsIcons.heading4" :size="18" />
      </button>
      <button @click="editor.chain().focus().toggleHeading({ level: 5 }).run()" title="标题5"
        :class="{ 'is-active': editor.isActive('heading', { level: 5 }) }">
        <Icon :name="toolsIcons.heading5" :size="18" />
      </button>
      <button @click="editor.chain().focus().toggleHeading({ level: 6 }).run()" title="标题6"
        :class="{ 'is-active': editor.isActive('heading', { level: 6 }) }">
        <Icon :name="toolsIcons.heading6" :size="18" />
      </button>
      <button @click="editor.chain().focus().toggleBulletList().run()" title="无序列表"
        :class="{ 'is-active': editor.isActive('bulletList') }">
        <Icon :name="toolsIcons.listUnOrdered" :size="18" />
      </button>
      <button @click="editor.chain().focus().toggleOrderedList().run()" title="有序列表"
        :class="{ 'is-active': editor.isActive('orderedList') }">
        <Icon :name="toolsIcons.listOrdered" :size="18" />
      </button>
      <button @click="editor.chain().focus().toggleTaskList().run()" title="任务列表"
        :class="{ 'is-active': editor.isActive('taskList') }">
        <Icon :name="toolsIcons.taskList" :size="18" />
      </button>
      <button @click="editor.chain().focus().toggleHighlight().run()" title="高亮"
        :class="{ 'is-active': editor.isActive('highlight') }">
        <Icon :name="toolsIcons.textHilite" :size="18" />
      </button>
    </div>
  </floating-menu>
</template>

<script setup>
import { BubbleMenu, FloatingMenu } from '@tiptap/vue-3/menus'
import Icon from '../../common/Icon.vue'
import { toolsIcons } from '../token/tools-icons.js'
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

const shouldShowColumnsMenu = ({ editor }) => {
  return editor.isActive('columns')
}

const shouldShowColumnMenu = ({ editor }) => {
  return editor.isActive('column') || editor.isActive('columns')
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

const getColumnsAttrs = () => {
  return props.editor?.getAttributes('columns') || {}
}
const getColumnAttrs = () => {
  return props.editor?.getAttributes('column') || {}
}
const columnBackground = getColumnAttrs().background || '#ffffff'
const onColumnColor = (color) => {
  props.editor.chain().focus().updateAttributes('column', { background: color }).run()
}
const increaseCols = () => {
  const { cols = 2, rows = 1 } = getColumnsAttrs()
  props.editor.commands.setColumnsSize({ cols: cols + 1, rows })
}
const decreaseCols = () => {
  const { cols = 2, rows = 1 } = getColumnsAttrs()
  props.editor.commands.setColumnsSize({ cols: Math.max(1, cols - 1), rows })
}
const increaseRows = () => {
  const { cols = 2, rows = 1 } = getColumnsAttrs()
  props.editor.commands.setColumnsSize({ cols, rows: rows + 1 })
}
const decreaseRows = () => {
  const { cols = 2, rows = 1 } = getColumnsAttrs()
  props.editor.commands.setColumnsSize({ cols, rows: Math.max(1, rows - 1) })
}
</script>
