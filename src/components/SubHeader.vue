<template>
  <div id="subheader">
    <el-row>
      <el-col :span="4">
        <FunctionSelector
          :defaultText="selectedFuncText == null ? '功能选择' : selectedFuncText"
          :funcDef="funcDef"
          :handler="funcHandler"
        />
      </el-col>
      <el-col :span="4">
        <TimeRangeSelector useage="date" :v_if="dateAvaliable"/>
      </el-col>
      <el-col :span="4">
        <TimeRangeSelector useage="time" :v_if="timeAvaliable"/>
      </el-col>
      <el-col :span="12">
        <DimensionSelector v-if="showDim"/>
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
    return {};
  },
  props: {
    funcDef: Array,
    funcHandler: Function,
    selectedFuncText: String,
    dateAvaliable: {
      type: Boolean,
      default: true
    },
    timeAvaliable: {
      type: Boolean,
      default: true
    },
    showDim: {
      type: Boolean,
      default: true
    }
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