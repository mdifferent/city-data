<template>
  <div id="index_main">
    <el-row type="flex">
      <el-col :span="4">
        <div v-for="item in tableData" v-bind:key="item.title">
          <el-row>
            <el-col :span="24">
              <TotalAmount
                :title="item.title"
                :itemcount="item.count"
                :unit="item.unit"
                :url="item.url"
              ></TotalAmount>
            </el-col>
          </el-row>
        </div>
      </el-col>
      <el-col :span="16">
        <el-row type="flex">
          <el-col :span="24">
            <GeoMapView
              id="chinamap"
              :option="mapOption"
              :width="mapstyle.width"
              :height="mapstyle.height"
              :geoSelectedHandler="geomapSelectedHandler"
            ></GeoMapView>
          </el-col>
        </el-row>
        <el-row type="flex">
          <el-col v-for="item in chartData1" v-bind:key="item.id">
            <TotalChart :id="item.id" :option="item.option"></TotalChart>
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="4">
        <div v-for="item in chartData" v-bind:key="item.id">
          <el-row>
            <el-col :span="24">
              <TotalChart :id="item.id" :option="item.option"></TotalChart>
            </el-col>
          </el-row>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import TotalAmount from "./TotalAmount";
import TotalChart from "./TotalChart";
import GeoMapView from "./GeoMapView";
import { Promise } from "q";

export default {
  name: "MainPage",
  data() {
    return {
      tableData: [],
      chartData: [
        {
          id: "time",
          option: {}
        },
        {
          id: "distance",
          option: {}
        },
        {
          id: "comsume",
          option: {}
        }
      ],
      chartData1: [
        {
          id: "age",
          option: {}
        },
        {
          id: "gender",
          option: {}
        }
      ],
      mapOption: {},
      mapstyle: {
        width: "100%",
        height: "800px"
      },
      cityInfo: Array
    };
  },
  components: {
    TotalAmount,
    TotalChart,
    GeoMapView
  },
  mounted() {
    //获取系统总体数据
    this.getTotalData();
    //获取地图数据
    this.getScatterData();
  },
  methods: {
    //获取系统数据
    getTotalData() {
      this.$axios
        .get("index/")
        .then(response => {
          this.tableData = [
            {
              title: "接入城市",
              count: response.data.cityCount,
              unit: "座"
              //url: "https://cn.vuejs.org/images/logo.png"
            },
            {
              title: "覆盖范围",
              count: response.data.districtCount,
              unit: "个"
              //url: "https://cn.vuejs.org/images/logo.png"
            },
            {
              title: "覆盖用户",
              count: response.data.cuUserCount,
              unit: "人"
              //url: "https://cn.vuejs.org/images/logo.png"
            },
            {
              title: "统计指标",
              count: response.data.indexCount,
              unit: "项"
              //url: "https://cn.vuejs.org/images/logo.png"
            }
          ];
        })
        .catch(error => console.log(error));
    },

    getTimeDisData(city) {},

    //获取地图数据
    getScatterData() {
      this.$axios
        .get("/index/cityInfo")
        .then(response => {
          var scatterData = response.data;
          var series = this.getMapSeries(scatterData);
          this.mapOption = this.getMapOption(series);
        })
        .catch(error => console.log(error));
    },

    getMapSeries(scatterData) {
      var series = [];
      series.push({
        name: "地点",
        type: "effectScatter",
        coordinateSystem: "geo",
        /*zlevel: 1,
        rippleEffect: {
          brushType: "stroke"
        },
        label: {
          normal: {
            show: true,
            position: "right",
            formatter: "{c}"
          }
        },
        symbolSize: function(val) {
          return val[2] / 8;
        },
        itemStyle: {
          normal: {
            color: "#a6c84c"
          }
        },*/
        data: scatterData
      });
      return series;
    },

    getMapOption(series) {
      return {
        tooltip: {
          trigger: "item"
        },
        geo: {
          map: "china",
          label: {
            emphasis: {
              show: false
            }
          },
          itemStyle: {
            normal: {
              areaColor: "#87CEEB",
              borderColor: "#404a59"
            },
            emphasis: {
              areaColor: "#87CEEB"
            }
          }
        },
        series: series
      };
    },

    getPieData(city, type, title, index) {
      let url = `index/chart/${type}?city=${city}`;
      this.$axios
        .get(url)
        .then(response => {
          let series = this.getPieChartSeries(title, response.data);
          let option = this.getPieChartOption(title, series);
          this.$set(this.chartData1, index, { id: title, option: option });
        })
        .catch(error => console.log(error));
    },

    getPieChartSeries(title, data) {
      return {
        name: title,
        type: "pie",
        radius: ["50%", "70%"],
        avoidLabelOverlap: false,
        label: {
          normal: {
            show: false,
            position: "center"
          },
          emphasis: {
            show: true,
            textStyle: {
              fontSize: "30",
              fontWeight: "bold"
            }
          }
        },
        labelLine: {
          normal: {
            show: false
          }
        },
        data: data
      };
    },

    getPieChartOption(title, series) {
      return {
        title: {
          text: title
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        series: series
      };
    },

    getBarData(city, type, title, index) {
      let url = `index/chart/${type}?city=${city}`;
      this.$axios
        .get(url)
        .then(response => {
          let xData = response.data.map(d => d.name);
          let yData = response.data.map(d => d.value);
          let series = [this.getBarSeries(title, yData)];
          let option = this.getBarChartOption(title, xData, series);
          this.$set(this.chartData, index, { id: title, option: option });
        })
        .catch(error => console.log(error));
    },

    getBarSeries(title, yData) {
      return {
        name: title,
        type: "bar",
        barGap: 0,
        data: yData
      };
    },

    getBarChartOption(title, xData, series) {
      return {
        color: ["#006699", "#e5323e"],
        title: {
          text: title
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        xAxis: {
          data: xData,
          axisLabel: {
            interval: 0,
            rotate: 75
          }
        },
        yAxis: [
          {
            type: "value"
          }
        ],
        series: series
      };
    },

    geomapSelectedHandler(params) {
      //console.log(params)
      if (
        params.seriesType === "effectScatter" &&
        params.seriesName === "地点"
      ) {
        let cityName = params.name + "市";
        this.getPieData(cityName, "age", "年龄分布", 0);
        this.getPieData(cityName, "gender", "性别分布", 1);
        this.getBarData(cityName, "time", "出行时间分布", 0);
        this.getBarData(cityName, "distance", "出行距离分布", 1);
        this.getBarData(cityName, "consume", "出行时耗分布", 2);
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
