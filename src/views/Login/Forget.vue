<!--
 * @Description: 找回密码
-->
<template>
  <section class="container forget-view">
    <div class="form-view">
      <!-- 步骤条 -->
      <a-steps :current="state.step">
        <a-step title="确认账号" />
        <a-step title="安全验证" />
        <a-step title="重置密码" />
      </a-steps>

      <!-- 确认账号表单 -->
      <div class="form-div" v-if="state.step == 0">
        <a-form ref="formRef_Confirm" :wrapperCol="{span: 24}" :rules="rules" :model="forms.confirm">
          <a-form-item class="input-view" name="account" autocomplete="off">
            <a-input v-model:value.trim="forms.confirm.account" size="large" placeholder="请输入学号/工号" />
          </a-form-item>

          <a-form-item class="next-view">
            <a-button type="primary" block @click="onNext(0)" size="large" :loading="state.loading">下一步</a-button>
          </a-form-item>
          
          <a-form-item>
            <p class="login">
              记得密码, 
              <a-button type="link">
                <router-link to="/login">直接登录</router-link>
              </a-button>
            </p>
          </a-form-item>
        </a-form>
      </div>

      <!-- 验证码表单 -->
      <div class="email-div" v-if="state.step == 1">
        <div class="email-tips" v-if="state.step1EmailBtn">
          <p>点击下方按钮，将会发送验证码到你的邮箱：</p>
          <h6>{{ Utils.Email.EmailChang(forms.email.email) }}</h6>
          <a-button type="primary" size="large" @click="onSendOutEmail" block>发送邮件</a-button>
        </div>

        <div class="email-input-view" v-else>
          <h4>输入6位验证码</h4>
          <p class="tips">验证码已发送到邮箱,  {{ Utils.Email.EmailChang(forms.email.email) }}</p>
          <div class="codes-view">
            <div class="input-view">
              <SingleNumberInput :codes="forms.email.codes" @changed="onInputChange" />
            </div>
            <div class="btn-view">
              <a-button type="link" v-if="time.countTime <= 0" @click="onSendOutEmail">重新获取</a-button>
              <p v-else><span>{{ time.countTime }}s</span> 后重新获取</p>
            </div>
          </div>
          <p class="error">{{ forms.email.errorTip }}</p>
          <p class="p-btn">
            <a-button type="link">没收到邮件？</a-button>
          </p>
        </div>
      </div>

      <!-- 重置密码表单 -->
      <div class="reset-div" v-if="state.step == 2">
        <a-form ref="formRef_Reset" :wrapperCol="{span: 24}" :rules="rules" :model="forms.reset">
          <a-form-item class="input-view" name="password" autocomplete="off">
            <a-input-password type="password" v-model:value="forms.reset.password" size="large" placeholder="请输入新密码（6-16位）" allowClear />
          </a-form-item>

          <a-form-item class="input-view" name="confirm" autocomplete="off">
            <a-input-password type="password" v-model:value="forms.reset.confirm" size="large" placeholder="请再次输入新密码" allowClear />
          </a-form-item>

          <a-form-item class="next-view">
            <a-button type="primary" block @click="onNext(2)" size="large" :loading="state.loading">重置密码</a-button>
          </a-form-item>
        </a-form>
      </div>
    </div>

    <!-- loading -->
    <a-modal v-model:visible="state.visible" title="请稍候..." :keyboard="false" :maskClosable="false" :closable="false" :footer="null" centered>
      <a-spin :spinning="true" />
    </a-modal>
  </section>
</template>

<script>
import { defineComponent, reactive, ref } from 'vue'
import { Steps, Spin, Modal } from 'ant-design-vue'
import SingleNumberInput from '@components/SingleNumberInput.vue'
import { accountQuery, accountEmail, getCode, codeVerification, updatePassword } from './ForgetService'
import Utils from '@common/utils/index'
import { message } from 'ant-design-vue'
import { useRouter } from 'vue-router'
import Storage from '@common/utils/storage'

