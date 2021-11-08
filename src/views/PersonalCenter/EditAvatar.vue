<!--
 * @Description: 个人设置 -> 编辑头像、上传头像
-->
<template>
  <section class="container">
    <!-- 头像 -->
    <div class="edit-avatar">
      <div class="avatar-image">
        <img :src="imageState.avatarImage ? imageState.avatarImage : imageState.allImage[0]?.imageUrl"/>
      </div>
      <div class="edit-btn">
        <a-button class="btn" type="link"  @click="showModal">编辑头像</a-button>
      </div>
    </div>
    
    <!-- 编辑头像 -->
    <a-modal v-model:visible="visible" width="610px" title="编辑头像" :footer="undefined" :afterClose="afterCloseHandel" centered>
      <a-tabs v-model:activeKey="activeKey">
        <!-- 系统头像 -->
        <a-tab-pane key="1" tab="系统头像">
          <div class="tabs-content">
            <div class="content-let overflow-y">
              
              <div class="system-container" v-for="(item, index) in imageState.allImage" :key="'imageState.image' + index">
                <div class="system-img" :class="{ 'img-active': index == imageState.currentImage }" @click="onCurrentImage(index, item.imageUrl, item.name)">
                  <img :src="item.imageUrl" />
                </div>
              </div>
            </div>
            
            <!-- 右边-选中的图片 -->
            <div class="content-right">
              <div class="large-img">
                <img :src="imageState.currentImageUrl" />
              </div>
              <p>大头像120*120</p>
              <div class="mini-img">
                <img :src="imageState.currentImageUrl" />
              </div>
              <p>小头像40*40</p>
            </div>
          </div>
        </a-tab-pane>
        
        <!-- 自定义头像 -->
        <a-tab-pane key="2" tab="自定义头像" force-render>
          <div class="tabs-content custom">
            <div class="content-let">
              <!-- 左边-图片选择 -->
              <div class="custom-view">
                <!-- 加号添加图片（+） -->
                <div class="custom-edit custom-add-image" v-if="!customcImageState.moveImage">
                  <PlusOutlined />
                  <input @change="onFileChange" accept="image/gif,image/jpeg,image/jpg,image/png,image/svg" type="file" class="input-file">
                </div>

                <!-- 图片展示 -->
                <div class="custom-edit" v-if="customcImageState.moveImage">
                  <img v-if="customcImageState.moveImage" class="custom-edit-image" id="image" :src="customcImageState.moveImage" />
                </div>
                <p class="updata-line">
                  <a-button type="link">
                    {{ customcImageState.moveImage ? '重新上传' : '上传图片' }}
                    <input @change="onFileChange" accept="image/gif,image/jpeg,image/jpg,image/png,image/svg" type="file" class="input-file">
                  </a-button>
                  支持jpg、jpeg、png格式的图片
                </p>
                
                <!-- 加载中 提示 -->
                <div v-if="customcImageState.loading" class="loading-view">
                  <div class="loading-content">
                    <LoadingOutlined class="icon" /> <br />
                    加载中
                  </div>
                </div>
              </div>
            </div>
            
            <!-- 右边-选中的图片 -->
            <div class="content-right">
              <div class="large-img">
                <img :src="customcImageState.shearImage ? customcImageState.shearImage : imageState.allImage[0]?.imageUrl" />
              </div>
              <p>大头像120*120</p>
              
              <div class="mini-img">
                <img :src="customcImageState.shearImage ? customcImageState.shearImage : imageState.allImage[0]?.imageUrl" />
              </div>
              <p>小头像40*40</p>
            </div>
          </div>
        </a-tab-pane>
      </a-tabs>
      
      <!-- 底部自定义按钮 -->
      <template #footer>
        <a-button @click="onClose">取消</a-button>
        <a-button @click="onSubmit" type="primary" :loading="imageState.loading">确定并退出</a-button>
      </template>
    </a-modal>
  </section>
