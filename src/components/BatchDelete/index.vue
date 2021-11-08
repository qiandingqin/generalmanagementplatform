<!--
 * @Description: 批量删除 组件
-->
<template>
  <div class="BatchDelete">
    <span class="editTitle" @click="showModal">批量删除</span>
    
    <!-- currentStep为1时有“知道了”按钮,:footer属性 -->
    <a-modal v-model:visible="visible" title="批量删除" :footer="currentStep === 0 ? null : undefined" :afterClose="afterCloseHandel" centered>
      
      <!-- 步骤条 -->
      <div class="steps">
        <a-steps :current="currentStep">
          <a-step title="安全验证" />
          <a-step title="完成" />
        </a-steps>
      </div>
      
      <!-- 完全验证 内容 -->
      <div v-if="currentStep === 0" class="verification">
        <p>输入6位验证码</p>
        <p>验证码已发送到邮箱：{{ email }}</p>
        <div class="inputs">
          <single-numberinput v-model:codes="codes"  @changed="onInputChange"></single-numberinput>
          <div v-if="codeBtn" class="gainCode cursor-pointer color-Blue" @click="verificationCodeBtn">获取验证码</div>
          <div v-else class="gainCode"><span class="color-Blue">{{ countTime }}s</span>后重新获取</div>
        </div>
        <p class="inputTip">{{ inputTip }}</p>
        
        <p class="nullEmail">没收到邮件?</p>
      </div>
      
      <!-- 已成功删除 内容 -->
      <div v-if="currentStep === 1" class="successDelete">
        <CheckCircleFilled />
        <p>已成功删除</p>
      </div>
      
      <!-- 底部自定义按钮 -->
      <template #footer>
        <a-button type="primary" @click="onYes">知道了</a-button>
      </template>
    </a-modal>
  </div>
</template>

<script>
import { defineComponent, reactive, ref, watch } from 'vue';
import { CheckCircleFilled } from '@ant-design/icons-vue'
import { Modal, Steps } from 'ant-design-vue'
import SingleNumberinput from '@/components/SingleNumberInput.vue'
import axios from "@common/http";
import API from "@common/api";
import Storage from '@common/utils/storage'
import Enums from '@common/enums'
import Utils from '@common/utils/index'