export default defineComponent({
  name: 'Forget',
  components: {
    ASteps: Steps,
    AStep: Steps.Step,
    ASpin: Spin,
    SingleNumberInput,
    AModal: Modal
  },
  setup() {
    const router = useRouter();
    // 表单
    const forms = reactive({
      confirm: {
        account: '', // 学号、工号
        validateAccount: false // 验证 学号、工号
      },
      email: {
        email: '',
        codes: ['', '', '', '', '', ''],
        errorTip: '', // 验证码已失效，错误提示
        code: ''
      },
      reset: {
        password: '',
        confirm: ''
      }
    });

    // 账号获取邮箱
    const getEmail = async() => {
      let res = '';
      try {
        res = await accountEmail({ account: forms.confirm.account });
      } catch (error) {
        return;
      }
      // 邮箱赋值
      forms.email.email = res.data;
      return res.data ? res.data : '';
    };

    // 账号验证、工号验证、学号验证是否存在
    const validateAccount = async() => {
      if (!forms.confirm.validateAccount) return;
      forms.confirm.validateAccount = false;

      let res = '';
      try {
        res = await accountQuery({ userAccount: forms.confirm.account });
      } catch (error) { return; }
      
      // 数据请求后提示 data：true为存在，false为不存在
      if (!res || !res?.data) {
        return Promise.reject('该账号不存在，请确认后再输入');
      } else {
        // 获取邮箱
        if (!getEmail()) {
          return Promise.reject('请重新再试');
        }
        
        state.step = 1;
        return Promise.resolve(); // 验证通过
      }
    };

    // 校验规则
    const rules = ref({
      account: [
        { required: true, message: '请输入学号或工号', trigger: 'blur' },
        { validator: validateAccount, trigger: 'blur' }
      ],
      password: [
        { required: true, message: '请输入新密码', trigger: 'blur' },
        { min: 6, max: 16, message: '请输入6-16位密码，可包含数字、英文字母，区分大小写', trigger: 'blur' }
      ],
      confirm: [
        { required: true, message: '请再次输入新密码', trigger: 'blur' },
        { validator: (rule, value, callback) => {
          return forms.reset.password !== forms.reset.confirm ? Promise.reject("密码不一致，请重新输入") : Promise.resolve();
        }, trigger: 'blur' }
      ]
    });
    // 状态
    const state = reactive({
      step: 0,
      step1EmailBtn: true, // 安全验证 发送邮箱 按钮部分
      visible: false,
      loading: false
    });
    const formRef_Confirm = ref(null);
    const formRef_Email = ref(null);
    const formRef_Reset = ref(null);

    // 下一步按钮点击
    const onNext = async (step) => {
      
      // 校验账号
      if (step == 0) {
        if (forms.confirm.account) forms.confirm.validateAccount = true;

        state.loading = true;
        try {
          await formRef_Confirm.value.validate();
        } catch (error) {
          console.log(error);
        }
        state.loading = false;
        // 数据交互在 校验中
        // state.step = 1;
      } else if (step == 2) {
        // 校验重置密码
        try {
          await formRef_Reset.value.validate();
        } catch (error) {
          console.log(error);
          return;
        }

        // 提交数据
        state.loading = true;
        let res = '';
        const param = {
          authcode: forms.email.code, // 验证码
          newPwd: forms.reset.password,
          newPwdAgain: forms.reset.confirm,
          userAccount: forms.confirm.account
        };
        try {
          res = await updatePassword(param);
        } catch (error) {
          res = error;
        }

        state.loading = false;

        if (!res || res.code != 200) {
          // 30007 验证码不存在，从新验证
          if (res.code == 30007) {
            restLoadng();
          }
          return;
        }

        message.success("重置密码成功！");
        Storage.clearStorage();
        router.push('/login');
      }
    }

    // 发送邮箱验证码，获取验证码
    const onSendOutEmail = () => {
      state.step1EmailBtn = false;
      setTimer(); // 启用倒计时
      onGetVerificationCode()
    }

    // 获取验证码
    const onGetVerificationCode = async() => {
      let res = '';
      try {
        res = await getCode({ userAccount: forms.confirm.account, modelId: 1})
      } catch (error) {
        return;
      } 
    }

    // 定时器、倒计时 值
    let time = reactive({
      countTimeData: 60, // 倒计时 实值，用于赋值
      countTime: 0, // 倒计时 显示
      timer: null
    });
    // 倒计时
    const setTimer = () => {
      time.countTime = time.countTimeData;
      time.timer = setInterval( () => {
        time.countTime--;
        if (time.countTime <= 0) {
          clearIntervalFun();
        }
      }, 1000)
    };
    // 关闭定时器
    const clearIntervalFun = () => {
      clearInterval(time.timer);
    };

    // 验证码输入框
    const onInputChange = async() => {
      const value = forms.email.codes.join('');
      forms.email.errorTip = '';

      if (value.length != 6) return;

      // 验证码，用于密码提交
      forms.email.code = value;
      // 校验验证码
      state.visible = true;
      let res = '';
      try {
        res = await codeVerification({ authcode: value, userAccount: forms.confirm.account });
      } catch (error) {
        res = error;
      }

      state.visible = false;
      if (!res || res.code != 200) {
        forms.email.errorTip = res.message;
        return;
      }
      state.step = 2;
    }
    
    // 重置数据、重置内容
    const restLoadng = () => {
      forms.confirm.account = ''; // 账号
      forms.email.email = ''; // 邮箱
      forms.email.codes = ['', '', '', '', '', '']; // 验证码
      forms.email.errorTip = ''; // 错误提示
      forms.email.code = ''; // 用于提交密码的验证码
      forms.reset.password = ''; // 密码
      forms.reset.confirm = ''; // 确定密码
      state.step = 0; // 控制显示内容
      state.step1EmailBtn = true; // 发送验证码按钮
      clearIntervalFun();
      time.countTimeData = 60;
    }

    return {
      onNext,
      onInputChange,
      formRef_Confirm,
      formRef_Email,
      formRef_Reset,
      rules,
      forms,
      state,
      Utils,
      onSendOutEmail,
      time,
      getEmail
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
  margin:0 auto;
  background-color: #fff;
  padding-top:0.8rem;
  min-height: 4rem;
}

.form-view {
  width:4rem;
  margin:0 auto;
}

.form-div {
  width: 3.3rem;
  margin:0 auto;
  padding-top:0.6rem;

  .input-view {
    margin-bottom: 0.7rem;
  }

  .next-view {
    margin-bottom: 0.24rem;
  }

  p.login {
    text-align: center;
  }
}

.email-div {

  .email-tips {
    width:3.3rem;
    margin:0 auto;
    padding-top: 0.65rem;

    p {
      font-size: 0.16rem;
      color: rgba(0, 0, 0, 0.65);
      margin-bottom: 0.1rem;
    }

    h6 {
      font-size: 0.16rem;
      color: rgba(0, 0, 0, 0.85);
    }

    button {
      margin-top:0.6rem;
    }
  }

  .email-input-view {

    h4 {
      font-size: 0.16rem;
      font-weight: bold;
      color: rgba(0, 0, 0, 0.85);
      margin:0.37rem 0 0.17rem;
    }

    p.tips {
      font-size: 0.16rem;
      color: rgba(0, 0, 0, 0.85);
    }

    .codes-view {
      margin-top:0.33rem;
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

    p.error {
      font-size: 0.14rem;
      color: #FF4D4F;
      margin-top:0.08rem;
      height: .14rem;
    }

    p.p-btn {
      margin-top: 0.48rem;

      button {
        padding:0;
      }
    }
  }
}

.reset-div {
  width:3.5rem;
  margin: 0.6rem auto 0;
}
</style>