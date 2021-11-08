<!--
 * @Description: 后台管理 -> 用户管理 -> 学生管理-> 新建 组件
-->
<template>
  <section>
    <a-button size="large" type="primary" @click="showModal">
      <PlusOutlined />
      新建
    </a-button>
    
    <a-modal v-model:visible="visible" title="新建学生" :footer="undefined" :afterClose="afterCloseHandel" centered>
      <a-form
        ref="formRef"
        :model="formState"
        :rules="rules"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-form-item label="学号" name="account">
          <a-input v-model:value.trim="formState.account" placeholder="请输入学号" @focus="nameGradeTeacherFocus" size="large" />
        </a-form-item>
        
        <a-form-item label="中文名" name="userName">
          <a-input v-model:value.trim="formState.userName" placeholder="请输入中文名" @focus="nameGradeTeacherFocus" size="large" />
        </a-form-item>

        <a-form-item label="英文名" name="secondName">
          <a-input v-model:value.trim="formState.secondName" placeholder="请输入英文名" @focus="nameGradeTeacherFocus" size="large" />
        </a-form-item>
        
        <a-form-item label="邮箱" name="email">
          <a-input v-model:value.trim="formState.email" placeholder="请输入邮箱" @focus="nameGradeTeacherFocus" size="large" />
        </a-form-item>

        <a-form-item label="性别" name="sex">
          <a-radio-group v-model:value="formState.sex">
            <a-radio value="0">男</a-radio><span v-html="'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'"></span>
            <a-radio value="1">女</a-radio>
          </a-radio-group>
        </a-form-item>
        
        <span class="errorTip" v-if="errorTip">{{ errorTip }}</span>
      </a-form>
      
      <!-- 底部自定义按钮 -->
      <template #footer>
        <a-button type="primary" @click="onSubmit" :loading="formState.loading">新建</a-button>
      </template>
    </a-modal>
  </section>
</template>

<script>
import { defineComponent, reactive, ref, toRaw } from 'vue';
import { PlusOutlined } from '@ant-design/icons-vue'
import { message, Modal, Select, notification, Radio } from 'ant-design-vue'
import { UserManageServervice } from '@views/BackstageManage/UserManage/UserManage.js'

export default defineComponent({
  name: 'UserManageStudentNewlyBuild',
  props: {
    msg: { type: String, defualt: '默认值' }
  },
  components: {
    PlusOutlined,
    AModal: Modal,
    ARadioGroup: Radio.Group,
    ARadio: Radio
  },
  setup(props, ctx) {
    const visible = ref(false); // 对话框状态
    let errorTip = ref(null); // 失败提示，错误提示
    
    // 表单数据
    const formRef = ref();
    const formState = reactive({
      account: '', // 学号
      userName: '', // 姓名
      role: '4', // 学生角色。1超级管理员，2管理员，3教师，4学生
      email: '', // 邮箱
      secondName: '', // 英文名
      sex: '', // 性别
      validateJobNumber: false, // 工号 验证
      validateEmail: false, // 邮箱 验证
      loading: false
    });
    
    //  工号 失去焦点，调用后台查询班级名是否存在
    let validateJobNumber = async (rule, value) => {
      // console.log('rule', rule, 'value', value);
      if(!formState.validateJobNumber) return;

      let res = '';
      try {
        res = await UserManageServervice.accountVerification({userAccount: formState.account})
      } catch (error) {
        res = error;
      }

      // 数据请求后提示 // 200 为用户已存在；30001 为用户不存在
      if (!res || res?.data) {
        return Promise.reject('学号已存在，请确认后再输入');
      } else {
        return Promise.resolve(); // 验证通过
      }
    };
    
    //  邮箱 失去焦点，调用后台查询班级名是否存在
    let validateEmail = async (rule, value) => {
      // console.log('rule', rule, 'value', value);
      if(!formState.validateEmail || !formState.email) return;

      let res = '';
      try {
        res = await UserManageServervice.emailVerification({emailAddress: formState.email})
      } catch (error) {
        res = error;
      }

      // 数据请求后提示
      if (!res || res?.data) {
        return Promise.reject('该邮箱已与其他账号绑定，请输入新邮箱地址');
        
      } else {
        return Promise.resolve(); // 验证通过
      }
    };
    
    const rules = {
      account: [
        { required: true, message: '请输入学号', trigger: 'blur', whitespace: true }, // whitespace 必选时，空格是否会被视为错误
        { validator: validateJobNumber, trigger: 'blur' },
      ],
      userName: [ 
        { required: true, message: '请输入中文名', trigger: 'blur', whitespace: true }
      ],
      secondName: [
        { required: false, pattern: /^[^\u4e00-\u9fa5\s]*$/, message: '请输入英文', 
          trigger: 'change', whitespace: true }, 
      ],
      email: [
        { required: true, message: '请输入邮箱', trigger: 'blur', whitespace: true },
        { required: true, pattern: /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/,
          message: '请输入正确的邮箱地址', trigger: 'blur', whitespace: true
        }, 
        { validator: validateEmail, trigger: 'blur' }
      ]
    };
    
    // 新建 事件
    const onSubmit = () => {
      formState.validateJobNumber = true; // 工号 验证
      formState.validateEmail = true; // 邮箱 验证

      formState.loading = true;

      formRef.value.validate().then(() => {
        // 验证通过
        // console.log('values', formState, toRaw(formState));
        
        newlyAddedUser();
      }).catch(error => {
        // 验证失败
        console.log('error', error);
        formState.loading = false;
      });
    };

    // 新建、新建用户
    const newlyAddedUser = async() => {
      const param = {
        account: formState.account,
        role: formState.role,
        username: formState.userName,
        email: formState.email,
        secondName: formState.secondName, // 英文名
        sex: formState.sex,
      }
      const res = await UserManageServervice.newlyAddedUser(param);

      formState.loading = false;

      if (!res || !res.code == 200) {
        // 调用后台，失败时提示
        errorTip.value = '创建失败！' + res?.message; // 失败提示，错误提示
        return;
      }

      ctx.emit("newlyAddedUserSuccess");

      // 关闭对话框
      visible.value = false;
    };
    
    // 关闭对话框 后调用方法
    const afterCloseHandel = () => {
      formRef.value.resetFields(); // 重置表单，重置提示
      
      errorTip.value = ''; // 错误提示制空
    };
    
    // 对话框显示 事件
    const showModal = () => {
      visible.value = true;
    };
    
    // 获得焦点事件
    const nameGradeTeacherFocus = () => {
      errorTip.value = ''; // 错误提示制空
    };
    
    return {
      visible,
      showModal,
      errorTip,
      afterCloseHandel,
      
      formRef,
      labelCol: {
        span: 4,
      },
      wrapperCol: {
        span: 19,
      },
      formState,
      rules,
      onSubmit,
      nameGradeTeacherFocus
    }
  }
});
</script>

<style lang="less" scoped>
.errorTip {
  font-size: 14px;
  color: @color-Red;
  margin-left: 12px;
}
</style>