</template>

<script>
import { defineComponent, reactive, ref } from 'vue'
import { Modal, Tabs } from 'ant-design-vue'
import { getAllSystemImage, modifyImageUpdata, customImageUpdata } from '@views/PersonalCenter/EditAvatarService.js'
import { getUserInfoStorage } from '@views/Login/LoginService'
import Enums from '@common/enums'
import Storage from '@common/utils/storage'
import Config from '@common/config'
import Cropper from 'cropperjs';
import 'cropperjs/dist/cropper.css'
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons-vue'

export default defineComponent({
  props: {
    msg: { type: String, default: '默认值' }
  },
  components: {
    AModal: Modal,
    ATabs: Tabs,
    ATabPane: Tabs.TabPane,
    PlusOutlined,
    LoadingOutlined
  },
  setup(props, ctx) {
    const visible = ref(false); // 绑定 对话框状态
    // 切换卡 默认选项
    let activeKey = ref('1');

    // 本地存储的个人信息
    const userInfo = Storage.getStorage(Enums.STORAGE.USER);

    // 系统头像图片
    let imageState = reactive({
      avatarImage: userInfo?.photo ? Config.SYSTEM_IMAGE_URL + userInfo?.photo : '', // 修改前系统头像
      allImage: [], // 所有图片
      currentImage: 0, // 当前选中图片
      currentImageUrl: '', // 当前选中图片url
      currentImageName: '', // 当前选中图片name
      loading: false // 按钮加载状态
    });

    // 加载系统所有头像
    const getAllSystemImageLoading = async() => {
      let res = await getAllSystemImage();
      
      if (!res || res?.code != 200) return;

      imageState.allImage = res.data;
      imageState.currentImageUrl = res.data[imageState.currentImage]?.imageUrl;
      // 默认提交为默认选中图片
      imageState.currentImageName = imageState.allImage[imageState.currentImage]?.name;
    };
    getAllSystemImageLoading();

    // 图片选择 事件
    const onCurrentImage = (imgIndex, imgUrl, imgName) => {
      // 当前选中图片
      imageState.currentImage = imgIndex;
      // 当前选中图片url
      imageState.currentImageUrl = imgUrl;
      // 当前选中图片name
      imageState.currentImageName = imgName;
    };

    // 系统头像 上传
    const systemImageUpdataHanlde = async() => {
      imageState.loading = true;

      const param = {
        photo: imageState.currentImageName // 上传name即可
      };

      let res = await modifyImageUpdata(param);
      if (!res || res.code != 200) {
        imageState.loading = false;
        return;
      }

      // 修改信息后，重写缓存
      let response = await getUserInfoStorage();
      imageState.loading = false;
      if (!response || response.code != 200) {
        return;
      }

      visible.value = false;
      location.reload();
    };

    // 保存并退出 事件
    const onSubmit = () => {
      if (activeKey.value == '1') {  // 系统头像上传
        systemImageUpdataHanlde();

      } else if (activeKey.value == '2') { // 自定义头像上传
        if (customcImageState.moveImage) { // 存在剪切图片
          onSubmitImage();

        } else { // 不存在剪切图片，上传系统图片
          systemImageUpdataHanlde();
        }
      }
    };

    /****************************** 自定义头像 ******************************/
    // 自定义图形 图片裁剪
    let customcImageState = reactive({
      moveImage: '', // 动态图片（选择图片）
      shearImage: '', // 剪切后的图片
      loadingTis: false // 加载提示
    });

    /**
     * @description: cropperjs 图片裁剪
     * 说明：使用cropperjs实现，动态显示重选后的图片需v-if销毁图片和图片的父级容器
     */    
    const imageHandle = () => {
      const image = document.getElementById('image');
      // console.log(image)
      customcImageState.loading = false;

      const cropper = new Cropper(image, {
        autoCrop: true, // 自动裁剪
        aspectRatio: 1,
        viewMode: 1, // 试图模式
        guides :false,//裁剪框虚线 默认true有
        dragMode : "move",
        background : true,// 容器是否显示网格背景
        movable : true,//是否能移动图片
        cropBoxResizable :false,//是否允许拖动 改变裁剪框大小
        checkImageOrigin: true,
        responsive: true, // 反应灵敏
        cropBoxMovable: true, // 裁剪框可移动
        minCanvasHeight: 120, // 最小裁剪高度
        minCropBoxWidth: 120, // 最小裁剪宽度
        initialAspectRatio: 1,
        preview: '.before',
        autoCropArea: 0.6,

        crop(event) {
          /* console.log(event.detail.x); console.log(event.detail.y); console.log(event.detail.width);
          console.log(event.detail.height); console.log(event.detail.rotate); console.log(event.detail.scaleX); console.log(event.detail.scaleY); */
          sursSava();
        },
      });
      // 获取截取的图片
      const sursSava = () => {
        customcImageState.shearImage = cropper.getCroppedCanvas({
          imageSmoothingQuality: 'high'
        }).toDataURL('image/jpeg');
        // console.log(customcImageState.shearImage);
      }
    }

    // file 选择图片，预览图片
    const onFileChange = async (event) => {
      let file = event.target.files[0];
      customcImageState.moveImage = '';
    
      if (!file) file; 
      customcImageState.loading = true; // 加载提示

      let url = "";
      // 转化为base64 （base64可以直接显示、预览）
      var reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = function(e) {
        url = this.result.substring(this.result.indexOf(",") + 1);
        // 预览图片
        customcImageState.moveImage = "data:image/jpeg;base64," + url;
      };

      // 短时间内不能获取到image的dome，固设置延时加载
      setTimeout(() => {
        imageHandle();
      }, 2000)
    };

    // 提交裁剪后图片（修改头像逻辑：获得剪切后的图片且为文件格式；提交图片到后台，成功会返回文件名；拿到文件名通过修改信息接口修改头像）
    const onSubmitImage = async() => {
      if (!customcImageState.shearImage) return;
      imageState.loading = true;

      // 将base64转换为file
      const base64TOfile = (base64) =>{
        var arr = base64.split(',');
        var mime = arr[0].match(/:(.*?);/)[1];
        var bstr = atob(arr[1]); // 解码base-64编码的数据
        var n = bstr.length; 
        var u8arr = new Uint8Array(n);// 无符号整型数组
        while(n--){
          u8arr[n] = bstr.charCodeAt(n);
        }
        // 转换成file对象
        let filename = new Date().getTime();
        let filetest = new File([u8arr], filename + '.jpg', {type:mime})
        return filetest
      }

      // 图片提交
      const formData = new FormData();
      formData.append('file', base64TOfile(customcImageState.shearImage));
      let res = await customImageUpdata(formData);

      if (!res || res.code != 200) {
        imageState.loading = false;
        return;
      }

      // 修改图片（修改个人信息中的图片）
      const param = {
        photo: res.data // res.data是后台返回内容
      };
      let response = await modifyImageUpdata(param);

      if (!response || response.code != 200) {
        imageState.loading = false;
        return;
      }

      // 修改个人信息
      let resInfoStorage = await getUserInfoStorage();

      if (!resInfoStorage) return;

      visible.value = false;
      location.reload();
    };
    
    // 对话框显示 事件
    const showModal = () => {
      visible.value = true;
    };
    
    // 关闭对话框 后调用方法
    const afterCloseHandel = () => {
      
    };

    // 取消 事假
    const onClose = () => {
      visible.value = false;
    };

    return {
      visible,
      showModal,
      afterCloseHandel,
      onClose,
      onSubmit,
      activeKey,
      imageState,
      onCurrentImage,

      customcImageState,
      onFileChange
    }
  }
});
</script>

