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
      myChart: "",
      bmap: ""
    };
  },
  props: {
    option: Object,
    datas: Array
  },
  watch: {
    option(newVal) {
      this.myChart.setOption(newVal);
    },
    datas(datas) {
      this.updateMap(datas);
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.myChart = this.$echarts.init(document.getElementById("chart"));
      this.myChart.setOption(this.option);
      this.bmap = this.myChart
        .getModel()
        .getComponent("bmap")
        .getBMap();
    },
    updateMap(datas) {
      if (!this.bmap)
        this.bmap = this.myChart
          .getModel()
          .getComponent("bmap")
          .getBMap();
      this.bmap.clearOverlays();
      var count = datas.length;
      var pointArray = [];
      for (var i = 0; i < count; i++) {
        //绘制行政边界
        var ply = new window.BMap.Polygon(datas[i].polygon, {
          strokeWeight: 2,
          strokeColor: "#808080",
          fillColor: this.getColorBasedonValue(datas[i].data),
          fillOpacity: datas[i].data ? 0 : 1,
          enableMassClear: true
        });
        this.bmap.addOverlay(ply);
        pointArray = pointArray.concat(ply.getPath());

        //绘制区县名称
        var labelPosition = {
          position: new window.BMap.Point(datas[i].coord[0], datas[i].coord[1])
        };
        var label = new window.BMap.Label(datas[i].name, labelPosition);
        label.setStyle({
          color: "black",
          fontSize: "12px",
          height: "20px",
          fontFamily: "微软雅黑"
        });
        this.bmap.addOverlay(label);
      }
      this.bmap.setViewport(pointArray);
      /*this.bmap.setMapStyle({
        styleJson: [
          {
            featureType: "all",
            elementType: "all",
            stylers: {
              color: "#4682b4ff",
              hue: "#4682b4",
              visibility: "off"
            }
          }
        ]
      });*/
    },
    getColorBasedonValue(value) {
      if (!value) return "#FFFFFF"
      var colorCode = "";
      if (value < 25000) colorCode = "#F5DEB3";
      else if (value >= 25000 && value < 30000) colorCode = "#B8860B";
      else colorCode = "#8B4513";
      return colorCode;
    }
  }
};
</script>

