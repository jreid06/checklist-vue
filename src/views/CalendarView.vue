<template>
  <div class="calendar-view pt-5 mb-5">
    <b-container class="mt-5 mb-5">
      <b-row>
        <b-col>
          <v-btn
            type="info"
            :outlined="isDarkMode ? false : true"
            :dark="isDarkMode"
            @click="toggleChecklistDialog"
          >
            Create checklist item
          </v-btn>
        </b-col>
      </b-row>
      <b-row>
        <b-col order="2" order-md="1" cols="12" lg="8">
          <div class="m-auto">
            <ChecklistCalendar @editChecklistItem="onEditChecklistItem" />
          </div>
        </b-col>
        <b-col order="1" order-md="2" cols="12" lg="4" class="mt-5 mt-lg-0">
          <b-row>
            <b-col cols="12" md="6" lg="12">
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
            <b-col cols="12" md="6" lg="12">
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
      :dialogOpen="isDialogOpen"
      :mode="dialogMode"
      :darkMode="isDarkMode"
      @closeDialog="toggleChecklistDialog"
    />
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import ChecklistCalendar from "@/components/Calendar.vue";
import ChecklistDialog from "@/components/ChecklistDialog.vue";
import ChecklistCard from "@/components/ChecklistCard.vue";
import { Checklist } from "@/classes/Checklist";

@Component({
  components: {
    ChecklistCalendar,
    ChecklistDialog,
    ChecklistCard
  }
})
export default class CalendarView extends Vue {
  isDialogOpen = false;

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

  get todaysChecklists(): Checklist[] {
    return (this.$store.getters.getChecklists as Checklist[]).filter(c => {
      return (
        new Date(c.dates.startDate).getDay() === new Date(Date.now()).getDay()
      );
    });
  }

  checkIfDateIsBetweenCurrentDay(startDate: string, endDate: string): boolean {
    const dateFrom = startDate;
    const dateTo = endDate;
    const dateCheck = this.formatDate(Date.now());

    const d1 = dateFrom.split("/");
    const d2 = dateTo.split("/");
    const c = dateCheck.split("/");

    const from = new Date(
      parseInt(d1[2]),
      parseInt(d1[1]) - 1,
      parseInt(d1[0])
    ); // -1 because months are from 0 to 11
    const to = new Date(parseInt(d2[2]), parseInt(d2[1]) - 1, parseInt(d2[0]));
    const check = new Date(parseInt(c[2]), parseInt(c[1]) - 1, parseInt(c[0]));

    return check > from && check < to;
  }

  formatDate(date: string | number) {
    const d = new Date(date);
    let month = "" + (d.getMonth() + 1),
      day = "" + d.getDate();
    const year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("-");
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

  onEditChecklistItem(checklistId: number) {
    const checklistItem = this.checklists.find(c => c.id === checklistId);
    if (checklistItem) {
      this.$store.commit(
        "setEditableChecklist",
        JSON.parse(JSON.stringify(checklistItem))
      );
      this.toggleChecklistDialog();
    }
  }

  addDays(date: Date, days: number) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }
}
</script>
