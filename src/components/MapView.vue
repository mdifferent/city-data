<template>
  <baidu-map class="bm-view" center="北京">
    <bml-heatmap :data="data" :max="100" :radius="20"></bml-heatmap>
    <bm-control anchor="BMAP_ANCHOR_TOP_RIGHT" :offset="{width: 43, height: 50}">
      <el-slider v-model="value" :min="min" :max="max" :marks="marks" vertical height="600px"></el-slider>
    </bm-control>
  </baidu-map>
</template>


<script>
import { BmlHeatmap } from "vue-baidu-map";

export default {
  components: {
    BmlHeatmap
  },
  data() {
    return {
      data: [
        { lng: 116.418261, lat: 39.921984, count: 50 },
        { lng: 116.423332, lat: 38.916532, count: 51 },
        { lng: 116.419787, lat: 37.930658, count: 15 }
      ],
      value: 5,
      min: 5,
      max: 23,
      marks: {
        5: "5:00",
        6: "6:00",
        7: "7:00",
        8: "8:00",
        9: "9:00",
        10: "10:00",
        11: "11:00",
        12: "12:00",
        13: "13:00",
        14: "14:00",
        15: "15:00",
        16: "16:00",
        17: "17:00",
        18: "18:00",
        19: "19:00",
        20: "20:00",
        21: "21:00",
        22: "22:00",
        23: "23:00"
      }
    };
  }
};
</script>

<style>
.bm-view {
  width: 100%;
  height: 800px;
}
</style>

