# BaseFrame

#### 介绍
通用虚访平台

#### 软件架构
<a href="https://v3.cn.vuejs.org/guide/introduction.html">Vue3（组合式API）</a>
 + 
 <a href="https://www.pipipi.net/vite/guide/">vite</a>
 +
 <a href="https://2x.antdv.com/components/overview/">antd 2.x</a> 
 + 
 <a href="http://www.axios-js.com/zh-cn/docs/index.html">axios</a>
 + 
 <a href="https://less.bootcss.com/">less</a>

### 注：样式px属性尽量使用rem， 1rem = 100px, 可在配置文件中设置rem设计分辨率、根节点最小宽度等 默认设计分辨率为 1920 全局样式设置最小宽度为1346

### 注：根据不同项目的需要自行更改http.js文件中的报头、与拦截器设置。这里默认常规做法

#### 安装教程

1.  clone
2.  cd generalmanagementplatform1.0 yarn
3.  yarn run dev

#### 开发环境建议

1.  vscode编辑器
2.  vscode安装PathIntellisense 1.4.2插件

#### 文档地址

1.  接口文档：

#### 目录说明

1. antd       AntdForVue2.x版本按需加载全局组件
2. assets     项目静态资源
3. common     公共js
4. component  自定义组件
5. router     路由
6. views      页面
7. vite.config.js 配置 代理、别名等