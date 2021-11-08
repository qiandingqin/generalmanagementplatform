<!--
 * @Description: 个人设置 -> 个人信息
-->
<template>
  <section class="personal-container" :class="{'min-heigth': userState.bindUserId}">
    <p class="title">个人信息</p>

    <!-- 学生、iLab -->
    <!-- 角色id: 1超级管理员 2管理员 3教师 4学生 5ilab用户 -->
    <div v-if="userState.roleShowHidden == $enums.ROLE.GET_ROLE('4')">
      <a-form ref="formRef" :model="userState" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol" >
        <a-form-item label="中文名" name="username">
          <a-input v-model:value.trim="userState.username" placeholder="请输入中文名" size="large" />
        </a-form-item>

        <a-form-item label="英文名" name="secondName">
          <a-input v-model:value.trim="userState.secondName" placeholder="请输入英文名" size="large" />
        </a-form-item>

        <a-form-item label="性别">
          <p class="value-view">
            <a-radio-group v-model:value="userState.sex">
              <a-radio value="0">男</a-radio><span v-html="'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'"></span>
              <a-radio value="1">女</a-radio>
            </a-radio-group>
          </p>
        </a-form-item>

        <a-form-item label="角色">
          <p class="value-view">{{ userState.roleName }}</p>
        </a-form-item>

        <a-form-item label="&nbsp;&nbsp;&nbsp;学号" name="account">
          <p class="value-view">{{ userState.account }}</p>
        </a-form-item>

        <a-form-item label="班级">
          <p class="value-view">
            <span v-if="userState.classId">{{ userState.className }}</span> 
            <span v-else class="display-flex">点击<apply-class @addClassSuccess="addClassSuccessEmit"></apply-class>进入我的班级</span>
          </p>
        </a-form-item>

        <a-form-item label="&nbsp;&nbsp;&nbsp;邮箱" name="email">
          <p class="value-view white-space-nowrap">{{ userState.email }} <router-link to="/email"><span class="replace-email">更换邮箱</span> </router-link> </p>
        </a-form-item>
      </a-form>
    </div>

    <!-- 非学生 -->
    <!-- 角色id: 1超级管理员 2管理员 3教师 4学生 5ilab用户 -->
    <div v-if="userState.roleShowHidden == $enums.ROLE.GET_ROLE('1') || 
      userState.roleShowHidden == $enums.ROLE.GET_ROLE('2') || 
      userState.roleShowHidden == $enums.ROLE.GET_ROLE('3')"
    >
      <a-form ref="formRef" :model="userState" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol" >
        <a-form-item label="中文名" name="username">
          <a-input v-model:value.trim="userState.username" placeholder="请输入中文名" size="large" />
        </a-form-item>

        <a-form-item label="英文名" name="secondName">
          <a-input v-model:value.trim="userState.secondName" placeholder="请输入英文名" size="large" />
        </a-form-item>

        <a-form-item label="性别">
          <p class="value-view">
            <a-radio-group v-model:value="userState.sex">
              <a-radio value="0">男</a-radio><span v-html="'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'"></span>
              <a-radio value="1">女</a-radio>
            </a-radio-group>
          </p>
        </a-form-item>

        <a-form-item label="角色">
          <p class="value-view">{{ userState.roleName }}</p>
        </a-form-item>

        <a-form-item label="&nbsp;&nbsp;&nbsp;工号" name="account">
          <p class="value-view">{{ userState.account }}</p>
        </a-form-item>

        <a-form-item label="&nbsp;&nbsp;&nbsp;邮箱" name="email">
          <p class="value-view white-space-nowrap">{{ userState.email }} <router-link to="/email"><span class="replace-email">更换邮箱</span> </router-link></p>
        </a-form-item>

      </a-form>
    </div>
    
    <!-- 第三方ilab -->
    <!-- <div v-if="userState.bindUserId" class="ILab-view"> -->
    <div class="ILab-view">
      <p class="ILab-title">第三方ilab</p>
    </div>
    <!-- <a-form v-if="userState.bindUserId" ref="formRef" :label-col="labelCol" :wrapper-col="wrapperCol" > -->
    <a-form :label-col="labelCol" :wrapper-col="wrapperCol" >
      <a-form-item v-if="userState.bindUserId" label="iLab-X">
        <p class="value-view display-flex">
          {{ userState.ilabAccount }}
          <span v-html="'&nbsp;&nbsp;'"></span>
          <ilab-binding :msg="userState.bindUserId ? 'unBinding' : 'binding'"></ilab-binding>
        </p>
      </a-form-item>

      <a-form-item v-else label="iLab-X">
        <p class="value-view display-flex unbound-ilab"> 未绑定 </p>
      </a-form-item>
    </a-form>

    <!-- iLab用户 -->
    <!-- 角色id: 1超级管理员 2管理员 3教师 4学生 5ilab用户 -->
    <div class="submit" :class="{disabledBtn: userState.disabled}"
      v-if="userState.roleShowHidden == $enums.ROLE.GET_ROLE('1') || 
      userState.roleShowHidden == $enums.ROLE.GET_ROLE('2') || 
      userState.roleShowHidden == $enums.ROLE.GET_ROLE('3') || 
      userState.roleShowHidden == $enums.ROLE.GET_ROLE('4')"
    >
      <a-button type="primary" size="large" @click="onSubmit" :loading="userState.loading" :disabled="userState.disabled">保存</a-button>
    </div>

  </section>
