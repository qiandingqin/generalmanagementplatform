/*
 * @Description: 学生注册 js
 * 使用的部分接口与修改邮箱的相同
 */
import axios from "@common/http"
import API from "@common/api"

/**
 * @description 验证邮箱是否存在（是否已绑定其他账户）
 * @param {Object} 
 */
 export const emailVerification = async (param) => {
  let response = null;

  try {
    response = await axios.get(API.GET_ACCOUNTEMAIL_VERIFICATION, {params: param});
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
    response = await axios.post(API.EMAIL.EMAIL_EMAILVERIFICATION, param)
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
    response = await axios.post(API.REGISTER.REGISTER, param)
  } catch (error) {
    response = error;
  }

  return response;
}