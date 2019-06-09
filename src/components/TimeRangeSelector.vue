<template>
  <el-dropdown @command="handler">
    <span class="el-dropdown-link">
      {{selectedText}}
      <i class="el-icon-arrow-down el-icon--right"></i>
    </span>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item v-for="time in rangeDef" :key="time.command" :command="time">{{time.text}}</el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
import { mapMutations } from "vuex";

export default {
  name: "TimeRangeSelector",
  data() {
    return {
      selectedText: "",
      rangeDef: []
    };
  },
  props: {
    useage: String
  },
  created() {
    if (this.useage === "time") {
      this.rangeDef = [
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
      ];
      this.changeTimeRange(this.rangeDef[0]);
    } else {
      this.rangeDef = [
        {
          text: "工作日",
          command: "w"
        },
        {
          text: "周末",
          command: "e"
        },
        {
          text: "节假日",
          command: "h"
        }
      ];
      this.changeDateType(this.rangeDef[0]);
    }
    this.selectedText = this.rangeDef[0].text;
  },
  methods: {
    ...mapMutations({
      changeTimeRange: "changeTimeRange",
      changeDateType: "changeDateType"
    }),
    handler(newVal) {
      if (this.useage === "time")  { 
        this.changeTimeRange(newVal);
      } 
      else if (this.useage === "date") {
        this.changeDateType(newVal);
      }
      this.selectedText = newVal.text
    }
  }
};
</script>