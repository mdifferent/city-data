<template>
  <div>
    <el-slider
      v-model="time"
      vertical
      :min="5"
      :max="23"
      height="600px"
      :marks="marks"
      @change="onTimeChange"
      :disabled="isAuto"
    ></el-slider>
    <el-button circle :icon="iconName" @click="onPlayClicked" size="medium"></el-button>
  </div>
</template>

<script>
export default {
  name: "PopulationTimeSlider",
  data() {
    return {
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
      },
      iconName: "el-icon-video-play",
      time: 5
    };
  },
  props: {
    onTimeChange: Function,
    onPlayClicked: Function,
    value: {
      type: Number,
      default: 5
    },
    isAuto: {
      type: Boolean, 
      default: false
    }
  },
  watch: {
    isAuto(newVal) {
      this.iconName = newVal
        ? "el-icon-video-pause"
        : "el-icon-video-play"
    },
    value(newVal) {
      this.time = newVal
    }
  }
};
</script>