export default defineComponent({
  name: 'BatchDelete',
  props: {
    // 删除信息：成功、失败；失败传入值“batchDeleteStatePropsError”关闭模态框，不传入不操作；成功传入为“batchDeleteStatePropsSuccess”进行成功提示
    batchDeleteStateProps: { type: [String, Object, Array], defualt: false },
  },
  components: {
    AModal: Modal,
    ASteps: Steps,
    AStep: Steps.Step,
    CheckCircleFilled,
    SingleNumberinput
  },
  setup(props, ctx) {
    // 获取用户信息
    const userInfo = Storage.getStorage(Enums.STORAGE.USER);

    const visible = ref(false); // 对话框状态
    const currentStep = ref(0); // 当前步骤，从0开始，1时有“知道了”按钮
    let footerShow = ref(true); // 底部按钮：true为显示，false为隐藏
    let email = ref(Utils.Email.EmailChang(userInfo?.email)); // 邮箱

    let inputTip = ref(null); // 三个类提示：验证码已失效，请重新获取、验证码错误、操作频繁
    let verificationCode = ref(''); // 接收验证码
    let codeBtn = ref(true); // 获取验证码按钮
    
    let countTimeData = ref(60); // 倒计时 实值，用于赋值
    let countTime = ref(0); // 倒计时 显示
    let timer = ref(null); // 定时器
    const codes = ref(['', '', '', '', '', '']); // 验证码值

    // 获取验证码 点击事件
    const verificationCodeBtn = async() => {
      // 获取验证码数据请求
      codeBtn.value = false; // 获取验证码按钮 隐藏
      inputTip.value = null; // 错误提示置空
      clearInterval(timer)
      setTimer();

      const param = { 
        userAccount: userInfo?.account,
        modelId: 3
      }
      // 获取验证码，参数：账号
      let res = '';
      try {
        res = await axios.get(API.GET_EMAIL, {params: param});
      } catch (error) { return; }
    };
    
    // 倒计时
    const setTimer = () => {
      countTime.value = countTimeData.value;
      timer = setInterval( () => {
        countTime.value--;
        if (countTime.value <= 0) {
          clearIntervalFun();
        }
      }, 1000)
    };
    
    // 关闭定时器
    const clearIntervalFun = () => {
      clearInterval(timer);
      codeBtn.value = true;
    };
    
    // 单数字输入框change
    const onInputChange = async () => {
      inputTip.value = '';

      const codeValue = codes.value.join('');
      // console.log(codes.value)
    
      if (codeValue.length != 6) return;

      // 邮箱验证码验证
      let res = '';
      const param = {
        authcode: codeValue,
        userAccount: userInfo?.account
      }
      try {
        res = await axios.post(API.GET_EMAIL_VERIFICATION, param, {requestToMessageHide: true})
      } catch (error) { 
        inputTip.value = error.message;
        return; 
      }
      
      // 邮箱验证通过，通知父组件进行删除数据请求，子组件监听父组件传来值（watch监听） // **，删除成功显示“已删除”，删除失败显示父组件传来错误信息
      ctx.emit("emailVerificetionSuccess", codeValue);
    };

    // 对话框关闭 事件
    const hiddenModal = () => {
      visible.value = false;
      currentStep.value = 0;
      inputTip.value = null;
      codes.value = ['', '', '', '', '', ''];
    };

    watch(() => props.batchDeleteStateProps, (count, prevCount) => {
      // console.log('count', count, 'prevCount', prevCount);

      // 删除成功
      if (count == "batchDeleteStatePropsSuccess") {
        // 成功后进入第二步 完成
        currentStep.value = 1;
        clearIntervalFun(); // 验证成功关闭倒计时

      } else if (count == "batchDeleteStatePropsError") { // 删除失败
        hiddenModal();
      }
    });

    // 知道了 事件
    const onYes = () => {
      currentStep.value = 0;
      inputTip.value = null;
      visible.value = false;
    };
    
    // 关闭对话框 后调用方法
    const afterCloseHandel = () => {
     clearIntervalFun();
    };
    
    // 对话框显示 事件
    const showModal = () => {
      visible.value = true;
      currentStep.value = 0;
      inputTip.value = null;
      codes.value = ['', '', '', '', '', ''];
    };

    return {
      visible,
      showModal,
      afterCloseHandel,
      email,
      inputTip,
      codeBtn,
      verificationCodeBtn,
      countTime,
      codes,
      onInputChange,
      
      onYes,
      footerShow,
      currentStep
    }
  }
});
</script>

<style lang="less" scoped>
.BatchDelete {
  font-size: 16px;
}
  
.editTitle {
  color: @color-Blue;
  cursor: pointer;
}

// 步骤条
.steps {
  width: 60%;
}

// 验证
.verification {
  p {
    &:nth-child(1) {
      padding-top: 20px;
    }
    
    &:nth-child(2) {
      color: @color-Black-45;
    }
    padding: 0px 0;
    padding-left: 3px;
  }
  
  .inputs {
    display: flex;
    justify-content: left;
    align-items: center;
    padding: 20px 0 8px 3px;
    
    .gainCode {
      margin-left: 20px;
    }
  }
  
  .inputTip {
    height: 20px;
    color: @color-Red;
    margin-bottom: 20px;
  }
  
  .nullEmail {
    color: @color-Blue;
  }
}

// 完成 成功删除
.successDelete {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100px;
  color: @color-Green;
  
  p {
    padding-left: 10px;
    color: @color-Black-85;
  }
}
</style>