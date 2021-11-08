<!--
 * @Description: 后台管理 -> 班级管理 -> 编辑 组件
-->
<template>
  <section>
    <!-- <a-button size="large" type="primary" @click="showModal">
      <template #icon><PlusOutlined /></template>
      编辑
    </a-button> -->
    <span class="editTitle" @click="showModal">编辑</span>
    
    <a-modal destroyOnClose v-model:visible="visible" title="编辑班级" :footer="undefined" :afterClose="afterCloseHandel" centered>
      <a-form
        ref="formRef"
        :model="formState"
        :rules="rules"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-form-item label="班级号" name="classNumber">
          <p class="rightContent">{{ formState.classNumber }}</p>
        </a-form-item>
        
        <a-form-item label="班级名" name="className">
          <a-input v-model:value.trim="formState.className" placeholder="请输入班级名" size="large" />
        </a-form-item>
        
        <a-form-item label="年级" name="grade">
          <p class="rightContent">{{ formState.grade }}</p>
        </a-form-item>
        
        <a-form-item label="授课老师" name="teacher">
          <a-select v-model:value="formState.teacher" 
            show-search
            placeholder="请输入授课老师" 
            size="large"
          >
            <!-- <a-select-option v-for="(item, index) in teacherSelect" :key="'teacherSelect' + index" :value="item.value" >{{ item.label }}</a-select-option> -->
            <a-select-option v-for="(item, index) in teacherSelect" :key="'teacher' + index" :value="item.value?.toString()" >{{ item.text }}</a-select-option>
          </a-select>
        </a-form-item>
        
        <a-form-item label="创建时间" name="createrTime">
          <p class="rightContent">{{ formState.createrTime }}</p>
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
import { defineComponent, reactive, ref, toRaw,watch } from 'vue';
import { PlusOutlined } from '@ant-design/icons-vue'
import { message, Modal, Select } from 'ant-design-vue'
import { ClassManageServervice } from '@views/BackstageManage/ClassManage/ClassManage.js'

// 授课老师 slectOption数据
let teacherSelect = ref([
  // { text: '张学友', value: '张学友' }
]);

export default defineComponent({
  name: 'Edit',
  props: {
    msg: { type: [String, Object, Array], defualt: '' },
    teacherList: { type: Array, defualt: [{text: '', value: ''}] }
  },
  components: {
    PlusOutlined,
    AModal: Modal,
    ASelect: Select,
    ASelectOption: Select.Option,
  },
  setup(props, ctx) {
    // console.log(props.msg)
    const visible = ref(false); // 对话框状态

    // 授课老师 slectOption数据
    teacherSelect.value = props.teacherList;

    // const teacherId = props.msg.teacherId;
    
    // 表单数据
    const formRef = ref();
    let formState = reactive({
      id: props.msg.id, // 班级id
      classNumber: props.msg.classNumber?.toString(), // 班级号
      className: props.msg.className, // 班级名
      grade: props.msg.grade?.toString(), // 年级
      teacher: props.msg.teacherId?.toString(), // 授课老师id
      createrTime: props.msg.createdTime, // 创建时间
      loading: false,
      validateClassNameState: false // 班级名和授课教师验证
    });

    // 父内容改变后，需更新内容
    watch(() => props.msg,  (count, prevCount) => {
      // console.log('count', count)
      formState.id = count.id, // 班级id
      formState.classNumber = count.classNumber.toString(), // 班级号
      formState.className = count.className, // 班级名
      formState.grade = count.grade?.toString(), // 年级
      formState.teacher = count.teacherId?.toString(), // 授课老师id
      formState.createrTime = count.createdTime, // 创建时间
      formState.loading = false,
      formState.validateClassNameState = false // 班级名和授课教师验证
    })

    //  班级名 失去焦点，调用后台查询班级名是否存在
    let validateClassName = async (rule, value) => {
      console.log('rule', rule, 'value', value);

      if (!formState.validateClassNameState) return;

      const param = {
        className: formState.classNumber,
        teacherId: formState.teacher
      };
      let res = await ClassManageServervice.classTeacherVerification(param)

      if (!res) return;

      // res.data 1为通过，0为班级重复
      // 数据请求后，错误提示
      if (res.data == '0') {
        return Promise.reject('班级名重复');
      } else {
        return Promise.resolve(); // 验证通过
      }
      
    };
    
    const rules = {
      classNumber: [{required: true}],
      className: [
        {
          required: true,
          message: '请输入班级名',
          trigger: 'change'
        },
        {
          validator: validateClassName,
          trigger: 'blur'
        },
      ],
      grade: [{required: true}],
      teacher: [
        {
          required: true,
          message: '请输入授课老师',
          trigger: 'change',
        },
      ],
      createrTime: [{required: true}]
    };
    
    // 更新 事件
    const onSubmit = () => {
      // 班级名和授课教师验证
      formState.validateClassNameState = true
      
      formState.loading = true;

      formRef.value.validate().then(() => {
        // 验证通过
        // console.log('验证通过', formState, toRaw(formState));
        // message.success('更新成功');

        // 更新 提交
        onUpdata();
      }).catch(error => {
        // 验证失败
        console.log('error', error);
        formState.loading = false;
      });
    };

    // 更新 提交
    const onUpdata = async() => {
      const param = {
        changeTeacherId: Number(formState.teacher), // 变更教师ID
        className: formState.className, // 班级名称
        gradeName: Number(formState.grade), // 年级名称
        id: formState.id,
      };

      let res = await ClassManageServervice.updateClass(param);
      
      formState.loading = false;
      if(!res) return;

      message.success("更新成功！");
      visible.value = false;

      ctx.emit("updataSuccess");
    };
    
    // 关闭对话框 后调用方法
    const afterCloseHandel = () => {
      formRef.value?.resetFields(); // 重置表单，重置提示
      formState.validateClassNameState = false;
    };
    
    // 取消、关闭 事件
    const onCancel = () => {
      formRef.value?.resetFields(); // 重置表单，重置提示
      visible.value = false;
      formState.validateClassNameState = false;
    };
    
    // 对话框显示 事件
    const showModal = () => {
      visible.value = true;
    };
    
    return {
      visible,
      showModal,
      teacherSelect,
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