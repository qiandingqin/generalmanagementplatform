<template>
  <h1>组件：{{ msg }}</h1>
</template>

<script setup>
import { defineComponent, reactive, ref } from 'vue'

export default defineComponent({
  props: {
    msg: { type: String, default: '默认值' }
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