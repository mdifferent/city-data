<template>
  <el-container>
    <el-header>
      <SubHeader
        :funcDef="funcDef"
        :funcHandler="funcHandler"
        :selectedFuncText="selectedFuncText"
      />
    </el-header>
    <el-main>
        <MapView />
    </el-main>
  </el-container>
</template>

<script>
import SubHeader from "../components/SubHeader";
import MapView from "../components/MapView"
export default {
  name: "PopulationPage",
  data() {
    return {
      funcDef: [
        {
          text: "人口动态分布",
          command: 1
        },
        {
          text: "职住分析",
          command: 2
        },
        {
          text: "流动人口",
          command: 3
        },
        {
          text: "画像分析",
          command: 4
        }
      ],
      selectedFuncText: null
    };
  },
  components: {
    SubHeader,
    MapView
  },
  methods: {
    funcHandler(func) {
      this.selectedFuncText = func.text;
    },
    dimHandler(dim) {}
  }
};
</script>