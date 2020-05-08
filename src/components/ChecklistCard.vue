<template>
  <v-card
    class="mx-auto mb-4"
    max-width="400"
    tile
    :dark="isDarkMode"
    :color="checklistComplete ? '#5f9b47' : 'inherit'"
    @click="$emit('editChecklist', checklist.id)"
  >
    <v-list-item class="grow">
      <v-list-item-avatar :color="checklist.color"> </v-list-item-avatar>

      <v-list-item-content>
        <v-list-item-title>{{ checklist.title }}</v-list-item-title>
      </v-list-item-content>

      <v-row align="center" justify="end" class="pr-2">
        <v-icon class="mr-1">mdi-checkbox-marked-circle</v-icon>
        <span class="subheading mr-2">{{
          checklist.completeItems().length
        }}</span>
        <span class="mr-1">·</span>
        <v-icon class="mr-1">mdi-close-outline</v-icon>
        <span class="subheading">{{ checklist.inCompleteItems().length }}</span>
      </v-row>
    </v-list-item>
  </v-card>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { Checklist } from "../classes/Checklist";

@Component
export default class ChecklistCard extends Vue {
  @Prop({ required: true }) checklist!: Checklist;

  get checklistComplete(): boolean {
    return (
      this.checklist.items.length > 0 &&
      this.checklist.items.filter(x => x.itemStatus).length ===
        this.checklist.getItems().length
    );
  }

  get isDarkMode(): boolean {
    return this.$store.getters.isDarkMode;
  }
}
</script>
<style lang="scss"></style>
