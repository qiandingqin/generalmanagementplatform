import axios from 'axios'
import config from '@common/config'
import { message } from 'ant-design-vue'
import Enums from '@common/enums'
import Storage from '@common/utils/storage'
import router from '@/router/index.js'

// 不需要token的url
const filterUrl = ['/login/login'];
// 不需要message提示的code值。20011:登录锁定提示；10001登录账号错误；30002登录密码错误；30004修改密码旧密码错误；30011教师管理删除有班级用户
const messageTipHide = [20011, 10001, 30002, 30004, 30011];

const statusCode = {
  "400": "Bad Request 客户端请求的语法错误，服务器无法理解",
  "401": "Unauthorized 请求要求用户的身份认证",
  "403": "Forbidden 服务器理解请求客户端的请求，但是拒绝执行此请求",
  "404": "Not Found Request 服务器无法根据客户端的请求找到资源",
  "405": "Method Not Allowed 客户端请求中的方法被禁止",
  "500": "Internal Server Error 服务器内部错误，无法完成请求",
  "501": "Not Implemented 服务器不支持请求的功能，无法完成请求",
  "502": "Bad Gateway 作为网关或者代理工作的服务器尝试执行请求时，从远程服务器接收到了一个无效的响应",
  "503": "Service Unavailable 由于超载或系统维护，服务器暂时的无法处理客户端的请求。延时的长度可包含在服务器的Retry-After头信息中",
  "504": "Gateway Time-out 充当网关或代理的服务器，未及时从远端服务器获取请求",
  "505": "HTTP Version not supported 服务器不支持请求的HTTP协议的版本，无法完成处理"
};

// 默认配置
axios.defaults.timeout = config.AXIOS_TIMEOUT;
// axios.defaults.baseURL = config.API; // 在此引用会重复 且灵活性差，每个接口都需要经过

// message提示设置
let requestToMessageHide = false;

// 对请求添加token
axios.interceptors.request.use(function(request) {
  // message提示设置，默认为提示，如不需要可设置，如在post请求参数后添加 {requestToMessageHide: true} ；get请求params后添加 requestToMessageHide: true
  if (request.requestToMessageHide) {
    requestToMessageHide = true;
  }

  // 不需要token
  if ((config.API + filterUrl).indexOf(request.url) != -1) return request;
  
  // 报头添加token
  // const header = {test: 'token'};
  const userToken = Storage.getStorage(Enums.STORAGE.TOKEN);
  // token userToken = null 时，请求不带token
  if (userToken) {
    const header = {token: userToken};
    Object.assign(request.headers, header);
  }
  
  return request;
});

// 统一处理响应
axios.interceptors.response.use(function(response) {
  let text = "";
  let data = response.request ? response.data : response;

  // 服务端业务状态
  if (data.code < 200 || data.code > 299) {
    text = data.message || statusCode[data.code] || "响应错误";
  }

  if (text) {
    // message提示设置 code非200提示。不需要message提示，messageTipHide中定义不需要提示的code
    if (!requestToMessageHide && !messageTipHide.includes(data.code)) {
      message.error(text);
      requestToMessageHide = false;
    }
    
    // 401 token 过期回登录页面
    if (data.code == 401) {
      // 退出系统，清除个人消息
      Storage.clearStorage();
      router.replace({path: '/login'});
    }
    
    return Promise.reject(data);
  } else {
    return Promise.resolve(data);
  }
  
}, function(error) {
  console.log(error)
  error && message.error( error.message);
  requestToMessageHide = false;

  return Promise.reject(error);
});

/* axios.post('/user/login', {userName: 'admin', password: '123456'})
.then(x => console.log('访问成功', x))
.catch(x => console.log('访问失败', x)); */

/**
 * @description axios 全局配置
 */
export default axios;