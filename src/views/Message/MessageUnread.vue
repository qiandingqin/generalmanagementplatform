<!--
 * @Description: 我的消息 -> 未读消息 组件
-->
<template>
  <section class="newsUnread">
    <span class="allRead" @click="knowHander(knowAllArray, 'all')">标记所有为已读</span>
    
    <ul v-show="dataList.length > 0" class="message-list-view">
      <li v-for="(items, index) in dataList" :key="'dataList' + index">
        <p v-if="items.id">{{ items.message }}<a-button type="link" v-if="items.particularPath" @click="detailsHander(items.particularPath)">查看详情</a-button></p>
        <p v-if="items.id">{{ getDate(items.createTime) }}<a-button type="link" @click="knowHander([items.id], 'one')">知道了</a-button></p>
      </li>
    </ul>
    
    <div v-show="dataList.length > 0" class="pagination-view">
      <a-pagination
        :total="paginationState.total"
        :show-total="total => `共 ${paginationState.total} 条记录  第 ${paginationState.currentPage}/${Math.ceil(paginationState.total/paginationState.pageSize)} 页`"
        :page-size="paginationState.pageSize"
        @change = "paginationOnChange"
        v-model:current="paginationState.currentPage"
      />
    </div>

    <!-- 空数据 -->
    <div v-show="!dataList.length > 0" class="empty-view">
      <my-empty 
        :imgUrlLast="emptyStateProps.imgUrlLast"
        :message="emptyStateProps.message"
      >
      </my-empty>
    </div>
  </section>
</template>

<script>
import { defineComponent, reactive, ref, watch, onMounted } from 'vue'
import { Empty } from 'ant-design-vue'
import { MessageLoad, KnowAxios, allKnowAxios } from './MessageService'
import { useRouter } from 'vue-router'
import MyEmpty  from '@components/Empty.vue'
import Enums from '@common/enums'
import Utils from '@/common/utils'

// 空数据 提示内容
const emptyStateProps = reactive({
  imgUrlFirst: '', // 图片路径 前面部分
  imgUrlLast: '/images/noData/noData-message.png', // 图片路径 后面部分
  imgHeight: '', // 高度
  message: '暂无消息',
  messageSmall: '' // 第二行内容
})

export default defineComponent({
  name: 'NewsUnread',
  props: {
    msg: { type: String, defualt: '默认值' },
    MessageUnreadProps: { type: Boolean, defualt: false }
  },
  components: {
    AEmpty: Empty,
    MyEmpty
  },
  setup(props, ctx) {
    const router = useRouter();
    // 分页配置
    const paginationState = reactive({
      total: 1, // 分页，总条数
      currentPage: 1, // 分页，当前页
      pageSize: 10 // 每页条数
    });
    
    // 列表数据
    let dataList = ref([{}]);
    // 标记为所有为已读 获取id参数
    let knowAllArray = ref([]);
    
    // 分页 变化监听
    const paginationOnChange = (pagination, filters) => {
      console.log('当前页：', pagination, '每页条数：', filters);
      paginationState.currentPage = pagination;
      paginationState.pageSize = filters;
      listData();
      // console.log('currentPage', paginationState.currentPage);
    };

    // 获取数据
    const listData = async () => {
      const res = await MessageLoad({
        pageNum: paginationState.currentPage, // 分页，当前页
        pageSize: paginationState.pageSize, // 每页条数
        isRead: 1 // 是否已读 0是 1 否
      });

      if (!res) {
        dataList.value = [];
        return;
      }

      paginationState.total = res.total;
      dataList.value = res.records;

      // 标记为所有为已读 获取id参数
      knowAllArray.value = [];
      for (let x in res.records) {
        knowAllArray.value.push(res.records[x].id)
      }
    };

    // 获取数据
    onMounted(() => {
      listData();
    });

    // 知道了、标记所有为已读 事件。 parmTpye: all标记所有为已读；one知道了
    const knowHander = async (parm, parmTpye) => {

      if (parmTpye == 'all') {
        const res = await allKnowAxios();
        if (!res) return;

        // 删除当前页全部 返回上一页
        paginationState.currentPage = 1;
      } else {
        const res = await KnowAxios(parm);
        if (!res) return;

        // 最后一条时返回上一页
        if (paginationState.currentPage > 1 && dataList.value.length <= 1) {
          paginationState.currentPage --;
        }
      }

      // 当点击了 我的消息 -> 未读消息 -> 点击“知道了” 后，Utils.MESSAGESTATE = true，进行Menu菜单数据请求，头部组件更新菜单微标数
      Utils.MESSAGESTATE = true;
      console.log(Utils.MESSAGESTATE)

      listData();
    };

    // 查看详情
    const detailsHander = (param) => {
      // console.log(param);
      router.push(param);
    };

    // 时间格式转换（后台给的格式为：2021-07-20T08:34:03.000+00:00 。需转换）
    const getDate = (param) => {
      let date = new Date(param);
      const year = date.getFullYear();
      let month = date.getMonth() + 1;
      let datas = date.getDate();
      let hours = date.getHours();
      let minutes = date.getMinutes();
      let seconds = date.getSeconds();
      function alterDate(params) {
        if (params < 10) {
          params = '0' + params;
        }
        if (!params) return;
        return params;
      }
      const myDate = year + ':' + alterDate(month)+ ':' + alterDate(datas) + ' ' + alterDate(hours) + ':' + alterDate(minutes) + ':' + alterDate(seconds);

      return myDate;
    }

    // 获取数据、修改页码
    const load = () => {
      paginationState.currentPage = 1;
      listData();
    };

    // 监听父级传入的值改变，改变表示父级 未读消息、历史消息切换
    watch(() => props.MessageUnreadProps, (count, prevCount) => {
      load();
    })
    
    return {
      emptyStateProps,
      paginationState,
      paginationOnChange,
      dataList,
      getDate,
      knowAllArray,
      knowHander,
      detailsHander
    }
  },
});
</script>

<style lang="less" scoped>
.newsUnread {
  padding: 0 .24rem .18rem .24rem;
  font-size: 16px;

  .allRead {
    position: absolute;
    top: 24px;
    right: 20px;
    cursor: pointer;
    color: @color-Blue;
  }
  
  .message-list-view {
    display: block;
    height: auto;
    min-height: 500px;
  
    li {
      border-bottom: 1px solid #9AA7BB;
      display: flex;
      padding: 0.18rem 0;
  
      p {
  
        &:first-child {
          color: #333333;
          flex: 1;
          height: 32px;
          line-height: 32px;
        }
  
        &:last-child {
          color: #8D8D8D;
        }
      }
    }
  }
  
  .empty-view {
    padding: 0.7rem 0;
    // height: calc(100vh - 0.6rem - 70px - 0.2rem - 0.20rem);
  }
}
</style>