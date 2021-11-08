<!--
 * @Description: 后台管理 -> 数据管理 -> 可视化分析 组件
-->
<template>
  <section class="visual-analysis">
    <div class="basic">
      <p>实训基本情况</p>
      <div class="statistics">
        <div>
          <p>{{ basicInfor.trainees }}</p>
          <span>实训人数</span>
        </div>
        <div>
          <p>{{ basicInfor.duration }}</p>
          <span>平均实训时长</span>
        </div>
        <div>
          <p>{{ basicInfor.average }}</p>
          <span>总分平均分</span>
        </div>
      </div>
    </div>
    
    <div class="echart-view">
      <div class="echart-view-1">
        <p>实训分数段分布</p>
        <div class="echart" ref="echart_1"></div>
      </div>
      <div class="echart-view-2">
        <p>各部分整体平均分</p>
        <div class="echart" ref="echart_2"></div>
      </div>
    </div>
  </section>
</template>

<script>
import { defineComponent, reactive, ref, onMounted } from 'vue'
import * as echarts from "echarts";

// 实训分数段分布
const echart_1 = ref(null);
const PieChart = () => {
  const PieChart = echarts.init(echart_1.value);
  PieChart.setOption({ // 绘制图表
    color: ['#2E87E1','#FF5353', '#F75789', '#FF9D2F', '#23CA98'],
    tooltip: {trigger: 'item'},
    series: {
      type: 'pie',
      radius: '60%',
      center: ['50%', '50%'],
      label: {
        fontSize: 15,
        formatter: '{b} {d}%',
      },
      data: [
        {value: 148, name: '50-60', label: { color: 'rgba(46, 135, 225, 1)' }},
        {value: 735, name: '60-70', label: { color: 'rgba(255, 83, 83, 1)' }},
        {value: 580, name: '70-80', label: { color: 'rgba(247, 87, 137, 1)' }},
        {value: 484, name: '80-90', label: { color: 'rgba(255, 157, 47, 1)' }},
        {value: 300, name: '90-100', label: { color: 'rgba(35, 202, 152, 1)' }}
      ]
    }
  });
};

// 各部分整体平均分
const echart_2 = ref(null);
const HistogramChart = () => {
  const HistogramChart = echarts.init(echart_2.value);
  HistogramChart.setOption({ // 绘制图表
    tooltip: {trigger: 'item'},
    xAxis: {
      type: 'category',
      data: ['自定义1', '自定义2', '自定义3', '自定义4', '自定义5', '自定义6']
    },
    yAxis: {
      type: 'value'
    },
    series: [{
      barWidth: 35,
      data: [20, 30, 50, 80, 70, 40],
      type: 'bar',
      itemStyle: {
        normal: {
          //这里是重点
          color: function(params) {
            //注意，如果颜色太少的话，后面颜色不会自动循环，最好多定义几个颜色
            var colorList = ['#2E87E1','#2E87E1', '#2E87E1', '#2E87E1', '#FF5353','#FF5353'];
            return colorList[params.dataIndex]
          }
        }
      }
    }]
  });
};

export default defineComponent({
  name: 'VisualAnalysis',
  props: {
    msg: { type: String, defualt: '默认值' }
  },
  components: {},
  setup(props, ctx) {
    // 实训基本情况
    const basicInfor = reactive({
      trainees: '2,258', // 实训人数
      duration: '1h53min', // 平均实训时长
      average: '83.5' // 总分平均分
    });
    
    onMounted(() => {
      // 实训分数段分布
      PieChart();
      // 各部分整体平均分
      HistogramChart();
    });
    
    return {
      basicInfor,
      echart_1,
      echart_2
    }
  }
});
</script>

<style lang="less" scoped>
.visual-analysis {
  padding: .24rem 0;
  border-top: 20px solid #FAFAFA;
  font-size: 16px !important;
  
  .basic {
    padding: 0 .24rem;
    border-bottom: 1px solid rgba(0, 0, 0, 0.15);
    
    .statistics {
      display: flex;
      justify-content: space-around;
      text-align: center;
      padding: 40px 0;
      
      p {
        height: 51px;
        font-size: 40px;
        font-family: DINPro;
        line-height: 51px;
        color: #1890FF;
        
      }
      
      span {
        color: #333333;
        opacity: 0.8;
        font-size: 14px;
      }
    }
  }
  
  .echart-view {
    padding: .24rem;
    display: flex;
    
    .echart-view-1 {
      flex: 1;
    }
    
    .echart-view-2 {
      flex: 1;
      
      p {
        padding-left: 30px;
      }
    }
    
    .echart {
      width: 80%;
      height: 350px;
      padding-top: .2rem;
    }
  }
}
</style>
