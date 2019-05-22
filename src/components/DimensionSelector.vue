<template>
  <div>
    <el-radio-group v-model="defaultRadio" size="medium" :change="handler" v-for="dim in dimDef" :key="dim.command">
      <el-radio-button :label="dim.label"></el-radio-button>
    </el-radio-group>
  </div>
</template>

<script>
export default {
  name: "DimensionSelector",
  data() {
    return {};
  },
  props: {
    dimDef: Array,
    defaultRadio: String,
    handler: Function
  }
};
</script>