</template>

<script>
import { defineComponent, ref, reactive, onActivated, watch } from 'vue'
import axios from "@common/http"
import API from "@common/api"
import Enums from '@common/enums'
import ApplyClass from '@/components/ApplyClass/ApplyClass.vue'
import { Radio, message } from 'ant-design-vue'
import { getUserInfoStorage } from '@views/Login/LoginService'
import IlabBinding from '@components/iLabBinding.vue'
// import Store from '@common/store'

export default defineComponent({
  name: 'PersonalSetting',
  components: {
    ApplyClass,
    ARadioGroup: Radio.Group,
    ARadio: Radio,
    IlabBinding,
  },
  setup(props, ctx) {
    // 表单数据
    const formRef = ref();
    
    const userState = reactive({
      account: '', // 账号
      username: '', // 中文名
      secondName: '', // 英文名
      sex: '',
      role: '', // 角色
      roleName: '', // 角色名
      account: '', // 学号、工号
      email: '', // 邮箱
      classId: '', // 班级id
      className: '', // 班级名称
      loading: false,
      disabled: true,
      bindUserId: '', // iLab 绑定用户id，存在的为ILab绑定用户 
      ilabAccount: '', // iLab 账号
      roleShowHidden: 100 // 根据角色 显示隐藏内容。
    });

    const rules = {
      username: [
        { required: true, message: '请输入中文名', trigger: 'blur', whitespace: true }, // 必选时，空格是否会被视为错误
      ],
      account: [
        { required: true, message: '', trigger: 'blur', whitespace: true }
      ],
      secondName: [
        { required: false, pattern: /^[^\u4e00-\u9fa5\s]*$/, message: '请输入英文', 
          trigger: 'change', whitespace: true }, 
      ],
      role: [
        { required: true, message: '', trigger: 'change',  whitespace: true }
      ],
      email: [
        { required: true, pattern: /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/, 
          message: '请设置正确的邮箱', trigger: 'blur', whitespace: true }, 
      ],
    };

    let getUserInfos = '';

    // 获取个人信息
    const loadData = async () => {
      let response = null;
      // 获取个人信息
      try {
        response = await axios.post(API.GET_USERINFO);
      } catch (error) { return }

      if (response.code != 200 || !response || !response.data) return;
      getUserInfos = response.data;
      const data = response.data;
      userState.account = data.account;
      userState.username = data.username;
      userState.secondName = data.secondName;
      userState.sex = data.sex?.toString();
      userState.role = data.cnName;
      userState.roleName = data.cnName;
      userState.account = data.account;
      userState.email = data.email;
      userState.classId = data.classId;
      userState.className = data.className;
      userState.bindUserId = data.bindUserId; // iLab 绑定用户id，存在为绑定
      userState.ilabAccount = data.ilabAccount;
      
      // 根据角色 显示隐藏内容。
      userState.roleShowHidden = Enums.ROLE.GET_ROLE(data.role?.toString())
    };
    onActivated(() => {
      loadData();
    });

    // 提交
    const onSubmit = () => {
      userState.loading = true;

      formRef.value.validate().then(() => {
        submitUpdata();
      }).catch(error => {
        console.log("error", error)
        userState.loading = false;
      });
    };

    // 提交修改
    const submitUpdata = async() => {
      const param = {
        username: userState.username, // 中文名
        secondName: userState.secondName, // 英文名
        sex: userState.sex
      };
      let res = '';
      try {
        res = await axios.put(API.PERSONALCENTER.PERSONALCENTER_INFO, param);
      } catch (error) {
        res = error;
      }
      userState.loading = false;

      if (!res || res?.code != 200) return;
      message.success("保存成功！")

      userState.disabled = true;
      loadData();

      let response = '';
      try {
        // 修改信息后，重写缓存
        response = await getUserInfoStorage();
      } catch (error) {
        return;
      }

      // 信息修改成功，通知父级重载数据
      ctx.emit("submitUpdataSuccess");
    };

    // 侦听中文名、英文名、性别改变
    watch(() => [userState.username, userState.secondName, userState.sex], ([newUsername, newSecondName, newSex], [oldUsername, oldSecondName, oldSex]) => {
      // 内容有改变，可以进行保存
      if (newUsername != getUserInfos.username || newSecondName != getUserInfos.secondName || newSex != getUserInfos.sex) {
        userState.disabled = false;
      } else {
        userState.disabled = true;
      }
    });

    // 加入班级成功；子组件返值给父组件，父组件新加载信息
    const addClassSuccessEmit = (param) => {
      loadData();
    };

    return {
      userState,
      computeRoleName: '',
      addClassSuccessEmit,

      formRef,
      rules,
      labelCol: {
        span: 3,
      },
      wrapperCol: {
        span: 7,
      },

      onSubmit
    }
  },
})
</script>

