<template>
  <div id="subheader">
    <el-row>
      <el-col :span="4">
        <TimeRangeSelector defaultText="日期选择" :rangeDef="dateRangeDef"/>
      </el-col>
      <el-col :span="4">
        <TimeRangeSelector defaultText="时间段选择" :rangeDef="timeRangeDef"/>
      </el-col>
      <el-col :span="4">
        <FunctionSelector
          :defaultText="selectedFuncText == null ? '功能选择' : selectedFuncText"
          :funcDef="funcDef"
          :handler="funcHandler"
        />
      </el-col>
      <el-col :span="12">
        <DimensionSelector :dimDef="dimDef" :handler="dimHandler" v-if="dimDef!==null"/>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import TimeRangeSelector from "../components/TimeRangeSelector";
import FunctionSelector from "../components/FunctionSelector";
import DimensionSelector from "../components/DimensionSelector";

export default {
  name: "SubHeader",
  data() {
    return {
      timeRangeDef: [
        {
          text: "早高峰",
          command: "1"
        },
        {
          text: "晚高峰",
          command: "2"
        },
        {
          text: "全日",
          command: "3"
        },
        {
          text: "自定义...",
          command: "0"
        }
      ],
      dateRangeDef: [
        {
          text: "工作日",
          command: "1"
        },
        {
          text: "周末",
          command: "2"
        },
        {
          text: "节假日",
          command: "3"
        }
      ]
    };
  },
  props: {
    funcDef: Array,
    funcHandler: Function,
    selectedFuncText: String,
    dimDef: Array,
    dimHandler: Function
  },
  watch: {
    selectedFuncText(newVal) {
      this.selectedFuncText = newVal;
    }
  },
  components: {
    TimeRangeSelector,
    FunctionSelector,
    DimensionSelector
  }
};
</script>