import { ResizableNodeView } from '@tiptap/core';
import { mergeAttributes } from '@tiptap/core';
import Image from '@tiptap/extension-image';

const CustomImage = Image.extend({
  addOptions() {
    return {
      HTMLAttributes: {},
      // 透传并支持按需配置的 resize 选项（与基础 Image 扩展保持一致）
      resize: {
        enabled: false,
        directions: ['top', 'bottom', 'left', 'right'],
        minWidth: 50,
        minHeight: 50,
        alwaysPreserveAspectRatio: true,
      },
    }
  },
  renderHTML({ HTMLAttributes }) {
    return ['img', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes)];
  },

  // 关键：重写 update 方法，确保 src 变化时更新 DOM
  addNodeView() {
    return ({ node, getPos, HTMLAttributes, editor }) => {
      const img = document.createElement('img');
      img.src = HTMLAttributes.src

      // 初始设置
      Object.entries(HTMLAttributes).forEach(([key, value]) => {
        if (value == null) return
        if (key === 'width' || key === 'height') return
        img.setAttribute(key, String(value))
      });

      return new ResizableNodeView({
        element: img,
        node,
        editor,
        getPos,
        onResize: (w, h) => {
          img.style.width = `${w}px`
          img.style.height = `${h}px`
        },
        onCommit: (w, h) => {
          const pos = getPos()
          if (pos === undefined) return
          // persist new size to the node
          editor.commands.updateAttributes('image', { width: w, height: h })
        },
        onUpdate: (updatedNode) => {
          if (updatedNode.type !== this.type) return false;

          // 比较 src 是否变化
          const oldSrc = img.getAttribute('src');
          const newSrc = updatedNode.attrs.src;

          if (oldSrc !== newSrc) {
            img.src = newSrc;
          }

          // 更新其他属性（alt, title 等）
          Object.entries(updatedNode.attrs).forEach(([key, value]) => {
            img.setAttribute(key, value);
          });

          return true;
        },
        options: {
          directions: ['bottom-right', 'bottom-left', 'top-right', 'top-left'],
          min: { width: 50, height: 50 },
          preserveAspectRatio: false, // hold Shift to lock aspect ratio
          className: {
            container: 'my-resize-container',
            wrapper: 'my-resize-wrapper',
            handle: 'my-resize-handle',
            resizing: 'is-resizing',
          },
        },
      })
    };
  },
});

export default CustomImage;
