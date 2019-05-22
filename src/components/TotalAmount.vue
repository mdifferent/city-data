
<!--首页系统指标模板（左侧）-->
<template>
  <el-row type="flex" align="middle">
    <el-col :span="8">
      <el-image :src="url" fit="cover"></el-image>
    </el-col>
    <el-col :span="16">
      <p>{{title}}</p>
      <el-row type="flex" align="middle">
        <el-col :span="20">
            <p>{{itemcount}}</p>
        </el-col>
        <el-col :span="4">
            <p>{{unit}}</p>
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