<!--
 * @Description: 新建班级成功，提示，复制
-->
<template>
  <section class="copy-container">
    <span class="iconfont" :class="'copy-btn-' + index" :style="{fontSize: size + 'rem'}">
      <CopyOutlined />
    </span>
  </section>
</template>

<script>
import { defineComponent, onUnmounted } from 'vue'
import { message } from 'ant-design-vue'
import { CopyOutlined } from '@ant-design/icons-vue'
import ClipboardJS from 'clipboard'

export default defineComponent({
  name: 'Copy',
  components: { CopyOutlined },
  props: {
    target: { type: String, default: '' },
    /**
     * @description 图标字体大小，单位 rem = 1rem = 100px
     */
    size: { type: Number, default: 0.14 },
    /**
     * @description 触发按钮索引，由于这里是独立创建实例 存界面存在多个Copy组件时实例会重复查询到同一个触发按钮
     */
    index: { type: Number, default: 0 }
  },
  setup(props) {

    if (!props.target) return;

    const copy = new ClipboardJS('.copy-btn-' + props.index, {target: () => document.querySelector(props.target)});

    copy.on('success', e => {
      e.clearSelection();
      message.success('复制成功!');
    });

    onUnmounted(() => {
      copy.destroy();
    });
  },
})
</script>


<style lang="less" scoped>
.copy-container {
  display: inline-block;
  
  .iconfont {
    font-size: 0.12rem;
    cursor: pointer;
  }
}
</style>