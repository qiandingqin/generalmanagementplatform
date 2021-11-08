<!--
 * @Description: 空数据 组件
 * 图片常用路径由存储桶路径 + 图片名称组成；imgUrlFirst：存储桶路径；imgUrlLast：图片名称
 * 如不使用存储桶路径在父组件imgUrlFirst传空即可
-->
<template>
  <div class="empty">
    <a-empty
      :image="imgUrlFirst + imgUrlLast"
      :image-style="{ height: imgHeight + 'px', }"
    >
      <template #description>
        <span>
          {{ message }}
        </span>
        <p class="small">
          {{ messageSmall }}
        </p>
      </template>
    </a-empty>
  </div>
  
</template>

<script>
import { defineComponent } from 'vue'
import { Empty } from 'ant-design-vue'
import Config from '@common/config'

const { STATIC_SOURCE_URI } = Config

export default defineComponent({
  props: {
    imgUrlFirst: { type: String, default: STATIC_SOURCE_URI }, // 图片路径 前面部分
    imgUrlLast: { type: String, default: '/images/noData/noData.png' }, // 图片路径 后面部分
    imgHeight: { type: [String, Number], default: 200 }, // 高度
    message: { type: String, default: '暂无数据' },
    messageSmall: { type: String, default: '' } // 第二行内容
  },
  components: {
    AEmpty: Empty
  },
  setup(props, ctx) {

    return {
      
    }
  }
});
</script>

<style lang="less" scoped>
.empty {
  padding: 1.8rem 0;

  .small {
    box-sizing: border-box;
    height: 30px;
    padding: 6px 0 2px 0;
    color: @color-Black-45;
  }
}
</style>