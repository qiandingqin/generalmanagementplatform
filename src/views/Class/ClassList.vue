<!--
 * @Description: 我的班级 -> 班级列表
-->
<template>
  <section class="container primary">
    <div class="title-view">
      <h2>我的班级</h2>
    </div>

    <div class="search-view">
      <div class="left">
        <!-- 新建班级 -->
        <new-class @newClassSuccess="newClassSuccess"></new-class>
        <!-- 列设置 -->
        <column-modify :allColumns="allColumns" @columnModifyPropsHanlde="columnModifyPropsHanlde"></column-modify>
      </div>
      <div>
        <a-input-search v-model:value="searchValue" placeholder="请输入班级名或班级号" enter-button="搜索" @search="onSearch" size="large" />
      </div>
    </div>

    <!-- 表格 -->
    <div class="table-view table-style">
      <a-config-provider :locale="$zhCN">
        <a-table
          :columns="columns" 
          :data-source="dataList" 
          :pagination="false"
          @change="tableOnChange"
          :locale="{filterConfirm: '确定',filterReset: '重置'}"
        >
          <!-- 序号 -->
          <!-- <template #number="{ record, index }"> -->
          <template #number="{ index }">
            <span>{{ index + 1 }}</span>
          </template>
          
          <template #handle="{ record }">
            <a-button class="link" type="link">
              <router-link :to="{path: '/class/members', query: {classId:record.id, classNumber: record.classNumber}}">查看班级成员</router-link>
            </a-button>
            <a-button class="link" type="link">
              <router-link to="/class/achievement">查看班级成绩</router-link>
            </a-button>
          </template>
        </a-table>
      </a-config-provider>

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

  </section>
</template>

<script>
import { defineComponent, reactive, ref, computed, toRefs } from 'vue'
import { Pagination, ConfigProvider, Input, Table, Modal } from 'ant-design-vue'
import NewClass from '@views/Class/Dialog/NewClass.vue'
import MyEmpty  from '@components/Empty.vue'
import { ClassServervice } from './Class'
import ColumnModify from '@components/ColumnModify.vue'

/************************* 表格数据、表头 *************************/
// 班级 筛选数据
let gradeValue = ref([]);

const columns = ref([]);
const allColumns = [ // 表格表头
  { title: '序号', slots: { customRender: 'number' }, show: true },
  { title: '班级名', dataIndex: 'className', show: true },
  { title: '班级号', dataIndex: 'classNumber', show: true },
  { title: '年级', 
    dataIndex: 'grade',
    filters: gradeValue,
    show: true
    /* filters: [ { text: '2017', value: '2017', }, ], */ // 筛选内容
    // filterMultiple: false, // 是否多选
    // onFilter: (value, record) => record.grade.indexOf(value) === 0, // 前端筛选
    // width: '8%', // 设置宽度
  },// dataIndex和data的key值一一对应 // sorter: (a, b) => { return a > b ? 1 : -1 }, ,
  { title: '人数', dataIndex: 'peopleNumber', show: true },
  {
    title: '创建时间',
    dataIndex: 'createTime', // dataIndex和data的key值一一对应
    sorter: (a, b) => a, // 用后端排序，前端排序去掉
    show: true
    // sorter: (a, b) => new Date(a.createTime).getTime() - new Date(b.createTime).getTime() // 前端排序
  },
  { title: '操作',width: 270, slots: { customRender: 'handle' }, show: true }
];
let dataList = ref([]);
/************************* 表格数据、表头 结束 *************************/

