<template>
  <div class="calendar-view pt-5">
    <b-container>
      <b-row>
        <b-col>
          <b-button variant="light" @click="toggleChecklistDialog">
            Create checklist item
          </b-button>
        </b-col>
      </b-row>
      <b-row>
        <b-col cols="12" lg="8">
          <div class="m-auto">
            <ChecklistCalendar @editChecklistItem="onEditChecklistItem" />
          </div>
        </b-col>
        <b-col lg="4">
          <v-card
            class="mx-auto mb-4"
            max-width="400"
            tile
            v-for="checklist in checklists"
            :key="checklist.id"
            @click="onEditChecklistItem(checklist)"
          >
            <v-list-item class="grow">
              <v-list-item-avatar :color="checklist.color">
              </v-list-item-avatar>

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
                <span class="subheading">{{
                  checklist.inCompleteItems().length
                }}</span>
              </v-row>
            </v-list-item>
          </v-card>
        </b-col>
      </b-row>
    </b-container>
    <ChecklistDialog
      :dialogOpen="isDialogOpen"
      :mode="dialogMode"
      @closeDialog="toggleChecklistDialog"
    />
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import ChecklistCalendar from "@/components/Calendar.vue";
import ChecklistDialog from "@/components/ChecklistDialog.vue";
import { Checklist } from "../classes/Checklist";

@Component({
  components: {
    ChecklistCalendar,
    ChecklistDialog
  }
})
export default class CalendarView extends Vue {
  isDialogOpen = false;

  get checklists(): Checklist[] {
    return this.$store.getters.getChecklists;
  }

  get dialogMode(): "create" | "edit" {
    return this.editableChecklist ? "edit" : "create";
  }

  get editableChecklist(): boolean {
    return !!this.$store.getters.getEditableChecklist;
  }

  toggleChecklistDialog(): void {
    this.isDialogOpen = !this.isDialogOpen;

    if (!this.isDialogOpen) {
      this.$store.commit("removeEditableChecklist");
    }
  }

  onEditChecklistItem(checklistItem: Checklist) {
    this.$store.commit("setEditableChecklist", checklistItem);
    this.toggleChecklistDialog();
  }

  addDays(date: Date, days: number) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }
}
</script>
