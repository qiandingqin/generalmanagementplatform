<!--
 * @Description: 个人设置
-->
<template>
  <section class="container">

    <div class="layout">
      <!-- 左边信息 -->
      <div class="info-view">
        <div>
          <div class="avatar-view">
            <edit-avatar></edit-avatar>
          </div>
          <!-- <div class="avatar-view">
            <a-avatar :size="120">{{ infoState.userName2 }}</a-avatar>
          </div> -->
          <div class="userinfo">
            <p>{{ infoState.userName }}</p>
            <p>{{ infoState.roleName }}</p>
          </div>

          <div class="tabbar">
            <router-link to="/personal">
              <p :class="{active: $route.path == '/personal'}"><UserOutlined /> 个人信息</p>
            </router-link>

            <!-- 角色id: 1超级管理员 2管理员 3教师 4学生 5ilab用户 -->
            <router-link to="/personal/modify-pwd">
              <p :class="{active: $route.path == '/personal/modify-pwd'}"><SafetyCertificateOutlined /> 账号密码</p>
            </router-link>
          </div>
        </div>
      </div>
      <!-- 子页 -->
      <div class="content-view">
        <router-view v-slot="{ Component }" >
          <keep-alive>
            <component @submitUpdataSuccess="submitUpdataSuccess" :is="Component" />
          </keep-alive>
        </router-view>
      </div>
    </div>
  </section>
</template>

<script>
import { defineComponent, ref, reactive } from 'vue'
import { Avatar } from 'ant-design-vue'
import { UserOutlined, SafetyCertificateOutlined } from '@ant-design/icons-vue'
import Storage from '@common/utils/storage'
import Enums from '@common/enums'
import EditAvatar from '@views/PersonalCenter/EditAvatar.vue'

export default defineComponent({
  name: 'Personal',
  components: {
    AAvatar: Avatar,
    UserOutlined,
    SafetyCertificateOutlined,
    EditAvatar
  },
  setup(props, ctx) {
    // 用户信息
    const infoState = reactive({
      userName: '', // 名称
      roleName: '', // 角色名称
      userName2:'' // 名称取最后两个字符
    });

    let userInfo = '';
    // 修改信息
    const modifyInfo = () => {
      userInfo = Storage.getStorage(Enums.STORAGE.USER);

      if (!userInfo) return;
      infoState.userName = userInfo.username;
      infoState.roleName = userInfo.cnName;
      infoState.userName2 = userInfo.username.substring(userInfo.username.length - 2);
    }
    modifyInfo();

    // 子组件修改信息成功，需更新信息
    const submitUpdataSuccess = () => {
      modifyInfo();
    };
    
    return {
      infoState,
      submitUpdataSuccess,
    }
  },
})
</script>

<style lang="less" scoped>
.container {
  width: 12rem;
  margin: 0 auto;
}

.mixins-card {
  height: 0.7rem;
  padding:0.17rem 0.5rem;
  background-color: #fff;
  margin-bottom: 0.03rem;
  display: flex;
  align-content: center
}

.layout {
  display: flex;

  .info-view {
    width: 2.55rem;

    > div {
      width:2.3rem;
      background-color: #fff;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding-bottom: 0.4rem;

       .avatar-view {
        margin: 0.5rem 0 0.2rem 0;
        width: 1.2rem;
        height: 1.2rem;
      }

      /* .avatar-view {
        margin: 0.5rem 0 0.2rem 0;
        font-size: 50px;
        
        :deep(.ant-avatar) {
          background-color: @color-Blue;
          
          span {
            font-size: 30px;
          }
        }
      } */

      .userinfo p {
        font-size: 0.16rem;
        color: #333333;
        text-align: center;
        margin-bottom: 0.05rem;
        font-weight: bold;
        line-height: 0.22rem;
        padding: 0 .1rem;

        &:last-child {
          color: #8D8D8D;
          font-weight: 100;
        }
      }

      .tabbar {
        width:100%;
        padding-top: .45rem;

        p {
          @color: #E6F7FF;
          @height: 0.4rem;
          height: @height;
          background: #fff;
          color: rgba(0, 0, 0, .65);
          border-right: 4px solid transparent;
          line-height: @height;
          text-align: center;
          margin-bottom: 0.1rem;
          cursor: pointer;

          &:hover, &.active {
            background: @color;
            border-right: 4px solid @color-Blue;
            color: rgba(0, 0, 0, .85);
          }
        }
      }
    }
  }

  .content-view {
    flex: 1;
    background-color: #fff;
  }
}
</style>
