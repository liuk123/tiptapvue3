import { Node, mergeAttributes } from '@tiptap/core'

export default Node.create({
  name: 'columns',
  group: 'block',
  content: 'column+',
  draggable: false,

  addAttributes() {
    return {
      cols: {
        default: 2,
        parseHTML: element => Number(element.getAttribute('data-cols')) || 2,
        renderHTML: attributes => ({ 'data-cols': attributes.cols }),
      },
      rows: {
        default: 1,
        parseHTML: element => Number(element.getAttribute('data-rows')) || 1,
        renderHTML: attributes => ({ 'data-rows': attributes.rows }),
      },
      gap: {
        default: 8,
        parseHTML: element => Number(element.getAttribute('data-gap')) || 8,
        renderHTML: attributes => ({ 'data-gap': attributes.gap }),
      },
      background: {
        default: 'transparent',
        parseHTML: element => element.getAttribute('data-background') || 'transparent',
        renderHTML: attributes => ({ 'data-background': attributes.background }),
      },
      padding: {
        default: 8,
        parseHTML: element => Number(element.getAttribute('data-padding')) || 8,
        renderHTML: attributes => ({ 'data-padding': attributes.padding }),
      },
      radius: {
        default: 6,
        parseHTML: element => Number(element.getAttribute('data-radius')) || 6,
        renderHTML: attributes => ({ 'data-radius': attributes.radius }),
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="columns"]',
      },
      {
        tag: 'div.t-columns',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    const attrs = {
      cols: HTMLAttributes.cols ?? 2,
      rows: HTMLAttributes.rows ?? 1,
      gap: HTMLAttributes.gap ?? 8,
      background: HTMLAttributes.background ?? 'transparent',
      padding: HTMLAttributes.padding ?? 8,
      radius: HTMLAttributes.radius ?? 6,
    }

    const style = [
      'display:grid',
      `grid-template-columns:repeat(${attrs.cols}, 1fr)`,
      `grid-template-rows:repeat(${attrs.rows}, auto)`,
      `gap:${attrs.gap}px`,
      `background:${attrs.background}`,
      `padding:${attrs.padding}px`,
      `border-radius:${attrs.radius}px`,
    ].join(';')

    return [
      'div',
      mergeAttributes({
        'data-type': 'columns',
        class: 't-columns',
        style,
      }, HTMLAttributes),
      0,
    ]
  },

  addCommands() {
    return {
      insertColumns:
        attributes => ({ state, commands }) => {
          const cols = attributes?.cols ?? 2
          const rows = attributes?.rows ?? 1
          const count = Math.max(1, cols * rows)
          const payload = {
            type: this.name,
            attrs: attributes,
            content: Array.from({ length: count }, () => ({ type: 'column', content: [{ type: 'paragraph' }] })),
          }

          return commands.insertContent(payload)
        },

      setColumnsAttrs:
        attributes => ({ commands }) => {
          return commands.updateAttributes(this.name, attributes)
        },

      setColumnsSize:
        ({ cols, rows }) => ({ state, dispatch }) => {
          const { selection } = state
          const { $from } = selection
          const typeName = this.name
          let match = null

          for (let d = $from.depth; d >= 0; d--) {
            const node = $from.node(d)
            if (node.type.name === typeName) {
              const start = $from.start(d)
              const end = start + node.nodeSize
              match = { node, pos: $from.before(d + 1), start, end, depth: d }
              break
            }
          }

          if (!match) return false

          const desiredCols = Math.max(1, cols ?? match.node.attrs.cols)
          const desiredRows = Math.max(1, rows ?? match.node.attrs.rows)
          const desiredCount = desiredCols * desiredRows

          const editor = this.editor
          const columnType = editor.schema.nodes.column
          const currentCount = match.node.childCount
          let children = []

          if (currentCount === desiredCount) {
            // 仅更新属性
            const tr = state.tr.setNodeMarkup(match.pos, match.node.type, {
              ...match.node.attrs,
              cols: desiredCols,
              rows: desiredRows,
            })
            dispatch(tr)
            return true
          }

          if (currentCount < desiredCount) {
            children = [
              ...Array.from({ length: currentCount }, (_, i) => match.node.child(i)),
              ...Array.from({ length: desiredCount - currentCount }, () => columnType.createAndFill()),
            ]
          } else {
            children = Array.from({ length: desiredCount }, (_, i) => match.node.child(i))
          }

          const newNode = match.node.type.create(
            { ...match.node.attrs, cols: desiredCols, rows: desiredRows },
            children,
          )

          const tr = state.tr.replaceRangeWith(match.start, match.end, newNode)
          dispatch(tr)
          return true
        },
    }
  },
})
