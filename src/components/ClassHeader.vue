<template>
  <!-- 班级管理header -->
  <section class="header-view">
    <p @click="$router.back()"><ArrowLeftOutlined /> <span>{{title}}</span></p>
  </section>
</template>

<script>
import { defineComponent } from 'vue'
import { ArrowLeftOutlined } from '@ant-design/icons-vue'

export default defineComponent({
  name: 'ClassHeader',
  components: {
    ArrowLeftOutlined
  },
  props: {
    title: { type: String, default: '' }
  },
  setup() {
    
  },
})
</script>


<style lang="less" scoped>
.header-view {
  height: 0.7rem;
  display: flex;
  align-items: center;
  font-size: 0.16rem;
  color: rgba(0, 0, 0, 0.85);

  p {
    display: inline;
    cursor: pointer;
  }

  > span {
    padding-left: 0.08rem;
  }
}
</style>