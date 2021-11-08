<!--
 * @Description: 新建班级成功，提示，复制
-->
<template>
  <!-- tips -->
  <section class="tips-view">
    <p>班级号：<span class="code">{{ value }}</span> <Copy target=".code" /></p>
    <p>请及时告知学生班级号</p>
  </section>
</template>

<script>
import { defineComponent } from 'vue'
import Copy from './Copy.vue'

export default defineComponent({
  name: 'Tips',
  props: {
    value: { type: [String, Number], defualt: '' }
  },
  components: { 
    Copy
  },
  setup() {
    
  },
})
</script>

<style scoped>
.tips-view p {
  color: rgba(0, 0, 0, 0.65);
}
</style>
