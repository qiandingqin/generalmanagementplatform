/*
 * @Description: 登录页js
 */
import axios from "@common/http";
import API from "@common/api";
import Enums from '@common/enums'
import Storage from '@common/utils/storage'

/**
 * @description 提交登录请求
 */
const requestLogin = async (form) => {
  // 登录成功检查是否需要保存登录状态 保存十五天否则只保存3小时
  const timer = form.checked ? 60 * 60 * 24 * 15 : 0;

  let response = null;
  // 获取token
  try {
    response = await axios.post(API.LOGIN, {account: form.name, password: form.password, time: timer});
  } catch (error) { 
    response = error;
  }

  if (!response || response.code != 200 || !response.data) {
    return response;
  }
  // if (!response || response.code != 200 || !response.data) return;
  
  // 永久保存登录token，每次登录或修改后更新
  Storage.setStorage(Enums.STORAGE.TOKEN, response.data, timer);
  
  // 用token获取个人信息
  let res = await getUserInfo();
  
  if (!res || res.code != 200 || !res.data) return;
  
  // 写缓存
  let user = res.data;
  
  // 设置其他额外信息
  user._sex = Enums.SEX.GET_SEX(user.sex);
  user._role = Enums.ROLE.GET_ROLE(user.role?.toString());
  user._roleName = Enums.ROLE.GET_ROLENAME(user.role?.toString());
  user._name = user.username;
  user._photo = user.photo;
  // user._remember = form.checked || false; // 15天内保持登录
  // 这里永久缓存用户信息 每次登录或修改后更新
  Storage.setStorage(Enums.STORAGE.USER, user);
  // 记住用户
  // user._remember ? Storage.setStorage(Enums.STORAGE.ACCOUNT, user.account) : Storage.removeStorage(Enums.STORAGE.ACCOUNT);
  
  return res;
}

// 用token获取个人信息
const getUserInfo = async () => {
  let res = null;
  try {
    res = await axios.post(API.GET_USERINFO);
  } catch (error) { return }
  
  return res;
}


// 用token获取个人信息，再次修改缓存信息（用于其他组件调用）
const getUserInfoStorage = async (form) => {
  let res = null;
  try {
    res = await axios.post(API.GET_USERINFO);
  } catch (error) { return }

  if (!res || res.code != 200 || !res.data) return;
  
  // 写缓存
  let user = res.data;
  
  // 设置其他额外信息
  user._sex = Enums.SEX.GET_SEX(user.sex);
  user._role = Enums.ROLE.GET_ROLE(user.role?.toString());
  user._roleName = Enums.ROLE.GET_ROLENAME(user.role?.toString());
  user._name = user.username;
  user._photo = user.photo;
  // user._remember = form.checked || false; // 15天内保持登录
  // 这里永久缓存用户信息 每次调用或修改后更新
  Storage.setStorage(Enums.STORAGE.USER, user);
  // 记住用户
  // user._remember ? Storage.setStorage(Enums.STORAGE.ACCOUNT, user.account) : Storage.removeStorage(Enums.STORAGE.ACCOUNT);
  
  return res;
}

export {
  requestLogin,
  getUserInfo,
  getUserInfoStorage
}