<!--
 * @Description: 登录 页面
-->
<template>
  <section class="container" :style="`background-image: url(` + STATIC_SOURCE_URI + `/images/login-bg.png)`">
    <div class="logTitle">
      <img class="log" :src="loginImg" />
      <div class="title">
        <p>跨文化情境英语口语能力</p>
        <p class="small">虚拟仿真实训系统</p>
      </div>
    </div>
    
    <!-- 表单 -->
    <div class="login">
      <!-- 表单 -->
      <div class="form-view">
      
        <a-form ref="formRef" class="form" :model="loginForm" :rules="rules" :wrapper-col="{ span: 24 }">
          <div class="title-view">
            <h3>登录</h3>
          </div>
          
          <a-form-item name="name">
            <a-input v-model:value.trim="loginForm.name" placeholder="请输入学号/工号" size="large" @pressEnter="onSubmit" @change="errorTipsNull">
              <!-- <template #prefix>
                <span>账号：</span>
              </template> -->
            </a-input>
            <p class="errorTips" v-if="loginForm.accountErrorTips">{{ loginForm.accountErrorTips }}</p>
          </a-form-item>
          
          <div class="password-view">
            <a-form-item name="password" style="padding-top: .10rem;">
              <a-input :type="showPassword ? 'password' : 'text'" v-model:value.trim="loginForm.password" placeholder="请输入密码" size="large" autocomplete="on" @pressEnter="onSubmit"  @change="errorTipsNull">
                <template #suffix>
                  <EyeInvisibleFilled v-if="showPassword" style="color: rgba(0, 0, 0, 0.75)" @click="onShowPassword" />
                  <EyeFilled v-else style="color: rgba(0, 0, 0, 0.75)" @click="onShowPassword" />
                </template>
              </a-input>
              <p class="errorTips" v-if="loginForm.passwordErrorTips">{{ loginForm.passwordErrorTips }}</p>
            </a-form-item>

            <div class="password-tip">
              <a-tooltip  placement="bottom" title="初始密码为xnfz 加上工号或学号的后四位">
                <question-circle-filled style="color: rgba(0, 0, 0, 0.45)" />
              </a-tooltip>
            </div>
          </div>

          <a-row class="row">
            <a-col :span="15">
              <a-form-item class="checkbox-view">
                <a-checkbox v-model:checked="loginForm.checked">15天内保持登录</a-checkbox>
              </a-form-item>
            </a-col>
      
            <a-col :span="9">
              <a-form-item class="checkbox-view">
                <p><router-link to="/forget">忘记密码</router-link></p>
              </a-form-item>
            </a-col>
          </a-row>
      
          <a-form-item>
            <a-button type="primary" class="btn" size="large" block @click="onSubmit" :loading="loading">登录</a-button>
          </a-form-item>

          <p class="register">
            <router-link to="/register">
              <a-button type="link">学生注册</a-button>
            </router-link>
          </p>
        </a-form>
      </div>
    </div>
    
    
    <!-- 排队中 -->
    <div class="order-modal" v-if="orderModal">
      <div class="content">
        <p class="title">实训排队中</p>
        <div class="tips">目前排在<span class="color-Red">第10位</span>,<span class="color-Red">20</span>名用户正在排队</div>
        <span class="small">预计等待：1小时1分15秒</span>
        <div class="btn">
          <a-button type="primary" @click="onOrderModal">退出排队</a-button>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { defineComponent, reactive, ref, createVNode, onMounted, onActivated } from 'vue'
import { Modal, Tooltip } from 'ant-design-vue'
import Config from '@/common/config'
import Store from '@common/store'
import { useRouter } from 'vue-router'
import { requestLogin, getUserInfo } from './LoginService'
import { ExclamationCircleFilled, QuestionCircleFilled, InfoCircleOutlined, EyeInvisibleFilled, EyeFilled } from '@ant-design/icons-vue'
import Storage from '@common/utils/storage'
import Enums from '@/common/enums'

const { STATIC_SOURCE_URI } = Config; // 腾讯存储统一路径
// 登录表单
const loginForm = reactive({
  name: '',
  password: '',
  checked: false,
  accountErrorTips: '', // 账号错误提示
  passwordErrorTips: '' // 密码错误提示
});

