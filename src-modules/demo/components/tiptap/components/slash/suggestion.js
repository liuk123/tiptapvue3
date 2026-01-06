import { computePosition, flip, shift } from '@floating-ui/dom'
import { posToDOMRect, VueRenderer } from '@tiptap/vue-3'
import { toolsIcons } from '../../token/tools-icons.js'

import CommandsList from './commandsList.vue'

const updatePosition = (editor, element) => {
  const virtualElement = {
    getBoundingClientRect: () => posToDOMRect(editor.view, editor.state.selection.from, editor.state.selection.to),
  }

  computePosition(virtualElement, element, {
    placement: 'bottom-start',
    strategy: 'absolute',
    middleware: [shift(), flip()],
  }).then(({ x, y, strategy }) => {
    element.style.width = 'max-content'
    element.style.position = strategy
    element.style.left = `${x}px`
    element.style.top = `${y}px`
  })
}

export default {
  items: ({ query }) => {
    return [
      {
        title: 'paragraph',
        icon: toolsIcons.fontStylePreview,
        command: ({ editor, range }) => {
          editor.chain().focus().deleteRange(range).setNode('paragraph').run()
        },
      },
      {
        title: 'Heading 1',
        icon: toolsIcons.heading1,
        command: ({ editor, range }) => {
          editor.chain().focus().deleteRange(range).setNode('heading', { level: 1 }).run()
        },
      },
      {
        title: 'Heading 2',
        icon: toolsIcons.heading2,
        command: ({ editor, range }) => {
          editor.chain().focus().deleteRange(range).setNode('heading', { level: 2 }).run()
        },
      },
      {
        title: 'Heading 3',
        icon: toolsIcons.heading3,
        command: ({ editor, range }) => {
          editor.chain().focus().deleteRange(range).setNode('heading', { level: 3 }).run()
        },
      },
      {
        title: 'Heading 4',
        icon: toolsIcons.heading4,
        command: ({ editor, range }) => {
          editor.chain().focus().deleteRange(range).setNode('heading', { level: 4 }).run()
        },
      },
      {
        title: 'Heading 5',
        icon: toolsIcons.heading5,
        command: ({ editor, range }) => {
          editor.chain().focus().deleteRange(range).setNode('heading', { level: 5 }).run()
        },
      },
      {
        title: 'Heading 6',
        icon: toolsIcons.heading6,
        command: ({ editor, range }) => {
          editor.chain().focus().deleteRange(range).setNode('heading', { level: 6 }).run()
        },
      },
      {
        title: 'Bold',
        icon: toolsIcons.fontStyleBold,
        command: ({ editor, range }) => {
          editor.chain().focus().deleteRange(range).setMark('bold').run()
        },
      },
      {
        title: 'Italic',
        icon: toolsIcons.fontStyleItalic,
        command: ({ editor, range }) => {
          editor.chain().focus().deleteRange(range).setMark('italic').run()
        },
      },
      {
        title: 'Strike',
        icon: toolsIcons.fontStyleStrike,
        command: ({ editor, range }) => {
          editor.chain().focus().deleteRange(range).setMark('strike').run()
        },
      },
      
      {
        title: 'Columns',
        icon: toolsIcons.insertTable,
        command: ({ editor, range }) => {
          editor
            .chain()
            .focus()
            .deleteRange(range)
            .insertColumns({ cols: 2, rows: 2 })
            .run()
        },
      },
      // {
      //   title: 'Code',
      //   icon: toolsIcons.code,
      //   command: ({ editor, range }) => {
      //     editor.chain().focus().deleteRange(range).setMark('code').run()
      //   },
      // },
      {
        title: 'BulletList',
        icon: toolsIcons.listUnOrdered,
        command: ({ editor, range }) => {
          editor.chain().focus().deleteRange(range).toggleBulletList().run()
        },
      },
      {
        title: 'OrderedList',
        icon: toolsIcons.listOrdered,
        command: ({ editor, range }) => {
          editor.chain().focus().deleteRange(range).toggleOrderedList().run()
        },
      },
      {
        title: 'TaskList',
        icon: toolsIcons.taskList,
        command: ({ editor, range }) => {
          editor.chain().focus().deleteRange(range).toggleTaskList().run()
        },
      },
    ]
      .filter(item => item.title.toLowerCase().startsWith(query.toLowerCase()))
      .slice(0, 50)
  },

  render: () => {
    let component

    return {
      onStart: props => {
        component = new VueRenderer(CommandsList, {
          // using vue 2:
          // parent: this,
          // propsData: props,
          props,
          editor: props.editor,
        })

        if (!props.clientRect) {
          return
        }

        component.element.style.position = 'absolute'

        document.body.appendChild(component.element)

        updatePosition(props.editor, component.element)
      },

      onUpdate(props) {
        component.updateProps(props)

        if (!props.clientRect) {
          return
        }

        updatePosition(props.editor, component.element)
      },

      onKeyDown(props) {
        if (props.event.key === 'Escape') {
          component.destroy()
          component.element.remove()

          return true
        }

        return component.ref?.onKeyDown(props)
      },

      onExit() {
        component.destroy()
        component.element.remove()
      },
    }
  },
}