<style lang="less" scoped>
// 头像 部分
.edit-avatar {
  width: 1.22rem;
  height: 1.22rem;
  position: relative;
  
  .avatar-image {
    width: 100%;
    height: 100%;
    border-radius: 100%;
    border: 1px dashed @color-Black-25;
    box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.05);
    
    img {
      width: 100%;
      height: 100%;
      border-radius: 100%;
    }
  }
  
  .edit-btn {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 100%;
    overflow: hidden;
    
    .btn {
      width: 100%;
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
    }
    
    :deep {
      .ant-btn-link {
        color: #FFFFFF;
        font-size: .12rem;
        background-color: @color-Black-65;
      }
    }
  }
}

// 对话框内容
.tabs-content {
  padding: 0px;
  display: flex;
  
  .content-let {
    border-right: 1px solid @color-Black-15;
    flex: 1;
    text-align: center;
    padding-right: 20px;
    max-height: 510px;
    min-height: 340px;
    
    .system-container {
      width: 50%;
      float: left;
      text-align: center;
      padding: 20px 0 30px 0;
      
      &:nth-last-child(1) {
        padding: 20px 0 30px 0;
      }
      
      &:nth-last-child(2) {
        padding: 20px 0 30px 0;
      }
    
      .system-img {
        width: 120px;
        height: 120px;
        border-radius: 100%;
        margin: 0 auto;
        cursor: pointer;
        
        img {
          width: 100%;
          height: 100%;
          border-radius: 100%;
        }
      }
      
      .img-active {
        border: 2px solid @color-Blue;
        box-shadow: 0px 0px 4px @color-Blue;
      }
    }
  }
  
  .content-right {
    width: 210px;
    text-align: center;
    
    .large-img {
      width: 120px;
      height: 120px;
      border-radius: 100%;
      margin: 0 auto;
      margin-top: 40px;
      border: 1px dashed @color-Black-25;
      box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.05);
      
      img {
        width: 100%;
        height: 100%;
        border-radius: 100%;
      }
    }
    
    .mini-img {
      width: 40px;
      height: 40px;
      border-radius: 100%;
      margin: 0 auto;
      margin-top: 50px;
      border: 1px dashed @color-Black-25;
      box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.05);
      
      img {
        width: 100%;
        height: 100%;
        border-radius: 100%;
      }
    }
    
    p {
      padding-top: 5px;
    }
  }
}