// 密码自定义校验提示
let validatePasswordShow = false;
let validatePasswordTip = ''; // 密码自定义校验提示内容
let validatePassword = async (a) => { // 自定义校验，密码剩余次数提示
  if (validatePasswordShow) {
    validatePasswordShow = false;
    // return Promise.reject('学号已存在，请确认后再输入');
    return Promise.reject(validatePasswordTip);
  } else {
    return Promise.resolve(); // 验证通过
  }
};
// 表单校验
const rules = reactive({
  name: [{required: true, message: '请输入学号或工号', trigger: 'change'}],
  password: [{required: true, message: '请输入密码', trigger: 'change'}, {validator: validatePassword, trigger: ''}]
});

const loginImg = STATIC_SOURCE_URI + '/images/login.png';

export default defineComponent({
  name: 'Login',
  components: {
    ExclamationCircleFilled,
    QuestionCircleFilled,
    InfoCircleOutlined,
    ATooltip: Tooltip,
    EyeInvisibleFilled,
    EyeFilled
  },
  setup() {
    // 设置App 头部样式
    const formRef = ref(null);
    const router = useRouter();
    const store = Store.getStore();
    const loading = ref(false);
    // 表单提交事件
    const onSubmit = async (state) => {
      errorTipsNull();
      let ref = formRef.value;
      let form = JSON.parse(JSON.stringify(loginForm));

      try {
        await ref.validate();
      } catch (error) {
        return;
      }
      
      loading.value = true;

      const user = await requestLogin(form);

      loading.value = false;
      
      // 判断后台返回错误信息时进行提示
      /* if (user) {
        validatePasswordShow = true;
        validatePasswordTip = '密码错误，如果重试超过5次账号将会被锁定！'; // 后台返回的错误提示内容
        try {
          await ref.validate();
        } catch (error) {
          return;
        }
      } */

      if (!user || user.code != 200) {
        if (user.code == 20011) lockingModal(); // 账号冻结提示
        if (user.code == 10001) loginForm.accountErrorTips = '该账号不存在，请确认后再输入'; // 账号不存在提示
        if (user.code == 30002) loginForm.passwordErrorTips = user.message; // 密码错误提示
        // loginForm.errorTips = user.message;
        return;
      }

      // store.user = user;
      router.replace({path: '/'});
    };
      
    // 账号已被锁定提示 超5次提示
    const lockingNumberModal = () => {
      Modal.warning({
        // title: '重试次数超过5次，账号已锁定！',
        title: createVNode( 'div', { style: 'color: #000; font-size: 16px;', }, '重试次数超过5次，账号已锁定！', ),
        content: createVNode( 'div', { style: 'color: #555658; font-size: 14px;', }, '请1小时后再尝试！', ),
        icon: createVNode(ExclamationCircleFilled),
        centered: true,
        okText: '知道了',
      });
    };
    
    // 账号已被锁定提示
    const lockingModal = () => {
      Modal.warning({
        // title: '该账号已被系统锁定！',
        title: createVNode( 'div', { style: 'color: #000; font-size: 16px;', }, '该账号已被系统锁定！', ),
        content: createVNode( 'div', { style: 'color: #555658; font-size: 14px;', }, '请1小时后再尝试！', ),
        icon: createVNode(ExclamationCircleFilled),
        centered: true,
        okText: '知道了',
      });
    }
    
    // 排队提示
    let orderModal = ref(false);
    const onOrderModal = () => { // 退出排队方法
      orderModal.value = false;
    };

    onActivated(() => {
      errorTipsNull();
    });
    
    // 页面加载执行
    onMounted( async() => {
      errorTipsNull();

      // 存在token进行token验证，为有效跳转首页
      if (Storage.getStorage(Enums.STORAGE.TOKEN)) {
        let res = await getUserInfo();
        
        if (!res || res?.code != 200) return; 
        router.replace({path: '/'});
      }
    })

    // 错误提示置空
    const errorTipsNull = () => {
      loginForm.accountErrorTips = '';
      loginForm.passwordErrorTips = '';
    }

    // 密码显示、隐藏
    const showPassword = ref(true);

    // 密码显示、隐藏 按钮点击事件
    const onShowPassword = () => {
      showPassword.value = !showPassword.value;
    }

    return {
      STATIC_SOURCE_URI,
      loginImg,
      loading,
      loginForm,
      rules,
      formRef,
      onSubmit,
      orderModal,
      onOrderModal,
      showPassword,
      onShowPassword,
      errorTipsNull
    }
  },
})
</script>

