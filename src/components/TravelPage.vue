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
          <MapView :option="option"/>
        </el-col>
        <el-col :span="4">
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
      dimDef: [],
      selectedFunc: {
        text: "宏观指标",
        command: 1
      },
      option: { bmap: {} },
      showChartList: false,
      chartData: [],
      currentDate: "w",
      currentCuky: "cu",
      currentOd: "o"
    };
  },
  computed: {
    ...mapState({
      currentCity: state => state.currentCity
    })
  },
  watch: {
    currentCity(newVal) {
      this.updateView();
    }
  },
  mounted() {},
  components: {
    SubHeader,
    MapView,
    PopulationChartBar
  },
  methods: {
    updateView() {},
    funcHandler(func) {
      this.selectedFunc = func;
      switch (func.command) {
        case 1:
          var points = [];
          for (let j = 0; j < 10; ++j) {
            points.push([
              (116.4 + Math.random() / 10).toFixed(6),
              (39.9 + Math.random() / 10).toFixed(6),
              Math.floor(Math.random() * 70) + 1
            ]);
          }
          this.option = this.getMapOption([108.93, 34.27], points);
          break;
        case 2:
        case 3:
      }
    },

    //SubHeader维度变化回调函数
    dimHandler(dim) {
      if (dim === "原始数据") this.currentCuky = "cu";
      else if (dim === "扩样数据") this.currentCuky = "ky";
      this.updateView();
    },

    updateGeneralMap() {
      if (this.currentCity) {
        var len = this.currentCity.length;
        if (len > 0) {
          var cityName = this.currentCity[len - 1];
          var centerUrl = "basic/cityCoords?city=" + cityName;
          var centerCoordRq = this.$axios.get(centerUrl);
          var polygonUrl =
            "basic/districtPolygons?province=" +
            this.currentCity[0] +
            "&city=" +
            this.currentCity[1];
          var polygonReq = this.$axios.get(polygonUrl);
          var dataUrl =
            "trip/" +
            this.currentCuky +
            "?city=" +
            cityName +
            "&date=" +
            this.currentDate +
            "&od=" +
            this.currentOd +
            "&time=";
          var mapDataReq = this.$axios.get(dataUrl);

          this.$axios
            .all([centerCoordRq, polygonReq, mapDataReq])
            .then(
              this.$axios.spread((coordRes, polygonRes, dataRes) => {
                var coord = [coordRes.data[0].lng, coordRes.data[0].lat];
                var polygon = polygonRes.data;
                var data = dataRes.data;
                //TODO update map option
              })
            )
            .catch(error => console.log(error));
        }
      }
    },

    getMapOption(center, data) {
      return {
        animation: false,
        bmap: {
          center: center,
          zoom: 5,
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
            color: ["blue", "yellow", "red"]
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
    }
  }
};
</script>
