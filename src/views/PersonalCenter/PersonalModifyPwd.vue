<!--
 * @Description: 个人设置 -> 账号密码
-->
<template>
  <section class="personal-container">
    <h3>账号密码</h3>

    <div class="content">
      <a-form layout="vertical" ref="formRef" :model="formState" :rules="rules">
        <span class="label">旧密码：</span>
        <a-form-item class="input-view" name="oldPassword">
          <a-input-password  type="password" v-model:value.trim="formState.oldPassword" placeholder="请输入旧密码"  autocomplete="on" size="small" @change="errorTipsNull" />
          <p v-if="formState.oldPasswordErrorTips" class="errorTips">{{ formState.oldPasswordErrorTips }}</p>
        </a-form-item>

        <span class="label">新密码：</span>
        <a-form-item class="input-view" name="newPassword">
          <a-input-password  type="password" v-model:value.trim="formState.newPassword" placeholder="请输入6-16位新密码" autocomplete="on" size="small" @change="errorTipsNull" />
        </a-form-item>

        <span class="label">确认新密码：</span>
        <a-form-item class="input-view" name="newPasswordYes">
          <a-input-password  type="password" v-model:value.trim="formState.newPasswordYes" placeholder="请再次输入6-16位新密码" autocomplete="on" size="small" @change="errorTipsNull" />
        </a-form-item>

        <a-form-item class="btn-view">
          <a-button type="primary" @click="onSubmit" size="large" :loading="formState.loading">保存</a-button>
        </a-form-item>
      </a-form>
    </div>
  </section>
</template>

<script>
import { defineComponent, reactive, ref, toRaw, onActivated, onMounted } from 'vue'
import axios from "@common/http";
import API from "@common/api";
import Storage from '@/common/utils/storage';
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'

export default defineComponent({
  name: 'PersonalModifyPwd',
  setup() {
    const router = useRouter();
    // 表单数据
    const formRef = ref(null);
    const formState = reactive({
      oldPassword: '', // 旧密码
      newPassword: '', // 新密码
      newPasswordYes: '', // 确认密码
      loading: false,
      oldPasswordErrorTips: '' // 旧密码错误提示
    });
    
    //  确认密码 失去焦点，调用后台查询班级名是否存在
    let validateNewPasswordYes = async (rule, value) => {
      // console.log('rule', rule, 'value', value);
      if (value != formState.newPassword) {
        return Promise.reject('密码前后不一致，请重新输入');
      } else {
        return Promise.resolve(); // 验证通过
      }
    };
    
    // 页面销毁 调用生命周期钩子
    onActivated(() => {
      formRef.value.resetFields(); // 重置表单
      errorTipsNull();
    });

    onMounted(() => {
      errorTipsNull();
    });
    
    const rules = reactive({
      oldPassword: [
        { required: true, message: '请输入旧密码', trigger: 'change' }
      ],
      newPassword: [
        { required: true, message: '请输入新密码', trigger: 'blur' }, 
        { min: 6, max: 16, message: '请输入6-16位密码，可包含数字、英文字母、特殊字符，区分大小写', trigger: 'blur' }
      ],
      newPasswordYes: [
        { required: true, message: '请再次输入新密码', trigger: 'blur' }, 
        { validator: validateNewPasswordYes, trigger: 'blur' },
      ],
    });

    const submitAxios = async(parm) => {
      let response = null;
      try {
        response = await axios.put(API.PERSONALCENTER.PERSONALCENTER_PASSWORD, parm);
      } catch (error) { response = error }

      if (!response || response.code != 200 ) {
        if (response.code == 30004) formState.oldPasswordErrorTips = response.message;
        return;
      }

      message.success("密码修改成功，请重新登录！")

      // 清除所有内容
      Storage.clearStorage();

      router.replace('/login')
    };
    
    // 保存 事件
    const onSubmit = () => {
      errorTipsNull();
      formState.loading = true;
      formRef.value.validate().then(() => {
        // 验证通过

        const parms = {
          newPassword: formState.newPassword,
          newPasswordTwice: formState.newPasswordYes,
          oldPassword: formState.oldPassword
        };

        submitAxios(parms);

      }).catch(error => {
        // 验证失败
        console.log('error', error);
      });
      formState.loading = false;
    };

    // 错误提示置空
    const errorTipsNull = () => {
      formState.oldPasswordErrorTips = '';
    };

    return {
      formRef,
      formState,
      onSubmit,
      rules,
      errorTipsNull
    };
  },
})
</script>

<style lang="less" scoped>
.personal-container {
  height: calc(100vh - 0.6rem);
  min-height: 5rem;

  h3 {
    font-size: 0.18rem;
    color: #333333;
    line-height: .7rem;
    padding: 0 0.3rem;
    border-bottom: .01rem solid rgba(112, 112, 112, .3);
  }
  
  .content {
    padding: 0.14rem 0.3rem;
    
    .label {
      font-size: .16rem;
      display: block;
      padding: .05rem 0 .08rem 0;
      color: rgba(0, 0, 0, .7)
    }
    
    .input-view {
      margin-bottom: 0.15rem;
      width: 4rem;

      :deep(.ant-form-item-label) {
        display: block;
        font-weight: bold;
        margin-bottom: 0.1rem;
      }

      :deep(input) {
        height: 0.4rem;
        font-size: 0.14rem;
        color: #333;
      }
      
      .errorTips {
        font-size: .14rem;
        color: @color-Red;
        height: .14rem;
        line-height: .14rem;
        padding-top: .05rem;
      }
    }

    .btn-view {
      padding-top: .3rem;
      
      button {
        padding: 0 25px;
      }
    }
  }
}

:deep(.ant-form-explain){
  white-space: nowrap;
}
</style>
