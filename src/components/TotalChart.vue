<!--首页统计图表模板（右侧）-->
<template>
  <div>
    <div :id="id" :style="style"></div>
  </div>
</template>

<script>
export default {
  name: "TotalChart",
  data() {
    return {
      chart: ""
    };
  },

  props: {
    id: String,
    width: {
      type: String,
      default: "400px"
    },
    height: {
      type: String,
      default: "300px"
    },
    option: {
      type: Object
    }
  },
  computed: {
    style() {
      return {
        height: this.height,
        width: this.width
      };
    }
  },
  mounted() {
    this.init();
  },
  watch: {
    option: function(newVal, oldVal) {
      if (this.chart) {
        if (newVal) {
          this.chart.setOption(newVal);
        } else {
          this.chart.setOption(oldVal);
        }
        this.chart.resize();
      } else {
        setTimeout(() => {
          this.init();
        }, 300);
      }
    }
  },
  methods: {
    init() {
      this.chart = this.$echarts.init(document.getElementById(this.id));
      this.chart.setOption(this.option);
      window.addEventListener("resize", this.chart.resize);
    }
  }
};
</script>