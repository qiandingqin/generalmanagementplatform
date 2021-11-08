/*
 * @Description: 变更邮箱 js
 */
import axios from "@common/http"
import API from "@common/api"

/**
 * @description 验证密码
 * @param {Object} 
 */
 export const verificationPassword = async (param) => {
  let response = null;

  try {
    response = await axios.get(API.EMAIL.EMAIL_PASSWORD, {params: param, requestToMessageHide: true})
  } catch (error) {
    response = error;
  }

  return response;
}

/**
 * @description 新邮箱，获取验证码
 * @param {Object} 
 */
 export const emailGetCode = async (param) => {
  let response = null;

  try {
    response = await axios.get(API.EMAIL.EMAIL_GETEMAIL, {params: param});
  } catch (error) {
    response = error;
  }

  return response;
}

/**
 * @description 邮箱、验证码验证
 * @param {Object} 
 */
 export const emailCodeVerification = async (param) => {
  let response = null;

  try {
    response = await axios.post(API.EMAIL.EMAIL_EMAILVERIFICATION, param, {requestToMessageHide: true})
  } catch (error) {
    response = error;
  }

  return response;
}

/**
 * @description 注册
 * @param {Object} 
 */
 export const userUpData = async (param) => {
  let response = null;

  try {
    response = await axios.put(API.EMAIL.EMAIL_PERSONALCENTER_INFO, param)
  } catch (error) {
    return;
  }

  return response;
}