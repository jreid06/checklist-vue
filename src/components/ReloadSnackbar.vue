<template>
  <v-snackbar :value="newContentAvailable" v-bind="snackbarOptions">
    <v-card-text>New content available</v-card-text>
    <v-btn dark text @click="reload">
      Reload
    </v-btn>
  </v-snackbar>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

export interface VuetifySnackbarInterface {
  position: "right" | "left" | "top" | "bottom";
  timeout: number;
  color: string | "success" | "error" | "info" | "primary"; // any colour hex code or material design color etc purple
  multiline?: boolean;
  vertical?: boolean;
}

@Component
export default class ReloadSnackbar extends Vue {
  @Prop({ default: { position: "bottom", color: "info" } })
  snackbarOptions!: VuetifySnackbarInterface;

  snackbar = true;

  reload(): void {
    window.location.reload(true);
  }

  get isDarkMode(): boolean {
    return this.$store.getters.isDarkMode;
  }

  get newContentAvailable(): boolean {
    return this.$store.getters.isNewContentAvailable;
  }
}
</script>

<style></style>
