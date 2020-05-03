<template>
  <v-app
    class="app"
    :class="{
      'mode--light': !modeState,
      'mode--dark': modeState
    }"
  >
    <v-system-bar
      :color="!isDarkMode ? '#fff' : ''"
      :height="50"
      :lights-out="false"
      :window="false"
      :dark="isDarkMode"
      class="system-bar position-fixed w-100 d-flex justify-content-center"
      :style="{ zIndex: '100' }"
    >
      <router-link :to="{ name: 'Home' }">
        <v-icon>mdi-home-variant-outline</v-icon>
      </router-link>
      <v-switch
        class="ml-3 darkModeToggle"
        v-model="modeState"
        :label="modeName"
        :dark="isDarkMode"
      ></v-switch>
      <v-spacer></v-spacer>
      <v-icon>mdi-wifi-strength-4</v-icon>
      <v-icon>mdi-battery</v-icon>
      <span class="ml-2">{{ time }}</span>
    </v-system-bar>
    <router-view></router-view>
  </v-app>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";

@Component
export default class App extends Vue {
  time = "00:00";
  modeState = false;

  @Watch("modeState")
  updateCurrentMode(mode: boolean) {
    if (!mode) {
      this.$store.dispatch("updateAppMode", "light");
      return;
    }

    this.$store.dispatch("updateAppMode", "dark");
  }

  get isDarkMode(): boolean {
    return this.$store.getters.isDarkMode;
  }

  get appMode(): "light" | "dark" {
    return this.$store.getters.getAppMode;
  }

  get modeName(): string {
    return this.modeState ? "Dark" : "Light";
  }

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

  setAppMode() {
    this.modeState = this.appMode === "light" ? false : true;
  }

  mounted() {
    this.startTime();
    this.setAppMode();
  }
}
</script>

<style lang="scss">
@import "@/assets/scss/Media.scss";

$black: #2c3e50;
$darkMode: #000000;
$white: #fff;
$white-grey: #f2f2f2;

.app {
  &.mode--dark {
    background-color: $darkMode !important;
    color: $white !important;
  }

  &.mode--light {
    background-color: $white !important;
    color: $black !important;
  }
}

.system-bar {
  .darkModeToggle {
    position: relative;
    top: -2px;
    padding: 0 !important;

    .v-messages {
      display: none;
    }

    .v-label {
      top: 3px;
    }
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
