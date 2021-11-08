<!--
 * @Description: 后台管理 -> 用户管理 -> 教师管理 组件
-->
<template>
  <section class="user-manage-teacher">
    <div class="head">
      <div class="left">
      <!-- 新建 -->
        <newly-build @newlyAddedUserSuccess="newlyAddedUserSuccess"></newly-build>
        <!-- 列设置 -->
        <column-modify :allColumns="allColumns" @columnModifyPropsHanlde="columnModifyPropsHanlde"></column-modify>
      </div>
      <!-- 搜索 -->
      <div class="inputSearch">
        <a-input-search v-model:value="inputSearchValue" placeholder="请输入工号/姓名" enter-button="搜 索" size="large" @search="onSearch" />
      </div>
    </div>
    <!-- 多选展示栏 -->
    <div class="checkboxShow" v-show="stateLength > 1">
      <div class="color"><InfoCircleOutlined /></div>
      <div>已选择 <span class="color">{{ stateLength }}</span> 项</div>
      <div class="verticalLine"><MinusOutlined /></div>
      <!-- 批量删除 -->
      <div class="batchDelete cursor-pointer">
        <BatchDelete :batchDeleteStateProps="batchDeleteStateProps" @emailVerificetionSuccess="emailVerificetionSuccess" />
      </div>
    </div>

    <!-- 表格 -->
    <a-config-provider :locale="$zhCN">
      <div class="tables table-view table-style">
        <a-table 
          :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }" 
          :columns="columns" 
          :data-source="dataList" 
          @change="tableOnChange" 
          :pagination="false"
        >
          <!-- 序号 -->
          <!-- <template #number="{ record, index }"> -->
          <template #number="{ index }">
            <span>{{ index + 1 }}</span>
          </template>
          
          <template #handle="{ record }">
            <div class="handle">
              <span @click="deletHandle([record.id])">删除</span>
              <!-- 编辑 -->
              <edit :msg="record" @updataUserSuccess="updataUserSuccess"></edit>
            </div>
          </template>
        </a-table>

        <!-- 空数据 -->
        <div v-show="!dataList.length > 0" class="empty-view">
          <my-empty></my-empty>
        </div>
        
        <!-- 分页 -->
        <div v-show="dataList.length > 0" class="pagination-view">
          <a-config-provider :locale="$zhCN">
            <a-pagination
              :showQuickJumper='true'
              :total="paginationState.total"
              :show-total="total => `共 ${paginationState.total} 条记录  第 ${paginationState.currentPage}/${Math.ceil(paginationState.total/paginationState.pageSize)} 页`" 
              :page-size="paginationState.pageSize"
              @change="paginationOnChange"
              v-model:current="paginationState.currentPage"
            />
          </a-config-provider>
        </div>
      </div>
    </a-config-provider>
  </section>
</template>

<script>
import { defineComponent, reactive, ref, toRefs, computed, createVNode, watch } from 'vue'
import { PlusOutlined, InfoCircleOutlined, MinusOutlined, ExclamationCircleFilled } from '@ant-design/icons-vue'
import { Input, Table, Modal } from 'ant-design-vue'
import NewlyBuild from '@/views/BackstageManage/UserManage/Components/UserManageTeacherNewlyBuild.vue'
import Edit from '@/views/BackstageManage/UserManage/Components/UserManageTeacherEdit.vue'
import BatchDelete from '@/components/BatchDelete/index.vue'
import { UserManageServervice } from '@views/BackstageManage/UserManage/UserManage.js'
import MyEmpty  from '@components/Empty.vue'
import ColumnModify from '@components/ColumnModify.vue'

/************************* 表格数据、表头 *************************/
const columns = ref([]);
const allColumns = [ // 表格表头
  { title: '序号', slots: { customRender: 'number' }, show: true},
  { title: '工号', dataIndex: 'account', show: true }, // dataIndex和data的key值一一对应
  { title: '中文名', dataIndex: 'userName', show: true },
  {
    title: '角色',
    dataIndex: 'roleName', // dataIndex和data的key值一一对应
    filters: [],
    show: true
    // filters: [ { text: '管理员', value: '管理员', } ], // 筛选内容
    // filterMultiple: false, // 是否多选
    // onFilter: (value, record) => record.roleName.indexOf(value) === 0,
  },
  { title: '英文名', dataIndex: 'secondName', show: false },
  { title: '性别', dataIndex: 'sex', show: false },
  { title: '邮箱', dataIndex: 'email', show: true },
  { title: '操作', width: 140, slots: { customRender: 'handle' }, show: true }
];
const dataList = ref([]);
/************************* 表格数据、表头 结束 *************************/

