import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import styleImport from 'vite-plugin-style-import'
import { resolve } from 'path'
// https://vitejs.dev/config/
export default defineConfig({
  
  plugins: [
    vue(),
    styleImport({
      libs: [{
        libraryName: 'ant-design-vue',
        esModule: true,
        resolveStyle: (name) => {
          // return `ant-design-vue/es/${name}/style/css`;
          return `ant-design-vue/es/${name}/style/index.js`; // 主题配置
        },
      }]
    })
  ],
  // 设置别名
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
      "@views": resolve(__dirname, "src/views"),
      "@components": resolve(__dirname, "src/components"),
      "@common": resolve(__dirname, "src/common"),
    }
  },
  // 全局样式
  css: {
    preprocessorOptions: {
      less: {
        additionalData: '@import "./src/assets/less/common.less";',
        javascriptEnabled: true,
        modifyVars: {
          "primary-color": "#1890ff", // 全局主色
          "link-color": "#1890ff", // 链接色
          "success-color": "#52c41a", // 成功色
          "warning-color": "#faad14", // 警告色
          "error-color": "#f5222d", // 错误色
          "font-size-base": "16px", // 主字号
          "heading-color": "rgba(0, 0, 0, 0.85)", // 标题色
          "text-color": "rgba(0, 0, 0, 0.65)", // 主文本色
          "text-color-secondary": "rgba(0, 0, 0, 0.65)", // 次文本色
          "disabled-color": "rgba(0, 0, 0, 0.25)", // 失效色
          "border-radius-base": "4px", // 组件/浮层圆角
          "border-color-base": "#d9d9d9", // 边框色
          "box-shadow-base": "0 2px 8px rgba(0, 0, 0, 0.15)" // 浮层阴影
        }
      }
    }
  },
  server: {
    // host: '192.168.1.24',
    // proxy: {
    //   '^/general-virtual-simulation': {
    //     // target: 'https://xcloud.vivedm.com:8433', // 公司服务器 API地址
    //     // target: 'https://117.174.25.188:8433', // 公司服务器 API地址
    //     // target: 'http://192.168.1.23:6060', // 公司内网 API地址
    //     changeOrigin: true,
    //     /* rewrite: (path) => {
    //       return path.replace(/^\/api/, '')
    //     } */
    //   }
    // }
  }
})
