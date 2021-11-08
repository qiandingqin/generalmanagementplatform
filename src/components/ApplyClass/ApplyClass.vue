<!--
 * @Description: 头部 申请入班 组件 （用于修改） -> 个人设置 -> 加入班级（学生角色功能） 
 * 修改文件需同时修改 index.vue、ApplyClass.vue
 * ApplyClass/index.vue 文件不知为何不能多文件引用，则新增一个ApplyClass.vue文件
-->
<template>
  <section>
    <!-- <a-button type="primary" @click.stop="showModal">Open Modal</a-button> -->
    <p class="addClassBtn" @click.stop="showModal">申请入班</p>

    <a-modal v-model:visible="visible" title="申请入班" :footer="undefined" :afterClose="afterCloseHandel" :centered="true">
        
      <div class="ClassNumber" v-if="!addClassState.addStatus">
        <p>输入4位班级号</p>
        <!-- 输入班级号 -->
        <single-numberinput class="applyClassInput" v-model:codes="codes"  @changed="onInputChange"></single-numberinput>
        <p class="errorTip">{{ inputTip }}</p>
      </div>
      
      <div class="ClassNumber addTip" v-if="addClassState.addStatus">
        <p>是否确认加入 {{ addClassState.classNum }} 班？</p>
        <p>班级名：{{ addClassState.className }}</p>
        <p>年级：{{ addClassState.grade }}</p>
        <p>授课教师：{{ addClassState.teacherName }}</p>
      </div>

      <template #footer>
        <a-button v-if="addClassState.addStatus" @click="backHandler">返回上一级</a-button>
        <a-button v-if="!addClassState.addStatus" type="primary" @click="addClassHandler" :loading="addClassState.loading">加入班级</a-button>
        <a-button v-if="addClassState.addStatus" type="primary" @click="yesAddHandler" :loading="addClassState.loading">确认加入</a-button>
      </template>
    </a-modal>
  </section>
</template>

<script>
import axios from "@common/http";
import API from "@common/api";
import { defineComponent, reactive, ref } from 'vue'
import { message, Modal } from 'ant-design-vue'
import SingleNumberinput from '@/components/SingleNumberInput.vue' // 申请入班

// 加入班级信息
const addClassState = reactive({
  addStatus: false, // 加入班级显示状态
  classNum: '', // 班级号
  className: '', // 班级名称
  grade: '', // 年级
  teacherName: '', // 授课教师
  loading: false
});

export default defineComponent({
  // name: 'applyClass',
  props: {
    msg: { type: String, defualt: '申请入班' }
  },
  components: {
    SingleNumberinput,
    AModal: Modal
  },
  setup(props, ctx) {
    const visible = ref(false); // 弹出框显示
    let inputTip = ref(''); // 验证码 提示有三种类值：空、"请输入班级号", "班级号不存在，请确认后再输入"
    let verificationCode = ref(''); // 接收验证码
    const codes = ref(['', '', '', '']); // 传给子组件的值
    
    // 点击显示 加入班级 对话框
    const showModal = () => {
      visible.value = true;
      codes.value = ['', '', '', ''];
    };

    // 单数字输入框change
    const onInputChange = async () => {
      const value = codes.value.join('');
      verificationCode.value = value;
      inputTip.value = '';

      if (value.length != 4) return;
    };

    // 加入班级 事件
    const addClassHandler = async (e) => {
      addClassState.loading = true;

      let response = null;
      if (verificationCode.value.length == 4) {
        // 加入班级 数据请求 
        try {
          response = await axios.get(API.CLASS.CLASS_QUERY, {params: {classNumber: verificationCode.value}, requestToMessageHide: true});
        } catch (error) { 
          addClassState.loading = false;
          inputTip.value = error.message;
          return; 
        }
      } else {
        inputTip.value = '请输入班级号';
        addClassState.loading = false;
        return ;
      }

      // 判断返回结果 正确结果，显示内容；错误结果，错误提示
      if (response) {
        // 成功后修改状态
        addClassState.addStatus = true;  // 加入班级显示状态

        addClassState.classNum = response.data.classNumber;
        addClassState.className = response.data.className;
        addClassState.grade = response.data.gradeName + '级'; // 年级
        addClassState.teacherName = response.data.username; // 授课教师

      } else {
        addClassState.addStatus = false;  // 加入班级显示状态
        inputTip.value = '班级号不存在，请确认后再输入';
      }

      addClassState.loading = false;
    };

    // 确定加入 事件
    const yesAddHandler = async (e) => {
      addClassState.loading = true;

      let response = null;
      try {
        response = await axios.get(API.CLASS.CLASS_ADDCLASS, {params: {classNumber: verificationCode.value}, requestToMessageHide: true});
      } catch (error) {
        addClassState.loading = false;
        return ;
      }

      // 请求正确
      if (response) {
        addClassState.addStatus = false;  // 加入班级显示状态
        visible.value = false; // 关闭 对话框
        backHandler(); // 数据重置 返回上一级操作一样
        message.success('操作成功！');
        
        ctx.emit('addClassSuccess');
        
        // 刷新页面
        location.reload();
      } else { // 请求错误

        backHandler(); // 数据重置 失败后操作和 返回上一级操作一样
        message.error('操作失败，请重新操作！');
      }
      addClassState.loading = false;
    };
    
    // 返回上一级
    const backHandler = () => {
      inputTip.value = '';
      verificationCode.value = '';
      codes.value = ['', '', '', ''];
      addClassState.addStatus = false;  // 加入班级显示状态
      addClassState.loading = false;
    };
    
    // 关闭对话框 后调用方法
    const afterCloseHandel = () => {
      inputTip.value = '';
    };
    
    return {
      visible,
      codes,
      onInputChange,
      showModal,
      inputTip,
      addClassHandler,
      addClassState,
      backHandler,
      yesAddHandler,
      afterCloseHandel
    };
  }
});
</script>

<style lang="less" scoped>
  .addClassBtn {
    color: @color-Blue;
    cursor: pointer;
  }

  .ClassNumber {
    text-align: center;
    font-size: .16rem;
    min-height: 1.25rem;
    
    .applyClassInput {
      padding: 0.16rem 0;
    }
    
    .errorTip {
      color: @color-Red;
      font-size: 16px !important;
      margin-top: -10px;
      text-align: left;
      padding-left: 150px;
    }
  }

  .addTip {
    text-align: left;
    padding-left: .5rem;

    p {
      padding: .05rem 0;

      &:nth-child(1) {
        font-weight: bold;
      }
    }
  }
</style>