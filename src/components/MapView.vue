<template>
  <div>
    <div id="chart" :style="{width: '100%', height:'800px'}"></div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { Promise } from "q";

export default {
  name: "MapView",
  data() {
    return {
      myChart: "",
      bmap: "",
      centerCoord: [],
      //行政区划polygon键值对，用于染色
      polygons: {},
      //行政区划label键值对
      labels: {},
      //初始overlay缓存
      tempOverlay: [],
      buttons: null
    };
  },
  props: {
    option: Object,
    datas: Object,
    mapSeries: Array,
    btnControl: Array
  },
  computed: {
    ...mapState({
      currentCity: state => state.currentCity
    })
  },
  watch: {
    option(newVal) {
      if (newVal.bmap.center == undefined || newVal.bmap.center.length == 0)
        newVal.bmap.center = this.centerCoord;
      this.myChart.setOption(newVal);
      this.updateViewport(newVal);
    },
    /*
    {
      data:[{name:"区县名称",value:"数值"}],
      colors:[]
    }
     */
    async datas(newVal) {
      if (newVal.data) {
        await this.initPolygons();
        let data = this.calculateColor(newVal.data, newVal.colors);
        this.fillColorOfPolygons(data);
      } else {
        if (this.bmap) {
          this.resetOverlays();
        }
      }
    },
    mapSeries(newVal) {
      console.log(newVal)
      if (newVal instanceof Array) {
        this.$set(this.option, "series", newVal);
        this.myChart.setOption(this.option);
        this.updateViewport(this.option);
      }
    },
    btnControl(newVal) {
      if (newVal.length == 0) {
        if (this.buttons != null) {
          this.bmap.removeControl(this.buttons);
          this.buttons = null;
          return;
        }
        return;
      }
      function DimensionControl() {
        this.defaultAnchor = BMAP_ANCHOR_TOP_LEFT;
        this.defaultOffset = new window.BMap.Size(10, 10);
      }
      DimensionControl.prototype = new window.BMap.Control();
      DimensionControl.prototype.initialize = function(map) {
        var div = document.createElement("div");
        div.style.cursor = "pointer";
        newVal.forEach((val, index) => {
          var btn = document.createElement("button");
          btn.setAttribute("tabIndex", index);
          btn.onclick = val.handler;
          var btnText = document.createTextNode(val.text);
          btn.appendChild(btnText);
          div.appendChild(btn);
        });
        map.getContainer().appendChild(div);
        return div;
      };
      this.buttons = new DimensionControl();
      this.bmap.addControl(this.buttons);
    }
  },
  mounted() {
    this.init();
  },
  destroyed() {
    console.log("MapView Destroyed");
  },
  methods: {
    async init() {
      this.myChart = this.$echarts.init(document.getElementById("chart"));
      this.centerCoord = await this.getCenterCoord();
      this.option.bmap.center = this.centerCoord;
      this.myChart.setOption(this.option);
      this.bmap = this.myChart
        .getModel()
        .getComponent("bmap")
        .getBMap();
      this.tempOverlay = this.bmap.getOverlays();
    },

    async initPolygons() {
      let polygon = await this.getDistrictPolygon();
      this.drawDistrict(polygon);
    },

    //在切换回不需要polygon的场景时清理polygons
    resetOverlays() {
      this.bmap.clearOverlays();
      this.tempOverlay.forEach(o => this.bmap.addOverlay(o));
      this.polygons = {};
      this.labels = {};
    },

    updateViewport(newVal) {
      if (newVal.series.length > 0) {
        var pointArray = [];
        newVal.series.forEach(s => {
          if (s.type === "lines") {
            s.data.forEach(d => {
              pointArray.push(
                new window.BMap.Point(d.coords[0][0], d.coords[0][1])
              );
            });
          } else if (s.type === "scatters" || s.type === "effectScatter") {
            s.data.forEach(d => {
              pointArray.push(new window.BMap.Point(d.value[0], d.value[1]));
            });
          } else if (s.type === "heatmap") {
            s.data.forEach(d => {
              pointArray.push(new window.BMap.Point(d[0], d[1]));
            });
          }
        });
        this.bmap.setViewport(pointArray);
      }
    },

    getCenterCoord() {
      return new Promise((resolve, reject) => {
        if (this.currentCity) {
          var len = this.currentCity.length;
          if (len > 0) {
            var cityName = this.currentCity[len - 1];
            //当前城市中心坐标
            var centerUrl = `basic/cityCoords?city=${cityName}`;
            this.$axios
              .get(centerUrl)
              .then(response => {
                let coord = [response.data[0].lng, response.data[0].lat];
                resolve(coord);
              })
              .catch(error => {
                reject(error);
                console.log(error);
              });
          }
        }
      });
    },

    //获取区县边界
    getDistrictPolygon() {
      return new Promise((resolve, reject) => {
        if (this.currentCity) {
          var len = this.currentCity.length;
          if (len > 0) {
            var cityName = this.currentCity[len - 1];
            //各区县中心坐标
            var districtCoordUrl = `basic/districtCoords?city=${cityName}`;
            var districtCoordReq = this.$axios.get(districtCoordUrl);
            //各区县行政区域边界
            var polygonUrl = `basic/districtPolygons?province=${
              this.currentCity[0]
            }&city=${this.currentCity[1]}`;
            var polygonReq = this.$axios.get(polygonUrl);
            this.$axios
              .all([districtCoordReq, polygonReq])
              .then(
                this.$axios.spread((disCoordRes, polygonRes) => {
                  var polygons = polygonRes.data;
                  var labels = disCoordRes.data;
                  labels.forEach(label => {
                    label.polygon = polygons[label.name];
                    //label.data = data[label.name];
                    label.coord = label.value;
                    delete label.value;
                  });
                  resolve(labels);
                })
              )
              .catch(error => {
                console.log(error);
                reject(error);
              });
          }
        } else {
          this.$alert("请先选择当前城市", "提示", {
            confirmButtonText: "确定"
          });
          reject("");
        }
      });
    },

    /*填充区县颜色
    [{"name":"区县名称",
      "value":"数值"
    "color":"颜色"}]*/
    fillColorOfPolygons(data) {
      if (Object.keys(this.polygons).length > 0) {
        data.forEach(d => {
          if (this.polygons[d.name]) {
            this.polygons[d.name].setFillColor(d.color);
            this.polygons[d.name].setFillOpacity(1);
            this.polygons[d.name].setStrokeOpacity(1);
          }
        });
      }
    },

    //根据data的value和颜色集计算各颜色覆盖的值域
    calculateColor(data, colorSet) {
      let dataLen = data.length;
      let colorLen = colorSet.length;
      if (dataLen > 0 && colorSet.length > 0) {
        data.sort((a, b) => a.value - b.value);
        if (colorLen < dataLen) {
          var lenForEachColor = Math.ceil(dataLen / colorLen);
          for (let i = 0, j = 0; i < dataLen; ++i) {
            data[i].color = colorSet[j];
            if (i % lenForEachColor == 0 && j < colorLen - 1) ++j;
          }
        } else {
          for (let i = 0; i < dataLen; ++i) {
            data[i].color = colorSet[i];
          }
          data[dataLen - 1].color = colorSet[colorLen - 1];
        }
        return data;
      }
    },

    /*绘制区县边界
    {
      name:"",
      polygon:""
      coord:[]
    }*/
    drawDistrict(datas) {
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
          strokeOpacity: 0,
          fillOpacity: 0,
          enableMassClear: true
        });
        //将polygon对象缓存起来，单独着色用
        this.polygons[datas[i].name] = ply;
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
        this.labels[datas[i].name] = label;
        this.bmap.addOverlay(label);
      }
      this.bmap.setViewport(pointArray);
    }
  }
};
</script>

