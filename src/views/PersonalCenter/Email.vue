<!--
 * @Description: 个人设置 -> 个人信息 -> 更换邮箱
-->
<template>
  <!-- 更换邮箱 -->
  <section class="container forget-view">
    <div class="form-view">
      <!-- 步骤条 -->
      <a-steps :current="state.step">
        <a-step title="身份验证" />
        <a-step title="绑定邮箱" />
        <a-step title="完成更换" />
      </a-steps>

      <!-- 密码表单 -->
      <div class="form-div" v-if="state.step == 0">
        <a-form ref="formRef_Confirm" :wrapperCol="{span: 24}" :rules="rules" :model="forms.confirm">
          <a-form-item class="input-view" name="password" label="密码">
            <a-input-password v-model:value.trim="forms.confirm.password" size="large" autocomplete="off" placeholder="请输入密码" />
            <p class="error" >{{ forms.email.errorTip }}</p>
          </a-form-item>

          <a-form-item class="next-view">
            <a-button type="primary" size="large" block @click="onNext(0)" :loading="state.loading">下一步</a-button>
          </a-form-item>
        </a-form>
      </div>

      <!-- 验证码表单 -->
      <div class="email-div" v-if="state.step == 1">
        <div class="email-input-view" >
          <a-form ref="formRef_Email" :wrapperCol="{span: 24}" :rules="rules" :model="forms.confirm">
            <a-form-item class="input-view input-width" name="email" label="邮箱">
              <a-input v-model:value="forms.confirm.email" size="large" placeholder="请输入邮箱" />
            </a-form-item>
            
            <div class="codes-view">
              <div class="input-view">
                <SingleNumberInput :codes="forms.email.codes" @changed="onInputChange" />
              </div>
              <div class="btn-view">
                <a-button type="link" v-if="time.countTime <= 0" @click="onSendOutEmail">获取验证码</a-button>
                <p v-else><span>{{ time.countTime }}s</span> 后重新获取</p>
              </div>
            </div>
            <p class="error" >{{ forms.email.errorTip }}</p>
            <p class="p-btn">
              <!-- <a-button type="link">没收到邮件？</a-button> -->
              <a-tooltip placement="bottomLeft">
                <template #title>
                  <span>查看邮箱的垃圾箱，邮件有可能被误认为垃圾邮件。</span>
                </template>
                <a-button type="link">没收到邮件？</a-button>
              </a-tooltip>
            </p>
          
            <a-form-item class="next-view input-width">
              <a-button type="primary" size="large" block @click="onNext(1)" :loading="state.loading">下一步</a-button>
            </a-form-item>
          </a-form>
        </div>
      </div>

      <!-- 完成更换 -->
      <div class="replace-div" v-if="state.step == 2">
        <div class="success-icon">
          <CheckCircleFilled />
        </div>
        <p class="success-explain">邮箱更换成功!</p>
        <p class="success-small">
          页面将于<span>{{ time.countTime }}s</span>后跳转至<span><router-link to="/personal">个人设置页</router-link></span>
        </p>
        
      </div>
    </div>

  </section>
</template>

<script>
import { defineComponent, reactive, ref } from 'vue'
import { Steps, Spin, Tooltip } from 'ant-design-vue'
import SingleNumberInput from '@components/SingleNumberInput.vue'
import { CheckCircleFilled } from '@ant-design/icons-vue'
import router from '@/router'
import { getUserInfoStorage } from '@views/Login/LoginService.js'
import { verificationPassword, emailGetCode, emailCodeVerification, userUpData } from '@views/PersonalCenter/EmailService.js'

