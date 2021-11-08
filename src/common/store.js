import { provide, inject, reactive, getCurrentInstance } from 'vue'
import Enums from './enums';
import Storage from './utils/storage';

const provideName = 'global_store';

/**
 * @description 全局状态管理 -- 简化实现 项目庞大考虑更换vuex
 */
class Store {

  state = null;

  static init() {
    if (!getCurrentInstance()) {
      throw new Error('初始化失败 provide/inject只能在setup中调用');
    }

    this.state = reactive(new State());
    provide(provideName, this.state);
  }

  /**
   * @description 获取全局对象
   * @returns {State} State对象
   */
   static getStore() {
    return inject(provideName);
  }
}

/**
 * @description 全局状态对象
 */
class State {
  /**
   * @description 用户对象
   * @type {User}
   */
  user = Storage.getStorage(Enums.STORAGE.USER) || {};

  /**
   * @description 课件、语料、创建标题
   * @type {String}
   */
  coursewareTitle = ''
  
  /**
   * @description 头部右侧按钮参数
   * @type {Object}
   */
  headerBtnParams = {path: '/data', title: '管理'}

  /**
   * @description 年级对象
   * @type {Array}
   */
  grades = []

  /**
   * @description 班级成员 用于班级管理成员查看时携带的参数
   */
  members = []

  /**
  * @description 学情数据 通用头部年级数据对象
  */
  dataGrades = [];
}

export default Store;