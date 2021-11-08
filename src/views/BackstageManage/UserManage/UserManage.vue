<!--
 * @Description: 后台管理 -> 用户管理
-->
<template>
  <section class="user-manege">
    <p>用户管理</p>
    
    <div class="content">
      <a-tabs v-model:activeKey="activeKey">
        <a-tab-pane key="1" tab="教师管理">
          <UserManageTeacher v-if="activeKey == 1" />
        </a-tab-pane>
        <a-tab-pane key="2" tab="学生管理" force-render>
          <UserManageStudent  v-if="activeKey == 2"  />
        </a-tab-pane>
      </a-tabs>
    </div>
  </section>
</template>

<script>
import { defineComponent, reactive, ref } from 'vue'
import { message, Tabs } from 'ant-design-vue'
import UserManageTeacher from '@/views/BackstageManage/UserManage/Components/UserManageTeacher.vue'
import UserManageStudent from '@/views/BackstageManage/UserManage/Components/UserManageStudent.vue'

export default defineComponent({
  name: 'UserManage',
  props: {
    msg: { type: String, defualt: '默认值' }
  },
  components: {
    ATabs: Tabs,
    ATabPane: Tabs.TabPane,
    UserManageTeacher,
    UserManageStudent
  },
  setup(props, ctx) {
    
    return {
      activeKey: ref('1'), // 默认选中第一个
    }
  }
});
</script>

<style lang="less" scoped>
.user-manege {
  padding: .22rem 0 .1rem 0;
  
  .content {
    width: 100%;
    height: 100%;
    background-color: #FFF;
    padding: 0.14rem .24rem ;
    margin-top: .30rem;
  }
}
</style>
