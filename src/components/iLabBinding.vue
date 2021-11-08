<!--
 * @Description: iLab 绑定校内用户，iLab解绑用户
-->
<template>
  <div class="binding">
    <!-- 点击绑定 -->
    <div v-if="msg == 'binding'">
      <a-button size="large" type="primary" class="schoolIn" @click="showModal">校内实验入口</a-button>
      <!-- <span class="btn" @click="showModal">点击绑定</span> -->
      
      <a-modal v-model:visible="visible" title="请输入学号和密码绑定账号" :footer="undefined" :afterClose="afterCloseHandel" centered>
        <a-form
          ref="formRef"
          :model="formState"
          :rules="rules"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        > 
        <div class="form-div">
          <a-form-item name="account">
            <a-input v-model:value.trim="formState.account" placeholder="请输入学号/工号" size="large" @change="inputOnChange" />
          </a-form-item>
          
          <a-form-item name="password">
            <a-input-password v-model:value.trim="formState.password" autocomplete="on" placeholder="请输入密码" size="large" @change="inputOnChange" />
          </a-form-item>
          
          <span class="color-Red" v-if="errorTip">{{ errorTip }}</span>
        </div>
        </a-form>
        
        <!-- 底部自定义按钮 -->
        <template #footer>
          <a-button @click="onClose">取消</a-button>
          <a-button type="primary" @click="onSubmit" :loading="formState.loading">确定</a-button>
        </template>
      </a-modal>
    </div>
    
    <!-- 解绑 -->
    <div v-if="msg == 'unBinding'">
      <span class="un-btn" @click="visibleUnboundShowModal">解绑</span>
      
      <a-modal v-model:visible="visibleUnbound" title="请输入学号和密码绑定账号" :footer="undefined" :afterClose="afterCloseHandel" centered>
        
        <div class="unbound">
          <div class="unbound-icon">
            <ExclamationCircleFilled />
          </div>
          <div class="unbound-content">
            <span>您正在解绑校内账号，解绑后您的实训成绩将不能被记录到学情数据系统中。</span>
          </div>
        </div>
        
        <!-- 底部自定义按钮 -->
        <template #footer>
          <a-button @click="onVisibleUnboundClose">取消</a-button>
          <a-button type="primary" @click="onVisibleUnboundOK" :loading="formState.loading">确定</a-button>
        </template>
      </a-modal>
    </div>
    
  </div>
</template>

<script>
import { defineComponent, reactive, ref } from 'vue'
import { Modal } from 'ant-design-vue'
import { ExclamationCircleFilled } from '@ant-design/icons-vue';
import axios from "@common/http"
import API from "@common/api"
import Enums from '@common/enums'
import Storage from '@common/utils/storage'
import { getUserInfoStorage } from '@views/Login/LoginService'
import { useRouter } from 'vue-router'

export default defineComponent({
  props: {
    // 绑定：binding  解绑：unBinding
    msg: { type: String, default: '' }
  },
  components: {
    AModal: Modal,
    ExclamationCircleFilled
  },
  setup(props, ctx) {
    const router = useRouter();
    const visible = ref(false); // 绑定 对话框状态
    let errorTip = ref(null); // 失败提示，错误提示

    // 表单数据
    const formRef = ref();
    const formState = reactive({
      account: '', // 工号
      password: '', // 姓名
      loading: false
    });
    
    const rules = {
      account: [
        { required: true, message: '请输入学号/工号', trigger: 'blur', whitespace: true }, // 必选时，空格是否会被视为错误
      ],
      password: [
        { required: true, message: '请输入密码', trigger: 'blur', whitespace: true },
        { min: 6, max: 16, message: '请输入6-16位密码，可包含数字、英文字母，区分大小写', trigger: 'blur'}, 
      ]
    };
    
    // 新建 事件
    const onSubmit = () => {
      formState.loading = true;
      
      formRef.value.validate().then(() => {
        // 验证通过
        // console.log('values', formState, toRaw(formState));
        
        onBind();
      }).catch(error => {
        // 验证失败
        console.log('error', error);
        formState.loading = false;
      });
    };

    // 确定、绑定事假
    const onBind = async() => {
      let res = '';
      try {
        // 绑定请求
        res = await axios.post(API.PERSONALCENTER.PERSONALCENTER_BINDUSER, {userAccount: formState.account, password: formState.password});
      } catch (error) {
        formState.loading = false;
        errorTip.value = error.message;
        return;
      }

      if (!res || res?.code != 200 || !res.data) return;

      // 绑定用户后，更换为绑定后用户信息，切换绑定后的用户token，用户缓存信息
      Storage.removeStorage(Enums.STORAGE.TOKEN);
      Storage.setStorage(Enums.STORAGE.TOKEN, res.data, 0);

      let response = '';
      try {
        // 修改用户本地缓存
        response = await getUserInfoStorage();
      } catch (error) {
        errorTip.value = error.message;
        formState.loading = false;
        return;
      }

      formState.loading = false;
      if (!response || response?.code != 200) return;

      visible.value = false;
      // 刷新页面
      location.reload();
    };
    
    // 对话框显示 事件
    const showModal = () => {
      visible.value = true;
    };
    
    // 取消、关闭对话框
    const onClose = () => {
      visible.value = false;
      afterCloseHandel();
    };
    
    // 关闭对话框 后调用方法
    const afterCloseHandel = () => {
      formRef.value?.resetFields(); // 重置表单，重置提示
      
      errorTip.value = ''; // 错误提示制空
    };
    
    
    // 解绑 对话框状态
    const visibleUnbound = ref(false)
    
    // 解绑 事件
    const visibleUnboundShowModal = () => {
      visibleUnbound.value = true;
    };
    
    // 解绑 取消事件
    const onVisibleUnboundClose = () => {
      visibleUnbound.value = false;
    };
    
    // 解绑 确定事件
    const onVisibleUnboundOK = async() => {
      let res = '';
      try {
        // 解除绑定请求
        res = await axios.post(API.PERSONALCENTER.PERSONALCENTER_REMOVEBIND);
      } catch (error) {
        formState.loading = false;
        return;
      }

      if (!res || res?.code != 200) return;
      visibleUnbound.value = false;

      // 绑定用户后，清除所有数据，退出到登录
      Storage.clearStorage();
      router.replace('/login')
    };

    // input的change监听，置空错误提示
    const inputOnChange = () => {
      errorTip.value = '';
    };
    
    return {
      visible,
      formRef,
      formState,
      rules,
      errorTip,
      
      labelCol: {
        span: 5,
      },
      wrapperCol: {
        span: 24,
      },
      
      showModal,
      afterCloseHandel,
      onClose,
      onSubmit,
      
      visibleUnbound,
      visibleUnboundShowModal,
      onVisibleUnboundClose,
      onVisibleUnboundOK,
      inputOnChange
    }
  }
});
</script>

<style lang="less" scoped>
.binding {
  
  .btn {
    color: @color-Red;
    cursor: pointer;
  }
  
  .un-btn {
    color: @color-Blue;
    cursor: pointer;
  }
}

.form-div {
  padding: 0 20px;
}

.unbound {
  display: flex;
  padding: 0 30px 20px 30px;
    
  .unbound-icon {
    font-size: 22px;
    color: @color-Yellow;
  }
  
  .unbound-content {
    padding-left: 15px;
  }
}
</style>