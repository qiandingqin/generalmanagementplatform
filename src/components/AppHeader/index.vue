<!--
 * @Description: 应用 头部
-->
<template>
  <section class="container">
    <router-link to='/'>
      <div class="log">
        <img :src="logSrc"/>
        <span class="log-name">威爱数矩</span>
      </div>
    </router-link>
    
    <div class="horizontalNav">
      <router-link to="/">
        <div class="nav" :class="{horizontalNavActive: $route.path == '/'}">
          首页
        </div>
      </router-link>
    </div>
    
    <!-- 个人信息-右边导航 -->
    <div v-show="menu.length > 0" class="information">
      <a-dropdown :trigger="['click']">
        <a class="ant-dropdown-link content" @click.prevent>
          <img v-if="userState.imageUrl" :src="userState.imageUrl" />
          <div class="nameRole">
            <p>{{ userState.userName }}</p>

            <!-- 角色 -->
            <!-- 角色id: 1超级管理员 2管理员 3教师 4学生 5ilab用户 -->
            <span v-if="$enums.ROLE.GET_ROLE(userState.role?.toString()) == $enums.ROLE.GET_ROLE('1') || 
              $enums.ROLE.GET_ROLE(userState.role?.toString()) == $enums.ROLE.GET_ROLE('2') || 
              $enums.ROLE.GET_ROLE(userState.role?.toString()) == $enums.ROLE.GET_ROLE('3') || 
              $enums.ROLE.GET_ROLE(userState.role?.toString()) == $enums.ROLE.GET_ROLE('5')"
            >
              {{ userState.roleName }}
            </span>

            <!-- 学生没有加入班级为申请入班：只有学生角色有加入班级 -->
            <!-- 角色id: 1超级管理员 2管理员 3教师 4学生 5ilab用户 -->
            <div class="add-class" v-if="$enums.ROLE.GET_ROLE(userState.role?.toString()) == $enums.ROLE.GET_ROLE('4')">
              <span v-if="userState.classId">{{ userState.className }}</span>
              <!-- 申请入班 -->
              <apply-class v-else @addClassSuccess="addClassSuccessEmit"></apply-class>
            </div>
          </div>
          <!-- <DownOutlined /> -->
        </a>
        <template #overlay>
          <a-menu class="menu-neiw">
            <!-- <router-link :to="items.showLine ? '' : items.path" v-for="(items, index) of menus" :key="items.id" @click="items.showLine ? '' : menuSelect = index"> -->
            <router-link :to="items.showLine ? '' : items.path == '/login' ? '' : items.path" v-for="(items, index) of menu" :key="items.id" @click.self="navHanlder(items)">
              <a-menu-divider v-if="items.showLine" />
              <a-menu-item v-else class="menus" :class="{active: menuSelect == index}" >
                <img :src="items.photoPath" :alt="items.name">
                <a-badge :count="items.news ? items.news : 0">
                  <a class="menus-a">{{ items.name }}</a>
                </a-badge>
              </a-menu-item>
            </router-link>
          </a-menu>
        </template>
      </a-dropdown>
    </div>
    
    <router-link v-show="!menu.length > 0" to="/login">
      <span class="toLogin">登录</span>
    </router-link>
  </section>
</template>

<script>
import { defineComponent, reactive, ref, onMounted, getCurrentInstance, watch, watchEffect, onActivated } from 'vue'
import { DownOutlined  } from '@ant-design/icons-vue'
import { Menu, Dropdown, Badge } from 'ant-design-vue'
import { useRoute, useRouter } from 'vue-router'
import ApplyClass from '@/components/ApplyClass/index.vue' // 申请入班
import Config from '@common/config'
import Enums from '@common/enums'
import Storage from '@common/utils/storage'
import { getUserInfo } from '@views/Login/LoginService'
import axios from "@common/http";
import API from "@common/api";
import Utils from '@/common/utils'
const { STATIC_SOURCE_URI } = Config; // 腾讯存储统一路径