<style lang="less" scoped>
.personal-container {
  height: calc(100vh - 0.6rem);
  min-height: 690px;
  // min-height: 750px;

  .title {
    font-size: .18rem;
    padding: .24rem .24rem .24rem .36rem;
    border-bottom: 1px solid @color-Black-15;
    margin-bottom: 20px;
  }

  .replace-email {
    color: @color-Blue;
    cursor: pointer;
    margin-left: 10px;
  }
  
  p.value-view {
    padding-left: 6px;

    .display-flex {
      display: flex;
    }
  }

  .white-space-nowrap {
    white-space: nowrap !important;
  }

  .unbound-ilab {
    color: @color-Black-65;
  }
  
  .ILab-view {
    padding: 0 .5rem;
    
    .ILab-title {
      font-size: .18rem;
      padding: .4rem 0 .2rem 0;
      border-top: 1px solid @color-Black-15;
    }
  }

  .submit {
    padding-left: .6rem;
    padding-bottom: .4rem;

    .ant-btn {
      padding-left: 24px;
      padding-right: 24px;
    }
  }

  .disabledBtn { // 不可以按钮样式
    .ant-btn {
      color: #fff;
      background: @color-Blue-Dissbles;
      border-color: @color-Blue-Dissbles;
    }
  }
}

.min-heigth {
  min-height: 830px;
}

.display-flex {
  display: flex;
}
</style>
