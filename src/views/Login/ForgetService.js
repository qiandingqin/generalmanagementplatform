/*
 * @Description: 忘记密码js
 */
import axios from "@common/http";
import API from "@common/api";

/**
 * @description 查询账号是否存在
 */
const accountQuery = async (param) => {
  
  let response = null;
  // 用户查询
  try {
    response = await axios.get(API.GET_ACCOUNT_VERIFICATION, {params: param});
  } catch (error) { return }
  
  if (!response || response.code != 200) return;
  
  return response;
}

// 账号获取邮箱
const accountEmail = async (param) => {
  let response = null;
  try {
    response = await axios.get(API.FORGET.FORGET_ACCOUNT_EMAIL, {params: param});
  } catch (error) { 
    response = error;
  }
  
  return response;
}

// 获取验证码
const getCode = async(param) => {
  let response = null;
  try {
    response = await axios.get(API.GET_EMAIL, {params: param});
  } catch (error) { 
    response = error;
  }
  
  return response;
}

// 验证邮箱验证码
const codeVerification = async(param) => {
  let response = null;
  try {
    response = await axios.post(API.GET_EMAIL_VERIFICATION, param);
  } catch (error) { 
    response = error;
  }
  
  return response;
}

// 提交密码
const updatePassword = async(param) => {
  let response = null;
  try {
    response = await axios.post(API.FORGET.FORGET_PASSWORD, param);
  } catch (error) { 
    response = error;
  }
  
  return response;
}

export {
  accountQuery,
  accountEmail,
  getCode,
  codeVerification,
  updatePassword
}