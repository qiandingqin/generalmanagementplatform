/*
 * @Description: 后台管理 -> 用户管理js
 */
import axios from "@common/http"
import API from "@common/api"
import Utils from '@common/utils/index'
import Enums from '@common/enums'

class UserManageServervice {
  /**
   * @description 后台管理 -> 用户管理 -> 获取角色
   */
  static getRoleLoad = async (param = '') => {
    let newArr = []

    let response = null;
    // 数据
    try {
      response = await axios.post(API.GET_ROLE);
    } catch (error) { return }

    if (!response || response.code != 200 || !response.data) return;

    // 数据处理 重新组装为表格所需数据结构
    newArr = response.data.map((x,i) => {
      return {
        text: x.cnName,
        value: x.id
      }
    })
    
    return newArr;
  }

  /**
   * @description 后台管理 -> 用户管理 -> 删除、批量删除用户
   */
  static deleteUser = async (param = '') => {

    let response = null;
    // 数据
    try {
      response = await axios.delete(API.MANAGE.MANAGE_USER_DELETE, {data: param});
    } catch (error) { 
      response = error;
    }

    // if (!response || response.code != 200 || !response.data) return; 
    
    return response;
  }
  
  /**
   * @description 后台管理 -> 用户管理 -> 查询、加载数据
   */
  static userListLoad = async (param = '') => {
    let newArr = {
      total: 1,
      data: ''
    }

    let response = null;
    const url = "?pageNum=" + param.pageNum + "&pageSize=" + param.pageSize;
    // 数据
    try {
      response = await axios.post(API.MANAGE.MANAGE_USER_PAGELIST + url, param);

    } catch (error) { return }

    if (!response || response.code != 200 || !response.data) return;

    newArr.total = response.data.total;

    // 数据处理 重新组装为表格所需数据结构
    newArr.data = response.data.records.map((x,i) => {
      return {
        key: x.id || i,
        id: x.id || '',
        account: x.account, // 工号
        userName: x.username, // 中文名
        secondName: x.secondName || '-', // 英文名
        sex: x.sex ? Enums.SEX.GET_SEX(x.sex.toString()) : '-',
        sexNumber: x.sex?.toString(), // 性别：0男 1女
        role: x.role, // 角色
        roleName: x.cnName, // 角色名称
        email: x.email,
      }
    })
    return newArr;
  }

  /**
   * @description 后台管理 -> 用户管理 -> 新建、新建用户
   */
  static newlyAddedUser = async (param = '') => {
    let response = null;
    // 数据
    try {
      response = await axios.post(API.MANAGE.MANAGE_USER_ADD, param);
    } catch (error) { 
      response = error;
    }
    
    return response;
  }

  /**
   * @description 后台管理 -> 用户管理 -> 编辑 -> 工号验证，验证工号是否存在
   */
  static accountVerification = async (param = '') => {
    let response = null;
    // 数据
    try {
      response = await axios.get(API.GET_ACCOUNT_VERIFICATION, {params: param});
    } catch (error) { 
      response = error;
    }
    
    return response;
  }

  /**
   * @description 后台管理 -> 用户管理 -> 编辑 -> 工号验证，验证工号是否存在
   */
  static emailVerification = async (param = '') => {
    let response = null;
    // 数据
    try {
      response = await axios.get(API.GET_ACCOUNTEMAIL_VERIFICATION, {params: param, requestToMessageHide: true});
    } catch (error) { 
      response = error;
    }
    
    return response;
  }

  /**
   * @description 后台管理 -> 用户管理 -> 编辑 -> 更新、提交
   */
  static updateUser = async (param = '') => {
    let response = null;
    // 数据
    try {
      response = await axios.put(API.MANAGE.MANAGE_USER_UPDATA, param);
    } catch (error) { return }
    
    return response;
  }

  /**
   * @description 后台管理 -> 用户管理 -> 批量导入学生
   */
  static batchImport = async (file = '') => {
    let response = null;
    const formData = new FormData();
    formData.append('file', file);

    // 数据
    try {
      response = await axios.post(API.MANAGE.MANAGE_USER_BATCHIMPORT, formData);
    } catch (error) { 
      response = error;
    }
    
    return response;
  }
}

export {
  UserManageServervice
}