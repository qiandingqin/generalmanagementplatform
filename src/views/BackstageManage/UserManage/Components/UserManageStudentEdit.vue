<!--
 * @Description: 后台管理 -> 用户管理 -> 学生管理-> 编辑 组件
-->
<template>
  <section>
    <!-- <a-button size="large" type="primary" @click="showModal">
      <template #icon><PlusOutlined /></template>
      编辑
    </a-button> -->
    <span class="editTitle" @click="showModal">编辑</span>
    
    <a-modal destroyOnClose v-model:visible="visible" title="编辑学生" :footer="undefined" :afterClose="afterCloseHandel" centered>
      <a-form
        ref="formRef"
        :model="formState"
        :rules="rules"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
      
        <a-form-item label="学号" name="account">
          <!-- <a-input v-model:value.trim="formState.account" placeholder="请输入学号" size="large" /> -->
          <p class="rightContent">{{ formState.account }}</p>
        </a-form-item>
        
        <a-form-item label="中文名" name="userName">
          <a-input v-model:value.trim="formState.userName" placeholder="请输入中文名" size="large" />
        </a-form-item>

        <a-form-item label="英文名" name="secondName">
          <a-input v-model:value.trim="formState.secondName" placeholder="请输入英文名" size="large" />
        </a-form-item>
        
        <a-form-item label="邮箱" name="email">
          <!-- <a-input v-model:value.trim="formState.email" placeholder="请输入班邮箱" size="large" /> -->
          <p class="rightContent">{{ formState.email }}</p>
        </a-form-item>

        <a-form-item label="性别">
          <a-radio-group v-model:value="formState.sex">
            <a-radio value="0">男</a-radio>
            <a-radio value="1">女</a-radio>
          </a-radio-group>
        </a-form-item>
      </a-form>
      
      <!-- 底部自定义按钮 -->
      <template #footer>
        <a-button @click="onCancel" >取消</a-button>
        <a-button type="primary" @click="onSubmit" :loading="formState.loading">更新</a-button>
      </template>
    </a-modal>
  </section>
</template>

<script>
import { defineComponent, reactive, ref, toRaw, watch } from 'vue';
import { PlusOutlined } from '@ant-design/icons-vue'
import { message, Modal, Radio } from 'ant-design-vue'
import { UserManageServervice } from '@views/BackstageManage/UserManage/UserManage.js'

export default defineComponent({
  name: 'UserManageStudentEdit',
  props: {
    msg: { type: [String, Object, Array], defualt: '' }
  },
  components: {
    PlusOutlined,
    AModal: Modal,
    ARadioGroup: Radio.Group,
    ARadio: Radio
  },
  setup(props, ctx) {
    const visible = ref(false); // 对话框状态
    
    // 表单数据
    const formRef = ref();
    const formState = reactive({
      id: props.msg.id,
      account: props.msg.account, // 学号
      userName: props.msg.userName, // 姓名
      email: props.msg.email, // 邮箱
      secondName: props.msg.secondName == '-' ? '' : props.msg.secondName, // 英文名
      sex: props.msg.sexNumber, // 性别 sexNumber性别：0男 1女
      validateJobNumber: false, // 工号 验证
      validateEmail: false, // 邮箱 验证
      loading: false
    });

    // 父内容改变后，需更新内容
    watch(() => props.msg,  (count, prevCount) => {
      // console.log('count', count)
      formState.id = count.id;
      formState.account = count.account; // 工号
      formState.userName = count.userName; // 姓名
      formState.email = count.email; // 邮箱
      formState.secondName = count.secondName == '-' ? '' : count.secondName; // 英文名
      formState.sex = count.sexNumber; // 性别 sexNumber性别：0男 1女
      formState.loading = false
    })
    
    const rules = {
      account: [
        { required: true, message: '学号不能为空', trigger: 'change', whitespace: true }, // 必选时，空格是否会被视为错误
      ],
      userName: [
        { required: true, message: '请输入中文名', trigger: 'change', whitespace: true }
      ],
      secondName: [
        { required: false, pattern: /^[^\u4e00-\u9fa5\s]*$/, message: '请输入英文', 
          trigger: 'change', whitespace: true }, 
      ],
      email: [
        { required: true, trigger: 'blur', whitespace: true }
      ],
    };
    
    // 更新 事件
    const onSubmit = () => {
      formState.loading = true;

      formRef.value.validate().then(() => {

        // 验证通过
        // console.log('values', formState, toRaw(formState));
        // message.success('更新成功');
        updateUser();
      }).catch(error => {
        // 验证失败
        console.log('error', error);
      });
    };

    //  更新 提交
    const updateUser = async() => {
      const param = {
        id: formState.id,
        secondName: formState.secondName,
        sex: formState.sex,
        username: formState.userName,
      }
      const res = await UserManageServervice.updateUser(param);

      formState.loading = false;

      if (!res || !res.code == 200) {
        return;
      }

      ctx.emit("updataUserSuccess");

      // 关闭对话框
      visible.value = false;
    };
    
    // 关闭对话框 后调用方法
    const afterCloseHandel = () => {
      formRef.value?.resetFields(); // 重置表单，重置提示
      formState.secondName = props.msg.secondName == '-' ? '' : props.msg.secondName; // 英文名 重置
      formState.sex = props.msg.sexNumber; // 性别 重置
    };
    
    // 取消、关闭 事件
    const onCancel = () => {
      formRef.value?.resetFields(); // 重置表单，重置提示
      visible.value = false;
    };
    
    // 对话框显示 事件
    const showModal = () => {
      visible.value = true;
    };
    
    return {
      visible,
      showModal,
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
      onCancel
    }
  }
});
</script>

<style lang="less" scoped>
.editTitle {
  color: @color-Blue;
  cursor: pointer;
}

.rightContent {
  padding-left: 0.15rem;
}
</style>