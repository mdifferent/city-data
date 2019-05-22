<template>
  <el-dropdown @command="handleCommand">
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
    defaultText: String
  },
  methods: {
    handleCommand(command) {
      if (command.command === "0") {
        //TODO add customized time range
      } else {
        this.selectedText = command.text;
      }
    }
  }
};
</script>