<template>
  <div id="header">
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
        <el-radio-group v-model="radio1" size="medium" change="handleChange">
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
  </div>
</template>

<script>
export default {
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
      radio1: null,
      selectedOptions: []
    };
  },
  methods: {
    handleChange(value) {
      this.$message(value);
    }
  }
};
</script>