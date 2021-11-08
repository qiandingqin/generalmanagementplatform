<!--
 * @Description: 我的班级 -> 班级成员
-->
<template>
  <section class="members-view">
    <ClassHeader title="返回班级列表" />

    <div class="table-view">
      <div class="title-view">查看班级成员</div>

      <div class="alert">
        <div class="alert-view" v-if="tableState.selected.length > 1">
          <InfoCircleFilled class="icon" />
          <span class="info-text">已选择 <b>{{tableState.selected.length}}</b> 项数据</span>
          <span class="info-line"></span>
          <a-button type="link" @click="onBatchRemove">批量移除</a-button>
        </div>
      </div>

      <a-config-provider :locale="$zhCN">
        <div class="tables table-view">
          <a-table 
            v-if="dataList.source.length > 0"
            :columns="dataList.columns" 
            :data-source="dataList.source" 
            :rowSelection="{onChange: onTableChange, columnWidth: 30}"
            @change="tableOnChange"
            :pagination="false"
            :loading="false" 
          >
            <template #index="{ index }">
              <span>{{ index + 1 }}</span>
            </template>
            <template #operation="{ record }">
              <div class="btn-view">
                <a-button class="btn delete" type="link" @click="onRemove([record.id])">移除</a-button>
              </div>
            </template>
          </a-table>

          <!-- 加入班级提示 未使用无数据组件 -->
          <div class="nodata-view" v-if="dataList.source.length <= 0">
            <img :src="$STATIC_SOURCE_URI + '/images/noData/noData-student.png'">
            <h3>还未有学生加入</h3>
            <p>复制班级号，立即邀请学生加入班级</p>
            <p>班级号：<span class="code">{{ classNumberQuery }}</span><Copy target=".code" /></p>
          </div>

          <!-- 分页 -->
          <div v-if="dataList.source.length > 0" class="pagination-view">
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

    </div>
  </section>
</template>

<script>
import { defineComponent, reactive, ref, createVNode, onMounted, onActivated } from 'vue'
import { Modal, Table, Pagination, message } from 'ant-design-vue'
import { InfoCircleFilled, ExclamationCircleFilled } from '@ant-design/icons-vue'
import Store from '@common/store'
import Copy from '@components/Copy.vue'
import ClassHeader from '@components/ClassHeader.vue'
import { ClassServervice } from './Class'
import { useRoute } from 'vue-router'

