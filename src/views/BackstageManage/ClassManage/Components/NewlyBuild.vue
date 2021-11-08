<!--
 * @Description: 后台管理 -> 班级管理 -> 新建 组件
-->
<template>
  <section>
    <a-button size="large" type="primary" @click="showModal">
      <PlusOutlined />
      新建
    </a-button>
    
    <a-modal v-model:visible="visible" title="新建班级" :footer="undefined" :afterClose="afterCloseHandel" centered>
      <a-form
        ref="formRef"
        :model="formState"
        :rules="rules"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-form-item label="班级名" name="className">
          <a-input v-model:value.trim="formState.className" placeholder="请输入班级名" @focus="nameGradeTeacherFocus" size="large" />
        </a-form-item>
        
        <a-form-item label="所属年级" name="grade">
          <a-select v-model:value="formState.grade" placeholder="请输入所属年级" @focus="nameGradeTeacherFocus" size="large" >
            <a-select-option v-for="(item, index) in gradeSlect" :key="'gradeSlect' + index" :value="item.value?.toString()" >{{ item.text }}</a-select-option>
          </a-select>
        </a-form-item>
        
        <a-form-item label="授课老师" name="teacher">
          <a-select v-model:value="formState.teacher" 
            show-search
            @focus="nameGradeTeacherFocus"
            placeholder="请输入授课老师" 
            size="large"
          >
            <a-select-option v-for="(item, index) in teacherList" :key="'teacherList' + index" :value="item.value?.toString()" >{{ item.text }}</a-select-option>
          </a-select>
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
import { defineComponent, reactive, ref, toRaw, createVNode } from 'vue';
import { PlusOutlined } from '@ant-design/icons-vue'
import { message, Modal, Select, notification } from 'ant-design-vue'
import Tips from '@/components/Tips.vue'
import { ClassManageServervice } from '@views/BackstageManage/ClassManage/ClassManage.js'
import { ClassServervice } from '@views/Class/Class'

// 所属年级 slectOption数据
let gradeSlect = ref([
  /* { text: '2020', value: '2020' } */
]);
// 授课老师 slectOption数据
let teacherSlect = ref([
  /* { label: '张学友', value: '张学友' } */
]);

export default defineComponent({
  name: 'NewlyBuild',
  props: {
    msg: { type: String, defualt: '默认值' },
    teacherList: { type: Array, defualt: [{text: '', value: ''}] }
  },
  components: {
    PlusOutlined,
    AModal: Modal,
    ASelect: Select,
    ASelectOption: Select.Option,
  },
  setup(props, ctx) {
    const visible = ref(false); // 对话框状态
    let errorTip = ref(null); // 失败提示，错误提示

    teacherSlect.value = props.teacherList;
    
    // 表单数据
    const formRef = ref();
    const formState = reactive({
      className: '',
      grade: undefined,
      teacher: undefined,
      loading: false
    });
    const rules = { // 表单验证
      className: [
        {
          required: true,
          message: '请输入班级名',
          trigger: 'change',
          whitespace: true
        }
      ],
      grade: [
        {
          required: true,
          message: '请输入所属年级',
          trigger: 'change',
        },
      ],
      teacher: [
        {
          required: true,
          message: '请输入授课老师',
          trigger: 'change',
        },
      ],
    };

    // 获取年级
    const getGradeLoad = async () => {
      const res = await ClassServervice.getGrade("getGradeLoad"); // 同使用 我的班级 里的年级请求

      if (!res) return;

      // 获取年级后赋值
      gradeSlect.value = res;
    };
    getGradeLoad();
    
    // 新建 事件
    const onSubmit = () => {
      
      formRef.value.validate().then(() => {
        // 验证通过
        // console.log('values', formState, toRaw(formState));

        formState.loading = true;
        newlyAddedClass()
      }).catch(error => {
        // 验证失败
        console.log('error', error);
      });
    };

    // 新建班级
    const newlyAddedClass = async() => {
      const param = {
        className: formState.className,
        gradeName: formState.grade,
        teacherId: formState.teacher
      }
      const res = await ClassManageServervice.newlyAddedClass(param);

      formState.loading = false;

      if (!res || !res.data) {
        // 调用后台，失败时提示
        errorTip.value = '创建失败！' + res?.message; // 失败提示，错误提示
        return;
      }

      // 新建成功 提示
      openNotificationWithIcon('success', res.data);

      ctx.emit("newlyAddedClassSuccess");

      // 关闭对话框
      visible.value = false;
    };
    
    // 新建成功 提示
    const openNotificationWithIcon = (type, classNumber) => {
      notification[type]({
        message: '新建班级成功！',
        /* description:
          '班级号：1001',
        // icon: h(SmileOutlined, { style: 'color: #108ee9' }), */
        style: {backgroundColor: 'rgba(246, 255, 237, 1)'},
        description: createVNode(Tips, {value: classNumber}) // classNumber 为班级号
      });
    };
    
    // 关闭对话框 后调用方法
    const afterCloseHandel = () => {
      formRef.value.resetFields(); // 重置表单，重置提示
      
      errorTip.value = ''; // 错误提示置空
    };
    
    // 对话框显示 事件
    const showModal = () => {
      visible.value = true;
    };
    
    // 获得焦点事件
    const nameGradeTeacherFocus = () => {
      errorTip.value = ''; // 错误提示置空
    };
    
    return {
      visible,
      showModal,
      errorTip,
      gradeSlect,
      teacherSlect,
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