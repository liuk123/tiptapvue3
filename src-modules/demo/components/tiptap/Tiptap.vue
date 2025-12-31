<template>
  <div class="editor-wrapper">
    <!-- 顶部状态栏 -->
    <div class="editor-header">
      <div class="user-info">
        <input type="color" :value="currentUser.color" @input="updateColor($event.target.value)" class="color-picker" />
        <input type="text" v-model="currentUser.name" @blur="updateName" @keyup.enter="updateName" class="name-input"
          placeholder="输入您的名字" />
      </div>
      <div class="status-info">
        <span class="status-dot" :class="status"></span>
        <span class="status-text">{{ statusText }}</span>
        <div class="online-users">
          <div v-for="user in users" :key="user.clientId" class="user-avatar" :style="{ backgroundColor: user.color }"
            :title="user.name">
            {{ user.name?.charAt(0).toUpperCase() }}
          </div>
          <div class="user-count" v-if="users.length > 0">
            {{ users.length }} 人在线
          </div>
        </div>
      </div>
    </div>

    <!-- 编辑器工具栏 -->
    <div v-if="editor" class="control-group">
      <div class="button-group">
        <button @click="editor.chain().focus().toggleBold().run()"
          :disabled="!editor.can().chain().focus().toggleBold().run()"
          :class="{ 'is-active': editor.isActive('bold') }">
          Bold
        </button>
        <button @click="editor.chain().focus().toggleItalic().run()"
          :disabled="!editor.can().chain().focus().toggleItalic().run()"
          :class="{ 'is-active': editor.isActive('italic') }">
          Italic
        </button>
        <button @click="editor.chain().focus().toggleStrike().run()"
          :disabled="!editor.can().chain().focus().toggleStrike().run()"
          :class="{ 'is-active': editor.isActive('strike') }">
          Strike
        </button>
        <button @click="editor.chain().focus().toggleCode().run()"
          :disabled="!editor.can().chain().focus().toggleCode().run()"
          :class="{ 'is-active': editor.isActive('code') }">
          Code
        </button>
        <button @click="editor.chain().focus().unsetAllMarks().run()">Clear marks</button>
        <button @click="editor.chain().focus().clearNodes().run()">Clear nodes</button>
        <button @click="editor.chain().focus().setParagraph().run()"
          :class="{ 'is-active': editor.isActive('paragraph') }">
          Paragraph
        </button>
        <button @click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
          :class="{ 'is-active': editor.isActive('heading', { level: 1 }) }">
          H1
        </button>
        <button @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
          :class="{ 'is-active': editor.isActive('heading', { level: 2 }) }">
          H2
        </button>
        <button @click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
          :class="{ 'is-active': editor.isActive('heading', { level: 3 }) }">
          H3
        </button>
        <button @click="editor.chain().focus().toggleBulletList().run()"
          :class="{ 'is-active': editor.isActive('bulletList') }">
          Bullet list
        </button>
        <button @click="editor.chain().focus().toggleOrderedList().run()"
          :class="{ 'is-active': editor.isActive('orderedList') }">
          Ordered list
        </button>
        <button @click="editor.chain().focus().toggleTaskList().run()"
          :class="{ 'is-active': editor.isActive('taskList') }">
          Task list
        </button>
        <button @click="editor.chain().focus().toggleHighlight().run()"
          :class="{ 'is-active': editor.isActive('highlight') }">
          Highlight
        </button>
        <button @click="editor.chain().focus().toggleCodeBlock().run()"
          :class="{ 'is-active': editor.isActive('codeBlock') }">
          Code block
        </button>
        <button @click="editor.chain().focus().toggleBlockquote().run()"
          :class="{ 'is-active': editor.isActive('blockquote') }">
          Blockquote
        </button>
        <button @click="editor.chain().focus().setHorizontalRule().run()">Horizontal rule</button>
        <button @click="editor.chain().focus().setHardBreak().run()">Hard break</button>
        <button @click="editor.chain().focus().undo().run()" :disabled="!editor.can().undo()">
          Undo
        </button>
        <button @click="editor.chain().focus().redo().run()" :disabled="!editor.can().redo()">
          Redo
        </button>
        <button @click="setLink" :class="{ 'is-active': editor.isActive('link') }">链接</button>
        <button @click="addImage">图片</button>
      </div>
    </div>

    <!-- 编辑器内容区域 -->
    <editor-content :editor="editor" class="editor-content" />

    <div class="editor-footer" v-if="editor">
      <div class="character-count">
        {{ editor.storage.characterCount.characters() }} 字符
        |
        {{ editor.storage.characterCount.words() }} 单词
      </div>
    </div>
  </div>
</template>

<script setup>
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import Placeholder from '@tiptap/extension-placeholder'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
import { ListItem } from '@tiptap/extension-list'
import { Color } from '@tiptap/extension-color'
import { TextStyle } from '@tiptap/extension-text-style'
import Highlight from '@tiptap/extension-highlight'
import Collaboration from '@tiptap/extension-collaboration'
import CollaborationCaret from '@tiptap/extension-collaboration-caret'
import CharacterCount from '@tiptap/extension-character-count'
import CollaborationHistory from './extensions/CollaborationHistory.js'
import { ref, onMounted, onBeforeUnmount, computed, defineProps, watch } from 'vue'
import * as Y from 'yjs'


