<template>
  <el-container>
    <el-header>
      <SubHeader
        :funcDef="funcDef"
        :funcHandler="funcHandler"
        :selectedFuncText="selectedFunc.text"
        :dimDef="dimDef"
        :dimHandler="dimHandler"
      />
    </el-header>
    <el-main>
      <el-row>
        <el-col :span="20">
          <MapView centerName="北京市" v-if="showBaiduMap" :option="option"/>
          <TotalChart
            id="citymap"
            :option="mapOption"
            :width="mapstyle.width"
            :height="mapstyle.height"
            v-if="showEChartMap"
          ></TotalChart>
          <GeoMapView
            id="geomap"
            :option="mapOption"
            :width="mapstyle.width"
            :height="mapstyle.height"
            v-if="showGeoMap"
            :geoSelectedHandler="geomapSelectedHandler"
          ></GeoMapView>
        </el-col>
        <el-col :span="4">
          <PopulationTimeSlider v-if="showSlider" :onTimeChange="onTimeChange"/>
          <PopulationChartBar v-if="showChartList" :chartData="chartData"/>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>

<script>
import SubHeader from "../components/SubHeader";
import MapView from "../components/MapView";
import TotalChart from "../components/TotalChart";
import GeoMapView from "../components/GeoMapView";

import PopulationTimeSlider from "../components/PopulationTimeSlider";
import PopulationChartBar from "../components/PopulationChartBar";

//MickData
import beijingData from "../static/mockData/beijingData.json";
import cityCoords from "../static/mockData/cityCoord.json";
import transportData from "../static/mockData/transportData.json";