<style lang="less" scoped>
.container {
  width: 100%;
  height: 100vh;
  min-height: 640px;
  background-size: cover;
  background-repeat: no-repeat;
  overflow: hidden;
  position: relative;
  
  .logTitle {
    margin: .6rem 0 0 1.2rem;
    
    .log {
      max-width: 2.64rem;
      max-height: 2rem;
    }
    
    .title {
      padding-top: 1.3rem;
      color: @color-Blue;
      
      p {
        font-size: .48rem;
      }
      
      .small {
        font-size: .36rem;
        padding-top: .2rem;
      }
    }
  }

  // 表单
  .login {
    position: absolute;
    top: 0;
    right: 0;
    margin: 1.75rem 1.3rem auto auto;
    width: 3.76rem;
    height: 4.3rem;
    background-color: #FFF;
    border-radius: .04rem;

    .form-view {
      display: flex;
      justify-content: flex-end;
    
      .form {
        width:4.7rem;
        background-color: #fff;
        padding:0.35rem;
    
        .title-view {
          padding-bottom: 0.6rem;
    
          h3 {
            text-align: center;
            font-size: 0.24rem;
            color: @color-Blue;
            letter-spacing: .14rem;
          }
        }
    
        .row {
          height: 0.6rem;
        }
        
        .checkbox-view {
          display: block;
          margin-top: -0.1rem;
          font-size: .14rem !important;
    
          p {
            text-align: right;
            
            a {
              color: @color-Black-45;
            }
          }
        }
    
        .btn {
          border-radius: .04rem;
          height: .4rem;
          font-size: .16rem;
        }

        .password-view {
          position: relative;

          .password-tip {
            position: absolute;
            top: calc(.12rem + 9px);
            right: .06rem;
            font-size: .14rem;
          }
        }
        
        // 学号、工号输入框
        :deep(.ant-form-item-control .ant-input-lg) {
          font-size: .16rem;
        }
        
        // 错误提示
        :deep(.ant-form-explain, .ant-form-extra) {
          font-size: .14rem;
          padding-top: .04rem;
        }
        
        // 忘记密码部分
        :deep {
          .ant-form-item {
            margin-bottom: .24rem;
          }

          .ant-checkbox + span {
            font-size: .14rem;
          }
          
          .ant-checkbox-input {
            width: .16rem;
            height: .16rem;
          }

          .ant-input-affix-wrapper .ant-input-suffix { // 问号、提示
            margin-right: .2rem;
            font-size: .14rem;
          }
        }
      }

      .register {
        margin: -10px 0 0 0 ;
        text-align: center;
        :deep {
          button {
            font-size: .14rem;
          }
        }
      }

      .errorTips {
        font-size: .14rem;
        color: @color-Red;
        height: .14rem;
        line-height: .14rem;
        padding-top: .05rem;
      }
    }
  }
  
  // 排队
  .order-modal {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.65);
    display: flex;
    justify-content: center;
    align-items: center;
    
    .content {
      background-color: #fff;
      width: 4.24rem;
      height: 1.92rem;
      padding: .4rem;
      
      .title {
        font-weight: bold;
        padding-bottom: .2rem;
      }
      
      .tips {
        font-size: .14rem;
        padding-bottom: .1rem;
      }
      
      .small {
        font-size: .14rem;
        color: @color-Black-45;
      }
      
      .btn {
        padding-top: .2rem;
        text-align: right;
        
        button {
          font-size: .14rem;
          padding: 0 .15rem;
          height: .32rem;
        }
      }
    }
  }
}
</style>
