<!--
 * @Description: 后台管理 -> 数据管理
-->
<template>
  <section class="data-manage">
    <p class="title">数据管理</p>
    
    <div class="content">
      <div class="source">用户来源：
        <a-select label-in-value v-model:value="sourceValue" style="width: 120px" @change="sourceHandleChange">
          <a-select-option value="全部来源">全部来源</a-select-option>
          <a-select-option value="校内学生">校内学生</a-select-option>
          <a-select-option value="校外学生">校外学生</a-select-option>
        </a-select>
      </div>
      
      <div class="tabs">
        <a-tabs v-model:activeKey="activeKey">
          <a-tab-pane key="1" tab="可视化分析">
            <visual-analysis></visual-analysis>
          </a-tab-pane>
          <a-tab-pane key="2" tab="源数据查询" force-render>
            <!-- 全部来源 -->
            <div v-if="DataQueryShow == '全部来源'" class="dataQuery">全部来源</div>
            <!-- 校内学生 -->
            <div v-if="DataQueryShow == '校内学生'" class="dataQuery">校内学生</div>
            <!-- 校外学生 -->
            <div v-if="DataQueryShow == '校外学生'" class="dataQuery">校外学生</div>
          </a-tab-pane>
        </a-tabs>
      </div>
    </div>
  </section>
</template>

<script>
import { defineComponent, reactive, ref } from 'vue'
import { Select, Tabs } from 'ant-design-vue'
import VisualAnalysis from '@/views/BackstageManage/DataManage/Components/VisualAnalysis.vue'

export default defineComponent({
  name: 'DataManage',
  props: {
    msg: { type: String, defualt: '默认值' }
  },
  components: {
    ASelect: Select,
    ASelectOption: Select.Option,
    ATabs: Tabs,
    ATabPane: Tabs.TabPane,
    VisualAnalysis,
  },
  setup(props, ctx) {
    // 源数据查询 中子组件显隐
    const DataQueryShow = ref('全部来源');
    // 用户来源，默认值
    const sourceValue = reactive({ key: '全部来源' });
    
    // 用户来源 change事件
    const sourceHandleChange = value => {
      console.log(value); // { key: "lucy", label: "Lucy (101)" }
      DataQueryShow.value = value.value
    };
    
    
    return {
      DataQueryShow,
      sourceValue,
      sourceHandleChange,
      activeKey: ref('1'), // 切换卡 默认选中第一个
    }
  }
});
</script>

<style lang="less" scoped>
.data-manage {
  background-color: #FFF;
  padding: .22rem 0 .1rem 0;
  font-size: .16rem;
  
  .title {
    padding: 0 20px;
  }
  
  .content {
    width: 100%;
    height: 100%;
    // padding: 0 .24rem ;
    margin-top: .30rem;
    
    .source {
      font-size: 16px;
      padding: 0 20px;
    }
    
    .tabs {
      padding-top: .3rem;
      
      .dataQuery {
        padding: .24rem;
        border-top: 30px solid #FAFAFA;
      }
    }
  }
  
  :deep(.ant-tabs-bar) {
    margin: 0 !important;
  }
}
</style>