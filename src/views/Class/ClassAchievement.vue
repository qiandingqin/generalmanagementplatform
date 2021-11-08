<!--
 * @Description: 我的班级 -> 班级成绩
-->
<template>
  <section class="class-achievement">
    <ClassHeader title="返回班级列表" />
    <p class="title">查看班级成绩</p>
    
    <div class="content">
      <div class="tabs">
        <a-tabs v-model:activeKey="activeKey">
          <a-tab-pane key="1" tab="可视化分析">
            <visual-analysis></visual-analysis>
          </a-tab-pane>
          <a-tab-pane key="2" tab="源数据查询" force-render>
            源数据查询
          </a-tab-pane>
        </a-tabs>
      </div>
    </div>
  </section>
</template>

<script>
import { defineComponent, reactive, ref } from 'vue'
import { Select, Tabs } from 'ant-design-vue'
import VisualAnalysis from '@/views/Class/ClassAchievementVisualAnalysis.vue'
import ClassHeader from '@components/ClassHeader.vue'

export default defineComponent({
  name: 'ClassAchievement',
  props: {
    msg: { type: String, defualt: '默认值' }
  },
  components: {
    ASelect: Select,
    ASelectOption: Select.Option,
    ATabs: Tabs,
    ATabPane: Tabs.TabPane,
    VisualAnalysis,
    ClassHeader
  },
  setup(props, ctx) {
    
    return {
      activeKey: ref('1'), // 切换卡 默认选中第一个
    }
  }
});
</script>

<style lang="less" scoped>
.class-achievement {
  // background-color: #FFF;
  // padding: .22rem 0 .1rem 0;
  font-size: .16rem;
  width: 16.64rem;
  margin: 0 auto;
  
  .title {
    padding: .3rem 20px .1rem 20px;
    background-color: #FFF;
    font-weight: bold;
  }
  
  .content {
    width: 100%;
    height: 100%;
    // padding: 0 .24rem ;
    background-color: #FFF;
    
    .tabs {
      padding-top: .3rem;
      
      .dataQuery {
        padding: .24rem;
        border-top: 300px solid #FAFAFA;
      }
    }
  }
  
}
</style>