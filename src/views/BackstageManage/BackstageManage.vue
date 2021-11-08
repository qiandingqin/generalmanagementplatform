<!--
 * @Description: 后台管理 -> 主体，侧边导航
 * 左边导航：监听路由改变，获取url中的参数active，页面加载的时左边导航默认选中状态；active值的与selectedKeys值相对应，active=1 与 selectedKeys: ['1']对应，表示选中第一个;
 * 右边内容：selectedKeys[0]的值进行控制；selectedKeys=['1']表示左边导航第一个，左边右边都对应“用户管理”
-->
<template>
  <div class="container">
    <div class="nav">
      <div class="nav-container" :class="{navWidth: !collapsed}">

        <a-menu
          mode="inline"
          :inline-collapsed="collapsed"
          v-model:selectedKeys="selectedKeys"
          v-for="(item, index) of sideMenuList" :key="'sideMenuList' + index"
        > 
          <a-menu-item v-if="item.sonMenu.length == 0" :key="menuNameActive(item.path)">
            <router-link :to="item.path">
              <!-- 图标 -->
              <TeamOutlined v-if="item.photoPath == '<TeamOutlined/>'" />
              <IdcardOutlined v-if="item.photoPath == '<IdcardOutlined/>'" />
              <FundProjectionScreenOutlined v-if="item.photoPath == '<FundProjectionScreenOutlined/>'" />
              <span>{{ item.name }}</span>
              <span class="rightOutlined"><RightOutlined /></span>
            </router-link>
          </a-menu-item>

          <!-- item.sonMenu.length > 0 为有下一级菜单 -->
          <a-sub-menu v-if="item.sonMenu.length > 0" :key="menuNameActive(item.path)">
            <template #title>
              <SecurityScanOutlined v-if="item.photoPath == '<SecurityScanOutlined/>'" />
              <span>权限管理</span>
              <span class="rightOutlined"><RightOutlined /></span>
            </template>
            <a-menu-item v-for="items of item.sonMenu" :key="menuNameActive(items.path)" @click="onRouter(items.path)">{{ items.name }}</a-menu-item>
          </a-sub-menu>
        </a-menu>
      </div>
      

      <!-- 底部缩放 -->
      <div class="nav-bottom" :class="{navWidth: !collapsed}">
        <p @click="toggleCollapsed">
          <MenuUnfoldOutlined v-if="collapsed" />
          <MenuFoldOutlined v-else />
        </p>
      </div>
    </div>

    <!-- 右边内容 -->
    <div class="content">
      <router-view v-slot="{ Component }" >
        <keep-alive>
          <component :is="Component" />
        </keep-alive>
      </router-view>
    </div>
  </div>
</template>

<script>
import { defineComponent, reactive, ref, toRefs, watch, watchEffect, onActivated } from 'vue'
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  MailOutlined,
  DatabaseOutlined,
  RightOutlined,
  TeamOutlined,
  IdcardOutlined,
  FundProjectionScreenOutlined,
  SecurityScanOutlined
} from '@ant-design/icons-vue';
import { Menu } from 'ant-design-vue'
import router from '@/router';
import { useRoute, useRouter } from 'vue-router'
import Storage from '@common/utils/storage'
import Enums from '@common/enums'

import UserManage from '@/views/BackstageManage/UserManage/UserManage.vue'
import ClassManage from '@/views/BackstageManage/ClassManage/ClassManage.vue'
import DataManage from '@/views/BackstageManage/DataManage/DataManage.vue'
import SuperAdmin from '@/views/BackstageManage/PowerManage/SuperAdmin.vue'
import Admin from '@/views/BackstageManage/PowerManage/Admin.vue'

import axios from "@common/http";
import API from "@common/api";

const regexp = /(?<=:)\S+/;

