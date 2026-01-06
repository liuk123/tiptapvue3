import { Node, mergeAttributes } from '@tiptap/core'

export default Node.create({
  name: 'column',
  group: 'block',
  content: 'block+',
  selectable: true,

  parseHTML() {
    return [
      {
        tag: 'div[data-type="column"]',
      },
      {
        tag: 'div.t-column',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      mergeAttributes({
        'data-type': 'column',
        class: 't-column',
      }, HTMLAttributes),
      0,
    ]
  },
})

