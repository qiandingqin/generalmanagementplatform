/*
 * @Description: 后台管理 -> 权限管理 -> 普通管理员、超级管理员 js
 * 使用的部分接口与修改邮箱的相同
 */
import axios from "@common/http"
import API from "@common/api"

/**
 * @description 获取所有操作权限列表
 * @param {Object} 
 */
 export const getPower = async (param) => {
  let response = null;
  let dataState = {
    user: [], // 用户管理-权限
    class: [], // 班级管理-权限
    data: [], // 数据管理-权限
    userSuperAdminOption: [], // superAdmin组件专有。超级管理员的权限不可更改，拥有所有权限，固在获取所有权限中提取
    classSuperAdminOption: [], // superAdmin组件专有。超级管理员的权限不可更改，拥有所有权限，固在获取所有权限中提取
    dataSuperAdminOption: [] // superAdmin组件专有。超级管理员的权限不可更改，拥有所有权限，固在获取所有权限中提取
  };

  try {
    response = await axios.post(API.MANAGE.MANAGE_POWER_GETPOWER, param);
  } catch (error) {
    return;
  }

  if (!response || response.code != 200) return;

  response.data.map(x => {
    const objs = {
      label: x.name,
      value: x.id
    }
    if (x.form == 'user') {
      dataState.user.push(objs);
      dataState.userSuperAdminOption.push(x.id);
    } else if (x.form == 'class') {
      dataState.class.push(objs);
      dataState.classSuperAdminOption.push(x.id);
    } else if (x.form == 'data') {
      dataState.data.push(objs);
      dataState.dataSuperAdminOption.push(x.id);
    }
  })

  // console.log('neirong ' ,dataState);
  return dataState;
}

/**
 * @description 获取已拥有操作权限列表
 * @param {Object} 
 */
 export const getHavePower = async (param) => {
  let response = null;
  let dataState = {
    user: [], // 用户管理-权限
    class: [], // 班级管理-权限
    data: [] // 数据管理-权限
  };

  try {
    response = await axios.get(API.MANAGE.MANAGE_POWER_ROLEPOWER, {params: param});
  } catch (error) {
    return;
  }

  if (!response || response.code != 200) return;

  response.data.map(x => {
    if (x.form == 'user') {
      dataState.user.push(x.id)
    } else if (x.form == 'class') {
      dataState.class.push(x.id)
    } else if (x.form == 'data') {
      dataState.data.push(x.id)
    }
  })

  return dataState;
}

/**
 * @description 变更操作权限、赋予权限
 * @param {Object} 
 */
 export const setHavePower = async (param) => {
  let response = null;

  try {
    response = await axios.post(API.MANAGE.MANAGE_POWER_HANDLEPOWER, param);
  } catch (error) {
    return;
  }

  if (!response || response.code != 200) return;

  return response;
}

/**
 * @description 获取已拥有 数据权限
 * @param {Object} param：1为超级管理员，2为管理员
 */
 export const getHaveDataPower = async (param = 1) => {
  let response = null;
  let res = '';
  try {
    response = await axios.get(API.MANAGE.MANAGE_POWER_GETROLE);
  } catch (error) {
    return;
  }

  if (!response || response.code != 200) return;

  response.data.map(x => {
    // 返回的id为角色，level为权限，通过角色获取权限
    if (x.id == param) {
      // 取权限
      res = x?.level.toString();
    }
  })

  return res;
}

/**
 * @description 修改数据权限
 * @param {Object} param：1为超级管理员，2为管理员
 */
 export const changeDataPower = async (param) => {
  let response = null;
  try {
    response = await axios.post(API.MANAGE.MANAGE_POWER_CHANGEPOWER, param);
  } catch (error) {
    return;
  }

  if (!response || response.code != 200) return;

  return response;
}
