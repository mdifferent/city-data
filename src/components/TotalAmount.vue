
<!--首页系统指标模板（左侧）-->
<template>
  <el-row type="flex" align="middle">
    <!--<el-col :span="8">
      <el-image :src="url" fit="cover"></el-image>
    </el-col>-->
    <el-col :span="16">
      <h3 class="page_text">{{title}}</h3>
      <el-row type="flex" align="middle">
        <el-col :span="20">
            <h1 class="data_color">{{itemcount}}</h1>
        </el-col>
        <el-col :span="4">
            <p class="page_text">{{unit}}</p>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>


<script>
export default {
  name: "TotalAmount",
  data() {
    return {};
  },
  props: {
    title: String,
    itemcount: Number,
    unit: String,
    url: String
  }
};
</script>