// Props 定义
const props = defineProps({
  ydoc: {
    type: Object,
    required: true,
  },
  provider: {
    type: Object,
    required: true,
  },
  room: {
    type: String,
    required: false,
  },
})



// 常量定义
const colors = [
  '#958DF1', '#F98181', '#FBBC88', '#FAF594', '#70CFF8', '#94FADB', '#B9F18D',
  '#C3E2C2', '#EAECCC', '#AFC8AD', '#EEC759', '#9BB8CD', '#FF90BC', '#FFC0D9',
  '#DC8686', '#7ED7C1', '#F3EEEA', '#89B9AD', '#D0BFFF', '#FFF8C9', '#CBFFA9',
  '#9BABB8', '#E3F4F4'
]

const names = [
  'Lea Thompson', 'Cyndi Lauper', 'Tom Cruise', 'Madonna', 'Jerry Hall', 'Joan Collins',
  'Winona Ryder', 'Christina Applegate', 'Alyssa Milano', 'Molly Ringwald', 'Ally Sheedy',
  'Debbie Harry', 'Olivia Newton-John', 'Elton John', 'Michael J. Fox', 'Axl Rose',
  'Emilio Estevez', 'Ralph Macchio', 'Rob Lowe', 'Jennifer Grey', 'Mickey Rourke',
  'John Cusack', 'Matthew Broderick', 'Justine Bateman', 'Lisa Bonet'
]

// const defaultContent = `
//   <p>Hi 👋, this is a collaborative document.</p>
//   <p>Feel free to edit and collaborate in real-time!</p>
// `

// 随机生成工具函数
const getRandomElement = list => list[Math.floor(Math.random() * list.length)]
const getRandomColor = () => getRandomElement(colors)
const getRandomName = () => getRandomElement(names)

// 状态管理
const status = ref('connecting')
const users = ref([])
const currentUser = ref({
  name: localStorage.getItem('currentUser_name') || getRandomName(),
  color: localStorage.getItem('currentUser_color') || getRandomColor()
})

// 计算属性
const statusText = computed(() => {
  switch (status.value) {
    case 'connected': return '已连接'
    case 'connecting': return '连接中...'
    case 'disconnected': return '已断开'
    default: return '未知状态'
  }
})
console.log(props.ydoc.getXmlFragment('body'))
const yxmlFragment = props.ydoc.getXmlFragment('prosemirror')
const undoManager = new Y.UndoManager(yxmlFragment)




// 初始化编辑器 (useEditor 必须在 setup 顶层调用)
const editor = useEditor({
  enableContentCheck: true,
  editable: true,
  onContentError: ({ disableCollaboration }) => {
    disableCollaboration()
  },
  extensions: [
    StarterKit.configure({
      history: false, // Collaboration 需要禁用默认 history
    }),
    Link.configure({ autolink: true, openOnClick: true, linkOnPaste: true }),
    Image.configure({
      resize: {
        enabled: true,
        directions: ['top', 'bottom', 'left', 'right'], // can be any direction or diagonal combination
        minWidth: 50,
        minHeight: 50,
        alwaysPreserveAspectRatio: true,
      }
    }),
    Placeholder.configure({ placeholder: '在此输入内容，大家都能看到...' }),
    TaskList,
    TaskItem.configure({
      nested: true,
    }),
    Color.configure({ types: [TextStyle.name, ListItem.name] }),
    TextStyle.configure({ types: [ListItem.name] }),
    Highlight,


    CharacterCount.configure({ limit: 10000 }),
    Collaboration.configure({
      document: props.ydoc,
      // fragment: props.ydoc.getXmlFragment('body'),
    }),
    CollaborationCaret.configure({
      provider: props.provider,
    }),
    CollaborationHistory.configure({
      undoManager, // 传入上面创建的实例
    }),
  ],
  editorProps: {
    attributes: {
      // class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl m-5 focus:outline-none',
    },
  },
  onCreate: () => {
    // 确保内容同步
    // if (props.provider) {
    //   props.provider.on('synced', () => {
    //     if (currentEditor.isEmpty) {
    //       // 只在文档完全为空时设置默认内容（避免覆盖已有内容）
    //       currentEditor.commands.setContent(defaultContent)
    //     }
    //   })
    // }
  }
})

// 更新用户信息
const updateUserInfo = () => {
  if (props.provider && props.provider.awareness) {
    props.provider.awareness.setLocalStateField('user', {
      name: currentUser.value.name,
      color: currentUser.value.color,
    })
  }

  // 保存到本地存储
  localStorage.setItem('currentUser_name', currentUser.value.name)
  localStorage.setItem('currentUser_color', currentUser.value.color)
}

// 监听 currentUser 变化
watch(
  () => currentUser.value,
  (newUser) => {
    localStorage.setItem('currentUser', JSON.stringify(newUser))
    if (editor.value) {
      editor.value.chain().focus().updateUser(newUser).run()
    }
  },
  { immediate: true }
)

