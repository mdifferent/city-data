<template>
  <el-container>
    <el-header>
      <SubHeader
        :funcDef="funcDef"
        :funcHandler="funcHandler"
        :dateHandler="dateHandler"
        :timeHandler="timeHandler"
        :selectedFuncText="selectedFunc.text"
        :dimHandler="dimHandler"
      />
    </el-header>
    <el-main>
      <el-row>
        <el-col :span="20">
          <MapView :option="option"/>
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

//MockData
import transportData from "../static/mockData/transportData.json";
import provincePinyin from "../static/mockData/provincePinyin.json";
import provinceCapital from "../static/mockData/provinceCapital.json";

import { mapState } from "vuex";

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
      selectedFunc: {
        text: "人口动态分布",
        command: 1
      },
      option: { bmap: {} },
      showSlider: false,
      showChartList: false,
      mapstyle: {
        width: "100%",
        height: "650px"
      },
      chartData: [],

      //流动人口当前选择省份
      selectedProvince: null,
      selectedDim: null,
      currentDate: "w",
      currentTime: 5,
      currentCuky: "cu"
    };
  },

  computed: {
    ...mapState({
      currentCity: state => state.currentCity
    })
  },
  components: {
    SubHeader,
    MapView,
    PopulationTimeSlider,
    TotalChart,
    PopulationChartBar,
    GeoMapView
  },
  mounted() {
    this.resetView();
    this.updateView();
  },
  watch: {
    currentCity(newVal) {
      this.updateView();
    }
  },
  methods: {
    updateView() {
      switch (this.selectedFunc.command) {
        case 1:
          this.refreshDynamicPopulationMap();
          break;
      }
    },
    //SubHeader功能变化回调函数
    funcHandler(func) {
      this.selectedFunc = func;
      this.resetView();
      switch (func.command) {
        case 1:
          this.refreshDynamicPopulationMap();
          break;
        case 2:
          this.showChartList = true;
          //渲染地图
          this.refreshBaiduMap();
          //生成Chart
          this.refreshChartForEmployment();
          break;
        case 3:
          this.showChartList = true;
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
          //var mapOptionSeries = this.getTempPopMapOptionSeries("北京");
          this.mapOption = this.getTempPopMapOption("china", []);
          this.chartData = [];
          break;
      }
    },

    resetView() {
      this.showSlider = false;
      this.showBaiduMap = false;
      this.showChartList = false;
    },

    //更新人口动态分布地图
    refreshDynamicPopulationMap() {
      if (this.currentCity) {
        this.showSlider = true;
        var len = this.currentCity.length;
        if (len > 0) {
          var cityName = this.currentCity[len - 1];
          var pointUrl =
            "pop/dynamic?city=" +
            cityName +
            "&date=" +
            this.currentDate +
            "&cuky=" +
            this.currentCuky +
            "&time=" +
            this.currentTime;
          var pointReq = this.$axios.get(pointUrl);
          var centerCoordRq = this.$axios.get(
            "basic/cityCoords?city=" + cityName
          );
          this.$axios
            .all([pointReq, centerCoordRq])
            .then(
              this.$axios.spread((pointsRes, coordRes) => {
                var coord = [coordRes.data[0].lng, coordRes.data[0].lat];
                var points = pointsRes.data;
                this.option = this.getPopulationMapOption(coord, points);
              })
            )
            .catch(error => console.log(error));
        }
      }
    },

    refreshBaiduMap() {
      var provinceName = this.getProvinceName();
      var cityResidentData = this.getPopulationData(provinceName, "居住人口");
      this.mapOption = this.getEmployMapOption(
        provinceName,
        cityResidentData,
        "居住人口"
      );
      this.$nextTick(() => {
        this.showEChartMap = true;
      });
    },

    refreshChartForEmployment() {
      var provinceName = this.getProvinceName();
      var cityResidentData = this.getPopulationData(provinceName, "居住人口");
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
    },

    //SubHeader维度变化回调函数
    dimHandler(dim) {
      if (dim === "原始数据")
        this.currentCuky = "cu"
      else if (dim === "扩样数据")
        this.currentCuky = "ky"
      this.updateView()
    },

    dateHandler(date) {
      console.log(date)
      this.updateView()
    },

    timeHandler(time) {
      console.log(time)
      this.updateView()
    },

    getCityPinyin(provinceName) {
      return provincePinyin[provinceName];
    },

    getProvinceCapital(provinceName) {
      return provinceCapital[provinceName];
    },

    //人口时间段变化回调函数
    onTimeChange(time) {
      this.currentTime = time
      this.updateView()
    },

    //获取人口动态分布百度地图option
    getPopulationMapOption(center, data) {
      return {
        animation: false,
        bmap: {
          center: center,
          zoom: 12,
          roam: true
        },
        visualMap: {
          show: false,
          top: "top",
          min: 0,
          max: 20,
          seriesIndex: 0,
          calculable: true,
          inRange: {
            color: ["yellow", "red"]
          }
        },
        series: [
          {
            type: "heatmap",
            coordinateSystem: "bmap",
            data: data,
            pointSize: 10,
            blurSize: 10
          }
        ]
      };
    },

    //根据当前城市选项获取城市名称，供职住分析使用
    getProvinceName() {
      return "北京";
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
        lineData.push([
          { coord: cityCoords[element["name"]] },
          { coord: targetCityCoord }
        ]);
        scatterData.push({
          name: element["name"],
          value: cityCoords[element["name"]].concat([element["value"]]),
          tooltip: {
            trigger: "axis",
            formatter: "{b}: {c2}"
          }
        });
      });

      var series = [];
      if (lineData.length > 0)
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
      if (scatterData.length > 0)
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
    getTempPopMapOption(province, series) {
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
        series: series
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
    }

    //流动人口全国地图点击回调函数
    /*geomapSelectedHandler(param) {
      if (param !== null) {
        console.log(param);
        var provinceName = param.batch[0].name.trim();
        console.log(provinceName);
        if (provinceName === this.selectedProvince) {
          //Unselect
          console.log("Unselect");
          this.selectedProvince == null;
          this.chartData = [];
          this.mapOption = this.getTempPopMapOption("china", []);
        } else {
          //Select
          console.log("Select");
          this.selectedProvince = provinceName;
          var mapOptionSeries = this.getTempPopMapOptionSeries(provinceName);
          this.mapOption = this.getTempPopMapOption("china", mapOptionSeries);
          this.chartData = [
            {
              id: "1",
              option: this.getTransportPopChartOption(transportData) //TODO get data
            }
          ];
        }
      } else {
        console.log("param is null");
      }
    }*/
  }
};
</script>