<!--
 * @Description: 我的消息
-->
<template>
  <section class="message">
    <a-tabs v-model:activeKey="activeKey">
      <a-tab-pane key="1"  tab="未读消息">
        <message-unread :MessageUnreadProps="MessageUnreadProps"></message-unread>
      </a-tab-pane>
      <a-tab-pane key="2" tab="历史消息" force-render>
        <message-history :MessageHistoryProps="MessageHistoryProps"></message-history>
      </a-tab-pane>
    </a-tabs>
  </section>
</template>

<script>
import { defineComponent, ref, watchEffect } from 'vue'
import { Tabs } from 'ant-design-vue'
import MessageUnread from '@/views/Message/MessageUnread.vue'
import MessageHistory from '@/views/Message/MessageHistory.vue'

export default defineComponent({
  name: 'Message',
  props: {
    msg: { type: String, defualt: '默认值' }
  },
  components: {
    ATabs: Tabs,
    ATabPane: Tabs.TabPane,
    MessageUnread,
    MessageHistory
  },
  setup(props, ctx) {
    // 默认选中第一个
    let activeKey = ref('1');

    // 传入 未读消息
    let MessageUnreadProps = ref(false);

    // 传入 未读消息
    let MessageHistoryProps = ref(false);

    // 改变传入子组件的值，子组件监听值改变，改变后重新加载当前组件数据列表
    const valueChange = () => {
      if (activeKey.value == 1) { // 未读消息
        MessageUnreadProps.value = !MessageUnreadProps.value;
      } else if (activeKey.value == 2) { // 已读消息
        MessageHistoryProps.value = !MessageHistoryProps.value;
      }
    };
    
    watchEffect(() => {
      valueChange();
      // console.log(activeKey.value)
    });

    return {
      activeKey,
      MessageUnreadProps,
      MessageHistoryProps
    }
  },
});
</script>

<style lang="less" scoped>
.message {
  width: 12rem;
  margin: 0 auto;
  background-color: #FFF;
  min-height: 500px;
  position: relative;
  
  :deep {
    .ant-tabs-bar {
      margin: 0 0 5px 0 !important;
    }
    .ant-tabs-nav .ant-tabs-tab {
      padding: 24px 16px;
    }
  }
  
}
</style>