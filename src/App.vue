<template>
  <v-app class="app">
    <v-system-bar
      color="#fff"
      :height="30"
      :lights-out="false"
      :window="false"
      class="border-bottom position-absolute w-100"
    >
      <router-link :to="{ name: 'Home' }">
        <v-icon>mdi-home-variant-outline</v-icon>
      </router-link>
      <v-spacer></v-spacer>
      <v-icon>mdi-wifi-strength-4</v-icon>
      <v-icon>mdi-battery</v-icon>
      <span class="ml-2">{{ time }}</span>
    </v-system-bar>
    <router-view></router-view>
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class App extends Vue {
  time = "00:00";

  get currentTime() {
    return this.time;
  }

  checkTime(i: number | string) {
    if (i < 10) {
      i = "0" + i;
    } // add zero in front of numbers < 10
    return i;
  }

  startTime() {
    const today = new Date();
    const h = today.getHours();
    let m = today.getMinutes();
    m = this.checkTime(m) as number;

    this.time = h + ":" + m;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const t = setTimeout(this.startTime, 1500);
  }

  mounted() {
    this.startTime();
  }
}
</script>

<style lang="scss">
@import "@/assets/scss/Media.scss";

$black: #2c3e50;
$white: #fff;
$white-grey: #f2f2f2;

.app {
  &.mode--dark {
    background-color: $black;
    color: $white;
  }

  &.mode--light {
    background-color: aliceblue;
    color: $black;
  }
}

#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: $black;
  font-family: "Comic Neue", cursive, sans-serif !important;
  // margin-top: 60px;
}
</style>
