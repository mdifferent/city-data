<!--ECHart地图-->
<template>
  <div>
    <div :id="id" :style="style"></div>
  </div>
</template>

<script>
export default {
  name: "GeoMapView",
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
    option: {},
    geoSelectedHandler: Function
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
    option: function(newVal) {
      if (this.chart) {
        if (newVal) {
          this.chart.setOption(newVal);
        } 
        this.chart.resize();
      } else {
        setTimeout(() => {
          this.init();
        }, 300);
      }
    },
    geoSelectedHandler: function(newVal) {
      this.chart.on("click", newVal);
    }
  },
  methods: {
    init() {
      this.chart = this.$echarts.init(document.getElementById(this.id));
      this.chart.setOption(this.option);
      window.addEventListener("resize", this.chart.resize);
      this.chart.on("click", this.geoSelectedHandler);
    }
  }
};
</script>