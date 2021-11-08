<!--
 * @Description: 应用 底部
-->
<template>
  <section>
    <div>底部</div>
  </section>
</template>

<script setup>
import { defineComponent, reactive, ref } from 'vue'

export default defineComponent({
  props: {
    msg: { type: String, defualt: '底部' }
  },
  
  setup(props, ctx) {

  }
});
</script>

<style scoped>
a {
  color: #42b983;
}
</style>