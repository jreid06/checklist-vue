<template>
  <v-card
    class="mx-auto mb-4"
    max-width="400"
    :dark="isDarkMode"
    :color="checklistComplete ? '#5f9b47' : 'inherit'"
  >
    <v-list-item class="grow">
      <v-list-item-avatar :color="checklist.color"> </v-list-item-avatar>
      <v-list-item-content
        :style="{ cursor: 'pointer' }"
        @click="
          $emit('editChecklist', {
            id: checklist.id,
            dialogName: 'checklist'
          })
        "
      >
        <v-list-item-title>{{ checklist.title }}</v-list-item-title>
      </v-list-item-content>

      <v-row align="center" justify="end" class="pr-2">
        <v-icon
          color="#c9ce35"
          class="mr-1"
          @click="
            $emit('editChecklist', {
              id: checklist.id,
              dialogName: 'checklist'
            })
          "
          >mdi-pencil-outline</v-icon
        >
        <span class="mr-1">·</span>
        <v-icon
          color="#3570ce"
          class="mr-1"
          @click="
            $emit('editChecklist', {
              id: checklist.id,
              dialogName: 'checklistItem'
            })
          "
          >mdi-checkbox-multiple-marked-outline</v-icon
        >
        <span class="mr-1">·</span>
        <v-icon class="mr-1" color="#31af31">mdi-checkbox-marked-circle</v-icon>
        <span class="subheading mr-2">{{
          checklist.completeItems().length
        }}</span>
        <v-icon class="mr-1" color="#a82e28">mdi-close-outline</v-icon>
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
