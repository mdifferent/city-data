<template>
  <el-col>
    <div v-for="item in chartData" v-bind:key="item.id">
      <el-row>
        <el-col :span="24">
          <TotalChart :id="item.id" :option="item.option"></TotalChart>
        </el-col>
      </el-row>
    </div>
  </el-col>
</template>


<script>
import TotalChart from "../components/TotalChart";
export default {
  data() {
    return {
      chartDatas: []
    };
  },
  props: { chartData: Array },
  watch: {
    chartData(newVal) {
      this.chartDatas = newVal;
    }
  },
  components: {
    TotalChart
  }
};
</script>
