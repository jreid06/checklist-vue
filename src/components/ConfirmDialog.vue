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
        <span v-html="configData.dialogTitle"></span>
      </v-card-title>
      <v-card-text>
        <span v-html="configData.bodyText"></span>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="green darken-1" text @click="rejectAction">
          {{ configData.rejectText }}
        </v-btn>
        <v-btn color="green darken-1" text @click="confirmAction">
          {{ configData.confirmText }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { Checklist, ChecklistItem } from "../classes/Checklist";

export interface ConfirmDialogConfig {
  dialogTitle: string;
  rejectText: string;
  confirmText: string;
  bodyText: string;
  color: "success" | "error";
}

export const defaultConfig: ConfirmDialogConfig = {
  dialogTitle: "Confirm dialog",
  rejectText: "Close",
  confirmText: "Confirm",
  bodyText: "Are you sure you want to complete this action?",
  color: "success"
};

@Component
export default class ConfirmDialog extends Vue {
  @Prop({ default: false }) dialogOpen!: boolean;
  @Prop({ default: "resetApp" }) dialogContentType!: string;
  @Prop({ default: () => defaultConfig }) dialogConfig!: ConfirmDialogConfig;
  @Prop({ default: null }) checklist!: Checklist;
  @Prop({ default: null }) checklistItem!: ChecklistItem;

  get isDarkMode(): boolean {
    return this.$store.getters.isDarkMode;
  }

  get configData(): ConfirmDialogConfig {
    if (this.dialogContentType === "resetApp") {
      return {
        dialogTitle: "Clear app data?",
        bodyText:
          "This will reset delete all checklists & items. Data cannot be recovered",
        rejectText: "Close",
        confirmText: "Confirm",
        color: "success"
      };
    }

    if (this.dialogContentType === "deleteChecklist" && this.checklist) {
      return {
        dialogTitle: `Delete checklist <b>${this.checklist.title}</b>?`,
        bodyText: `You wont be able to recover this checklist <b>${this.checklist.title}</b> once confirm has been clicked. All items attached to this checklist will aslo be deleted`,
        rejectText: "Close",
        confirmText: "Confirm",
        color: "success"
      };
    }

    if (this.dialogContentType === "deleteItem" && this.checklistItem) {
      return {
        dialogTitle: `Delete checklist item <b>${this.checklistItem.itemName}</b>?`,
        bodyText: `You wont be able to recover deleted checklist item <b>${this.checklistItem.itemName}</b> once confirm has been clicked`,
        rejectText: "Close",
        confirmText: "Confirm",
        color: "success"
      };
    }

    return defaultConfig;
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
