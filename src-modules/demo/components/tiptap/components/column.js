import { Node, mergeAttributes } from '@tiptap/core'
const defaultColor = '#ff000009'

export default Node.create({
  name: 'column',
  group: 'block',
  content: 'block+',
  selectable: true,

  addAttributes() {
    return {
      background: {
        default: defaultColor,
        parseHTML: element => element.getAttribute('data-background') || defaultColor,
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
    const bg = HTMLAttributes['data-background'] ?? HTMLAttributes.background ?? defaultColor
    const style = [
      `background:${bg}`, 
      'border-radius: 4px',
    ].join(';')
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

