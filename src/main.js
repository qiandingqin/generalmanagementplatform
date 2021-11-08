import { createApp } from 'vue'
import App from './App.vue'
import route from './router'
import antd from './antd'
import htmlFontSize from '@common/htmlFontSize'
import '@/assets/less/reset.less'
import config from './common/config'
import Enums from './common/enums'

// 中文
import zhCN from 'ant-design-vue/es/locale/zh_CN';
import moment from 'moment';
import 'moment/dist/locale/zh-cn';

// 引用阿里图标
import './assets/icon/iconfont.css'

// 重置根节点字体
new htmlFontSize();

const app = createApp(App);

// 全局挂载 腾讯存储桶地址（用于选项API）
app.config.globalProperties.$STATIC_SOURCE_URI = config.STATIC_SOURCE_URI;
/* // 取数据方法：在import的vue引用中，取出getCurrentInstance
 const { proxy } = getCurrentInstance()
 console.log(proxy.$STATIC_SOURCE_URI)
 */

app.config.globalProperties.$zhCN = zhCN;

// 全局挂载 腾讯存储桶地址 （用于组合或选项API）
app.provide('STATIC_SOURCE_URI', config.STATIC_SOURCE_URI)
/* // 取数据方法 
  inject('STATIC_SOURCE_URI')
 */

app.config.globalProperties.$enums = Enums;

app.use(route)
.use(antd)
.mount('#app');