// log地址
let logSrc = STATIC_SOURCE_URI + '/images/login-small.png';
// 导航
let menu = ref([
  /* {id: 8, path: '', showLine: true}, // 线 {id: 6, photoPath: STATIC_SOURCE_URI + '/images/icon/tuichu.png', name: '退出登录', path: '/login'} */
]);

// 用户信息
let userState = reactive({
  userName: '', // 用户名称
  role: '', // 角色
  roleName: '', // 角色名称
  classId: '', // 班级id
  className: '', // 班级名称
  imageUrl: '',
});

const regexp = /(?<=:)\S+/;

export default defineComponent({
  name: 'AppFooter',
  components: {
    DownOutlined,
    AMenu: Menu,
    AMenuItem: Menu.Item,
    AMenuDivider: Menu.Divider,
    ADropdown: Dropdown,
    ABadge: Badge,
    ApplyClass
  },
  props: {
    msg: { type: String, defualt: '头部' }
  },
  setup(props, ctx) {
    const menuSelect = ref(0);
    // 个人信息的导航
    const route = useRoute();
    const router = useRouter();
    const userMenus = ref();

    // 获取信息、修改信息
    const modifyInfo = async () => {
      // 不存在token
      if (!Storage.getStorage(Enums.STORAGE.TOKEN)) return;

      // 获取用户信息
      const res  = await getUserInfo();

      if (!res || res.code != 200 || !res.data) return;
      const userInfo = res.data;
      userState.userName = userInfo?.username; // 用户名称
      userState.role = userInfo?.role; // 角色
      userState.roleName = userInfo?.cnName; // 角色名称
      userState.classId = userInfo?.classId; // 班级id
      userState.className = userInfo?.className; // 班级名称
      userState.imageUrl = userInfo?.photo ? Config.SYSTEM_IMAGE_URL + userInfo?.photo : ''; // 班级名称
    };
    modifyInfo();

    // 获取菜单，向菜单中添加横线(分割线)
    const getMenu = async () => {
      if (!Storage.getStorage(Enums.STORAGE.TOKEN)) {
        menu.value = [];
        return;
      }

      let response = null;
      // 获取菜单
      try {
        response = await axios.post(API.GET_MEUN);
      } catch (error) { return }

      if (!response || response.code != 200 || !response.data) return;

      let firstLine = ''; // 第一条线索引
      let lastLine = ''; // 第二条线索引
      // 获取后台管理(id=13)、退出登录(id=14)在数组中的索引
      response.data.find((x, index) => {
        x.photoPath = STATIC_SOURCE_URI + x.photoPath
        if (x.id == 13) {
          firstLine = index;
        } else if (x.id == 14) {
          lastLine = index;
        }
      })

      // 添加线 方法
      const addLine = (param) => {
        response.data.splice(param, 0, { // 添加第一根线
          id: 1000 + firstLine, 
          path: '', 
          showLine: true
        });
      }

      // 存在第一根线(存在：后台管理)
      if (firstLine) {
        addLine(firstLine);
        addLine(lastLine + 1);
      } else { // 不存在第一根线
        addLine(lastLine);
      }

      menu.value = response.data;
    };
    // getMenu();
    
    // 登出
    const navHanlder = async (param) => {
      if (param.path == '/login') {
        let response = '';
        // 退出登录
        try {
          response = await axios.post(API.LOGOUT);
        } catch (error) { return }

        if (!response || response.code != 200) return;

        // 清空个人缓存
        Storage.clearStorage();

        router.push('/login')
      }
    };

    // 加入班级成功；子组件返值给父组件，父组件新加载信息
    const addClassSuccessEmit = (param) => {
      modifyInfo();
    };

    onMounted(() => {
      // 获取菜单，向菜单中添加横线(分割线)
      getMenu();
    })

    // 监听路由
    const routeChange = () => {
      // console.log('路由', route.matched[0])
      let rootMatched = route.matched[0];
      let path, menuIndex;
    
      // 更新用户信息状态
      // userMenus.value = filterMneus(globalStore.accountRole, globalStore.user?.classesList);
      // 用户直接刷新浏览器进入时 无根节点
      if (!rootMatched) return;
    
      path = regexp.test(rootMatched.path) ? rootMatched.path.replace(regexp, route.params.projectName).replace(':', '') : rootMatched.path;
      menuIndex = menu.value.findIndex(x => x.path === path); // 返回索引，没有返回-1
      menuSelect.value = menuIndex; // == -1 ? -1 : menuIndex;
      // globalStore.appClassName = rootMatched.meta.appClassName;
    };

    // 监听
    watchEffect(() => {
      routeChange();
    });
    
    // 监听所有点击事件，当点击了 我的消息 -> 未读消息 -> 点击“知道了” 后，Utils.MESSAGESTATE = true，进行Menu菜单数据请求，头部组件更新菜单微标数
    window.addEventListener("click", (e) => {
      if (Utils.MESSAGESTATE) {
        getMenu();
        Utils.MESSAGESTATE = false;
      }
    });

    return {
      logSrc,
      userState,
      menu,
      menuSelect,
      navHanlder,
      addClassSuccessEmit
    };
  }
});
</script>

