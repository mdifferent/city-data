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
          zoom: 5,
          roam: true
        },
        tooltip: {
          trigger: "item"
        },
        series: []
      },
      showChartList: false,
      chartData: [],
      currentOd: "o",
      districtMapData: {},
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
  },
  components: {
    SubHeader,
    MapView,
    PopulationChartBar
  },
  methods: {
    updateView() {
      this.resetView();
      switch (this.selectedFunc.command) {
        case 1:

          break;
        case 2:
          break;
      }
    },

    resetView() {
      this.chartData = [];
      this.districtMapData = {};
      this.mapSeries = [];
    },

    renderItem(params, api) {
      var context = params.context;
      var lngIndex = api.value(0);
      var latIndex = api.value(1);
      var coordLeftTop = [
        +(latExtent[0] + lngIndex * cellSizeCoord[0]).toFixed(6),
        +(lngExtent[0] + latIndex * cellSizeCoord[1]).toFixed(6)
      ];
      var pointLeftTop = getCoord(params, api, lngIndex, latIndex);
      var pointRightBottom = getCoord(params, api, lngIndex + 1, latIndex + 1);

      return {
        type: "rect",
        shape: {
          x: pointLeftTop[0],
          y: pointLeftTop[1],
          width: pointRightBottom[0] - pointLeftTop[0],
          height: pointRightBottom[1] - pointLeftTop[1]
        },
        style: api.style({
          stroke: "rgba(0,0,0,0.1)"
        }),
        styleEmphasis: api.styleEmphasis()
      };
    },

    getGridMapSeries(data) {
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
        data: data
      };
    },

    addGridTypeButtons() {
      let len = this.currentCity.length;
      var nameList = ["行政区域", "热点区域", "用户自定义区域"];
      if (len > 0) {
        //添加切换按钮控件
        this.btnControl = this.addMapBtnControl(nameList, this.mapDimHandler);
        this.mapDimHandler({
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

    async mapDimHandler(e) {
      var len = this.currentCity.length;
    }
  }
};
</script>