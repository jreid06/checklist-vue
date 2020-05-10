<template>
  <v-app
    class="app"
    :class="{
      'mode--light': !modeState,
      'mode--dark': modeState
    }"
  >
    <ChecklistDialog
      :dialogOpen="isChecklistDialogOpen"
      :mode="dialogMode"
      :darkMode="isDarkMode"
      @closeDialog="toggleDialog('checklist')"
    />
    <ConfirmDialog
      :dialogOpen="isConfirmDialogOpen"
      @reject="toggleDialog('confirm')"
      @confirm="deleteAppData"
    />
    <v-system-bar
      :color="!isDarkMode ? '#fff' : ''"
      :height="60"
      :lights-out="false"
      :window="false"
      :dark="isDarkMode"
      class="system-bar position-fixed w-100 d-flex justify-content-center px-4"
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
      <v-btn
        type="info"
        class="mx-2"
        :outlined="true"
        :dark="isDarkMode"
        @click="toggleDialog('checklist')"
      >
        <v-icon>mdi-sticker-check-outline</v-icon>
        <span v-if="!isMobile">Create Checklist</span>
      </v-btn>
      <v-btn
        type="info"
        color="#a82e28"
        class="mx-2"
        :outlined="true"
        :dark="isDarkMode"
        @click="toggleDialog('confirm')"
      >
        <v-icon color="#a82e28">mdi-delete</v-icon>
        <span v-if="!isMobile">Delete app data</span>
      </v-btn>
      <v-icon>mdi-battery</v-icon>
      <span class="ml-2">{{ time }}</span>
    </v-system-bar>
    <router-view></router-view>
    <ReloadSnackbar :snackbarOptions="snackbarOptions" />
    <v-footer :padless="true" :fixed="true">
      <v-card
        flat
        tile
        width="100%"
        class="text-center"
        :color="isDarkMode ? '#000' : '#fff'"
      >
        <v-card-text :class="{ 'white--text': isDarkMode }">
          Made with <v-icon color="red">mdi-heart</v-icon>
          {{ new Date().getFullYear() }} by
          <strong><a href="https://www.jbreid.co.uk">JB.Reid</a></strong>
        </v-card-text>
      </v-card>
    </v-footer>
  </v-app>
</template>

<script lang="ts">
import { Component, Watch } from "vue-property-decorator";
import ReloadSnackbar, {
  VuetifySnackbarInterface
} from "@/components/ReloadSnackbar.vue";
import { mixins } from "vue-class-component";
import DialogMixin from "@/mixins/DialogMixin";
import ChecklistDialog from "./components/ChecklistDialog.vue";
import ConfirmDialog from "./components/ConfirmDialog.vue";

@Component({ components: { ReloadSnackbar, ChecklistDialog, ConfirmDialog } })
export default class App extends mixins(DialogMixin) {
  time = "00:00";
  modeState = false;
  appWidth = window.innerWidth;

  @Watch("modeState")
  updateCurrentMode(mode: boolean) {
    if (!mode) {
      this.$store.dispatch("updateAppMode", "light");
      return;
    }

    this.$store.dispatch("updateAppMode", "dark");
  }

  get snackbarOptions(): VuetifySnackbarInterface {
    return {
      position: "bottom",
      color: this.isDarkMode ? "#303030" : "info",
      timeout: 0
    };
  }

  get isMobile(): boolean {
    return this.appWidth < 768;
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

  deleteAppData(): void {
    this.$store.dispatch("clearAllData");
    this.toggleDialog("confirm");
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

    window.addEventListener("resize", () => {
      console.log(window.innerWidth);
      this.appWidth = window.innerWidth;
    });
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