export default {
  name: "PopulationPage",
  data() {
    return {
      funcDef: [
        {
          text: "人口动态分布",
          command: 1
        },
        {
          text: "职住分析",
          command: 2
        },
        {
          text: "流动人口",
          command: 3
        }
      ],
      dimDef: [],
      value: 5,
      selectedFunc: {
        text: "功能选择",
        command: 0
      },
      option: {},
      showSlider: false,
      showBaiduMap: false,
      showEChartMap: false,
      showChartList: false,
      showGeoMap: false,
      mapOption: {},
      mapstyle: {
        width: "100%",
        height: "650px"
      },
      chartData: [],

      geoMap: ""
    };
  },
  props: {
    currentCity: {
      type: String,
      default: "北京市"
    }
  },
  watch: {
    currentCity(newVal) {
      //TODO update current map
    }
  },
  components: {
    SubHeader,
    MapView,
    PopulationTimeSlider,
    TotalChart,
    PopulationChartBar,
    GeoMapView
  },
  methods: {
    //SubHeader功能变化回调函数
    funcHandler(func) {
      this.selectedFunc = func;
      switch (func.command) {
        case 1:
          //TODO get pos
          //TODO get data
          var pos = [116.404498, 39.915858];
          var points = [];
          for (let j = 0; j < 10; ++j) {
            points.push([
              (116.5 + Math.random() / 10).toFixed(6),
              (39.5 + Math.random() / 10).toFixed(6),
              Math.floor(Math.random() * 70) + 1
            ]);
          }
          this.showSlider = true;
          this.showBaiduMap = true;
          this.showEChartMap = false;
          this.showChartList = false;
          this.showGeoMap = false;
          this.dimDef = null;
          this.option = this.getPopulationMapOption(pos, points);
          break;
        case 2:
          this.showSlider = false;
          this.showBaiduMap = false;
          this.showEChartMap = false;
          this.showChartList = true;
          this.showGeoMap = false;
          this.dimDef = [
            {
              text: "居住人口",
              command: 1
            },
            {
              text: "就业人口",
              command: 2
            },
            {
              text: "流动人口",
              command: 3
            }
          ];
          //渲染地图
          var provinceName = this.getProvinceName();
          var cityResidentData = this.getPopulationData(
            provinceName,
            "居住人口"
          );
          this.mapOption = this.getEmployMapOption(
            provinceName,
            cityResidentData,
            "居住人口"
          );
          this.$nextTick(() => {
            this.showEChartMap = true;
          });
          //生成Chart
          var cityEmployData = this.getPopulationData(provinceName, "就业人口");
          var cityTempData = this.getPopulationData(provinceName, "流动人口");
          var cityResidentChartOption = this.getPopulationChartOption(
            "居住人口",
            cityResidentData
          );
          var cityEmployChartOption = this.getPopulationChartOption(
            "就业人口",
            cityEmployData
          );
          var cityTempChartOption = this.getPopulationChartOption(
            "流动人口",
            cityTempData
          );
          this.chartData = [
            {
              id: "1",
              option: cityResidentChartOption
            },
            {
              id: "2",
              option: cityEmployChartOption
            },
            {
              id: "3",
              option: cityTempChartOption
            }
          ];
          break;
        case 3:
          this.showSlider = false;
          this.showBaiduMap = false;
          this.showChartList = true;
          this.showEChartMap = false;
          this.showGeoMap = true;
          this.dimDef = [
            {
              text: "全国分布",
              command: 1
            },
            {
              text: "省内分布",
              command: 2
            }
          ];
          this.mapOption = this.getTempPopMapOption("china", "北京");
          this.chartData = [
            {
              id: "1",
              option: this.getTransportPopChartOption(transportData) //TODO get data
            }
          ];
          break;
      }
    },

    //SubHeader维度变化回调函数
    dimHandler(dim) {
      switch (this.selectedFunc.command) {
        case 2:
          var cityName = this.getProvinceName();
          var cityData = this.getPopulationData(cityName, dim);
          this.mapOption = this.getEmployMapOption(cityName, cityData, dim);
      }
    },

    //人口时间段变化回调函数
    onTimeChange(time) {
      //TODO get data range between time[0] and time[1]
      var pos = [116.404498, 39.915858];
      var points = [];
      for (let j = 0; j < 10; ++j) {
        points.push([
          (116.4 + Math.random() / 10).toFixed(6),
          (39.9 + Math.random() / 10).toFixed(6),
          Math.floor(Math.random() * 70) + 1
        ]);
      }
      this.option = this.getPopulationMapOption(pos, points);
    },

    //获取人口动态分布百度地图option
    getPopulationMapOption(center, data) {
      return {
        animation: false,
        bmap: {
          center: center,
          zoom: 14,
          roam: true
        },
        visualMap: {
          show: false,
          top: "top",
          min: 0,
          max: 100,
          seriesIndex: 0,
          calculable: true,
          inRange: {
            color: ["blue", "blue", "green", "yellow", "red"]
          }
        },
        series: [
          {
            type: "heatmap",
            coordinateSystem: "bmap",
            data: data,
            pointSize: 10,
            blurSize: 6
          }
        ]
      };
    },

    //根据当前城市选项获取城市名称，供职住分析使用
    getProvinceName() {
      var fullName = this.currentCity.split("/")[0].trim();
      return fullName.slice(0, -1);
    },

    //生成职住分析地图option
    getEmployMapOption(name, data, dim) {
      var color = [];
      switch (dim) {
        case "居住人口":
          color = ["lightyellow", "yellow", "gold", "khaki", "darkkhaki"];
          break;
        case "就业人口":
          color = ["lightpink", "hotpink", "red", "crimson", "darkred"];
          break;
        case "流动人口":
          color = ["lightcyan", "skyblue", "blue", "darkblue", "midnightblue"];
          break;
      }
      return {
        tooltip: {
          trigger: "item",
          formatter: "{b}<br/>{c}"
        },
        visualMap: {
          min: 0,
          max: 1000,
          text: ["High", "Low"],
          realtime: false,
          calculable: true,
          inRange: {
            color: color
          }
        },
        series: [
          {
            name: "中国",
            type: "map",
            mapType: name,
            selectedMode: "single",
            label: {
              normal: {
                show: true
              },
              emphasis: {
                show: true
              }
            },
            data: data
          }
        ]
      };
    },

    //获取职住分析地图数据
    getPopulationData(province, type) {
      //TODO: Request data
      /*this.$axios
        .get("../static/mockData/beijingData.json")
        .then(response => {
          this.$message(response.data);
          return response.data;
        })
        .catch(function(error) {
          //Console.error(error)
        });*/

      return beijingData;
    },

    //生成职住分析图表option
    getPopulationChartOption(title, data) {
      var xData = [];
      var yData = [];
      for (let i = 0; i < data.length; ++i) {
        xData.push(data[i].name);
        yData.push(data[i].value);
      }
      return {
        title: {
          text: title
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow"
          }
        },
        xAxis: {
          data: xData
        },
        yAxis: [
          {
            type: "value"
          }
        ],
        series: [
          {
            type: "bar",
            itemStyle: {
              normal: {
                color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: "#83bff6" },
                  { offset: 0.5, color: "#188df0" },
                  { offset: 1, color: "#188df0" }
                ])
              }
            },
            data: yData
          }
        ]
      };
    },

    //生成流动人口地图上的点线option
    getTempPopMapOptionSeries(targetCity) {
      var targetCityCoord = cityCoords[targetCity];
      var lineData = [];
      var scatterData = [];

      transportData.forEach(element => {
        this.$message(element["name"]);
        lineData.push([
          { coord: cityCoords[element["name"]] },
          { coord: targetCityCoord }
        ]);
        scatterData.push({
          name: element["name"],
          value: cityCoords[element["name"]].concat([element["value"]])
        });
      });

      var series = [];
      series.push({
        name: "连线",
        type: "lines",
        zlevel: 2,
        lineStyle: {
          normal: {
            color: "#a6c84c",
            width: 1,
            opacity: 0.4,
            curveness: 0.2
          }
        },
        data: lineData
      });
      //地点
      series.push({
        name: "地点",
        type: "effectScatter",
        coordinateSystem: "geo",
        zlevel: 1,
        rippleEffect: {
          brushType: "stroke"
        },
        label: {
          normal: {
            show: true,
            position: "right",
            formatter: "{b}"
          }
        },
        symbolSize: function(val) {
          return val[2] / 8;
        },
        itemStyle: {
          normal: {
            color: "#a6c84c"
          }
        },
        data: scatterData
      });

      return series;
    },

    //生成流动人口地图option
    getTempPopMapOption(province, targetCity) {
      var option = {
        backgroundColor: "#404a59",
        title: {
          text: "流动人口",
          left: "center",
          textStyle: {
            color: "#fff"
          }
        },
        tooltip: {
          trigger: "item"
        },
        geo: {
          map: province,
          label: {
            emphasis: {
              show: false
            }
          },
          selectedMode: "single",
          itemStyle: {
            normal: {
              areaColor: "#323c48",
              borderColor: "#404a59"
            },
            emphasis: {
              areaColor: "#2a333d"
            }
          }
        },
        series: this.getTempPopMapOptionSeries(targetCity)
      };
      return option;
    },

    //生成流动人口图表option
    getTransportPopChartOption(data) {
      var fromList = [];
      var valueList = [];
      for (let i = 0; i < data.length; ++i) {
        fromList.push(data[i].name);
        valueList.push(data[i].value);
      }
      var option = {
        title: {
          text: "客流来源"
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow"
          }
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: {
          type: "value",
          boundaryGap: [0, 0.01]
        },
        yAxis: {
          type: "category",
          data: fromList
        },
        series: [
          {
            type: "bar",
            data: valueList
          }
        ]
      };
      return option;
    },

    //流动人口全国地图点击回调函数
    geomapSelectedHandler(param) {
      var provinceName = param.batch[0].name.trim()
      this.$message(provinceName)
      this.mapOption = this.getTempPopMapOption("china", provinceName);
      this.chartData = [
        {
          id: "1",
          option: this.getTransportPopChartOption(transportData) //TODO get data
        }
      ];
    }
  }
};
</script>