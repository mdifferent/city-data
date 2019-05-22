<template>
  <el-dropdown @command="handler">
    <span class="el-dropdown-link">
      {{defaultText}}
      <i class="el-icon-arrow-down el-icon--right"></i>
    </span>
    <el-dropdown-menu slot="dropdown" >
      <el-dropdown-item v-for="func in funcDef" :key="func.command" :command="func">{{func.text}}</el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
export default {
  name: "FunctionSelector",
  data() {
    return {
    };
  },
  props: {
    funcDef: Array,
    defaultText: String,
    handler: Function
  },
  watch: {
    defaultText(newVal) {
      this.defaultText = newVal;
    }
  }
};
</script>