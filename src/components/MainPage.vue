<template>
  <el-container>
    <el-header>
      <el-row type="flex" align="middle">
        <el-col :span="2">
          <p>首页</p>
        </el-col>
        <el-col :span="5">
          <el-cascader placeholder="城市" :options="options" filterable></el-cascader>
        </el-col>
        <el-col :span="7">
          <h1>城建设计手机数据可视化平台</h1>
        </el-col>
        <el-col :span="6">
          <el-radio-group v-model="radio1" size="small">
            <el-radio-button label="人口分布"></el-radio-button>
            <el-radio-button label="出行指标"></el-radio-button>
            <el-radio-button label="区域分析"></el-radio-button>
          </el-radio-group>
        </el-col>
        <el-col :span="4">
          <el-dropdown trigger="click">
            <span class="el-dropdown-link">
              用户
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>控制台</el-dropdown-item>
              <el-dropdown-item>注销</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-row>
    </el-header>

    <el-main>
      <el-row type="flex">
        <el-col :span="6">
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
        <el-col :span="12">
          <el-row type="flex">
            <el-col :span="24">
              <TotalChart id="chinamap" :option="mapoption" :width="mapstyle.width" :height="mapstyle.height"></TotalChart>
            </el-col>
          </el-row>
          <el-row type="flex">
            <el-col v-for="item in chartData1" v-bind:key="item.id">
              <TotalChart :id="item.id" :option="item.option"></TotalChart>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="6">
          <div v-for="item in chartData" v-bind:key="item.id">
            <el-row>
              <el-col :span="24">
                <TotalChart :id="item.id" :option="item.option"></TotalChart>
              </el-col>
            </el-row>
          </div>
        </el-col>
      </el-row>
    </el-main>

    <el-footer>
      <p>
        For a guide and recipes on how to configure / customize this project,
        <br>check out the
        <a
          href="https://cli.vuejs.org"
          target="_blank"
          rel="noopener"
        >vue-cli documentation</a>.
      </p>
    </el-footer>
  </el-container>
</template>

<script>
import TotalAmount from "./TotalAmount";
import TotalChart from "./TotalChart";

export default {
  name: "MainPage",
  data() {
    return {
      options: [
        {
          value: "beijing",
          label: "北京市"
        },
        {
          value: "hebei",
          label: "河北省",
          children: [
            {
              value: "shijiazhuang",
              label: "石家庄市"
            },
            {
              value: "baoding",
              label: "保定市"
            }
          ]
        }
      ],
      radio1: "人口分布",
      selectedOptions: [],
      tableData: [
        {
          title: "接入城市",
          count: 10,
          unit: "座",
          url: "https://cn.vuejs.org/images/logo.png"
        },
        {
          title: "覆盖范围",
          count: 10,
          unit: "个",
          url: "https://cn.vuejs.org/images/logo.png"
        },
        {
          title: "覆盖用户",
          count: 10,
          unit: "人",
          url: "https://cn.vuejs.org/images/logo.png"
        },
        {
          title: "统计指标",
          count: 10,
          unit: "项",
          url: "https://cn.vuejs.org/images/logo.png"
        }
      ],
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
          option: this.getPieChart("年龄分布")
        },
        {
          id: "comsume_dis1",
          option: this.getPieChart("性别分布")
        }
      ],
      mapoption: this.getChinaMap(),
      mapstyle: {
        width: "100%",
        height: "650px"
      }
    };
  },
  components: {
    TotalAmount,
    TotalChart
  },
  methods: {
    handleChange(value) {
      this.$message(value);
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
    getChinaMap() {
      return {
        tooltip: {
          trigger: "item",
          formatter: "{b}"
        },
        series: [
          {
            name: "中国",
            type: "map",
            mapType: "china",
            selectedMode: "single",
            label: {
              normal: {
                show: true
              },
              emphasis: {
                show: true
              }
            },
            data: []
          }
        ]
      };
    },
    getPieChart(title) {
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
            data: [
              { value: 335, name: "直接访问" },
              { value: 310, name: "邮件营销" },
              { value: 234, name: "联盟广告" },
              { value: 135, name: "视频广告" },
              { value: 1548, name: "搜索引擎" }
            ]
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
