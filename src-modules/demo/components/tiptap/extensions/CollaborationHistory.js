import { Extension } from '@tiptap/core'


const CollaborationHistory = Extension.create({
  name: 'collaborationHistory',
   // 必须在创建 Editor 时传入 undoManager
  addOptions() {
    return {
      undoManager: null,
    }
  },
  addStorage() {
    return {
      undoManager: this.options.undoManager,
    }
  },

  // 添加命令
  addCommands() {
    return {
      undo:
        () =>
        ({ dispatch }) => {
          const { undoManager } = this.storage
          if (undoManager.undoStack.length > 0) {
            if (dispatch) {
              undoManager.undo()
            }
            return true
          }
          return false
        },

      redo:
        () =>
        ({ dispatch }) => {
          const { undoManager } = this.storage
          if (undoManager.redoStack.length > 0) {
            if (dispatch) {
              undoManager.redo()
            }
            return true
          }
          return false
        },
    }
  },

  // 绑定快捷键
  addKeyboardShortcuts() {
    return {
      'Mod-z': () => this.editor.commands.undo(),
      'Mod-y': () => this.editor.commands.redo(),
      'Shift-Mod-z': () => this.editor.commands.redo(), // Mac
    }
  },

  // 可选：暴露状态给外部（用于 UI 按钮禁用）
  onBeforeCreate({ editor }) {
    // 动态添加 canUndo / canRedo 方法到 editor
    Object.defineProperty(editor, 'canUndo', {
      get() {
        return this.storage.collaborationHistory.undoManager.undoStack.length > 0
      },
    })

    Object.defineProperty(editor, 'canRedo', {
      get() {
        return this.storage.collaborationHistory.undoManager.redoStack.length > 0
      },
    })
  },
})
export default CollaborationHistory