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

export default {
  name: "MainPage",
  data() {
    return {
      tableData: [],
      chartData: [
        {
          id: "time_dis",
          option: this.getTimeDisData("出行时间分布")
        },
        {
          id: "distance_dis",
          option: this.getDistanceDisData("出行距离分布")
        },
        {
          id: "comsume_dis",
          option: this.getDistanceDisData("出行时耗分布")
        }
      ],
      chartData1: [
        {
          id: "distance_dis1",
          option: {}
        },
        {
          id: "comsume_dis1",
          option: {}
        }
      ],
      mapOption: [],
      mapstyle: {
        width: "100%",
        height: "650px"
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
    this.getTotalData();
    this.getScatterData();
  },
  methods: {
    getTotalData() {
      this.$axios
        .get("index/")
        .then(response => {
          console.log(response.data);
          this.tableData = [
            {
              title: "接入城市",
              count: response.data.cityCount,
              unit: "座",
              url: "https://cn.vuejs.org/images/logo.png"
            },
            {
              title: "覆盖范围",
              count: response.data.districtCount,
              unit: "个",
              url: "https://cn.vuejs.org/images/logo.png"
            },
            {
              title: "覆盖用户",
              count: response.data.cuUserCount,
              unit: "人",
              url: "https://cn.vuejs.org/images/logo.png"
            },
            {
              title: "统计指标",
              count: response.data.indexCount,
              unit: "项",
              url: "https://cn.vuejs.org/images/logo.png"
            }
          ];
        })
        .catch(error => console.log(error));
    },
    getTimeDisData(title) {
      return {
        title: {
          text: title
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
        },
        yAxis: {
          type: "value"
        },
        series: [
          {
            data: [820, 932, 901, 934, 1290, 1330, 1320],
            type: "line",
            itemStyle: {
              normal: {
                color: "#00c1de",
                shadowBlur: 8,
                shadowColor: "#25d5f0",
                borderColor: "#00c1de",
                borderWidth: 2,
                backgroundColor: "transparent"
              }
            },
            areaStyle: {
              normal: {
                color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: "#00c1de"
                  },
                  {
                    offset: 1,
                    color: "rgba(0,0,0,0)"
                  }
                ])
              }
            }
          }
        ]
      };
    },

    getScatterData() {
      this.$axios.get("/index/cityInfo")
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
        zlevel: 1,
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
        },
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
    },

    getAgeData(city) {
      this.$axios.get("/index/age?city=" + city)
        .then(response => {
            return this.getPieChart("年龄分布", response.data)
        })
    },

    getGenderData(city) {
      this.$axios.get("/index/gender?city=" + city)
        .then(response => {
            return this.getPieChart("性别分布", response.data)
        })
    },

    getPieChart(title, data) {
      return {
        title: {
          text: title
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        series: [
          {
            name: "访问来源",
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
          }
        ]
      };
    },
    getDistanceDisData(title) {
      return {
        title: {
          text: title
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        xAxis: {
          data: ["点", "击", "柱", "子", "或", "者"]
        },
        yAxis: [
          {
            type: "value"
          }
        ],
        series: [
          {
            // For shadow
            type: "bar",
            itemStyle: {
              normal: { color: "rgba(0,0,0,0.05)" }
            },
            barGap: "-100%",
            barCategoryGap: "40%",
            data: [500, 500, 500, 500, 500, 500],
            animation: false
          },
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
            data: [220, 182, 191, 234, 290, 330]
          }
        ]
      };
    },
    geomapSelectedHandler(param) {
      this.$message(param.batch[0].name);
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
