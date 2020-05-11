<template>
  <div class="calendar-view pt-5 mb-5">
    <b-container class="mt-5 mb-5">
      <b-row>
        <b-col order="2" order-md="1" cols="12" lg="8">
          <div class="m-auto">
            <ChecklistCalendar @editChecklistItem="onEditChecklistItem" />
          </div>
        </b-col>
        <b-col order="1" order-md="2" cols="12" lg="4" class="mt-5 mt-lg-0">
          <b-row>
            <b-col cols="12" md="4" lg="12">
              <h4>Today's Checklists</h4>
              <v-divider />
              <div :style="{ maxHeight: '300px', overflow: 'auto' }">
                <template v-if="todaysChecklists.length">
                  <ChecklistCard
                    v-for="checklist in todaysChecklists"
                    :checklist="checklist"
                    :key="checklist.id"
                    @editChecklist="onEditChecklistItem"
                  />
                </template>
                <template v-else>
                  <v-alert
                    class=""
                    type="info"
                    outlined
                    width="100%"
                    elevation="2"
                  >
                    No Checklists for today
                  </v-alert>
                </template>
              </div>
            </b-col>
            <b-col cols="12" md="4" lg="12">
              <h4>All Checklists</h4>
              <v-divider />
              <div :style="{ maxHeight: '300px', overflow: 'auto' }">
                <template v-if="checklists.length">
                  <ChecklistCard
                    v-for="checklist in checklists"
                    :checklist="checklist"
                    :key="checklist.id"
                    @editChecklist="onEditChecklistItem"
                  />
                </template>
                <template v-else>
                  <v-alert
                    class=""
                    type="info"
                    outlined
                    width="100%"
                    elevation="2"
                  >
                    No Checklists to complete. Get adding!!
                  </v-alert>
                </template>
              </div>
            </b-col>
            <b-col cols="12" md="4" lg="12">
              <h4>Completed</h4>
              <v-divider />
              <div :style="{ maxHeight: '300px', overflow: 'auto' }">
                <template v-if="completed.length">
                  <ChecklistCard
                    v-for="checklist in completed"
                    :checklist="checklist"
                    :key="checklist.id"
                    @editChecklist="onEditChecklistItem"
                  />
                </template>
                <template v-else>
                  <v-alert
                    class=""
                    type="info"
                    outlined
                    width="100%"
                    elevation="2"
                  >
                    No completed checklists
                  </v-alert>
                </template>
              </div>
            </b-col>
          </b-row>
        </b-col>
      </b-row>
    </b-container>
    <ChecklistDialog
      :dialogOpen="isChecklistDialogOpen"
      :mode="dialogMode"
      :darkMode="isDarkMode"
      @closeDialog="toggleDialog('checklist')"
    />
    <ChecklistItemDialog
      :dialogOpen="isChecklistItemDialogOpen"
      :darkMode="isDarkMode"
      @closeDialog="toggleDialog('checklistItem')"
    />
  </div>
</template>
<script lang="ts">
import { Component } from "vue-property-decorator";
import ChecklistCalendar from "@/components/Calendar.vue";
import ChecklistDialog from "@/components/ChecklistDialog.vue";
import ChecklistCard from "@/components/ChecklistCard.vue";
import ChecklistItemDialog from "@/components/ChecklistItemsDialog.vue";
import { Checklist } from "@/classes/Checklist";
import { mixins } from "vue-class-component";
import DialogMixin from "@/mixins/DialogMixin";

@Component({
  components: {
    ChecklistCalendar,
    ChecklistDialog,
    ChecklistCard,
    ChecklistItemDialog
  }
})
export default class CalendarView extends mixins(DialogMixin) {
  get isDarkMode(): boolean {
    return this.$store.getters.isDarkMode;
  }

  get completed(): Checklist[] {
    return (this.$store.getters.getChecklists as Checklist[]).filter(
      c =>
        c.items.length &&
        c.items.filter(ci => ci.itemStatus).length === c.items.length
    );
  }

  get checklists(): Checklist[] {
    return this.$store.getters.getChecklists;
  }

  dateSpansCurrentDay(_startDate: string, _endDate: string) {
    const startDate = new Date(_startDate);
    const endDate = new Date(_endDate);
    const today = new Date();

    return (
      today.getDate() === startDate.getDate() ||
      (today > startDate && today < endDate)
    );
  }

  get todaysChecklists(): Checklist[] {
    return this.checklists.filter(c => {
      return this.dateSpansCurrentDay(c.dates.startDate, c.dates.endDate);
    });
  }

  onEditChecklistItem({
    id: checklistId,
    dialogName
  }: {
    id: number;
    dialogName: string;
  }) {
    const checklistItem = this.checklists.find(c => c.id === checklistId);
    if (checklistItem) {
      this.$store.commit(
        "setEditableChecklist",
        JSON.parse(JSON.stringify(checklistItem))
      );
      this.toggleDialog(dialogName);
    }
  }
}
</script>