export default defineComponent({
  props: {
    msg: { type: [String, Number], default: 0 }
  },
  components: {
    InfoCircleFilled,
    APagination: Pagination,
    ClassHeader,
    ATable: Table,
    ExclamationCircleFilled,
    Copy
  },
  setup(props, ctx) {
    const route = useRoute()
    // 获取 班级id
    let classIdQuery = ref('');
    classIdQuery.value = route.query.classId
    // 获取 班级号
    let classNumberQuery = ref('');
    classNumberQuery.value = route.query.classNumber;

    // 分页配置
    const paginationState = reactive({
      total: 1, // 分页，总条数
      currentPage: 1, // 分页，当前页
      pageSize: 10 // 每页条数
    });

    // 数据请求参数
    let params = reactive({
      pageNum: paginationState.currentPage, // 页数
      pageSize: paginationState.pageSize, // 每页条数
      classId: classIdQuery.value, // 班级id
      asc: '', // 排序：1降序，0升序
      orderBy: 'create_time', // 排序字段
    });
    
    const store = Store.getStore();
    let dataList = reactive({
      columns: [
        { title: '序号', slots: { customRender: 'index' }, width: 100 },
        { title: '学号', dataIndex: 'account' },
        { title: '中文名', dataIndex: 'name', ellipsis: true },
        { title: '英文名', dataIndex: 'secondName', ellipsis: true },
        { title: '性别', dataIndex: 'sex', ellipsis: true },
        { title: '入班时间', dataIndex: 'date', ellipsis: true, sorter: (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime() },
        { title: '操作', dataIndex: 'operation', slots: { customRender: 'operation' }, width: 140 },
      ].map(x => {
        x.align = 'left'
        return x;
      }),
      source: [ // 表格数据
        // {key: 0, index: 1, account: 1001, name: '张学友', secondName: 英文名, sex: 男, date: '2021-01-10 15:33:33'}
      ]
    });

    // 表格操作数据
    let tableState = reactive({
      selected: [] // 批量移除值（存储批量移除选中值）
    });

    onActivated(() => {
      console.log("onActivated");
      // 获取 班级id
      classIdQuery.value = route.query.classId;
      classNumberQuery.value = route.query.classNumber;
      // 修改 班级id (请求参数，该值不会相应改变)
      params.classId = route.query.classId;

      // 多选 置空
      tableState.selected = [];
      
      dataListLoad();
    });

    // 数据列表加载
    const dataListLoad = async () => {
      let res = await ClassServervice.membersDataListLoad(params);

      if (!res || !res.data) return;

      paginationState.total = res.total;
      dataList.source = res.data;
    };

    // 表格选中项
    const onTableChange = (e) => {
      tableState.selected = e;
      // console.log(tableState.selected)
    }

    // 批量移除
    const onBatchRemove = () => {
      Modal.confirm({
        // title: '确定要将这 '+ tableState.selected.length + ' 名学生移除班级吗？',
        title: createVNode( 'div', { style: 'color: #000; font-size: 16px;', }, '确定要将这 '+ tableState.selected.length + ' 名学生移除班级吗？', ),
        icon: createVNode(ExclamationCircleFilled),
        centered: true,
        okText: '移除',
        cancelText: '取消',
        content: createVNode( 'div', { style: 'color: #555658; font-size: 14px;', }, '用户须知的信息，你还要继续吗？', ),
        
        onOk() {
          console.log('移除');
          // 在此进行删除操作，数据请求
          const paramService = {
            classId: classIdQuery.value,
	          userIds: tableState.selected
          }
          onRemoveData(paramService);
        },
        
        onCancel() {
          console.log('取消');
        },
        
        class: 'test',
      });
    }

    // 移除
    const onRemove = (param) => {
      
      Modal.confirm({
        title: createVNode( 'div', { style: 'color: #000; font-size: 16px;', }, '确定要将该学生移除班级吗？', ),
        icon: createVNode(ExclamationCircleFilled),
        centered: true,
        okText: '移除',
        cancelText: '取消',
        content: createVNode( 'div', { style: 'color: #555658; font-size: 14px;', }, '用户须知的信息，你还要继续吗？', ),
        
        onOk() {
          console.log('移除');
          // 在此进行删除操作，数据请求
          // console.log(param)
          const paramService = {
            classId: classIdQuery.value,
	          userIds: param
          }
          onRemoveData(paramService);
        },
        
        onCancel() {
          console.log('取消');
        },
        
        class: 'test',
      });
    }

    // 移除 学员
    const onRemoveData = async (param) => {
      const res = await ClassServervice.membersRemoveStudent(param)

      if(!res) return;

      // 改变页码
      if (tableState.selected.length > 1) {
        // 批量删除 返回第一页
        if (paginationState.currentPage > 1) {
          paginationState.currentPage = 1;
          params.pageNum = 1;
        }
      } else {
        // 单条删除 最后一条时返回上一页
        if (paginationState.currentPage > 1 && dataList.source.length <= 1) {
          paginationState.currentPage --;
          params.pageNum --;
        }
      }
      
      message.success('已移除学生！')
      // 多选 置空
      tableState.selected = [];

      dataListLoad();
    }
    
    // 表格改变时调用方法
    const tableOnChange = (pagination, filters, sorter) => {
      console.log('表格改变时调用方法', pagination, filters, sorter);

      // 排序：1降序，0升序
      if (sorter && sorter.order == 'descend') { // 降序
        params.asc = 1;
      } else if (sorter && sorter.order == 'ascend') { // 升序
        params.asc = 0;
      } else { // 无排序
        params.asc = '';
      }
      
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

    dataListLoad();

    return {
      paginationState,
      tableOnChange,
      dataList,
      paginationOnChange,
      tableState,
      onTableChange,
      onRemove,
      onBatchRemove,
      classNumberQuery
    }
  },
})
</script>

<style scoped lang="less">
.members-view {
  // padding:0 1.28rem;
  width: 16.64rem;
  margin: 0 auto;
}

.header-view {
  height: 0.7rem;
  display: flex;
  align-items: center;
  font-size: 0.16rem;
  color: rgba(0, 0, 0, 0.85);

  p {
    display: inline;
    cursor: pointer;
  }

  > span {
    padding-left: 0.08rem;
  }
}

.table-view {
  .title-view {
    height: 0.7rem;
    background-color: #fff;
    display: flex;
    align-items: center;
    padding:0 0.16rem;
    font-size: 0.16rem;
    color: rgba(0, 0, 0, 0.85);
    border-bottom: 1px solid rgba(0, 0, 0, 0.15);
  }
  
  .tables {
    padding:0 0.16rem;
    margin-bottom: .20rem;
    background-color: #fff;
    
    .btn-view {
      button {
        padding: 0;
        height: 20px;
      }
    }
  }
}

.alert {
  background-color: #fff;
  padding:0.08rem 0;
}

.alert-view {
  @padlr: 0.16rem;
  width:calc(100% - (@padlr * 2));
  margin:0 auto 0;
  padding:0 @padlr;
  height: 0.44rem;
  background: #E6F7FF;
  border: 1px solid #91D5FF;
  opacity: 1;
  border-radius: 2px;
  display: flex;
  align-items: center;

  .icon {
    font-size: 0.14rem;
    color: @color-Blue;
  }

  .info-text {
    font-size: 0.16rem;
    font-weight: 400;
    line-height: 22px;
    color: #000000;
    margin:0 0 0 0.09rem;

    b {
      color: @color-Blue;
    }
  }

  .info-line {
    display: inline-block;
    width: 1px;
    height: 0.14rem;
    background-color: #000;
    opacity: 0.15;
    margin:0 0.16rem;
  }

  button {
    padding:0;
    font-size: 0.16rem;
    line-height: 22px;
  }
}

.nodata-view {
  padding-top: 1rem;
  text-align: center;
  height: calc(100vh - 0.6rem - 0.7rem - 1rem - 0.16rem - 0.2rem);
  min-height: 5rem;

  h3 {
    margin:0.14rem 0 0.08rem;
    font-size: 0.16rem;
    line-height: .22rem;
    color: @color-Black-85;
    opacity: 0.85;
  }

  p {
    font-size: 0.16rem;
    line-height: .22rem;
    color: @color-Black-45;
    
    &:last-child {
      padding-top: .18rem;
      color: @color-Black-85;
    }
  }
}
</style>