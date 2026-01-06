import { Node, mergeAttributes } from '@tiptap/core'

export default Node.create({
  name: 'column',
  group: 'block',
  content: 'block+',
  selectable: true,

  addAttributes() {
    return {
      background: {
        default: 'transparent',
        parseHTML: element => element.getAttribute('data-background') || 'transparent',
        renderHTML: attributes => ({ 'data-background': attributes.background }),
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="column"]',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    const style = [`background:${HTMLAttributes.background ?? 'transparent'}`].join(';')
    return [
      'div',
      mergeAttributes({
        'data-type': 'column',
        style,
      }, HTMLAttributes),
      0,
    ]
  },
})

