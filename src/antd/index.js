import { Button, Input, Form, Checkbox, Row, Col, ConfigProvider, Pagination, Empty } from 'ant-design-vue'

/**
 * @description Antd 组件 按需加载
 */
export default {
  install(Vue) {
    Vue.component(Button.name, Button)
    Vue.component(Form.name, Form)
    Vue.component(Form.Item.name, Form.Item)
    Vue.component(Input.name, Input)
    Vue.component(Input.Password.name, Input.Password)
    Vue.component(Checkbox.Group.name, Checkbox.Group)
    Vue.component(Checkbox.name, Checkbox)
    Vue.component(Row.name, Row)
    Vue.component(Col.name, Col)
    Vue.component(ConfigProvider.name, ConfigProvider)
    Vue.component(Pagination.name, Pagination)
  }
}