<template>
  <el-container>
    <el-header>
      <el-row>
        <el-col :span="18">
          <SubHeader
            :funcDef="funcDef"
            :funcHandler="funcHandler"
            :selectedFuncText="selectedFunc.text"
          />
        </el-col>
        <el-col :span="6">
          <el-cascader
            placeholder="请选择区域"
            :options="regionSelectOption"
            @change="regionSelectHandler"
          />
        </el-col>
      </el-row>
    </el-header>
    <el-main>
      <el-row>
        <el-col :span="showChartList ? 18 : 24">
          <MapView
            :option="option"
            :datas="districtMapData"
            :mapSeries="mapSeries"
            :btnControl="btnControl"
          />
        </el-col>
        <el-col :span="showChartList ? 6 : 0">
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
  name: "GridPage",
  data() {
    return {
      funcDef: [
        {
          text: "职住分析",
          command: 1
        },
        {
          text: "来源去向分析",
          command: 2
        }
      ],
      selectedFunc: {
        text: "职住分析",
        command: 1
      },
      option: {
        bmap: {
          center: [],
          zoom: 8,
          roam: true
        },
        tooltip: {
          trigger: "item"
        },
        series: [],
        animation: false
      },
      showChartList: false,
      chartData: [],
      currentOd: "o",
      districtMapData: {},
      populationMapData: [],  //缓存当前区县人口数据
      mapSeries: [],
      btnControl: [],
      currentRegion: [],  //当前选择的区域[类型代码(1,2,3)， 名称]
      currentGrid: null,
      activeMapType: 0,
      regionSelectOption: [
        {
          label: "行政区域",
          value: 1,
          children: []
        },
        {
          label: "热点区域",
          value: 2,
          children: []
        },
        {
          label: "用户自定义区域",
          value: 3,
          children: []
        }
      ],
      regionList: {
        lazy: true,
        lazyLoad(node, resolve) {
          console.log("lazyload");
          let url = null;
          switch (node.value) {
            case 1:
              url = `/region/list/district?city=${this.currentCity}`;
              break;
            case 2:
              url = `/region/list/hot?city=${this.currentCity}`;
              break;
            case 3:
              break;
          }
          this.$axios
            .get(url)
            .then(response => {
              const nodes = response.data.result.map(d => {
                return {
                  label: d,
                  value: d,
                  leaf: true
                };
              });
              resolve(nodes);
            })
            .catch(error => {
              console.error(error);
            });
        }
      }
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
  async mounted() {
    this.updateView();
    this.getRegionList("district", 0);
    this.getRegionList("hot", 1);
  },
  components: {
    SubHeader,
    MapView,
    PopulationChartBar
  },
  methods: {
    funcHandler(func) {
      this.selectedFunc = func;
      this.updateView();
    },
    updateView() {
      this.resetView();
      switch (this.selectedFunc.command) {
        case 1:
          this.showChartList = true
          //this.getChartData();
          break;
        case 2:
          break;
      }
    },

    resetView() {
      this.chartData = [];
      this.mapSeries = [];
    },

    renderItem(params, api) {
      var centerLng = api.value(0);
      var centerLat = api.value(1);
      var value = api.value(2);
      var pointLeftTop = api.coord([centerLng - 0.0025, centerLat + 0.0025]);
      var pointRightTop = api.coord([centerLng + 0.0025, centerLat + 0.0025]);
      var pointLeftBottom = api.coord([centerLng - 0.0025, centerLat - 0.0025]);
      var color = this.calculateColor(value)
      return {
        type: "rect",
        shape: {
          x: pointLeftTop[0],
          y: pointLeftTop[1],
          width: pointRightTop[0] - pointLeftTop[0],
          height: pointLeftTop[1] - pointLeftBottom[1],
        },
        style: api.style({
          stroke: 'RGBA(220, 220, 220, 0.5)',
          fill: color,
        }),
        styleEmphasis: api.styleEmphasis()
      };
    },

    calculateColor(value) {
      let opacity = value == 0 ? 0 : 1;
      switch(this.activeMapType) {
        case 0: return `rgba(255, 255, 0, ${opacity})`;
        case 1: return `rgba(255, 0, 0, ${opacity})`;
        case 2: return `rgba(0, 0, 255, ${opacity})`;
      }
    },

    getGridMapSeries(data, index) {
      let dataItems = data.map(d => d.coords.concat(d.populations[index]));
      return {
        type: "custom",
        coordinateSystem: "bmap",
        renderItem: this.renderItem,
        animation: false,
        itemStyle: {
          emphasis: {
            color: "yellow"
          }
        },
        encode: {
          tooltip: 2
        },
        data: dataItems,
        animation: false
      };
    },

    addGridTypeButtons() {
      let len = this.currentCity.length;
      var nameList = ["居住人口", "就业人口", "流动人口"];
      if (len > 0) {
        //添加切换按钮控件
        this.btnControl = this.addMapBtnControl(nameList, this.mapDimHandler);
      } else {
        this.$alert("请先选择当前城市", "提示", {
          confirmButtonText: "确定"
        });
      }
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

    mapDimHandler(param) {
      this.activeMapType = param.srcElement.tabIndex
      this.mapSeries = [this.getGridMapSeries(this.populationMapData, this.activeMapType)]
    },

    getChartData() {
      var len = this.currentCity.length;
      var cityName = this.currentCity[len - 1];
      let ageUrl = `region/age/${this.currentRegion[0]}?city=${cityName}&region=${this.currentRegion[1]}&cuky=${
        this.currentCuky
      }`;
      this.$axios.get(ageUrl).then(response => {
        let xData = Object.keys(response.data);
        let yData = xData.map(x => response.data[x]);
        let option = this.getAgeBarOption(xData, yData);
        this.$set(this.chartData, 1, {
          id: "0",
          option: option
        });
      });

      let genderUrl = `region/gender/${this.currentRegion[0]}?city=${cityName}&region=${this.currentRegion[1]}&cuky=${
        this.currentCuky
      }`;
      this.$axios.get(genderUrl).then(response => {
        let xData = Object.keys(response.data).map(key => {
          return {
            name: key === "0" ? "女" : "男",
            value: response.data[key]
          };
        });
        let option = this.getGenderPieOption(xData);
        this.$set(this.chartData, 0, {
          id: "1",
          option: option
        });
      });
    },

    getAgeBarOption(xData, yData) {
      return {
        title: {
          text: "年龄分布"
        },
        xAxis: {
          type: "value"
        },
        yAxis: [
          {
            type: "category",
            data: xData,
            min: 0,
            max: 150,
            interval: 1
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

    getGenderPieOption(data) {
      return {
        title: {
          text: "性别分布"
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        series: [
          {
            type: "pie",
            radius: "55%",
            center: ["40%", "50%"],
            data: data
          }
        ]
      };
    },

    //获取行政区域和热点区域列表
    getRegionList(type, index) {
      var len = this.currentCity.length;
      let cityName = this.currentCity[len - 1];
      let districtUrl = `/region/list/${type}?city=${cityName}`;
      this.$axios
        .get(districtUrl)
        .then(response => {
          const nodes = response.data.map(d => ({
            label: d,
            value: d
          }));

          this.$set(this.regionSelectOption[index], "children", nodes);
        })
        .catch(error => {
          console.error(error);
        });
    },

    regionSelectHandler(e) {
      var len = this.currentCity.length;
      var cityName = this.currentCity[len - 1];
      this.currentRegion = [e[0] === 1 ? 'district' : 'hot', e[1]]
      this.showChartList = true
      this.getChartData();
      //获取区县中心并更新地图
      if (e[0] === 1) {
        let distirctUrl = `/basic/districtCoords?city=${cityName}&districts=${e[1]}`;
        this.$axios
          .get(distirctUrl)
          .then(response => {
            let district = response.data[0]
                this.$set(this.option, "bmap", {
                  center: district.value,
                  zoom: 10,
                  roam: true
                });
          })
          .catch(error => {
            console.error(error);
          });
      }

      let url = `/region/population/${this.currentRegion[0]}?city=${cityName}&region=${
        this.currentRegion[1]
      }&cuky=${this.currentCuky}`;
      this.$axios
        .get(url)
        .then(response => {
          this.populationMapData = response.data
          this.addGridTypeButtons()
          this.mapSeries = [this.getGridMapSeries(response.data, 0)];
        })
        .catch(error => {
          console.error(error);
        });
    }
  }
};
</script>