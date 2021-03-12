<template>
  <div class="px_quan">
       <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/about/reports' }"
        >首页</el-breadcrumb-item
      >
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>

    <div id="echars" style="width: 750px;height:400px;"></div>
  </div>
</template>
<script>
import * as echarts from "echarts";
import aaa from "./../../components/requert/index.js";
import _ from "lodash";
export default {
  props: {},
  data() {
    return {
      options: {
        title: {
          text: "堆叠区域图",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#6a7985",
            },
          },
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: [
          {
            boundaryGap: false,
          },
        ],
        yAxis: [
          {
            boundaryGap: false,
          },
        ],
      },
    };
  },
  mounted() {
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById("echars"));
    aaa({
      url: "reports/type/1",
    }).then((res) => {
      // 4. 准备数据和配置项
      const result = _.merge(res.data, this.options);
      // 5. 展示数据
      myChart.setOption(result);
    });
  },
  methods: {},
  components: {},
};
</script>

<style scoped lang="less">
.px_quan{
    padding: 20px 30px;
}
#echars{
    margin-top: 30px;
}
</style>
