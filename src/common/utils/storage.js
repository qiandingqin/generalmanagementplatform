import Utils from '@/common/utils'

/**
 * @description 本地储存类 封装时效
 */
class Storage extends Utils{

  /**
   * @description 设置本地储存
   * @param {string} key Key
   * @param {Object | T} value 值
   * @param {number} timeout 有效期 单位秒 0秒为不过期 默认0秒
   */
  static setStorage(key, value, timeout = 0) {

    if (this.String.isNullOrEmpty(key)) throw new Error('key 不能是null或空');
    if (!this.Typeof.isNumber(timeout)) throw new Error('timeout 不是一个数字');

    localStorage.setItem(key, JSON.stringify({
      createtime: new Date().getTime(),
      timeout: timeout, 
      value 
    }));
  }

  /**
   * @description 获取本地储存
   * @param {string} key key
   * @returns value | null
   */
  static getStorage(key) {
    if (this.String.isNullOrEmpty(key)) throw new Error('key 不能是null或空');

    let cache, data, now;

    cache = localStorage.getItem(key);

    if (this.String.isNullOrEmpty(cache)) return null;

    data = JSON.parse(cache);

    // 检查是否过期
    now = new Date().getTime();

    if (data.timeout > 0 && (now - data.createtime) / 1000 > data.timeout) {
      data.value = null;
      Storage.removeStorage(key);
    }

    return data.value;
  }

  /**
   * @description 移除本地储存
   * @param {string} key Key
   * @returns value
   */
  static removeStorage(key) {
    if (this.String.isNullOrEmpty(key)) throw new Error('key 不能是null或空');
    return localStorage.removeItem(key);
  }

  /**
   * @description 清除本地储存
   */
  static clearStorage() {
    localStorage.clear();
  }

}

export default Storage;