<!--
 * @Description: 我的班级 -> 新建班级
-->
<template>
  <div>
    <a-button type="primary" @click="statusState.visible = true" size="large"><PlusOutlined /> 新建班级</a-button>

    <!-- 新建班级dialog -->
    <a-modal v-model:visible="statusState.visible" title="新建班级" wrapClassName="primary" :afterClose="afterCloseHandel" centered>
      <template #footer>
        <a-button type="primary" :loading="statusState.btnLoading" @click="onAddClass">新建</a-button>
      </template>
    
      <div class="form-view">
        <a-form :model="form" :label-col="{span: 4}" :wrapper-col="{span: 19}"  ref="formRef" :rules="rules">
          <a-form-item label="班级名" name="className">
            <a-input v-model:value.trim="form.className" placeholder="请输入15字以内的班级名" />
          </a-form-item>
          
          <a-form-item label="所属年级" name="grade">
            <a-select v-model:value="form.grade" placeholder="请选择" >
              <a-select-option v-for="(items, index) in form.selectOption" :key="'新建班级' + index" :value="items.value">{{ items.lable }}</a-select-option>
              <!-- <a-select-option value="2021">2021</a-select-option>
              <a-select-option value="2020">2020</a-select-option> -->
            </a-select>
          </a-form-item>
        </a-form>
    
        <p class="error">{{ errorTip }}</p>
      </div>
    </a-modal>
  </div>
</template>

<script>
import { createVNode, defineComponent, reactive, ref } from 'vue'
import { Select, notification, Modal } from 'ant-design-vue'
import { PlusOutlined } from '@ant-design/icons-vue'
import Tips from '@/components/Tips.vue'
import { ClassServervice } from './../Class'

export default defineComponent({
  props: {
    msg: { type: String, defualt: '默认值' }
  },
  components: {
    AModal: Modal,
    ASelect: Select,
    ASelectOption: Select.Option,
    PlusOutlined,
  },
  setup(props, ctx) {
    // 状态
    const statusState = reactive({
      visible: false, // 对话框 显示隐藏
      btnLoading: false // 新建 按钮，加载状态
    });
    // 数据请求错误提示
    const errorTip = ref(null);
    
    const formRef = ref();
    const form = reactive({
      className: '',
      grade: '',
      selectOption: [{lable: '', value: ''}] 
    });
    
    // 获取年级
    const getGradeLoad = async () => {
      const res = await ClassServervice.getGrade();

      if (!res) return;
      
      form.selectOption = res;
    };
    getGradeLoad();

    //  邮箱 失去焦点，调用后台查询班级名是否存在
    let validateClassName = async (rule, value) => {
      // console.log('rule', rule, 'value', value);
      // 数据请求后，错误提示
      if (value.length === 0) {
        return Promise.reject('请输入15字以内的班级名');
      } else if (value.length > 15) {
        return Promise.reject('请输入15字以内的班级名');
      } else {
        errorTip.value = '';
        return Promise.resolve(); // 验证通过
      }
    };
    //  邮箱 失去焦点，调用后台查询班级名是否存在
    let validateGrade = async (rule, value) => {
      // console.log('rule', rule, 'value', value);
      // 数据请求后，错误提示
      if (value.length === 0) {
        return Promise.reject('请选择所属班级');
      } else {
        return Promise.resolve(); // 验证通过
      }
    };
    
    const rules = {
      className: [
        {
          validator: validateClassName,
          trigger: 'change',
        }
      ],
      grade: [
        {
          validator: validateGrade,
          trigger: 'change'
        }
      ]
    };

    // 新建班级
    const onAddClass = () => {
      
      formRef.value.validate().then(() => {
        statusState.btnLoading = true;

        newClassHander();
        
      }).catch(error => {
        // 验证失败
        console.log('error', error);
      });
    }

    // 新建班级 数据提交
    const newClassHander = async () => {
      const res = await ClassServervice.newClass({
        className: form.className,
        gradeName: form.grade
      })
      // console.log(res)

      statusState.btnLoading = false;

      if (!res || res.code != 200) {
        errorTip.value = '创建失败！该班级已存在'; // 错误提示制空
        return;
      }

      statusState.visible = false;
        
      notification.success({
        message: '新建班级成功',
        style: {backgroundColor: 'rgba(246, 255, 237, 1)'},
        description: createVNode(Tips, {value: res.data})
      });

      // 通知父组件进行操作
      ctx.emit("newClassSuccess");
    };
    
    // 关闭对话框 后调用方法
    const afterCloseHandel = () => {
      formRef.value.resetFields(); // 重置表单，重置提示
      errorTip.value = ''; // 错误提示制空
    };
    
    return {
      statusState,
      formRef,
      rules,
      form,
      onAddClass,
      afterCloseHandel,
      errorTip,
    }
  }
});
</script>

<style lang="less" scoped>
a {
  color: #42b983;
}

p.error {
  font-size: 0.14px;
  color: #FF4D4F;
  padding-left: 0.1rem;
  margin-top: -0.1rem;
  height: 18px;
}
</style>