export default defineComponent({
  name: 'BackstageManage',
  props: {
    msg: { type: String, defualt: '默认值' }
  },
  components: {
    AMenu: Menu,
    AMenuItem: Menu.Item,
    AMenuItemGroup: Menu.ItemGroup,
    ASubMenu: Menu.SubMenu,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    MailOutlined,
    DatabaseOutlined,
    RightOutlined,
    UserManage,
    ClassManage,
    DataManage,
    SuperAdmin,
    Admin,
    TeamOutlined,
    IdcardOutlined,
    FundProjectionScreenOutlined,
    SecurityScanOutlined
  },
  setup(props, ctx) {
    // 侧边导航list
    let sideMenuList = ref([]);

    // 侧边导航name、key。获取值为路由文件的name
    let menuNameKey = reactive({
      UserManageName: UserManage?.name, // 用户管理
      ClassManageName: ClassManage?.name, // 班级管理
      DataManageName: DataManage?.name, // 数据管理
      SuperAdminName: SuperAdmin?.name, // 权限管理 -> 超级管理员
      AdminName: Admin?.name // 权限管理 -> 普通管理员
    });

    // 用于 判断当前活动导航标识，和key对应
    const menuNameActive = (param) => {
      let menuNamePath = '';
      switch (param) {
        case '/manage':
          menuNamePath = menuNameKey.UserManageName;
          break;
        case '/manage/class-manage':
          menuNamePath = menuNameKey.ClassManageName;
          break;
        case '/manage/data-manage':
          menuNamePath = menuNameKey.DataManageName;
          break;
        case '/manage/super-admin':
          menuNamePath = menuNameKey.SuperAdminName;
          break;
        case '/manage/admin':
          menuNamePath = menuNameKey.AdminName;
          break;
        default:
          break;
      }
      return menuNamePath;
    };
    
    // 用户信息
    let userInfo = ref(Storage.getStorage(Enums.STORAGE.USER));
    
    const route = useRoute(); // 获取路由改变
    const state = reactive({
      collapsed: false, // inline 时菜单是否收起状态
      selectedKeys: [menuNameKey.UserManageName], // 当前选中的菜单项 key 数组
    });

    // 获取侧边菜单
    const getMenu = async () => {
      let response = null;
      // 获取菜单
      try {
        response = await axios.post(API.GET_MEUN);
      } catch (error) { return }

      if (!response || response.code != 200 || !response.data) return;

      let ss = response.data.find(x => x.id == 13);
      // 侧边导航list
      sideMenuList.value = ss?.sonMenu;
    };
    getMenu();

    onActivated(() => {
      // console.log("ones")
    })
    
    // 监听路由
    const routeChange = () => {
      // console.log('active', route.query.active);
      // 监听路由改变，获取url中的参数active，页面加载的时左边导航默认选中状态；active值的与selectedKeys值相对应，active=1 与 selectedKeys: ['1']对应，表示选中第一个;
      state.selectedKeys = [route.name || menuNameKey.UserManageName];
    }
    
    // 监听 改变导航当前活动窗口
    watchEffect(() => {
      routeChange();
    });

    // 内嵌菜单 缩起/展开
    const toggleCollapsed = () => {
      state.collapsed = !state.collapsed;
    };

    // 超级管理员、普通管理员点击事件，路由跳转
    const onRouter = (param) => {
      router.push(param);
    };

    return {
      userInfo,
      ...toRefs(state),
      toggleCollapsed,

      onRouter,
      menuNameKey,

      sideMenuList,
      menuNameActive
    };
  },
});
</script>

<style lang="less" scoped>
.container {
  width: 100%;
  height: 100%;
  // background-color: #FAFAFA;
  display: flex;

  .nav {
    height: calc(100vh - 0.6rem);
    display: flex;
    flex-flow: column;
    
    .nav-container {
      width: 80px;
      padding: .20rem 0 0 0;
      background-color: #FFF;
      flex: 1;
      
      .rightOutlined {
        float: right;
        width: 14px;
        line-height: 38px;
        
        .anticon-right {
          font-size: 12px;
        }
      }
    }
    
    .nav-bottom {
      width: 80px;
      border-top: .01rem solid @color-Black-15;
      background-color: #FFF;
      
      p {
        cursor: pointer;
        padding: 12px 24px;
      }
    }
    
    .navWidth {
      width: 2.08rem;
    }
  }
  
  // 右边内容
  .content {
    flex: 1;
    // padding: .22rem .25rem .1rem .25rem;
    padding: 0 .25rem;
  }
}

// 修改antd样式 左边导航有根竖线
.ant-menu-inline, .ant-menu-vertical, .ant-menu-vertical-left {
  border-right: none;
}

:deep {
  .ant-menu-submenu-arrow { // 右边箭头
    display: none;
  }

  .ant-menu-inline .ant-menu-submenu-title { // 右边箭头
    padding-right: 16px;
  }
}

.iconfont {
  margin-right: 8px;
}
</style>