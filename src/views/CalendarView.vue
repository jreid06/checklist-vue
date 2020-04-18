<template>
  <div class="calendar-view">
    <b-container>
      <b-row>
        <b-col>
          <b-button variant="light" @click="toggleChecklistDialog">
            Create checklist item
          </b-button>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <ChecklistCalendar />
        </b-col>
        <b-col>
          <v-card class="mx-auto" max-width="400" tile>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>Single-line item</v-list-item-title>
              </v-list-item-content>
            </v-list-item>

            <v-list-item two-line>
              <v-list-item-content>
                <v-list-item-title>Two-line item</v-list-item-title>
                <v-list-item-subtitle>Secondary text</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>

            <v-list-item three-line>
              <v-list-item-content>
                <v-list-item-title>Three-line item</v-list-item-title>
                <v-list-item-subtitle>
                  Secondary line text Lorem ipsum dolor sit amet,
                </v-list-item-subtitle>
                <v-list-item-subtitle>
                  consectetur adipiscing elit.
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-card>
        </b-col>
      </b-row>
    </b-container>
    <ChecklistDialog
      :dialogOpen="isDialogOpen"
      @closeDialog="toggleChecklistDialog"
    />
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import ChecklistCalendar from "@/components/Calendar.vue";
import ChecklistDialog from "@/components/ChecklistDialog.vue";
import { AppIChecklist, Checklist } from "@/classes/Checklist";
import { LocalStorageService } from "@/services/LocalStorageService";

@Component({
  components: {
    ChecklistCalendar,
    ChecklistDialog
  }
})
export default class CalendarView extends Vue {
  isDialogOpen = false;

  toggleChecklistDialog(): void {
    this.isDialogOpen = !this.isDialogOpen;
  }
  createChecklistItem(): void {
    const fakeItem: AppIChecklist = {
      title: "Work In progress",
      dateStart: new Date(),
      dateEnd: this.addDays(new Date(), 1),
      description: null
    };

    const fakeKey = "test-checklist";
    const checklistItem = new Checklist(fakeItem);
    console.log(checklistItem);
    console.log(checklistItem.getName());
    LocalStorageService.setData(fakeKey, checklistItem);

    const parsedItem = LocalStorageService.getDataItem<Checklist>(
      fakeKey,
      Checklist
    );

    console.log(parsedItem);
    console.log(parsedItem?.getName());
  }

  addDays(date: Date, days: number) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }
}
</script>