export default defineComponent({
  name: 'ClassList',
  components: {
    APagination: Pagination,
    AConfigProvider: ConfigProvider,
    AInputSearch: Input.Search,
    ATable: Table,
    AModal: Modal,
    NewClass,
    MyEmpty,
    ColumnModify
  },
  setup() {
    // 分页配置
    const paginationState = reactive({
      total: 1, // 分页，总条数
      currentPage: 1, // 分页，当前页
      pageSize: 10 // 每页条数
    });
    // 搜索框值
    const searchValue = ref('');
    const loading = ref(false);

    // 数据请求参数
    let params = reactive({
      pageNum: paginationState.currentPage, // 页数
      pageSize: paginationState.pageSize, // 每页条数
      asc: '', // 排序：1降序，0升序
      orderBy: 'create_time', // 排序字段
      gradeName: [], // 年级
      param: '', // 搜索 模糊查询参数
    });

    // 获取年级
    const getGradeLoad = async () => {
      const res = await ClassServervice.getGrade("getGradeLoad");

      if (!res) return;

      // 获取年级后赋值
      allColumns[3].filters = res;
    };
    getGradeLoad();

    // 分页数据加载、数据加载
    const dataListLoad = async () => {
      const res = await ClassServervice.classListLoad(params);
      // console.log('res:', res);
      if (!res || !res.data) return;

      paginationState.total = res.total;
      dataList.value = res.data;
    };
    dataListLoad();
    
    // 搜索 事件
    const onSearch = () => {
      // console.log('搜索事件');
      // 模糊查询 (搜索框值赋值本地存储)
      params.param = searchValue.value;

      // 页码赋值
      paginationState.currentPage = 1;
      params.pageNum = 1; // 请求参数 页数

      dataListLoad();
    }

    // 表格改变时调用方法
    const tableOnChange = (pagination, filters, sorter) => {
      // console.log('表格改变时调用方法', pagination, filters, sorter);

      // 排序：1降序，0升序
      if (sorter && sorter.order == 'descend') { // 降序
        params.asc = 1;
      } else if (sorter && sorter.order == 'ascend') { // 升序
        params.asc = 0;
      } else { // 无排序
        params.asc = '';
      }

      // 年级筛选
      params.gradeName = filters.grade;
      
      // 模糊查询 (搜索框值赋值本地存储值)
      params.param = searchValue.value;

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
    
    // 新建班级 成功（子组件传值），重新加载数据
    const newClassSuccess = () => {
      dataListLoad();
    };

    // 列设置、列赋值（子组件传入）
    const columnModifyPropsHanlde = (param) => {
      columns.value = param;
    };
    
    return {
      gradeValue,
      onSearch,
      searchValue,
      columns,
      loading,
      paginationState,
      tableOnChange,
      paginationOnChange,
      dataList,

      newClassSuccess,

      allColumns,
      columnModifyPropsHanlde
    }
  },
})
</script>

<style lang="less" scoped>
@pageHeight: 0.6rem;

.mixins-card {
  height: 0.7rem;
  padding: 0.17rem 0.25rem;
  background-color: #fff;
  // margin-bottom: 0.03rem;
  display: flex;
  align-content: center
}

.container {
  // .mixins-container();
  width: 16.64rem;
  margin: 0 auto;
}

.title-view {
  .mixins-card();
  border-bottom: 1px solid rgba(0, 0, 0, .15);

  h2 {
    font-size: 0.16rem;
    color: #333333;
    display: flex;
    align-items: center
  }
}

.search-view {
  .mixins-card();
  height: auto;
  padding: 0.3rem 0.25rem;
  
  .left {
    display: flex;
    align-items: center;
  }

  > div:first-child {
    flex: 1;
  }

  > div:last-child {
    width: 3.6rem;
  }
}

.table-view {
  padding: 0 0.25rem;
  // margin-top: 0.2rem;
  // margin-bottom: calc();
  background-color: #fff;
  .link {
    // color:@formColor;
    height: 20px;
    padding: 0;
    margin-right: 40px;
    
    &:last-child {
      margin-right: 0;
    }
  }

  .table {
    :deep(.ant-table-content) {
      @bgc:#9AA7BB;

      td {
        color:#333;
      }

      tbody tr:last-child td {
        border-bottom-color:#fff;
      }
    }
  }
}

</style>
