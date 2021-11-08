<!--
 * @Description: 后台管理 -> 权限管理 -> 普通管理员
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
                  <a-checkbox-group v-model:value="checkboxState.userManageOption" name="checkboxgroup" :options="checkboxState.userManage" @change="onHandlePower" @click="clickHanldePower" :disabled="checkboxState.disabled" />
                </div>
              </div>

              <div class="line">
                <p class="line-title">班级管理-权限</p>
                <div class="line-checkbox">
                  <a-checkbox-group v-model:value="checkboxState.classManageOption" name="checkboxgroup" :options="checkboxState.classManage" @change="onHandlePower" @click="clickHanldePower" :disabled="checkboxState.disabled" />
                </div>
              </div>

              <div class="line">
                <p class="line-title">数据管理-权限</p>
                <div class="line-checkbox">
                  <a-checkbox-group v-model:value="checkboxState.dataMaganeOption" name="checkboxgroup" :options="checkboxState.dataMagane" @change="onHandlePower" @click="clickHanldePower" :disabled="checkboxState.disabled" />
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

                  <a-radio-group name="radioGroup" v-model:value="radioValueState.radioValue" @change="dataHaveChange">
                    <div class="radio-line">
                      <a-radio value="2" class="radio-line-radio" :disabled="radioValueState.disabled">个人</a-radio>
                      <span>只能操作自己和所有学生的数据</span>
                    </div>

                    <div class="radio-line">
                      <a-radio value="1" class="radio-line-radio" :disabled="radioValueState.disabled">自己及普通教师</a-radio>
                      <span>能操作自己和其他普通教师以及所有学生的数据</span>
                    </div>

                    <div class="radio-line">
                      <a-radio value="0" class="radio-line-radio" :disabled="radioValueState.disabled">全部</a-radio>
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
import { Select, Tabs, Radio, message } from 'ant-design-vue'
import { getPower, getHavePower, setHavePower, getHaveDataPower, changeDataPower } from './PowerManageService.js'

export default defineComponent({
  name: 'Admin',
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
      allCheckboOption: [], // 所有选中权限，用于数据请求
      disabled: false,
      oldAllCheckboOption: [], // 存储旧所有选中权限，用于判断为增加、取消权限。新权限比旧权限多为增加，少为减少。当为增加时与successTipText作为增加成功提示
      successTipText: '', // 对新增的权限进行提示（选中提示）
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
    };
    getPowerData();

    // 获取已拥有 操作权限
    const getHavePowerData = async() => {
      checkboxState.disabled = true;
      let res = '';
      const param = { roleId: 2 }; // roleId: 1超级管理员，2管理员
      try {
        res = await getHavePower(param);
      } catch (error) {
        checkboxState.disabled = false;
        return;
      }

      checkboxState.disabled = false;
      if (!res) return;

      // 拿到所有选项赋值
      checkboxState.userManageOption = res?.user;
      checkboxState.classManageOption = res?.class;
      checkboxState.dataMaganeOption = res?.data;

      // 所有新权限
      let newAllCheckboOption = [];
      newAllCheckboOption.push(...res?.user, ...res?.class, ...res?.data);

      if (checkboxState.oldAllCheckboOption.length < newAllCheckboOption.length) { // 原有权限长度小于现有权限长度为增加
        if (checkboxState.successTipText)  message.success("成功启用" + checkboxState.successTipText);
      }
      // 存储旧所有选中权限，用于判断为增加、取消权限。新权限比旧权限多为增加，少为减少。当为增加时与successTipText作为增加成功提示
      checkboxState.oldAllCheckboOption = [];
      checkboxState.oldAllCheckboOption.push(...res?.user, ...res?.class, ...res?.data);
    };
    getHavePowerData();

    // 操作权限更改
    const onHandlePower = async() => {
      checkboxState.disabled = true;
      checkboxState.allCheckboOption = [];
      checkboxState.allCheckboOption.push(...checkboxState.userManageOption, ...checkboxState.classManageOption, ...checkboxState.dataMaganeOption);
      
      const param = {
        menuIds: checkboxState.allCheckboOption, // 已选角色
        roleId: 2 // roleId: 1超级管理员，2管理员
      };

      let res = '';
      try {
        res = await setHavePower(param);
      } catch (error) {
        res = error;
      }

      checkboxState.disabled = false;
      getHavePowerData();
    };

    // 操作权限更改 点击事件 获取点击当文字，用于提示
    const clickHanldePower = (param) => {
      if (param.target.innerHTML && param.target.innerHTML.length < 20) {
       checkboxState.successTipText = param.target.innerHTML;
      }
    };


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
      const param = 2;
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

    // 修改 数据管理（单选按钮）
    const dataHaveChange = async() => {
      radioValueState.disabled = true;
      const param = {
        roleId: 2, // 修改角色（超级管理员为1，普通管理员为2）
        level: radioValueState.radioValue // 修改的值
      }
      let res = '';
      try {
        res = await changeDataPower(param);
      } catch (error) {
        res = error;
      }

      radioValueState.disabled = false;
      if(!res) {
        radioValueState.radioValue = radioValueState.oldRadioValue;
        return;
      }

      // 提示信息
      let tips = '';
      switch ( radioValueState.radioValue ) {
        case '0':
          tips = '全部';
          break;
        case '1':
          tips = '自己及普通教师';
          break;
        case '2':
          tips = '个人';
          break;
        default:
          break;
      }
      if(tips) message.success('成功将数据权限设置为' + tips)
      // console.log('旧', radioValueState.oldRadioValue, '新', radioValueState.radioValue)
      // 数据交互成功后，更新旧值
      radioValueState.oldRadioValue = radioValueState.radioValue;
    };

    return {
      activeKey: ref('1'), // 切换卡 默认选中第一个
      checkboxState,
      clickHanldePower,
      radioValueState,
      dataHaveChange,
      onHandlePower
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
</style>