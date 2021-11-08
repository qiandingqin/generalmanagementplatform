/*
 * @Description: 
 */
/**
 * @description 配置文件
 */
class Config {
  /**
   * @description API 服务器
   */
  static get HOST() { return 'https://xcloud.vivedm.com:8433' } // 公司服务器 API
  // static get HOST() { return 'https://117.174.25.188:8433' } // 公司服务器 API
  // static get HOST() { return '' }  

  /**
   * @description API 接口地址
   */
  static get API() { return this.HOST + '/general-virtual-simulation' }

  /**
   * @description 系统图片地址
   */
   static get SYSTEM_IMAGE_URL () { return this.HOST + '/upload/' }

  /**
   * @description 远程静态资源地址
   */
  static get STATIC_SOURCE_URI() { return 'https://2019vivedmstorge1-1258148561.cos.ap-chengdu.myqcloud.com/web/GeneralManagementPlatform' }

  /**
   * @description axios 请求超时时间(10000为10秒)
   */
  static get AXIOS_TIMEOUT() { return 300000 }

  /**
   * @description 设计分辨率
   */
  static get DESUGN_RESOLUTION() { return 1920 }

  /**
   * @description HTML根节点最小宽度
   */
  static get HTML_MINWIDTH() { return 1346 }

  /**
   * @description 批量导入，下载失败记录地址
   */
  static get DOWNLOAD_URL() { return this.HOST + '/upload' }
}

// export default new Config();
export default Config;