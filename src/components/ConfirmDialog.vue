<template>
  <v-dialog
    v-model="dialogOpen"
    scrollable
    persistent
    :dark="isDarkMode"
    max-width="290"
  >
    <v-card>
      <v-card-title class="headline">
        {{ dialogConfig.dialogTitle }}
      </v-card-title>
      <v-card-text>
        {{ dialogConfig.bodyText }}
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="green darken-1" text @click="rejectAction">
          {{ dialogConfig.rejectText }}
        </v-btn>
        <v-btn color="green darken-1" text @click="confirmAction">
          {{ dialogConfig.confirmText }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

export interface ConfirmDialogConfig {
  dialogTitle: string;
  rejectText: string;
  confirmText: string;
  bodyText: string;
  color: "success" | "error";
}

const defaultConfig: ConfirmDialogConfig = {
  dialogTitle: "Confirm dialog",
  rejectText: "Close",
  confirmText: "Confirm",
  bodyText: "Are you sure you want to complete this action?",
  color: "success"
};

@Component
export default class ConfirmDialog extends Vue {
  @Prop({ default: false }) dialogOpen!: boolean;
  @Prop({ default: () => defaultConfig }) dialogConfig!: ConfirmDialogConfig;

  get isDarkMode(): boolean {
    return this.$store.getters.isDarkMode;
  }

  confirmAction(): void {
    this.$emit("confirm");
  }

  rejectAction(): void {
    this.$emit("reject");
  }
}
</script>

<style></style>
