<!--
 * @Description: 后台管理 -> 权限管理 -> 超级管理员
-->
<template>
  <section class="power-manage">
    <p class="title">权限管理</p>
    
    <div class="content">
      <div class="tabs">
        <a-tabs v-model:activeKey="activeKey">
          <a-tab-pane key="1" tab="操作权限">
            <div class="content-view operation-view">
              <div class="samll">操作权限是指该角色的用户是否能查看、新增、编辑、删除某些数据。</div>
              
              <div class="line">
                <p class="line-title">用户管理-权限</p>
                <div class="line-checkbox">
                  <a-checkbox-group v-model:value="checkboxState.userManageOption" name="checkboxgroup" :options="checkboxState.userManage" disabled />
                </div>
              </div>

              <div class="line">
                <p class="line-title">班级管理-权限</p>
                <div class="line-checkbox">
                  <a-checkbox-group v-model:value="checkboxState.classManageOption" name="checkboxgroup" :options="checkboxState.classManage" disabled />
                </div>
              </div>

              <div class="line">
                <p class="line-title">数据管理-权限</p>
                <div class="line-checkbox">
                  <a-checkbox-group v-model:value="checkboxState.dataMaganeOption" name="checkboxgroup" :options="checkboxState.dataMagane" disabled />
                </div>
              </div>
            </div>
          </a-tab-pane>
          
          <!-- 数据权限 -->
          <a-tab-pane key="2" tab="数据权限" force-render>
            <div class="content-view operation-view data-view">
              <div class="samll">操作权限是指该角色的用户是否能查看、新增、编辑、删除某些数据。</div>
              
              <div class="line">
                <p class="line-title">数据管理</p>
                <div class="line-checkbox">

                  <a-radio-group name="radioGroup" v-model:value="radioValueState.radioValue">
                    <div class="radio-line">
                      <a-radio value="2" class="radio-line-radio" disabled>个人</a-radio>
                      <span>只能操作自己和所有学生的数据</span>
                    </div>

                    <div class="radio-line">
                      <a-radio value="1" class="radio-line-radio" disabled>自己及普通教师</a-radio>
                      <span>能操作自己和其他普通教师以及所有学生的数据</span>
                    </div>

                    <div class="radio-line">
                      <a-radio value="0" class="radio-line-radio" disabled>全部</a-radio>
                      <span>能操作全部的数据</span>
                    </div>
                  </a-radio-group>
                </div>
              </div>
            </div>
          </a-tab-pane>
        </a-tabs>
      </div>
    </div>
  </section>
</template>

<script>
import { defineComponent, reactive, ref } from 'vue'
import { Select, Tabs, Radio } from 'ant-design-vue'
import { getPower, getHaveDataPower } from './PowerManageService.js'

export default defineComponent({
  name: 'SuperAdmin',
  props: {
    msg: { type: String, defualt: '默认值' }
  },
  components: {
    ASelect: Select,
    ATabs: Tabs,
    ATabPane: Tabs.TabPane,
    ARadio: Radio,
    ARadioGroup: Radio.Group,
  },
  setup(props, ctx) {
    /**************************** 操作权限 ****************************/
    // 操作管理
    const checkboxState = reactive({
      userManage: [], // 用户管理-权限 所有选项  格式：[{ label: 'Apple', value: 'Apple' }]
      userManageOption: [], // 用户管理-权限 已选项 格式：['Apple']
      classManage: [], // 班级管理-权限  所有选项
      classManageOption: [], // 班级管理-权限 已选项
      dataMagane: [], // 数据管理-权限 所有选项
      dataMaganeOption: [], // 数据管理-权限 已选项
    });

    // 获取所有 操作权限
    const getPowerData = async() => {
      let res = '';
      const param = {
        isShow: 0,
        type: 1 // 0菜单，1接口
      }
      try {
        res = await getPower(param);
      } catch (error) {
        return;
      }

      if (!res) return;

      // 拿到所有选项后复制
      checkboxState.userManage = res?.user;
      checkboxState.classManage = res?.class;
      checkboxState.dataMagane = res?.data;

      checkboxState.userManageOption = res?.userSuperAdminOption;
      checkboxState.classManageOption = res?.classSuperAdminOption;
      checkboxState.dataMaganeOption = res?.dataSuperAdminOption;
    };
    getPowerData();


    /**************************** 数据权限 ****************************/
    // 数据管理，单选按钮值
    const radioValueState = reactive({
      radioValue: '', // 单选按钮值
      oldRadioValue: '', // 存储旧值，当数据交互失败时，赋予原值
      disabled: false // 是否可用
    });
    
    // 获取已拥有 数据权限
    const getHaveDataPowerData = async() => {
      let res = '';

      // param：1为超级管理员，2为管理员
      const param = 1;
      try {
        res = await getHaveDataPower(param);
      } catch (error) {
        return;
      }

      if (!res) return;

      radioValueState.radioValue = res;
      radioValueState.oldRadioValue = res;
    };
    getHaveDataPowerData();

    return {
      activeKey: ref('1'), // 切换卡 默认选中第一个
      checkboxState,
      radioValueState,
    }
  }
});
</script>

<style lang="less" scoped>
.power-manage {
  background-color: #FFF;
  padding: .22rem 0 .1rem 0;
  font-size: .16rem;
  
  .title {
    padding: 0 20px;
    font-size: 20px;
  }
  
  .content {
    width: 100%;
    height: 100%;
    // padding: 0 .24rem ;
    margin-top: 0rem;
    
    .tabs {
      padding-top: .3rem;
      
      .content-view {
        padding: .24rem;
        border-top: 15px solid #FAFAFA;
      }
      
      // 操作权限
      .operation-view {
        .samll {
          color: @color-Black-65;
        }
        
        .line {
          padding-top: 20px;
          
          .line-title {
            color: @color-Black-100;
            font-size: 16px;
            padding-bottom: 10px;
          }
          
          .line-checkbox {
            padding: 0 20px;
            min-height: 20px;
            
            .radio-line {
              padding-bottom: 8px;
              
              .radio-line-radio {
                width: 150px;
              }
              
              span {
                color: @color-Black-65;
              }
            }
          }
        }
      }
      
      // 数据权限
      .data-view {
        width: auto;
      }
    }
  }
  
  :deep(.ant-tabs-bar) {
    margin: 0 !important;
  }
  
  :deep {
    .ant-tabs-nav-scroll {
      padding: 0 10px;
    }
    
    .ant-tabs-nav .ant-tabs-tab {
      padding: 4px 16px 20px 16px;
    }

    .ant-checkbox-disabled + span { // 禁用按钮
      color: @color-Black-85;
    }

    .ant-checkbox-group-item {
      margin-right: 22px;
    }
  }
}

:deep {
  .ant-radio-disabled + span {
    color: @color-Black-85;
  }
}
</style>