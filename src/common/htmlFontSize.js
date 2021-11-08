import config from '@common/config'

/**
 * @description 重置html 文字大小用以匹配rem = 1rem = 100px
 */
class HtmlFontSize {
  resolution = config.DESUGN_RESOLUTION; // 设计分辨率
  minWidth = config.HTML_MINWIDTH; // HTML根节点最小宽度
  
  constructor() {
    this._resetFontSize();
    // 开启浏览器被用户重置大小监听
    window.addEventListener('resize', () => this._resetFontSize());
  }

  /**
   * @description 重置字体
   */
  _resetFontSize() {
    // 设置html 根节点样式
    let w = document.documentElement.offsetWidth;
    document.documentElement.style.fontSize = (w < this.minWidth ? this.minWidth : w) / (this.resolution / 100) + 'px';
  }
}

export default HtmlFontSize;