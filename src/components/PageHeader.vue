<template>
  <div id="header">
    <el-row type="flex" align="middle">
      <el-col :span="2">
        <p class="page_text">首页</p>
      </el-col>
      <el-col :span="5">
        <el-cascader placeholder="城市" :options="options" filterable @change="changeCity"></el-cascader>
      </el-col>
      <el-col :span="10">
        <h1 class="page_text">城建设计手机数据可视化平台</h1>
      </el-col>
      <el-col :span="5">
        <el-radio-group v-model="radio1" size="medium" @change="onPageButtonClicked">
          <el-radio-button label="人口分布"></el-radio-button>
          <el-radio-button label="出行指标"></el-radio-button>
          <el-radio-button label="区域分析"></el-radio-button>
        </el-radio-group>
      </el-col>
      <el-col :span="2">
        <el-dropdown trigger="click">
          <span class="el-dropdown-link, page_text" >
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
  </div>
</template>

<script>
import { mapMutations, mapState } from "vuex";
export default {
  data() {
    return {
      options: [],
      radio1: null
    };
  },
  mounted() {
    this.getCityList();
  },
  computed: {
    ...mapState({
      currentCity: state => state.currentCity,
      currentPage: state => state.currentPage
    })
  },
  watch: {
    currentCity(newVal, oldVal) {
      if (oldVal.length == 0 && this.currentPage == null) {
        this.changePage('人口分布')
        this.radio1 = '人口分布'
      }
    }
  },
  methods: {
    ...mapMutations({
      changeCity: "changeCity",
      changePage: "changePage"
    }),
    onPageButtonClicked(newVal) {
      if (this.currentCity.length > 0) {
        this.changePage(newVal);
      } else {
        this.$alert("请先选择当前城市", "提示", {
          confirmButtonText: "确定"
        });
      }
    },
    getCityList() {
      this.$axios
        .get("index/city")
        .then(response => {
          this.options = response.data;
        })
        .catch(error => console.log(error));
    }
  }
};
</script>

<style>
.page_text {
  font-family:"Times New Roman",Georgia,Serif;
  font-weight:bolder;
  color: rgb(78, 170, 201);
}
.data_color {
  color: white;
}
</style>