<style lang="less" scoped>
  @font-color: #FFF;
  .container {
    width: 100%;
    height: .6rem;
    padding: 0 .44rem;
    box-sizing: border-box;
    background-color: @color-Black;
    display: flex;
    justify-content: space-between;
    
    // log部分
    .log {
      width: auto;
      height: 100%;
      max-width: 200rem;
      display: flex;
      align-items: center;
      cursor: pointer;
      
      img {
        height: .24rem;
      }
      
      .log-name {
        color: @font-color;
        padding-left: .15rem;
        letter-spacing: .07rem;
      }
    }
    
    .horizontalNav {
      flex: 1;
      color: @font-color;
      line-height: .58rem;
      padding-left: 4.5rem;
      
      a {
        color: @font-color;
      }
      
      .nav {
        display: inline;
        padding: .19rem .04rem;
        
        &:hover {
          border-bottom: .02rem solid @color-Blue;
        }
      }
      
      .horizontalNavActive {
        border-bottom: .02rem solid @color-Blue;
      }
    }
    
    // 右边 个人信息
    .information {
      height: 100%;
      padding-right: .15rem;
      
      .content {
        display: flex;
        align-items: center;
        height: 100%;
        
        img {
          width: .4rem;
          height: .4rem;
          border-radius: 100%;
        }

        .nameRole {
          padding-left: .12rem;
          p {
            max-width: 1.8rem;
            display: table-cell;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            color: @font-color;
          }
          
          span {
            font-size: .14rem;
            max-width: 1.8rem;
            color: rgba(225, 225, 225, 0.45);
            display: block;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            padding-top: .06rem;
          }
          
          .add-class {
            padding-top: .06rem;

            span {
              padding-top: 0;
            }
          }
        }
      }
    }

    .toLogin {
      cursor: pointer;
      line-height: .6rem;
      color: @font-color;
    }
  }
  
  // 导航
  .menus-a {
    padding-right: .08rem;
    font-size: .16rem;
  }
  
  // 当前活动路径
  :deep(.active) {
    background-color: #f5f5f5;
  }

  // 下拉导航宽度
  .ant-dropdown-menu {
    width: 1.5rem;
  }

  :deep {
    // 设置图标
    .ant-dropdown-menu-item, .ant-dropdown-menu-submenu-title {
      display: flex;
      align-items: center;
      height: .44rem;
      font-size: .16rem;
      
      a {
        display: flex;
      }
      
      img {
        width: .2rem;
        height: .2rem;
        margin: 0 .08rem;
      }
      
      a {
        color: rgba(0, 0, 0, 0.55);
      }
    }
    // 线
    .ant-dropdown-menu-item-divider, .ant-dropdown-menu-submenu-title-divider {
      background-color: rgba(0,0,0,0.15);
    }
    
    // 下拉框宽度
    .ant-dropdown {
      .ant-dropdown-menu {
        width: 1.6rem !important;
      }
    }
  }
  
</style>