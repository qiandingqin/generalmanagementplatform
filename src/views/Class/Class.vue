<!--
 * @Description: 我的班级
-->
<template>
  <!-- 班级 -->
  <section class="container">
    <router-view v-slot="{ Component }" >
        <keep-alive>
          <component :is="Component" />
        </keep-alive>
    </router-view>
  </section>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Class',
  setup() {
    
  },
})
</script>