export default defineComponent({
  name: 'Email',
  components: {
    ASteps: Steps,
    AStep: Steps.Step,
    ASpin: Spin,
    SingleNumberInput,
    CheckCircleFilled,
    ATooltip: Tooltip
  },
  setup() {
    // 表单
    const forms = reactive({
      confirm: {password: '', email: ''},
      email: {
        errorTip: '', // 验证码，错误提示
        codes: ['', '', '', '', '', ''],
        saveCode: '' // 用于接收codes验证码
      }
    });
    // 校验规则
    const rules = ref({
      password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 6, max: 16, message: '请输入6-16位密码，可包含数字、英文字母、特殊字符，区分大小写', trigger: 'blur' },
        { validator: () => { forms.email.errorTip = ''; return Promise.resolve() }, trigger: 'change' },
      ],
      email: [
        { required: true, message: '请输入邮箱', trigger: 'blur' },
        { required: true, pattern: /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/, 
          message: '请输入正确邮箱', trigger: 'blur', whitespace: true  },
        { validator: () => { forms.email.errorTip = ''; return Promise.resolve() }, trigger: 'change' },
      ]
    });
    // 状态
    const state = reactive({
      step: 0,
      loading: false
    });
    const formRef_Confirm = ref(null); // 身份验证，验证
    const formRef_Email = ref(null); // 绑定邮箱，验证

    // 下一步按钮点击
    const onNext = async (step) => {
      state.loading = true;
      // 验证密码
      if (step == 0) {
        // 校验密码
        try {
          await formRef_Confirm.value.validate();
        } catch (error) {
          state.loading = false;
          return;
        }

        // 验证密码
        let res = await verificationPassword({password: forms.confirm.password})
        state.loading = false;

        if (!res || res?.code != 200)  {
          forms.email.errorTip = res?.message;
          return;
        }
        forms.email.errorTip = '';
        state.step = 1;
      
      } else if (step == 1) { // 绑定邮箱“下一步”
        // 正则验证
        try {
          await formRef_Email.value.validate();
        } catch (error) {
          state.loading = false;
          return;
        }

        if (forms.email.saveCode.length != 6) {
          forms.email.errorTip = '请输入正确的验证码！';
          state.loading = false;
          return;
        }
        // 邮箱、验证码验证
        let res = await emailCodeVerification({email: forms.confirm.email, authcode: forms.email.saveCode})
        
        if (!res || res?.code != 200) {
          forms.email.errorTip = res?.message; 
          state.loading = false;
          return;
        }

        // 修改个人信息内容（验证码）
        let response = await userUpData({email: forms.confirm.email, authCode: forms.email.saveCode})
        if (!response || response?.code != 200) {
          state.loading = false;
          return;
        }

        // 用token获取个人信息，再次修改缓存信息（用于其他组件调用）
        let msg = await getUserInfoStorage();
        state.loading = false;
        if (!msg || msg?.code != 200) return;

        state.step = 2;
        setTimer(5, true);
      }
    }

    // 验证码输入框
    const onInputChange = () => {
      const value = forms.email.codes.join('');
      forms.email.saveCode = value;
      forms.email.errorTip = '';

      if (value.length != 6) return;
    }
    
    // 定时器、倒计时 值
    let time = reactive({
      countTimeData: 60, // 倒计时 实值，用于赋值
      countTime: 0, // 倒计时 显示
      timer: null
    });
    // 倒计时
    const setTimer = (param = time.countTimeData, href = false) => {
      clearIntervalFun();

      time.countTime = param;
      time.timer = setInterval( () => {
        time.countTime--;
        if (time.countTime <= 0) {
          clearIntervalFun();
          if (href) router.push('/personal'); // 更换邮箱，跳转到“个人设置”
        }
      }, 1000)
    };
    // 关闭定时器
    const clearIntervalFun = () => {
      clearInterval(time.timer);
    };
    
    // 发送邮箱验证码，获取验证码
    const onSendOutEmail = async() => {
      forms.email.errorTip = '';
      // 正则验证
      try {
        await formRef_Email.value.validate();
      } catch (error) { return; }

      setTimer(); // 启用倒计时

      // 新邮箱，获取验证码
      let res = await emailGetCode({email: forms.confirm.email, modelId: 2});
      if (!res || res?.code != 200) {
        forms.email.errorTip = res.message;
        return;
      }
    }
    
    return {
      onNext,
      onInputChange,
      formRef_Confirm,
      formRef_Email,
      rules,
      forms,
      state,
      time,
      onSendOutEmail
    }
  },
})
</script>

<style scoped lang="less">
button.ant-btn-primary, button.ant-btn-primary:active, button.ant-btn-primary:focus {
  background-color: #1890ff;
  border-color: #1890ff;
  color: #fff;
}

button.ant-btn-primary:hover {
  background-color: #1890ff;
  border-color: #1890ff;
  color: #fff;
  opacity:0.7;
}

.forget-view {
  width:12rem;
  height: calc(100vh - .6rem);
  min-height: 500px;
  margin:0 auto;
  background-color: #fff;
  padding-top:0.8rem;
}

.form-view {
  width:4.4rem;
  margin:0 auto;
}

.form-div {
  width: 3.3rem;
  margin:0 auto;
  padding-top:0.3rem;

  .input-view {
    margin-bottom: 0.7rem;
  }

  .next-view {
    margin-bottom: 0.24rem;
  }

  p.error {
    font-size: 0.14rem;
    color: #FF4D4F;
  }
}

.email-div {
  padding: 0 0 0 .2rem;
  
  .email-input-view {
    padding-top:0.3rem;

    .codes-view {
      margin-top:0.20rem;
      display: flex;
      align-items: center;

      .input-view {
        :deep(.add-grade-view) {
          input {
            margin-right: 0.08rem;
            border:1px solid #d9d9d9;
          }
        }
      }

      .btn-view {
        p {
          font-size: 0.16rem;
          color: rgba(0, 0, 0, 0.65);

          span {
            color: rgba(24, 144, 255, 1);
          }
        }
      }
    }
    
    .input-width {
      width: 3.4rem;
    }

    p.error {
      font-size: 0.14rem;
      color: #FF4D4F;
      margin-top:0.08rem;
    }

    p.p-btn {
      margin: 0.2rem 0 0.4rem 0;

      button {
        padding:0;
      }
    }
  }
}

.replace-div {
  width:3.5rem;
  margin: 0.6rem auto 0;
  text-align: center;
  
  .success-icon {
    color: @color-Green;
    font-size: .6rem;
  }
  
  .success-explain {
    font-weight: bold;
    margin: .25rem 0 .4rem 0;
  }
  
  .success-small {
    span {
      color: @color-Blue;
      
      &:last-child {
        cursor: pointer;
        
        a {
          color: @color-Blue;
        }
      }
    }
  }
}
</style>