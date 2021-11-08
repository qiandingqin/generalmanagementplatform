/*
 * @Description: 我的消息 js
 */
import axios from "@common/http";
import API from "@common/api";

/**
 * @description MessageUnread、MessageHistory  未读数据、历史消息 数据加载 （isRead: 1 // 是否已读 0是 1 否）
 */
const MessageLoad = async (parm = '') => {
  let response = null;
  // 列表数据
  try {
    response = await axios.post(API.MESSAGE.MESSAGE_LOAD + '?pageNum=' + parm.pageNum + '&pageSize=' + parm.pageSize, {isRead: parm.isRead});
  } catch (error) { return }

  if (response.code != 200 || !response || !response.data) return;
  
  const data = response.data;

  return data;
};

/**
 * @description MessageUnread  未读数据 知道了
 */
const KnowAxios = async (parm = '') => {
  let response = null;
  // console.log(parm)
  
  try {
    response = await axios.post(API.MESSAGE.MESSAGE_KNOW, parm);
  } catch (error) { return }

  if (response.code != 200 ) return;

  return response.code;
};

/**
 * @description MessageUnread 标记所有为已读
 */
 const allKnowAxios = async (parm = '') => {
  let response = null;
  // console.log(parm)
  
  try {
    response = await axios.post(API.MESSAGE.MESSAGE_ALLKNOW);
  } catch (error) { return }

  if (response.code != 200 ) return;

  return response.code;
};

/**
 * @description MessageUnread  历史消息 删除
 */
const DeleteAxios = async (parm = '') => {
  let response = null;
  
  try {
    response = await axios.delete(API.MESSAGE.DELETE_KNOW, {data: parm });
  } catch (error) { return }

  if (response.code != 200 ) return;

  return response.code;
};

/**
 * @description MessageUnread  历史消息 删除所有
 */
 const allDeleteAxios = async (parm = '') => {
  let response = null;

  try {
    response = await axios.post(API.MESSAGE.DELETE_ALLKNOW);
  } catch (error) { return }

  if (response.code != 200 ) return;

  return response.code;
};

export {
  MessageLoad,
  KnowAxios,
  allKnowAxios,
  DeleteAxios,
  allDeleteAxios
}