<!--
 * @Description: 首页
-->
<template>
  <section class="container">
    <div class="banner" :style="'background-image: url('+ bannerBg +')'">
      <div class="loginBtn">
        <div class="loginBtn-btn">
          <!-- 角色id: 1超级管理员 2管理员 3教师 4学生 5ilab用户 -->
          <a-button size="large" class="schoolOutside" @click="onTestEnter('schoolOutside')"
            v-if="$enums.ROLE.GET_ROLE(userState.userInfo?.role.toString()) == $enums.ROLE.GET_ROLE('5')"
          >
            校外实验入口
          </a-button>

          <ilab-binding :msg="userState.bindUserId ? 'unBinding' : 'binding'" 
            v-if="$enums.ROLE.GET_ROLE(userState.userInfo?.role.toString()) == $enums.ROLE.GET_ROLE('5')"
          ></ilab-binding>
          <a-button v-else size="large" type="primary" class="schoolIn" @click="onTestEnter('schoolIn')">校内实验入口</a-button>
        </div>
        <p>* 请使用谷歌浏览器进行访问</p>
      </div>
    </div>

    <!-- 两个视频 -->
    <div class="content">
      <div>
        <p>项目简介视频</p>
        <video class="video"
          :src="STATIC_SOURCE_URI + '/video/%E9%A1%B9%E7%9B%AE%E4%BB%8B%E7%BB%8D%E8%A7%86%E9%A2%91.mp4'"
          controls></video>
      </div>
      <div>
        <p>项目操作视频</p>
        <video class="video"
          :src="STATIC_SOURCE_URI + '/video/%E9%A1%B9%E7%9B%AE%E5%BC%95%E5%AF%BC%E8%A7%86%E9%A2%91.mp4'"
          controls></video>
      </div>
    </div>

    <!-- 项目数据 -->
    <div class="projectData">
      <p class="title">项目数据</p>
      <ul>
        <li>
          <p class="color-violet">68463</p>
          <span>累计浏览数</span>
        </li>
        <li>
          <p class="color-blue">54624</p>
          <span>累计实验数</span>
        </li>
        <li>
          <p class="color-gree">12549</p>
          <span>累计实验优秀数</span>
        </li>
        <li>
          <p class="color-yellow">13695</p>
          <span>累计实验合格数</span>
        </li>
        <li>
          <p class="color-red">2545</p>
          <span>累计实验不合格数</span>
        </li>
      </ul>

      <div class="echarts" ref="myCharts"></div>
    </div>
  </section>
</template>

<script>
import { defineComponent, ref, reactive, onMounted } from 'vue'
import conf from '@common/config'
import * as echarts from "echarts";
import axios from "@common/http";
import API from "@common/api";
import Enums from '@common/enums'
import Storage from '@common/utils/storage'
import IlabBinding from '@components/iLabBinding.vue'
import Config from '@common/config'

const { STATIC_SOURCE_URI } = conf; // 腾讯存储统一路径

export default defineComponent({
  name: 'Home',
  components: {
    IlabBinding: IlabBinding,
  },
  setup(props, ctx) {
    // 个人信息
    const userState = reactive({
      userInfo: Storage.getStorage(Enums.STORAGE.USER),
    });
    const bannerBg = STATIC_SOURCE_URI + '/images/home-banner.png'; // banner背景图
    let myCharts = ref(null); // echarts

    onMounted(() => {
      // axios.post(API.GET_USERINFO);
      // axios.post(API.throw); // 401 调用
      const chart = echarts.init(myCharts.value);
      // 绘制图表
      chart.setOption({
        color: ['#1890FF', '#91CC75', '#FAC858', '#EE6666'],
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        legend: {
          x: 'right',
          icon: 'rect',
          itemWidth: 28,
          itemHeight: 18, //修改icon图形大小
          data: ['总浏览数', '实验优秀数', '实验合格数', '实验不合格数']
        },
        grid: {
          left: '0%',
          right: '0%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [{
          type: 'category',
          data: ['4.9', '4.10', '4.11', '4.12', '4.13', '4.14', '4.15']
        }],
        yAxis: [{
          type: 'value'
        }],
        series: [{
            name: '总浏览数',
            type: 'bar',
            emphasis: {
              focus: 'series'
            },
            data: [690, 732, 701, 834, 890, 690, 900]
          },
          {
            name: '实验优秀数',
            type: 'bar',
            stack: '广告',
            emphasis: {
              focus: 'series'
            },
            data: [120, 132, 101, 134, 90, 130, 210]
          },
          {
            name: '实验合格数',
            type: 'bar',
            stack: '广告',
            emphasis: {
              focus: 'series'
            },
            data: [220, 182, 191, 234, 290, 230, 270]
          },
          {
            name: '实验不合格数',
            type: 'bar',
            stack: '广告',
            emphasis: {
              focus: 'series'
            },
            data: [150, 232, 201, 154, 190, 230, 310]
          }
        ]
      });
    });

    // 实验入口 点击事件
    const onTestEnter = (param) => {
      // 校外实验入口
      if (param == 'schoolOutside') {
        open(
          // `${Config.HOST}?token=` + Storage.getStorage(Enums.STORAGE.TOKEN) + '&userId='
        )
      } else if (param == 'schoolIn') { // 校内实验入口
        open(
          // `${Config.HOST}?token=` + Storage.getStorage(Enums.STORAGE.TOKEN) + '&userId='
        )
      }
    };
    return {
      userState,
      STATIC_SOURCE_URI,
      bannerBg,
      myCharts,
      onTestEnter
    };
  }
})
</script>

<style lang="less" scoped>
  .container {
    background-color: #fff;
    
    .banner {
      width: 100%;
      height: 0;
      padding-bottom: 31.25%;
      // background-image: url(../../assets/images/home-banner.png);
      background-repeat: no-repeat;
      background-size: 100%;
      position: relative;

      .loginBtn {
        text-align: center;
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        bottom: 1.1rem;
        
        .loginBtn-btn {
          display: flex;
          justify-content: center;
        }

        p {
          color: #FFF;
          padding-top: .2rem;
        }

        .schoolOutside {
          color: #40a9ff;
          margin-right: .6rem;
        }
      }
    }

    // 连个两个视频
    .content {
      width: 12rem;
      margin: 0 auto;
      padding: .5rem 0;
      display: flex;
      justify-content: space-between;

      div {
        width: 5.44rem;

        p {
          padding: 0 0 .2rem 0;
          font-weight: bold;
          line-height: 22px;
        }

        .video {
          width: 100%;
          height: 3.06rem;
        }
      }
    }

    // 项目数据
    .projectData {
      width: 12rem;
      margin: 0 auto;
      padding: .2rem 0;

      .title {
        font-weight: bold;
      }

      ul {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: .42rem 0;

        li {
          text-align: center;

          p {
            font-size: .32rem;
            padding-bottom: .1rem;
          }

          span {
            color: rgba(0, 0, 0, 0.65);
          }

          .color-violet {
            // 紫色
            color: #3631C6;
          }

          .color-blue {
            // 蓝色
            color: #1890FF;
          }

          .color-gree {
            // 绿色
            color: #91CC75;
          }

          .color-yellow {
            // 黄色
            color: #FAC858;
          }

          .color-red {
            // 红色
            color: #EE6666;
          }
        }
      }

      // echarts 图标
      .echarts {
        width: 100%;
        height: 4.5rem;
      }
    }
  }
</style>
