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
        <el-col :span="18">
          <MapView
            :option="option"
            :datas="districtMapData"
            :mapSeries="mapSeries"
            :btnControl="btnControl"
          />
        </el-col>
        <el-col :span="6">
          <PopulationChartBar v-if="showChartList" :chartData="chartData"/>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>

<script>
import SubHeader from "../components/SubHeader";
import MapView from "../components/MapView";
import PopulationChartBar from "../components/PopulationChartBar";

import { mapState } from "vuex";
import { Promise } from "q";

export default {
  name: "TravelPage",
  data() {
    return {
      funcDef: [
        {
          text: "宏观指标",
          command: 1
        },
        {
          text: "区域OD",
          command: 2
        },
        {
          text: "网格OD",
          command: 3
        }
      ],
      selectedFunc: {
        text: "网格OD",
        command: 3
      },
      option: {
        bmap: {
          center: [],
          zoom: 5,
          roam: true
        },
        series: []
      },
      showChartList: false,
      chartData: [],
      currentOd: "o",
      polygons: [],
      districtMapData: {},
      cityCenterCoord: [],
      mapSeries: [],
      btnControl: []
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
  watch: {
    async currentCity(newVal) {
      var result = await this.updateCityCenterCoord();
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
  async mounted() {
    this.updateView();
  },
  components: {
    SubHeader,
    MapView,
    PopulationChartBar
  },
  methods: {
    async updateView() {
      switch (this.selectedFunc.command) {
        case 1:
          this.mapSeries = [];
          this.districtMapData = await this.getGeneralDistrictData();
          this.showChartList = true;
          this.getGeneralChartData();
          break;
        case 2:
          this.showChartList = true;
          var odMapSeries = await this.getOdDataOnMap();
          this.updateMap(odMapSeries);
          this.getDistrictOdChartData();
          break;
        case 3:
          this.showChartList = false;
          this.chartData = [];
          var mapData = await this.getGridOdMapData();
          this.updateMap(mapData);
          break;
      }
    },

    //切换功能回调函数
    funcHandler(func) {
      this.selectedFunc = func;
      this.updateView();
    },

    //根据当前城市获取城市中心坐标
    updateCityCenterCoord() {
      return new Promise((resolve, reject) => {
        if (this.currentCity) {
          var len = this.currentCity.length;
          if (len > 0) {
            var cityName = this.currentCity[len - 1];
            //当前城市中心坐标
            var centerUrl = `basic/cityCoords?city=${cityName}`;
            var centerCoordRq = this.$axios
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

    //绘制地图以及上面的控件
    async updateMap(series) {
      if (this.cityCenterCoord.length == 0) {
        await this.updateCityCenterCoord();
      }
      this.option = this.getMapOption(this.cityCenterCoord, series);
    },

    //宏观指标：获取区县数据
    getGeneralDistrictData() {
      return new Promise((resolve, reject) => {
        var len = this.currentCity.length;
        var cityName = this.currentCity[len - 1];
        var dataUrl = `trip/${this.currentCuky}?city=${cityName}&date=${
          this.currentDate
        }&od=${this.currentOd}&time=`;
        this.$axios
          .get(dataUrl)
          .then(response => {
            var result = {
              data: response.data,
              colors: ["#FFFFE0", "#FFE4B5", "#FFFF00", "#FFD700", "#BDB76B"]
            };
            resolve(result);
          })
          .catch(error => {
            reject(error);
            console.log(error);
          });
      });
    },

    //区域OD: 获取地图出行数据
    getOdDataOnMap() {
      return new Promise((resolve, reject) => {
        var len = this.currentCity.length;
        var cityName = this.currentCity[len - 1];
        let intraUrl = `od/district/intra?city=${cityName}&date=${
          this.currentDate
        }&cuky=${this.currentCuky}&time=${this.currentTime}`;
        let intraReq = this.$axios.get(intraUrl);
        let interUrl = `od/district/inter?city=${cityName}&date=${
          this.currentDate
        }&cuky=${this.currentCuky}&time=${this.currentTime}`;
        let interReq = this.$axios.get(interUrl);
        this.$axios
          .all([intraReq, interReq])
          .then(
            this.$axios.spread((intraRes, interRes) => {
              let series = [
                this.getIntraSeries(intraRes.data.map(data => data.value))
                //this.getInterSeries(interRes.data)
              ];
              resolve(series);
            })
          )
          .catch(error => {
            reject(error);
            console.log(error);
          });
      });
    },

    //区域OD: 获取地图出行数据
    getIntraSeries(data) {
      return {
        id: "intra",
        name: "区内出行",
        type: "scatter",
        zlevel: 1,
        coordinateSystem: "bmap",
        data: data /*,
        symbolSize: function(val) {
          return val[2] / 10;
        },
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
        itemStyle: {
          normal: {
            color: "yellow",
            shadowBlur: 10,
            shadowColor: "#333"
          }
        }*/
      };
    },

    //区域OD: 获取地图出行数据
    getInterSeries(payload) {
      console.log(payload.length);
      var data = payload.map(p => {
        return {
          name: `${p.fromName} - ${p.toName}`,
          coords: p.coords,
          lineStyle: {
            color: "rgb(128, 128, 128)",
            width: 1,
            curveness: 1
          }
        };
      });
      return {
        id: "lines",
        name: "跨区出行",
        type: "lines",
        coordinateSystem: "bmap",
        large: true,
        data: data
      };
    },

    //绘制城市行政区县

    lineOption(xData, yoData, ydData) {
      return {
        xAxis: {
          type: "category",
          data: xData,
          nameRotate: 90
        },
        yAxis: {
          type: "value"
        },
        legend: {
          data: ["O Value", "D Value"]
        },
        series: [
          {
            name: "O Value",
            data: yoData,
            type: "line",
            lineStyle: {
              normal: {
                color: "#006699"
              }
            },
            smooth: true
          },
          {
            name: "D Value",
            data: ydData,
            type: "line",
            lineStyle: {
              normal: {
                color: "#e5323e"
              }
            },
            smooth: true
          }
        ]
      };
    },

    barOption(xData, yData, isVertical) {
      return {
        color: yData.map(data => data["color"]),
        legend: {
          data: yData.map(yData => yData["name"])
        },
        xAxis: [
          {
            type: isVertical ? "value" : "category",
            data: isVertical ? null : xData,
            axisLabel: {
              interval: 0,
              rotate: 40
            }
          }
        ],
        yAxis: [
          {
            type: isVertical ? "category" : "value",
            data: isVertical ? xData : null
          }
        ],
        series: yData.map(data => {
          return {
            name: data["name"],
            type: "bar",
            barGap: 0,
            data: data["value"]
          };
        })
      };
    },

    //宏观指标：图表
    getGeneralChartData() {
      let len = this.currentCity.length;
      if (len == 0) {
        console.error("未选择当前城市");
        this.chartData = [];
        return;
      }
      let cityName = this.currentCity[len - 1];
      let dateType = this.currentDate;
      let cuky = this.currentCuky;

      let allDayUrl = `trip/distribute/24hours?city=${cityName}&date=${dateType}&cuky=${cuky}`;
      let districtUrl = `trip/distribute/district?city=${cityName}&date=${dateType}&cuky=${cuky}&time=`;
      let avgUrl = `trip/distribute/avg?city=${cityName}&date=${dateType}&cuky=${cuky}&time=`;

      this.$axios
        .get(allDayUrl)
        .then(response => {
          let data = response.data;
          let xData = data.map(curr => curr["name"]);
          let yoData = data.map(curr => (curr["value"][0] * 100).toFixed(3));
          let ydData = data.map(curr => (curr["value"][1] * 100).toFixed(3));
          let option = this.lineOption(xData, yoData, ydData);
          this.$set(this.chartData, 0, { id: "0", option: option });
        })
        .catch(error => {
          let option = this.lineOption([], [], []);
          this.$set(this.chartData, 0, { id: "0", option: option });
          console.log(error);
        });

      this.$axios
        .get(districtUrl)
        .then(response => {
          let data = response.data;
          let xData = data.map(curr => curr["name"]);
          let yoData = data.map(curr => curr["value"][0]);
          let ydData = data.map(curr => curr["value"][1]);
          let yData = [
            {
              color: "#006699",
              name: "O Value",
              value: yoData
            },
            {
              color: "#e5323e",
              name: "D Value",
              value: ydData
            }
          ];
          let option = this.barOption(xData, yData, false);
          this.$set(this.chartData, 1, { id: "1", option: option });
        })
        .catch(error => {
          let option = this.barOption([], [], false);
          this.$set(this.chartData, 1, { id: "1", option: option });
          console.log(error);
        });

      this.$axios
        .get(avgUrl)
        .then(response => {
          let data = response.data;
          let xData = data.map(curr => curr["name"]);
          let yoData = data.map(curr => curr["value"][0]);
          let ydData = data.map(curr => curr["value"][1]);
          let yData = [
            {
              color: "#006699",
              name: "O Value",
              value: yoData
            },
            {
              color: "#e5323e",
              name: "D Value",
              value: ydData
            }
          ];
          let option = this.barOption(xData, yData, false);
          this.$set(this.chartData, 2, { id: "2", option: option });
        })
        .catch(error => {
          let option = this.barOption([], [], false);
          this.$set(this.chartData, 2, { id: "2", option: option });
          console.log(error);
        });
    },

    //区域OD: 获取地图出行数据
    getDistrictOdChartData() {
      this.chartData = [];
      let len = this.currentCity.length;
      if (len == 0) {
        console.error("未选择当前城市");
        return;
      }
      let cityName = this.currentCity[len - 1];

      let top10Url = `od/top10?city=${cityName}&date=${this.currentDate}&cuky=${
        this.currentCuky
      }`;
      let districtUrl = `od/percent?city=${cityName}&date=${
        this.currentDate
      }&cuky=${this.currentCuky}`;

      this.$axios
        .get(top10Url)
        .then(response => {
          let data = response.data;
          let xData = data.map(curr => curr["name"]);
          let yData = [
            {
              color: "#006699",
              name: "O Value",
              value: data.map(curr => curr["value"])
            }
          ];
          let option = this.barOption(xData, yData, true);
          this.$set(this.chartData, 0, { id: "0", option: option });
        })
        .catch(error => {
          let option = this.barOption([], [], true);
          this.$set(this.chartData, 0, { id: "0", option: option });
          console.log(error);
        });

      this.$axios
        .get(districtUrl)
        .then(response => {
          let data = response.data;
          let xData = data.map(curr => curr["name"]);
          let yData = [
            {
              color: "#006699",
              name: "O Value",
              value: data.map(curr => curr["value"])
            }
          ];
          let option = this.barOption(xData, yData, false);
          this.$set(this.chartData, 1, { id: "1", option: option });
        })
        .catch(error => {
          let option = this.barOption([], [], false);
          this.$set(this.chartData, 1, { id: "1", option: option });
          console.log(error);
        });
    },

    getGridOdMapData() {
      return new Promise((resolve, reject) => {
        var len = this.currentCity.length;
        var cityName = this.currentCity[len - 1];
        let gridOdUrl = `od/grid?city=${cityName}&date=${
          this.currentDate
        }&cuky=${this.currentCuky}&time=${this.currentTime}`;
        this.$axios
          .get(gridOdUrl)
          .then(response => {
            let data = [this.getInterSeries(response.data)];
            resolve(data);
          })
          .catch(error => {
            reject(error);
            console.log(error);
          });
      });

      /*let data = [this.getInterSeries([{
        fromName:"fromName",
        toName:"toName",
        value:1,
        coords:[[111.735,40.795],[111.720,40.820]]
      }])];
      resolve(data)
      })*/
    },

    getMapOption(center, series) {
      return {
        title: {
          id: "map",
          text: "map"
        },
        animation: false,
        bmap: {
          center: center,
          zoom: 5,
          roam: true
        },
        /*visualMap: {
          show: false,
          top: "top",
          min: 0,
          max: 1000,
          seriesIndex: 0,
          calculable: true,
          inRange: {
            color: ["blue", "yellow", "red"]
          }
        },*/
        series: series
      };
    }
  }
};
</script>
