<template>
  <div>
    <div id="chart" :style="{width: '100%', height:'800px'}"></div>
  </div>
</template>

<script>
export default {
  name: "MapView",
  data() {
    return {
      myChart: ""
    };
  },
  props: {
    option: Object
  },
  watch: {
    option(newVal) {
      this.myChart.setOption(newVal);
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.myChart = this.$echarts.init(document.getElementById("chart"));
      this.myChart.setOption(this.option);
      var bmap = this.myChart
        .getModel()
        .getComponent("bmap")
        .getBMap();
      bmap.addControl(new window.BMap.MapTypeControl());
    }
  }
};
</script>

