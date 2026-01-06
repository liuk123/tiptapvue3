<template>
  <div class="dropdown-menu" ref="menu" :style="{'--t-cols': COLS}">
    <template v-if="items.length">
      <button
        :class="{ 'is-selected': index === selectedIndex }"
        v-for="(item, index) in items"
        :key="index"
        @click="selectItem(index)"
      >
        <Icon :name="item.icon" :size="18" />
      </button>
    </template>
    <div class="item" v-else>No result</div>
  </div>
</template>

<script>
import Icon from '../../../common/Icon.vue'

export default {
  components: { Icon },
  props: {
    items: {
      type: Array,
      required: true,
    },
    command: {
      type: Function,
      required: true,
    },
  },

  data() {
    return {
      selectedIndex: 0,
      COLS: 7
    }
  },

  watch: {
    items() {
      this.selectedIndex = 0
    },
  },

  mounted() {
  },

  methods: {
    // 外部调用：由父组件传入键盘事件
    onKeyDown({ event }) {
      if (event.key === 'ArrowUp') {
        this.upHandler()
        return true
      }
      if (event.key === 'ArrowDown') {
        this.downHandler()
        return true
      }
      if (event.key === 'ArrowLeft') {
        this.leftHandler()
        return true
      }
      if (event.key === 'ArrowRight') {
        this.rightHandler()
        return true
      }
      if (event.key === 'Enter') {
        this.enterHandler()
        return true
      }
      return false
    },

    // 计算当前选中项的行列
    getRowCol(index) {
      return {
        row: Math.floor(index / this.COLS),
        col: index % this.COLS,
      }
    },

    // 根据行列获取有效索引（防止超出 items 长度）
    getIndexFromRowCol(row, col) {
      const index = row * this.COLS + col
      // 如果该位置没有 item（比如最后一行不满），则保持原位置或跳到最近有效项
      if (index >= this.items.length) {
        return -1 // 无效
      }
      return index
    },

    // 尝试移动到新行列，如果无效则保持原位置
    moveSelection(newRow, newCol) {
      const newIndex = this.getIndexFromRowCol(newRow, newCol)
      if (newIndex !== -1) {
        this.selectedIndex = newIndex
      }
    },

    upHandler() {
      const { row, col } = this.getRowCol(this.selectedIndex)
      const newRow = Math.max(0, row - 1)
      this.moveSelection(newRow, col)
    },

    downHandler() {
      const { row, col } = this.getRowCol(this.selectedIndex)
      const newRow = row + 1
      // 最大行数：Math.ceil(items.length / COLS) - 1
      const maxRow = Math.ceil(this.items.length / this.COLS) - 1
      if (newRow <= maxRow) {
        this.moveSelection(newRow, col)
      }
    },

    leftHandler() {
      const { row, col } = this.getRowCol(this.selectedIndex)
      const newCol = Math.max(0, col - 1)
      this.moveSelection(row, newCol)
    },

    rightHandler() {
      const { row, col } = this.getRowCol(this.selectedIndex)
      const newCol = Math.min(this.COLS - 1, col + 1)
      this.moveSelection(row, newCol)
    },

    enterHandler() {
      this.selectItem(this.selectedIndex)
    },

    selectItem(index) {
      const item = this.items[index]
      if (item) {
        this.command(item)
      }
    }
  },
}
</script>

<style lang="less" scoped>
.dropdown-menu {
  display: grid;
  grid-template-columns: repeat(var(--t-cols), 30px);
  // display: flex;
  // flex-wrap: wrap;
  // width: fit-content;
}

.dropdown-menu button {
  width: 30px;
  height: 30px;
  background: white;
  cursor: pointer;
}

.dropdown-menu button.is-selected {
  outline: 2px solid #007bff;
  outline-offset: 2px;
}
</style>
