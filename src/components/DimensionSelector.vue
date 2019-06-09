<template>
  <div>
    <el-radio-group
      v-model="selectedRadio"
      size="medium"
      @change="changeCuky"
      v-for="dim in dimDef"
      :key="dim.command"
    >
      <el-radio-button :label="dim.text"></el-radio-button>
    </el-radio-group>
  </div>
</template>

<script>
import { mapMutations } from "vuex";

export default {
  name: "DimensionSelector",
  data() {
    return {
      dimDef: [
        {
          text: "原始数据",
          command: "1"
        },
        {
          text: "扩样数据",
          command: "2"
        }
      ],
      selectedRadio: String
    };
  },
  mounted() {
    if (this.dimDef != null && this.dimDef.length > 0)
      this.selectedRadio = this.dimDef[0].text;
  },
  methods: {
    ...mapMutations({
      changeCuky: "changeCuky"
    })
  }
};
</script>