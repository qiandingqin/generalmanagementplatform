<template>
  <a-layout class="app-container" :class="{appContainer: hidHeader}">
    <app-header v-if="hidHeader" class="app-header"></app-header>
    <router-view />
  </a-layout>
</template>

<script>
import { defineComponent, reactive, ref, watchEffect } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Layout, Menu, Dropdown, Avatar, Modal } from 'ant-design-vue'
import AppHeader from '@/components/AppHeader/index.vue'
import Store from '@/common/store.js'

const regexp = /(?<=:)\S+/;
const hidHeaderRoute = ['/login', '/register/clause', '/register/policy']

export default defineComponent({
  props: {

  },
  
  components: {
    ALayout: Layout,
    ALayoutHeader: Layout.Header,
    ALayoutFooter: Layout.Footer,
    ALayoutContent: Layout.Content,
    AppHeader
  },

  setup(props, ctx) {
    const route = useRoute();
    const router = useRouter();
    const menuSelect = ref(0);
    let hidHeader = ref(true)
    
    Store.init();
    
    // 监听路由
    const routeChange = () => {
      let rootMatched = route.matched[0];
      let path, menuIndex;
    
      // 更新用户信息状态
      // userMenus.value = filterMneus(globalStore.accountRole, globalStore.user?.classesList);
      // 用户直接刷新浏览器进入时 无根节点
      if (!rootMatched) return;
    
      path = regexp.test(rootMatched.path) ? rootMatched.path.replace(regexp, route.params.projectName).replace(':', '') : rootMatched.path;
      // menuIndex = menu.findIndex(x => x.path === path);
      // menuSelect.value = menuIndex;// == -1 ? -1 : menuIndex;
      // globalStore.appClassName = rootMatched.meta.appClassName;
      
      // hidHeaderRoute 包含的路径，不显示头部
      if (hidHeaderRoute.includes(path)) {
        hidHeader.value = false;
      } else {
        hidHeader.value = true;
      }
    }
    
    // 监听
    watchEffect(() => {
      routeChange();
    });
    
    return {
      hidHeader
    };
  }
});

</script>

<style lang="less" scoped>
  .app-container {
    height: 100%;
  }
  
  // 有头部时，存在该class，用于内容满屏
  .appContainer {
    padding: .6rem 0 0 0;
    box-sizing: border-box;
    
    .app-header {
      margin-top: -.6rem;
    }
  }
</style>