export default defineComponent({
  name: 'UserManageTeacher',
  props: {
    msg: { type: String, defualt: '默认值' }
  },
  components: {
    PlusOutlined,
    InfoCircleOutlined,
    MinusOutlined,
    AInputSearch: Input.Search,
    ATable: Table,
    NewlyBuild,
    Edit,
    BatchDelete,
    Modal,
    MyEmpty,
    ColumnModify
  },
  setup(props, ctx) {
    // 分页配置
    const paginationState = reactive({
      total: 21, // 分页，总条数
      currentPage: 1, // 分页，当前页
      pageSize: 10 // 每页条数
    });

    // 批量删除状态
    const batchDeleteStateProps = ref('');

    // 搜索输入框
    const inputSearchValue = ref('');

    // 获取角色
    const getRoleLoad = async () => {
      const res = await UserManageServervice.getRoleLoad(); // 同使用 班级管理 里的“获取授课教师”请求 getTeacherLoad

      if (!res) return;

      // 获取角色后赋值
      // columns.value[3]?.filters = res;
      allColumns[3].filters = res;
      return res;
    };
    getRoleLoad();

    // 数据请求参数
    let params = reactive({
      pageNum: paginationState.currentPage, // 页数
      pageSize: paginationState.pageSize, // 每页条数
      selectRoles: [], // 角色 角色id: 1超级管理员 2管理员 3教师 4学生 5ilab用户
      param: '' // 搜索 模糊查询参数
    });

    // 分页数据加载、数据加载
    const dataListLoad = async () => {
      const res = await UserManageServervice.userListLoad(params);
      // console.log('res:', res);
      if (!res || !res.data) return;

      paginationState.total = res.total;
      dataList.value = res.data;
    };
    dataListLoad();

    // 搜索输入框 事件
    const onSearch = searchValue => {
      // 模糊查询 (搜索框值赋值本地存储)
      params.param = inputSearchValue.value;

      // 页码赋值
      paginationState.currentPage = 1;
      params.pageNum = 1; // 请求参数 页数

      dataListLoad();
    };
    
    // 表格改变时调用方法
    const tableOnChange = (pagination, filters, sorter) => {
      console.log('表格改变时调用方法', pagination, filters, sorter);
      // paginationState.currentPage = pagination.current;

      // 角色筛选
      params.selectRoles = filters.roleName;

      // 模糊查询 (搜索框值赋值本地存储值)
      params.param = inputSearchValue.value;

      // 页码赋值
      paginationState.currentPage = 1;
      params.pageNum = 1; // 请求参数 页数

      dataListLoad();
    };

    // 分页Change
    const paginationOnChange = (page, pageSize) => {
      // console.log('分页change:', page, 'pageSize:', pageSize)
      // 修改两个地方的数据原因：单独修改paginationState的数据不会同步到params里
      paginationState.currentPage = page; // 分页，当前页
      paginationState.pageSize = pageSize; // 每页条数
      params.pageNum = page; // 请求参数 页数
      params.pageSize = pageSize; // 请求参数 每页条数
      
      dataListLoad();
    };
    
    /************************* 多选 *************************/
    let stateLength = ref(0); // 多选数量
    // 多选
    const state = reactive({
      selectedRowKeys: [],
      // Check here to configure the default column 选中此处可配置默认列
      loading: false,
    });
    const hasSelected = computed(() => state.selectedRowKeys.length > 0);

    const start = () => {
      state.loading = true; // ajax request after empty completing

      setTimeout(() => {
        state.loading = false;
        state.selectedRowKeys = [];
      }, 1000);
    };

    const onSelectChange = selectedRowKeys => { // 取key字段值
      // console.log('selectedRowKeys changed: ', selectedRowKeys);
      state.selectedRowKeys = selectedRowKeys;
      stateLength.value = selectedRowKeys.length; // 获取多选长度
    };
    /************************* 多选 结束 *************************/
    
    // 删除 单条数据
    const deletHandle = (msg) => {
      // 删除当前数据
      Modal.confirm({
        // title: '确定要将该教师删除吗？',
        title: createVNode( 'div', { style: 'color: #000; font-size: 16px;', }, '确定要将该教师删除吗？', ),
        icon: createVNode(ExclamationCircleFilled),
        centered: true,
        okText: '删除',
        cancelText: '取消',
        content: createVNode( 'div', { style: 'color: #555658; font-size: 14px;', }, '删除后将不可恢复，你还要继续吗？', ),

        onOk() {
          // console.log('删除');
          // 在此进行删除操作，数据请求
          deletHandleService(msg);
        },

        onCancel() {
          console.log('取消');
        },

        class: 'test',
      });
    };

    // 验证码，接收子组件返回验证码
    let authCode = ref('');
    // 删除、批量删除
    const deletHandleService = async(param) => {
      // 恢复空状态(需放在更改之前，之后监听无效)
      batchDeleteStateProps.value = '';
      
      // 删除请求参数
      let objParam = '';
      if (!authCode.value) { // 删除
        objParam = {
          delUserIds: param
        };
      } else if (authCode.value) { // 批量删除，需携带验证码
        objParam = {
          authCode: authCode.value,
          delUserIds: param
        };
      }

      const res = await UserManageServervice.deleteUser(objParam);
      // 请求结束后，置空验证码
      authCode.value = '';
      // 30011 状态为：请选择权限范围内的教师进行批量删除 提示
      if (!res || res?.code == 30011) {
        if (res?.code == 30011) cannotDelete(res?.message);

        // 删除失败后关闭 批量删除 对话框
        batchDeleteStateProps.value = 'batchDeleteStatePropsError';
        return;
      }

      if (param.length > 1) {
        paginationState.currentPage = 1;
        params.pageNum = 1;

        // 批量删除成功，成功标识传入子组件，显示删除成功
        batchDeleteStateProps.value = 'batchDeleteStatePropsSuccess';
      } else {
        // 最后一条时返回上一页
        if (paginationState.currentPage > 1 && dataList.value.length <= 1) {
          paginationState.currentPage --;
          params.pageNum --;
        }
      }

      // 存储多选数据
      state.selectedRowKeys = [];
      stateLength.value = 0;

      dataListLoad();
    };
    
    // 操作频繁 提示 调用方法即可
    const frequentOperation = () => {
      Modal.warning({
        title: createVNode( 'div', { style: 'color: #000; font-size: 16px;', }, '操作频繁', ),
        content: createVNode( 'div', { style: 'color: #555658; font-size: 14px;', }, '请稍后继续', ),
        icon: createVNode(ExclamationCircleFilled),
        centered: true,
        okText: '知道了',
      });
    }
    
    // 无法直接删除 提示 调用方法即可。两种提示文字：一、请选择权限范围内的教师进行批量删除！二、该教师名下有班级，请在班级管理页面删除或指派给别的教师。 
    // cannotDelete('请选择权限范围内的教师进行批量删除！');
    const cannotDelete = (tipContent) => {
      Modal.warning({
        title: createVNode( 'div', { style: 'color: #000; font-size: 16px;', }, '无法直接删除', ),
        content: createVNode( 'div', { style: 'color: #FF4D4F; font-size: 14px;', }, tipContent, ),
        icon: createVNode(ExclamationCircleFilled),
        centered: true,
        okText: '知道了',
      });
    }

    // 新建用户成功（子组件传值给父组件提示）
    const newlyAddedUserSuccess = () => {
      dataListLoad();
    };

    // 编辑，更新，提交成功（子组件传值给父组件提示）
    const updataUserSuccess = () => {
      dataListLoad();
    };

    // 邮箱验证通过
    const emailVerificetionSuccess = (emit) => {
      authCode.value = emit;
      deletHandleService(state.selectedRowKeys);
    };

    // 列设置、列赋值（子组件传入）
    const columnModifyPropsHanlde = (param) => {
      columns.value = param;
    };

    return {
      inputSearchValue,
      onSearch,
      paginationState,
      paginationOnChange,
      
      dataList,
      columns,
      tableOnChange,
      
      ...toRefs(state),
      stateLength,
      start,
      onSelectChange,
      deletHandle,
      newlyAddedUserSuccess,
      emailVerificetionSuccess,
      batchDeleteStateProps,
      updataUserSuccess,

      allColumns,
      columnModifyPropsHanlde
    }
  }
});
</script>

<style lang="less" scoped>
.user-manage-teacher {
  width: 100%;
  height: 100%;
  background-color: #FFF;
  padding: .1rem 0;
  
  .head {
    display: flex;
    justify-content: space-between;
    padding-bottom: .20rem;

    .left {
      display: flex;
      align-items: center;
    }
    
    .inputSearch {
      width: 2.5rem;
    }
  }
  
  // 多选展示栏
  .checkboxShow {
    width: 100%;
    height: 44px;
    border: 1px solid @color-Blue-border;
    background-color: @color-Blue-bg;
    border-radius: 2px;
    margin-bottom: .1rem;
    display: flex;
    align-items: center;
    font-size: 16px;
    padding: 0 20px;
    
    .color {
      color: @color-Blue;
    }
    
    div {
      margin-right: 10px;
    }
    
    .batchDelete {
      margin-right: 20px;
    }
    
    .verticalLine {
      color: rgba(0, 0, 0, 0.15);
      transform: rotate(90deg);
    }
  }
  
  .handle {
    display: flex;
    
    span {
      color: @color-Blue;
      margin-right: .25rem;
      cursor: pointer;
    }
  }
}
</style>
