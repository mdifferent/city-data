<template>
  <el-container>
    <el-header>
      <PageHeader />
    </el-header>
    <el-main>
      <MainPage v-if="currentPage===null"/>
      <PopulationPage v-else-if="currentPage === '人口分布'"/>
      <TravelPage v-else-if="currentPage === '出行指标'"/>
    </el-main>
  </el-container>
</template>

<script>
import MainPage from "../components/MainPage";
import PageHeader from "../components/PageHeader";
import PopulationPage from "../components/PopulationPage";
import TravelPage from "../components/TravelPage";

import { mapState } from 'vuex'

export default {
  data() {
    return {
    };
  },
  computed: {
    ...mapState({
      currentPage: state => state.currentPage
    })
  },
  components: {
    PageHeader,
    MainPage,
    PopulationPage,
    TravelPage
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>