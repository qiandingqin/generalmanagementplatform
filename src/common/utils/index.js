/**
 * @description 工具基础类 包含各种辅助函数大类
 */
class Utils {

  /**
   * @description 类型工具类
   */
  static Typeof = class Typeof {

    /**
     * @description 获取参数类型
     * @param {T} obj 参数
     * @returns {string} string，number，object，array，function，boolean， null， undefined (object 可能为json对象或Class对象)
     */
    static getTypeof(obj) {
      let t = typeof obj;

      if (t === 'object') {
        t = obj === null ? 'null' : obj.length ? 'array' : 'object';
      } else if (t === 'function') {
        t = obj.prototype ? 'object' : 'function';
      }

      return t;
    }

    /**
     * @description 是否string
     * @param {T} obj 参数
     * @returns {boolean} 布尔值
     */
    static isString(obj) {
      return Utils.Typeof.getTypeof(obj) == 'string';
    }

    /**
     * @description 是否数字
     * @param {T} obj 参数
     * @returns 
     */
    static isNumber(obj) {
      return Utils.Typeof.getTypeof(obj) == 'number';
    }

    /**
     * 是否数组
     * @param {T} obj 参数
     * @returns 
     */
    static isArray(obj) {
      return Utils.Typeof.getTypeof(obj) == 'array';
    }

    /**
     * @description 是否object 
     * @param {T} obj 参数
     * @returns json,class,arrayBuffer = object
     */
    static isObject(obj) {
      return Utils.Typeof.getTypeof(obj) == 'object';
    }

    /**
     * @description 是否function
     * @param {T} obj 参数
     * @returns 
     */
    static isFunction(obj) {
      return Utils.Typeof.getTypeof(obj) == 'function';
    }
  }

  /**
   * @description 字符串工具类
   */
  static String = class String {

    /**
     * @description 判断字符串是否null、undefined、空值，数字0返回false, 传入非字符串、数字参数一律返回true
     * @param {string} str 欲检测的字符串
     * @returns {boolean} boolean
     */
    static isNullOrEmpty(str) {
      const type = Utils.Typeof.getTypeof(str);

      if (type != 'string' && type != 'number') {
        return true;
      }

      if (str != '' && type != 'null' && type != 'undefined') {
        return false;
      }

      return true;
    }

  }

  /**
   * @description 日期时间处理类
   */
  static Time = class Time {

    /**
     * @description 格式化时间戳或日期对象
     * @param {string | Date} dateObject 传入字符串或日期对象
     * @param {string} type yyy-MM-dd hh:mm:ss
     * @returns string
     */
    static formatTimestamp(dateObject, type = 'yyyy-MM-dd hh:mm:ss') {
      let classify = Utils.Typeof.getTypeof(dateObject);

      if (classify != 'string' && classify != 'object') throw new Error('参数不是字符串或date对象');

      let date = new Date(dateObject);
      let o = {   
        "M+" : date.getMonth()+1,	//月份   
        "d+" : date.getDate(),		//日   
        "h+" : date.getHours(),		//小时   
        "m+" : date.getMinutes(),	//分   
        "s+" : date.getSeconds(),	//秒   
      };   

      if(/(y+)/.test(type)){
        type = type.replace(RegExp.$1, (date.getFullYear()+"").substr(4-RegExp.$1.length)); 
      };    

      for(var k in o){
        if(new RegExp("("+ k +")").test(type)){
          type = type.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+o[k]).length))); 
        }; 
      }

      return type; 
    }

  }

  /**
   * @description 邮箱处理类
   */
  static Email = class Email {
    /**
     * @description 邮箱中间的用*显示
     * @param {string} str 欲检测的字符串
     * @returns {boolean} boolean
     */
    static EmailChang(str) {
      const type = Utils.Typeof.getTypeof(str);

      if (type != 'string' && type != 'object') {
        console.log("参数不是字符串或date对象");
        return;
      }
      // if (type != 'string' && type != 'object') throw new Error('参数不是字符串或date对象');

      let newStr;
      if (str.length === 2) {
        newStr = str.substr(0, 1) + '*';
      } else if (str.length > 2) {
        let char = '';
        for (let i = 0, len = 5; i < len; i++) {
          char += '*';
        }
        newStr = str.substr(0, 3) + char + str.substr(str.length - 10, str.length);
      } else {
        newStr = str;
      }
      
      return newStr;
    };
  }

  /**
   * @description 用于头部微标数更新
   * 当点击了 我的消息 -> 未读消息 -> 点击“知道了” 后，Utils.MESSAGESTATE = true，进行Menu菜单数据请求，头部组件更新菜单微标数
   */
  static MESSAGESTATE = false;
}

export default Utils;