// 监听 Awareness 变化
onMounted(() => {
  // 注册 Provider 事件
  if (props.provider) {
    props.provider.on('status', event => {
      status.value = event.status
    })

    props.provider.on('synced', () => {
      console.log('Document synced')
    })

    if (props.provider.awareness) {
      updateUserInfo()

      // props.provider.awareness.on('change', () => {
      props.provider.on("awarenessUpdate", ({ states }) => {
        const activeUsers = []

        states.forEach((state, clientId) => {
          if (state.user && clientId !== props.provider.awareness.clientID) {
            activeUsers.push({
              clientId,
              ...state.user
            })
          }
        })

        users.value = activeUsers
      })
    }
  }
})

// 方法
const setLink = () => {
  const url = window.prompt('请输入链接地址')
  if (url === null) return
  if (url === '') {
    editor.value?.chain().focus().extendMarkRange('link').unsetLink().run()
    return
  }
  editor.value?.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
}

const addImage = () => {
  const url = window.prompt('请输入图片地址')
  if (!url) return
  editor.value?.chain().focus().setImage({ src: url }).run()
}

const updateName = () => {
  updateUserInfo()
}

const updateColor = (color) => {
  currentUser.value.color = color
  updateUserInfo()

  // 强制更新光标颜色
  editor.value?.chain().focus().updateUser({ color: color }).run()
}

// 清理资源
onBeforeUnmount(() => {
  editor.value?.destroy()
})
</script>

<style scoped lang="less">
.editor-wrapper {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  height: 600px;
  /* 固定高度或者使用 flex */
  overflow: hidden;
  border: 1px solid #e0e0e0;
}

.editor-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  background: #f8f9fa;
  border-bottom: 1px solid #e9ecef;

  .user-info {
    display: flex;
    align-items: center;
    gap: 0.5rem;

    .color-picker {
      width: 28px;
      height: 28px;
      border: none;
      padding: 0;
      background: none;
      cursor: pointer;
      border-radius: 4px;
    }

    .name-input {
      border: 1px solid #ced4da;
      border-radius: 4px;
      padding: 0.25rem 0.5rem;
      font-size: 0.9rem;
      width: 120px;

      &:focus {
        outline: none;
        border-color: #70CFF8;
      }
    }
  }

  .status-info {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-size: 0.85rem;
    color: #6c757d;

    .status-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background-color: #ccc;

      &.connected {
        background-color: #28a745;
      }

      &.connecting {
        background-color: #ffc107;
      }

      &.disconnected {
        background-color: #dc3545;
      }
    }

    .online-users {
      display: flex;
      align-items: center;
      gap: -8px;

      .user-avatar {
        width: 24px;
        height: 24px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
        font-weight: bold;
        font-size: 0.75rem;
        border: 2px solid #fff;
        margin-left: -8px;

        &:first-child {
          margin-left: 0;
        }
      }

      .user-count {
        margin-left: 8px;
        font-size: 0.75rem;
      }
    }
  }
}

.control-group {
  padding: 0.5rem 1rem;
  border-bottom: 1px solid #e9ecef;
  background: #fff;
  z-index: 10;

  .button-group {
    display: flex;
    flex-wrap: wrap;
    gap: 0.25rem;

    button {
      background: transparent;
      border: 1px solid transparent;
      border-radius: 4px;
      padding: 0.25rem 0.5rem;
      cursor: pointer;
      font-size: 0.9rem;
      color: #495057;

      &:hover {
        background-color: #f1f3f5;
      }

      &.is-active {
        background-color: #e7f5ff;
        color: #1971c2;
        border-color: #d0ebff;
      }

      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
    }
  }
}

.editor-content {
  flex: 1;
  overflow-y: auto;
  padding: 1rem 1.5rem;

  :deep(.ProseMirror) {
    outline: none;
    min-height: 100%;

    /* Collaboration Cursor Styles */
    .collaboration-cursor__caret {
      border-left: 1px solid #0d0d0d;
      border-right: 1px solid #0d0d0d;
      margin-left: -1px;
      margin-right: -1px;
      pointer-events: none;
      position: relative;
      word-break: normal;
    }

    .collaboration-cursor__label {
      border-radius: 3px 3px 3px 0;
      color: #0d0d0d;
      font-size: 12px;
      font-style: normal;
      font-weight: 600;
      left: -1px;
      line-height: normal;
      padding: 0.1rem 0.3rem;
      position: absolute;
      top: -1.4em;
      user-select: none;
      white-space: nowrap;
      z-index: 10;
    }

    ul[data-type="taskList"] {
      list-style: none;
      padding: 0;

      li {
        display: flex;
        align-items: flex-start;

        >label {
          flex: 0 0 auto;
          margin-right: 0.5rem;
          user-select: none;
        }

        >div {
          flex: 1 1 auto;
        }
      }
    }
  }
}

.editor-footer {
  padding: 0.5rem 1rem;
  border-top: 1px solid #e9ecef;
  font-size: 0.8rem;
  color: #adb5bd;
  text-align: right;
  background-color: #fcfcfc;
}
</style>
