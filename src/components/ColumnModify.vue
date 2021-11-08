<!--
 * @Description: 表格 -> 列设置
 * 使用说明：父组件应该存在两个列，一个用于动态显示，一个用于存放全部列数据。引用时父组件传入全部列，show:true为显示，show:false为隐藏；
 *          当子组件根据处理完毕，返回列给子组件，子组件拿到值后赋值给动态显示列。
-->
<template>
  <section>
    <a-dropdown v-model:visible="visible" :placement="bottomLeft" :trigger="['click']">
      <a class="ant-dropdown-link setup-icon" @click.prevent>
        <!-- <SettingOutlined /> -->
        <i class="iconfont icon-a-Iconfeather-settings"></i>
      </a>
      <template #overlay>
        <a-menu>

          <a-checkbox-group v-model:value="tableCheckboxState.stateValue" name="checkboxgroup">
            <a-menu-item v-for="(item, index) in tableCheckboxState.plainOptions" :key="'plainOptions' + index">
              <a-checkbox :value="item">{{item}}</a-checkbox>
            </a-menu-item>
          </a-checkbox-group>
          
        </a-menu>
      </template>
    </a-dropdown>
  </section>
</template>

<script>
import { defineComponent, reactive, ref, watch } from 'vue'
import { Dropdown, Menu } from 'ant-design-vue'
import { SettingOutlined } from '@ant-design/icons-vue'

export default defineComponent({
  props: {
    allColumns: { type: Array, default: [] }
  },
  components: {
    ADropdown: Dropdown,
    AMenu: Menu,
    AMenuItem: Menu.Item,
    SettingOutlined
  },
  setup(props, ctx) {
    const visible = ref(false);
    const tableCheckboxState = reactive({
      plainOptions: [], // 所有值
      stateValue: [], // 选中选项
    });
    
    // 所有选项
    tableCheckboxState.plainOptions = props.allColumns.map(x => x.title);

    props.allColumns.map(x => {
      if (x.show) {
        tableCheckboxState.stateValue.push(x.title);
      }
    })
    // console.log("所有选项：", tableCheckboxState.plainOptions)
    // console.log("选中选项：", tableCheckboxState.stateValue)

    // 动态改变后的列
    let setColumn = [];
    watch(tableCheckboxState, (newValue, oldValue) => {
      setColumn = [];
      props.allColumns.map(x => {
        for (let i = 0; i < newValue.stateValue.length; i++) {
          // console.log(newValue.stateValue[i])
          if (x.title == newValue.stateValue[i]) {
            setColumn.push(x);
          }
        }
      })
      ctx.emit("columnModifyPropsHanlde", setColumn)
      // columns.value = setColumn;
    })
    // 初始化时加载列
    const loadingColunm = () => {
      setColumn = [];
      props.allColumns.map(x => {
        for (let i = 0; i < tableCheckboxState.stateValue.length; i++) {
          if (x.title == tableCheckboxState.stateValue[i]) {
            setColumn.push(x);
          }
        }
      })
    };
    loadingColunm();
    ctx.emit("columnModifyPropsHanlde", setColumn)
    // columns.value = setColumn;
    
    return {
      tableCheckboxState,
      visible,
      bottomLeft: 'bottomLeft'
    }
  }
});
</script>

<style lang="less" scoped>
.setup-icon {
  margin-left: 16px;
  padding-left: 10px;

  i {
    font-size: 26px;
  }
}
</style>