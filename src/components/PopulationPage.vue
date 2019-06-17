<template>
  <el-container>
    <el-header>
      <SubHeader
        :funcDef="funcDef"
        :funcHandler="funcHandler"
        :selectedFuncText="selectedFunc.text"
      />
    </el-header>
    <el-main>
      <el-row>
        <el-col :span="20">
          <MapView
            :option="option"
            :datas="districtMapData"
            :mapSeries="mapSeries"
            :btnControl="btnControl"
          />
        </el-col>
        <el-col :span="4">
          <PopulationTimeSlider v-if="showSlider" :onTimeChange="onTimeChange" :onPlayClicked="onPlayClicked" :isAuto="isAuto" :value="dynamicTime"/>
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

import { mapState } from "vuex";
import { Promise } from "q";
import { clearInterval } from 'timers';

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
      option: { bmap: { center: [], zoom: 5, roam: true }, series: [] },
      showSlider: false,
      showChartList: false,
      mapstyle: {
        width: "100%",
        height: "650px"
      },

      //图表数据
      chartData: [],
      //动态人口时间点
      dynamicTime: 5,
      //地图chart
      mapSeries: [],
      districtMapData: {},
      btnControl: [],
      migrationType: "inter",
      migrationData: [],
      isAuto: false
    };
  },

  computed: {
    ...mapState({
      currentCity: state => state.currentCity,
      currentTime: state => state.currentTimeRange.command,
      currentDate: state => state.currentDateType.command,
      currentCuky: state => state.currentCuky
    })
  },
  components: {
    SubHeader,
    MapView,
    PopulationTimeSlider,
    PopulationChartBar
  },
  mounted() {
    this.updateView();
  },
  watch: {
    currentCity(newVal) {
      this.updateView();
    },
    currentTime(newVal) {
      this.updateView();
    },
    currentDate(newVal) {
      this.updateView();
    },
    currentCuky(newVal) {
      this.updateView();
    }
  },
  methods: {
    updateView() {
      this.funcHandler(this.selectedFunc);
    },
    //SubHeader功能变化回调函数
    async funcHandler(func) {
      this.selectedFunc = func;
      this.resetView();
      this.$nextTick(() => {
        switch (func.command) {
          case 1:
            this.refreshDynamicPopulationMap();
            break;
          case 2:
            this.showChartList = true;
            //渲染地图
            this.refreshEmploymentMap();
            //生成Chart
            this.refreshChartForEmployment();
            break;
          case 3:
            this.showChartList = true;
            this.refreshMigrationMap();
            break;
        }
      });
    },

    resetView() {
      this.showSlider = false;
      this.showChartList = false;
      this.chartData = [];
      this.mapSeries = [];
      this.btnControl = [];
      this.$nextTick(() => this.districtMapData = {});
    },

    //更新人口动态分布地图
    refreshDynamicPopulationMap() {
      if (this.currentCity) {
        this.showSlider = true;
        var len = this.currentCity.length;
        if (len > 0) {
          var cityName = this.currentCity[len - 1];
          var pointUrl = `pop/dynamic?city=${cityName}&date=${
            this.currentDate
          }&cuky=${this.currentCuky}&time=${this.dynamicTime}`;
          this.$axios
            .get(pointUrl)
            .then(response => {
              var points = response.data;
              let series = this.getDynamicSeries(points);
              this.option = this.getPopulationMapOption(series);
            })
            .catch(error => console.log(error));
        }
      }
    },

    //获取职住分析地图数据
    getDensityData(city) {
      return new Promise((resolve, reject) => {
        let url = `pop/density?city=${city}&cuky=${this.currentCuky}`;
        this.$axios
          .get(url)
          .then(response => {
            resolve(response.data);
          })
          .catch(error => {
            reject(error);
            console.error(error);
          });
      });
    },

    refreshEmploymentMap() {
      let len = this.currentCity.length;
      var nameList = ["居住人口", "就业人口", "流动人口"];
      if (len > 0) {
        //添加切换按钮控件
        this.btnControl = this.addMapBtnControl(
          nameList,
          this.employMapDimHandler
        );
        this.employMapDimHandler({
          srcElement: {
            tabIndex: 0
          }
        });
      } else {
        this.$alert("请先选择当前城市", "提示", {
          confirmButtonText: "确定"
        });
      }
    },

    //流动人口地图更新
    refreshMigrationMap() {
      var nameList = ["全国分布", "省内分布"];
      this.btnControl = this.addMapBtnControl(
        nameList,
        this.migrationMapDimHandler
      );
      this.migrationMapDimHandler({
        srcElement: {
          tabIndex: 0
        }
      });
    },

    addMapBtnControl(nameList, handler) {
      var controls = [];
      for (let i = 0; i < nameList.length; ++i) {
        controls.push({
          text: nameList[i],
          handler: handler
        });
      }
      return controls;
    },

    async employMapDimHandler(e) {
      var len = this.currentCity.length;
      var densityData = await this.getDensityData(this.currentCity[len - 1]);
      var colorSet = [
        ["lightyellow", "yellow", "gold", "khaki", "darkkhaki"],
        ["lightpink", "hotpink", "red", "crimson", "darkred"],
        ["lightcyan", "skyblue", "blue", "darkblue", "midnightblue"]
      ];

      var index = e.srcElement.tabIndex;
      densityData.map(d => (d.value = d.value[index]));
      this.districtMapData = { data: densityData, colors: colorSet[index] };
    },

    refreshChartForEmployment() {
      let len = this.currentCity.length;
      let titles = ["居住人口", "就业人口", "流动人口"];
      if (len > 0) {
        let cityName = this.currentCity[len - 1];
        let url = `pop/amount?city=${cityName}&cuky=${this.currentCuky}`;
        this.$axios
          .get(url)
          .then(response => {
            let xData = response.data.map(data => data.name);
            for (let i = 0; i < 3; ++i) {
              let yData = response.data.map(data => data.value[i]);
              let option = this.getPopulationChartOption(
                titles[i],
                xData,
                yData
              );
              this.$set(this.chartData, i, {
                id: i.toString(),
                option: option
              });
            }
          })
          .catch(error => {
            console.error(error);
          });
      } else {
        this.$alert("请先选择当前城市", "提示", {
          confirmButtonText: "确定"
        });
      }
    },

    //人口时间段变化回调函数
    onTimeChange(time) {
      this.dynamicTime = time;
      this.refreshDynamicPopulationMap();
    },

    onPlayClicked() {
      this.isAuto = !this.isAuto;
      if (this.isAuto) {
        var t = setInterval(() => {
          let newtime = this.dynamicTime + 1
          if (newtime >= 24) newtime = 5
          this.dynamicTime = newtime
          this.refreshDynamicPopulationMap();
        }, 2000);
      } else {
        clearInterval(t)
      }
    },

    getDynamicSeries(data) {
      return [
        {
          type: "heatmap",
          coordinateSystem: "bmap",
          data: data,
          pointSize: 5,
          blurSize: 6
        }
      ];
    },

    //获取人口动态分布百度地图option
    getPopulationMapOption(series) {
      return {
        animation: false,
        bmap: {
          zoom: 11,
          roam: true
        },
        visualMap: {
          show: false,
          min: 0,
          max: 10,
          seriesIndex: 0,
          calculable: true,
          inRange: {
            color: ["#FFFF00", "#FFA500", "#FF4500", "#FF0000"]
          }
        },
        series: series
      };
    },

    //生成职住分析图表option
    getPopulationChartOption(title, xData, yData) {
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
          type: "category",
          data: xData,
          axisLabel: {
            interval: 0,
            rotate: 90
          }
        },
        yAxis: [
          {
            type: "value"
          }
        ],
        series: [
          {
            type: "bar",
            data: yData
          }
        ]
      };
    },

    getMigrationData(migrationType) {
      return new Promise((resolve, reject) => {
        let len = this.currentCity.length;
        let url = `pop/migration/${migrationType}?city=${
          this.currentCity[len - 1]
        }&cuky=${this.currentCuky}`;
        this.$axios
          .get(url)
          .then(response => {
            resolve(response.data);
          })
          .catch(error => {
            console.error(error);
            reject(error);
          });
      });
    },

    //流动人口地图维度按钮click回调
    async migrationMapDimHandler(e) {
      var len = this.currentCity.length;
      //获取数据
      var index = e.srcElement.tabIndex;
      let migrationType = index == 0 ? "inter" : "intra";
      this.migrationData = await this.getMigrationData(migrationType);
      //更新地图
      let series = this.getMigrationMapOptionSeries(this.migrationData);
      this.option = this.getMigrationMapOption(series);
      //更新图表
      this.chartData = [
        { id: "0", option: this.getTransportPopChartOption(this.migrationData) }
      ];
    },

    //生成流动人口地图上的点线option
    getMigrationMapOptionSeries(migrationData) {
      var lineData = [];
      var scatterData = [];
      migrationData.forEach(d => {
        lineData.push({
          name: d.sourceName,
          coords: [d.sourceCoord, d.targetCoord],
          lineStyle: {
            color: "rgb(128, 128, 128)",
            width: 2,
            curveness: 0.4
          }
        });
        scatterData.push({
          name: d.sourceName,
          value: d.sourceCoord.concat(d.amount)
        });
      });

      var series = [];
      if (lineData.length > 0)
        series.push({
          name: "连线",
          type: "lines",
          coordinateSystem: "bmap",
          tooltip: {
            show: false
          },
          data: lineData
        });

      if (scatterData.length > 0) {
        series.push({
          name: "出发地",
          type: "effectScatter",
          coordinateSystem: "bmap",
          showEffectOn: "render",
          rippleEffect: {
            brushType: "stroke"
          },
          hoverAnimation: true,
          label: {
            normal: {
              formatter: "{b}",
              position: "right",
              show: true
            }
          },
          data: scatterData
        });
      }

      return series;
    },

    //生成流动人口地图option
    getMigrationMapOption(series) {
      var option = {
        bmap: {
          center: [],
          zoom: 10,
          roam: true
        },
        tooltip: {
          trigger: "item"
        },
        title: {
          text: "流动人口",
          left: "center",
          textStyle: {
            color: "#fff"
          }
        },
        series: series
      };
      return option;
    },

    //生成流动人口图表option
    getTransportPopChartOption(data) {
      data.sort((a, b) => a.amount - b.amount);
      var xData = data.map(d => d.sourceName);
      var yData = data.map(d => d.amount);
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
          data: xData
        },
        series: [
          {
            type: "bar",
            data: yData
          }
        ]
      };
      return option;
    }
  }
};
</script>