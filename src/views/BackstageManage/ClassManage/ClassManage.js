/*
 * @Description: 后台管理 -> 班级管理js
 */
import axios from "@common/http";
import API from "@common/api";
import Utils from '@common/utils/index'

class ClassManageServervice {
  /**
   * @description 后台管理 -> 班级管理 -> 获取教师信息
   */
   static getTeacher = async (param = '') => {
    let newArr = []

    let response = null;
    // 数据
    try {
      response = await axios.get(API.GET_TEACHER);
    } catch (error) { return }

    if (!response || response.code != 200 || !response.data) return;

    // 数据处理 重新组装为表格所需数据结构
    newArr = response.data.map((x,i) => {
      return {
        text: x.account + '\xa0\xa0\xa0' + x.username,
        value: x.id
      }
    })
    
    return newArr;
  }

  /**
   * @description 后台管理 -> 班级管理 -> 删除班级
   */
   static deleteClass = async (param = '') => {

    let response = null;
    // 数据
    try {
      response = await axios.delete(API.MANAGE.MANAGE_CLASS_DELETE, {data: param});
    } catch (error) { return }

    // if (!response || response.code != 200 || !response.data) return; 
    
    return response;
  }
  
  /**
   * @description 后台管理 -> 班级管理 -> 查询、加载数据
   */
  static classListLoad = async (param = '') => {
    let newArr = {
      total: 1,
      data: ''
    }

    let response = null;
    const url = "?pageNum=" + param.pageNum + "&pageSize=" + param.pageSize + "&asc=" + param.asc + "&orderBy=" + param.orderBy;
    // 数据
    try {
      response = await axios.post(API.MANAGE.MANAGE_CLASS_PAGELIST + url, {gradeNames: param.gradeName, param: param.param});
      // response = await axios.post(API.CLASS.CLASS_PAGELIST + url, param);

    } catch (error) { return }

    if (!response || response.code != 200 || !response.data) return;

    newArr.total = response.data.total;

    // 数据处理 重新组装为表格所需数据结构
    newArr.data = response.data.records.map((x,i) => {
      return {
        key: x.id || i,
        id: x.id || '',
        className: x.className,
        classNumber: x.classNumber, // 班级号
        grade: x.gradeName, // 年级
        peopleNumber: x.peopleNumber, // 人数
        teacher: x.username, // 授课教师
        teacherId: x.teacherId, // 授课教师id
        createdTime: x.createTime ? Utils.Time.formatTimestamp(x.createTime) : '', // 创建时间
      }
    })
    
    return newArr;
  }

  /**
   * @description 后台管理 -> 班级管理 -> 新建班级
   */
   static newlyAddedClass = async (param = '') => {

    let response = null;
    // 数据
    try {
      response = await axios.put(API.MANAGE.MANAGE_CLASS_ADD, param, {requestToMessageHide: true});
    } catch (error) { 
      response = error;
    }

    // if (!response || response.code != 200 || !response.data) return; 
    
    return response;
  }

  /**
   * @description 后台管理 -> 班级管理 -> 编辑 -> 班级名和授课教师验证，验证班级是否存在
   */
   static classTeacherVerification = async (param = '') => {

    let response = null;
    // 数据
    try {
      response = await axios.put(API.MANAGE.MANAGE_CLASS_VERIFICATION, param);
    } catch (error) { return }

    // if (!response || response.code != 200 || !response.data) return; 
    
    return response;
  }

  /**
   * @description 后台管理 -> 班级管理 -> 编辑 -> 更新、提交
   */
   static updateClass = async (param = '') => {

    let response = null;
    // 数据
    try {
      response = await axios.put(API.MANAGE.MANAGE_CLASS_UPDATACLASS, param);
    } catch (error) { return }

    // if (!response || response.code != 200 || !response.data) return; 
    
    return response;
  }
}

export {
  ClassManageServervice
}