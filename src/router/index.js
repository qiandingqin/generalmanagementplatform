/*
 * @Description: 路由
 */
import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'
import NotFound from '@/views/NotFound.vue'
import Home from '@/views/Home/Home.vue'
import Login from '@/views/Login/Login.vue'
import Forget from '@/views/Login/Forget.vue'
import Register from '@/views/Login/Register/Register.vue'
import RegisterClause from '@/views/Login/Register/RegisterClause.vue'
import RegisterPolicy from '@/views/Login/Register/RegisterPolicy.vue'

import BackstageManage from '@/views/BackstageManage/BackstageManage.vue'
import UserManage from '@/views/BackstageManage/UserManage/UserManage.vue'
import ClassManage from '@/views/BackstageManage/ClassManage/ClassManage.vue'
import DataManage from '@/views/BackstageManage/DataManage/DataManage.vue'
import SuperAdmin from '@/views/BackstageManage/PowerManage/SuperAdmin.vue'
import Admin from '@/views/BackstageManage/PowerManage/Admin.vue'

import Message from '@/views/Message/Message.vue'

import Personal from '@views/PersonalCenter/Personal.vue'
import PersonalSetting from '@views/PersonalCenter/PersonalSetting.vue'
import PersonalModifyPwd from '@views/PersonalCenter/PersonalModifyPwd.vue'
import Email from '@/views/PersonalCenter/Email.vue'

import Class from "@views/Class/Class.vue";
import ClassList from "@views/Class/ClassList.vue";
import ClassMembers from '@views/Class/ClassMembers.vue'
import ClassAchievement from '@views/Class/ClassAchievement.vue'
/* import ClassAchievementScore from '@views/Class/ClassAchievementScore.vue' */

import Score from '@views/Score/Score.vue'

const routes = [
  {
    path: '/',
    name: Home.name,
    component: Home
  },
  // 登录
  {
    path: '/login',
    name: Login.name,
    component: Login
  },
  // 忘记密码
  {
    path: '/forget',
    name: Forget.name,
    component: Forget
  },
  // 学生注册
  {
    path: '/register',
    name: Register.name,
    component: Register,
  },
  // 学生注册 -> 虚拟仿真平台服务条款
  {
    path: '/register/clause',
    name: RegisterClause.name,
    component: RegisterClause
  },
  // 学生注册 -> 数矩隐私政策
  {
    path: '/register/policy',
    name: RegisterPolicy.name,
    component: RegisterPolicy
  },
  // 后台管理
  {
    path: '/manage',
    name: BackstageManage.name,
    component: BackstageManage,
    children: [
      // 用户管理
      {
        path: '',
        name: UserManage.name,
        component: UserManage
      },
      // 班级管理
      {
        path: 'class-manage',
        name: ClassManage.name,
        component: ClassManage
      },
      // 数据管理
      {
        path: 'data-manage',
        name: DataManage.name,
        component: DataManage
      },
      // 权限管理 -> 超级管理员
      {
        path: 'super-admin',
        name: SuperAdmin.name,
        component: SuperAdmin
      },
      // 权限管理 -> 普通管理员
      {
        path: 'admin',
        name: Admin.name,
        component: Admin
      },
    ]
  },
  // 我的消息
  {
    path: '/message',
    name: Message.name,
    component: Message
  },
  // 我的成绩
  {
    path: '/score',
    name: Score.name,
    component: Score
  },
  // 个人中心
  {
    path: '/personal',
    name: Personal.name,
    component: Personal,
    children: [
      // 信息设置 首页
      {
        path: '',
        name: PersonalSetting.name,
        component: PersonalSetting
      },
      // 修改密码
      {
        path: 'modify-pwd',
        name: PersonalModifyPwd.name,
        component: PersonalModifyPwd
      },
    ]
  },
  // 个人中心 -> 更换邮箱
  {
    path: '/email',
    name: Email.name,
    component: Email
  },
  // 我的班级
  {
    path: '/class',
    name: Class.name,
    component: Class,
    meta: {appClassName: 'w1ebgl-page'},
    children: [
      // 班级管理首页 - 列表
      {
        path: '',
        name: ClassList.name,
        component: ClassList
      },
      // 班级成员  
      {
        path: 'members',
        name: ClassMembers.name,
        component: ClassMembers,
      },
      // 班级成绩
      {
        path: 'achievement',
        name: ClassAchievement.name,
        component: ClassAchievement,
      },
    ]
  },
  // 404 错误页 必须放到最后
  {
    path: '/:catchAll(.*)*',
    name: NotFound.name,
    component: NotFound
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router