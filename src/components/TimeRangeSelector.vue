<template>
  <el-dropdown @command="handler">
    <span class="el-dropdown-link">
      {{selectedText}}
      <i class="el-icon-arrow-down el-icon--right"></i>
    </span>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item  v-for="time in rangeDef" :key="time.command" :command="time">{{time.text}}</el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
export default {
  name: "TimeRangeSelector",
  data() {
    return {
      selectedText: this.defaultText
    };
  },
  props: {
    rangeDef: Array,
    defaultText: String,
    handler: Function
  }
};
</script>