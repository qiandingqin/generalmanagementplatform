/*
 * @Description: 我的班级js
 */
import axios from "@common/http";
import API from "@common/api";
import Utils from '@common/utils/index'
import Enums from '@common/enums'

class ClassServervice {
  /**
   * @description 我的班级 -> 新建班级 -> 获取年级
   */
   static getGrade = async (param = '') => {
    let newArr = []

    let response = null;
    // 数据
    try {
      response = await axios.get(API.CLASS.CLASS_GRADE);
    } catch (error) { return }

    if (!response || response.code != 200 || !response.data) return;

    if (param === "getGradeLoad") { // 筛选获取年级
      // 数据处理 重新组装为表格所需数据结构
      newArr = response.data.map((x,i) => {
        return {
          text: x,
          value: x
        }
      })
    } else {
      // 数据处理 重新组装为表格所需数据结构
      newArr = response.data.map((x,i) => { // 新建班级 对话框 获取年级
        return {
          lable: x,
          value: x
        }
      })
    }
    
    return newArr;
  }

  /**
   * @description 我的班级 -> 新建班级 -> 新建班级
   */
   static newClass = async (param = '') => {

    let response = null;
    // 数据
    try {
      response = await axios.post(API.CLASS.CLASS_NEWCLASS, param);
    } catch (error) { return }

    // if (!response || response.code != 200 || !response.data) return; 
    
    return response;
  }
  
  /**
   * @description 我的班级 -> 查询、加载数据
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
      response = await axios.post(API.CLASS.CLASS_PAGELIST + url, {gradeNames: param.gradeName, param: param.param});
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
        createTime: x.createTime ? Utils.Time.formatTimestamp(x.createTime) : '', // 创建时间
      }
    })
    
    return newArr;
  }

  /**
   * @description 我的班级 -> 查看班级成员 -> 加载数据
   */
   static membersDataListLoad = async (param = '') => {
    let newArr = {
      total: 1,
      data: ''
    }

    let response = null;
    
    const paramService = {
      pageNum: param.pageNum, 
      pageSize: param.pageSize,
      classId: param.classId,
      asc: param.asc,
      orderBy: param.orderBy
    }

    // 数据
    try {
      response = await axios.get(API.CLASS.MEMBERS_PAGELIST, {params: paramService});
      // response = await axios.post(API.CLASS.CLASS_PAGELIST + url, param);

    } catch (error) { return }

    if (!response || response.code != 200 || !response.data) return;

    newArr.total = response.data.total;

    // 数据处理 重新组装为表格所需数据结构
    newArr.data = response.data.records.map((x,i) => {
      return {
        key: x.id || i,
        id: x.id || '',
        index: i + 1,
        account: x.account,
        name: x.username, // 中文名
        secondName: x.secondName || '-', // 英文名
        sex: x.sex ? Enums.SEX.GET_SEX(x.sex.toString()) : '-',
        date: x.joinClassTime ? Utils.Time.formatTimestamp(x.joinClassTime) : '', // 入班时间
      }
    })
    
    return newArr;
  }

  /**
   * @description 我的班级 -> 查看班级成员 -> 移除学生
   */
  static membersRemoveStudent = async (param) => {
    let response = null;
    // console.log(param)
    try {
      response = await axios.post(API.CLASS.MEMBERS_REMOVESTUDENT, param);
    } catch (error) { return }

    if (!response || response.code != 200) return;
    
    return response;
  }
}

export {
  ClassServervice
}