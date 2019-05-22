<template>
  <el-container>
    <el-header>
      <PageHeader />
    </el-header>
    <el-main>
      <!--<MainPage msg="Welcome to Your Vue.js App" v-if="currentPage===null"/>
      <PopulationPage v-else-if="currentPage==='人口分布'" />-->
      <PopulationPage />
    </el-main>
  </el-container>
</template>

<script>
import MainPage from '../components/MainPage'
import PageHeader from '../components/PageHeader'
import PopulationPage from '../components/PopulationPage'

export default {
  data() {
    return {
      currentPage: null
    }
  },
  components: {
    PopulationPage,
    PageHeader,
    MainPage
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>