// 自定义，使用的样式和系统样式相同
.custom {
  
  .custom-view {
    padding-right: 20px;
    text-align: left;
    position: relative;
    
    .custom-edit {
      width: 305px;
      height: 305px;
      border: 1px dashed @color-Black-15;
      
      .custom-edit-image {
        display: block;
        max-width: 100%;
        height: 0px;
        width: 0px;
      }
    }
    
    .custom-add-image {
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      color: @color-Black-65;
      font-size: 27px;
      cursor: pointer;
      
      .input-file {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        width: 305px;
        height: 305px;
        opacity: 0;
      }
    }
    
    .updata-line {
      color: @color-Black-65;
      
      button {
        padding: 0;
        cursor: pointer;
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
    
    // 加载提示
    .loading-view {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      width: 305px;
      height: 305px;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: @color-Black-15;
      
      .loading-content {
        text-align: center;
        
        .icon {
          font-size: 24px;
        }
      }
    }
  }
}

:deep {
  .ant-tabs-bar { // 切换卡长下划线
    border-bottom: none;
  }
  
  .ant-tabs-tab { // 切换卡按钮
    padding: 0 0px 6px 0px;
    margin: 0 18px 0 0;
  }
}

img {
  display: block;
  max-width: 100%;
}

:deep{
  // 修改剪切图片样式
  .cropper-view-box {
    outline: none;
    border: 1px solid rgba(255, 255, 255, 1);
    border-radius: 100%;
  }
  
  .cropper-face, .cropper-line, .cropper-point {
    opacity: 0;
  }
}
</style>