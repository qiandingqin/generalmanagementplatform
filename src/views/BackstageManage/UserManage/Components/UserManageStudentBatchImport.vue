<!--
 * @Description: 后台管理 -> 用户管理 -> 学生管理-> 批量导入 组件
 * 下载模板存放存储桶，如果项目不能访问内网需修改路径
-->
<template>
  <section>
    <a-button size="large" @click="showModal">
      批量导入
    </a-button>
    
    <a-modal v-model:visible="visible" title="批量导入" :footer="statusState.step === 0 ? null : undefined" :afterClose="afterCloseHandel" centered>
      <div v-if="statusState.step === 0" class="import importBtnLine">
        <a-button>
          <a :href="statusState.importTemplateUrl || 'javascript:void(0);'" download>下载模板</a>
        </a-button>
        <a-button type="primary" :loading="statusState.loading">
          我已填好表格，点击上传
          <input @change="onFileChange" accept=".csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" type="file" class="input-file">
        </a-button>
      </div>
      
      <div v-else-if="statusState.step === 1" class="import importSuccess">
        <CheckCircleFilled />
        <p>成功导入{{ statusState.successNumber }}人！</p>
      </div>
      
      <div v-else-if="statusState.step === 2" class="import importSuccessFail">
        <ExclamationCircleFilled class="color" />
        <div class="content">
          <p class="tip">成功导入{{ statusState.successNumber }}人，失败<span class="color-Red">{{ statusState.errorNumber }}</span>人</p>
          <p class="smallTip">{{ statusState.errorNumber }}条错误记录，你可以下载未导入成功的学生信息表，修改后重新上传</p>
        </div>
      </div>
      
      <div v-else-if="statusState.step === 3" class="import importFail">
        <ExclamationCircleFilled class="color color-Red" />
        <div class="content">
          <p class="tip">导入失败</p>
          <p class="smallTip">上传文件不能超过{{ statusState.fileSize }}M！</p>
        </div>
      </div>
      
      <!-- 底部自定义按钮 -->
      <template #footer>
        <a-button v-if="statusState.step === 1" @click="onKeep">继续上传</a-button>
        <a-button v-if="statusState.step === 1" type="primary" @click="onClose">完成</a-button>
        
        <a-button v-if="statusState.step === 2" @click="onAgainKeep">再次上传</a-button>
        <a-button v-if="statusState.step === 2" type="primary">
          <a :href="statusState.tipsErrorFileUrl || 'javascript:void(0);'" download>下载失败记录</a>
        </a-button>
        
        <a-button v-if="statusState.step === 3" type="primary" @click="onClose">知道了</a-button>
      </template>
    </a-modal>
  </section>
</template>

<script>
import { defineComponent, reactive, ref, toRaw } from 'vue';
import { message, Modal, Upload  } from 'ant-design-vue'
import { CheckCircleFilled, ExclamationCircleFilled } from '@ant-design/icons-vue'
import { UserManageServervice } from '@views/BackstageManage/UserManage/UserManage.js'
import Config from '@common/config'

export default defineComponent({
  name: 'UserManageStudentNewlyBuild',
  props: {
    msg: { type: String, defualt: '默认值' }
  },
  components: {
    AModal: Modal,
    AUpload: Upload,
    CheckCircleFilled,
    ExclamationCircleFilled
  },
  setup(props, ctx) {
    const visible = ref(false); // 对话框状态
    
    const statusState = reactive({
      step: 0, // 用于控制步骤：0：显示导入按钮；1：全部导入成功；2：部分成功，部分失败；3：失败
      successNumber: 0, // 导入成功人数
      errorNumber: 0, // 导入失败人数
      fileSize: 2, // 文件大小
      loading: false,
      importTemplateUrl: Config.STATIC_SOURCE_URI + '/model/学生信息表模板.xlsx', // 模板文件
      tipsErrorFileUrl: '', // 错误文件
    });
    
    // 文件上传变化
    const onFileChange = async (event) => {
      const file = event.target.files[0];
    
      if (!file) return;

      // 此处判断上传文件的大小，不大于2M ； 单位为 b 故要乘以两个1024
      if (event.target.files[0].size > 2*1024*1024) {
        statusState.step = 3;
        return;
      }

      statusState.loading = true;
      
      // 后面进行业务逻辑处理
      let res = null;
    
      try {
        res = await UserManageServervice.batchImport(file);
      } catch (error) {
        res = error;
        // return;
      }

      statusState.loading = false;
      if (!res || res?.code != 200 || !res?.data) {
        if (res?.code == 40008) statusState.step = 3; // 40008 为文件不能超过2M
        return;
      };

      const successNum = res.data?.successNum;
      const errorNum = res.data?.errorNum;

      ctx.emit('batchImportSuccess');

      // statusState.step 控制步骤：0：显示导入按钮；1：全部导入成功；2：部分成功，部分失败；3：失败
      if (successNum > 0 && errorNum == 0) { // 全部成功
        statusState.step = 1;
        statusState.successNumber = successNum;

      } else if (successNum >= 0 && errorNum >= 0) { // 部分成功，部分失败；全部失败
        statusState.step = 2;
        statusState.successNumber = successNum;
        statusState.errorNumber = errorNum;
        statusState.tipsErrorFileUrl = Config.DOWNLOAD_URL + '/' + res.data?.fileName; // 下载失败记录

      }
    }
    
    // 继续上传 事件
    const onKeep = () => {
      statusState.step = 0;
    };
    
    // 完成、知道了 事件
    const onClose = () => {
      visible.value = false;
    };
    
    // 继续上传
    const onAgainKeep = () => {
      statusState.step = 0;
    };
    
    // 关闭对话框 后调用方法
    const afterCloseHandel = () => {
      // console.log("关闭了")
    };
    
    // 对话框显示 事件
    const showModal = () => {
      visible.value = true;
      statusState.step = 0;
    };
    
    return {
      visible,
      showModal,
      onKeep,
      onClose,
      onAgainKeep,
      afterCloseHandel,
      onFileChange,
      statusState
    }
  }
});
</script>

<style lang="less" scoped>
.import {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100px;
}
  
.importBtnLine {
  button {
    margin: 0 10px;
  }
  
  .input-file {
    display: block;
    width: 100%;
    height: 100%;
    opacity: 0;
    position: absolute;
    left: 0;
    top: 0;
    z-index: 2;
    cursor: pointer;
  }
}

.importSuccess {
  color: @color-Green;
  
  p {
    padding-left: 10px;
    color: #000;
  }
}

.importSuccessFail {
  width: 80%;
  align-items: end;
  margin: 0 auto;
  
  .color {
    color: #FAAD14;
    font-size: 18px;
    padding-top: 5px;
  }
  
  .content {
    padding-left: 15px;
    
    .tip {
      font-size: 16px;
      color: #000;
    }
    
    .smallTip {
      padding-top: 12px;
      color: @color-Black-45;
    }
  }
}

.importFail {
  width: 80%;
  align-items: end;
  margin: 0 auto;
  
  .color {
    font-size: 18px;
    padding-top: 5px;
  }
  
  .content {
    padding-left: 15px;
    
    .tip {
      font-size: 16px;
      color: #000;
    }
    
    .smallTip {
      padding-top: 12px;
      color: @color-Black-45;
    }
  }
}
</style>