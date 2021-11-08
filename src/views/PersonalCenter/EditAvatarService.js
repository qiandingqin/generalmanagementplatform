/*
 * @Description: 个人设置 -> 编辑头像、上传头像 js
 */
import axios from "@common/http"
import API from "@common/api"
import Config from '@common/config'

/**
 * @description 获取所有系统头像
 * @param {Object} 
 */
 export const getAllSystemImage = async (param) => {
  let response = null;

  try {
    response = await axios.post(API.PERSONALCENTER.PERSONALCENTER_GETIMAGE)
  } catch (error) {
    return;
  }

  response.data.map(x => {
    // 拼接图片路径
    return x.imageUrl = Config.SYSTEM_IMAGE_URL + x?.name;
  })
  
  // console.log(response)

  return response;
}

/**
 * @description 系统头像、自定义图片上传 上传（修改头像）
 * @param {Object} 
 */
 export const modifyImageUpdata = async (param) => {
  let response = null;

  try {
    // 使用修改个人信息接口，传字段：photo
    response = await axios.put(API.PERSONALCENTER.PERSONALCENTER_INFO, param)
  } catch (error) {
    return;
  }
  
  // console.log(response)

  return response;
}

/**
 * @description 自定义头像 图片上传（裁剪后头像）
 * @param {Object} 
 */
 export const customImageUpdata = async (param) => {
  let response = null;

  try {
    // 使用修改个人信息接口，传字段：photo
    response = await axios.post(API.PERSONALCENTER.PERSONALCENTER_CUSTOMIMAGE, param)
  } catch (error) {
    return;
  }
  
  // console.log(response)

  return response;
}