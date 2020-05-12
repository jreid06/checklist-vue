<template>
  <div>
    <v-dialog
      v-model="dialogOpen"
      scrollable
      persistent
      :max-width="maxWidth"
      :dark="darkMode"
    >
      <v-card v-if="editableChecklist && checklistFormattedDate">
        <v-card-title class="pb-0">
          <v-container>
            <v-row>
              <v-col cols="12" class="pb-0">
                <div class="d-flex flex-wrap flex-sm-nowrap align-items-center">
                  <div class="d-flex w-100">
                    <v-list-item-avatar :color="editableChecklist.color">
                    </v-list-item-avatar>
                    <span class="headline text-capitalize">{{
                      editableChecklist.title
                    }}</span>
                    <v-spacer></v-spacer>
                  </div>

                  <div class="d-flex flex-wrap justify-content-end">
                    <span
                      class="headline text-capitalize font-italic"
                      :style="{ fontSize: '12px !important' }"
                      >{{ "Start: " + checklistFormattedDate.startDate }}</span
                    >
                    <span
                      class="headline text-capitalize font-italic"
                      :style="{ fontSize: '12px !important' }"
                      >{{ "End: " + checklistFormattedDate.endDate }}</span
                    >
                  </div>
                </div>
              </v-col>
              <v-col cols="12" class="pt-0">
                <div class="d-flex">
                  <div class="flex-grow-1 pr-4">
                    <v-text-field
                      v-model="formData.itemName"
                      label="Checklist item name"
                      required
                      @keyup.13="addChecklistItem"
                    ></v-text-field>
                  </div>
                  <div class="d-flex align-items-center">
                    <v-btn
                      color="primary"
                      @click="addChecklistItem"
                      :outlined="true"
                    >
                      Add item
                    </v-btn>
                  </div>
                </div>
              </v-col>
            </v-row>
          </v-container>
        </v-card-title>
        <v-card-text class="p-2">
          <v-container>
            <v-row>
              <v-col cols="12" class="pt-0">
                <div class="">
                  <template v-if="items.length">
                    <ChecklistItem
                      v-for="item in items"
                      :item="item"
                      :key="item.itemId"
                      @deleteChecklistItem="handleDeleteItem"
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
                      No list items created
                    </v-alert>
                  </template>
                </div>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="emitClose">Cancel</v-btn>
          <v-btn
            color="blue darken-1"
            text
            @click="updateChecklistItems(false)"
          >
            Save
          </v-btn>
          <v-btn color="blue darken-1" text @click="updateChecklistItems(true)">
            Save & close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <ConfirmDialog
      dialogContentType="deleteItem"
      :checklistItem="itemToDelete"
      :dialogOpen="isConfirmDialogOpen"
      @reject="toggleDialog('confirm')"
      @confirm="deleteChecklistItem"
    />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Watch } from "vue-property-decorator";
import {
  Checklist,
  ChecklistItem as ChecklistItemInterface
} from "@/classes/Checklist";
import ChecklistItem from "@/components/ChecklistItem.vue";
import ConfirmDialog from "./ConfirmDialog.vue";
import { mixins } from "vue-class-component";
import DialogMixin from "../mixins/DialogMixin";

@Component({
  components: { ChecklistItem, ConfirmDialog }
})
export default class ChecklistItemsDialog extends mixins(DialogMixin) {
  @Prop({ default: "700px" }) maxWidth!: string;
  @Prop({ default: false }) dialogOpen!: boolean;
  @Prop({ default: false }) darkMode!: boolean;

  mL = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ];
  mS = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "June",
    "July",
    "Aug",
    "Sept",
    "Oct",
    "Nov",
    "Dec"
  ];

  itemToDelete: ChecklistItemInterface | null = null;
  items: ChecklistItemInterface[] = [];
  formData: { itemName: string } = {
    itemName: ""
  };

  @Watch("editableChecklist", { deep: true })
  onEditchecklistChange(checklist: Checklist) {
    if (checklist) {
      this.items = JSON.parse(JSON.stringify(checklist.items));
    }
  }

  get checklistFormattedDate(): { startDate: string; endDate: string } | null {
    // setup
    if (this.editableChecklist) {
      const {
        startTime,
        startDate,
        endTime,
        endDate
      } = this.editableChecklist.dates;
      const hasStartTime = !!startTime;
      const hasEndTime = !!endTime;

      const startDateString = this.formatDate(
        new Date(startDate),
        hasStartTime,
        startTime
      );
      const endDateString = this.formatDate(
        new Date(endDate),
        hasEndTime,
        endTime
      );

      return {
        endDate: endDateString,
        startDate: startDateString
      };
    }
    return null;
  }

  get editableChecklist(): Checklist | undefined {
    const checklist = this.$store.getters.getEditableChecklist as
      | Checklist
      | undefined;

    if (checklist) {
      return checklist;
    }

    return undefined;
  }

  formatDate(a: Date, withTime: boolean, time: string | null) {
    return withTime
      ? `${this.mL[a.getMonth()]} ${a.getDate()}, ${a.getFullYear()} ${time}`
      : `${this.mL[a.getMonth()]} ${a.getDate()}, ${a.getFullYear()}`;
  }

  addChecklistItem(): void {
    if (!this.formData.itemName) return;
    const item: ChecklistItemInterface = {
      itemId: Date.now(),
      itemName: this.formData.itemName,
      itemStatus: false
    };

    this.items.push(item);
    this.formData.itemName = "";
  }

  getChecklist(): Checklist {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return (this.$store.getters.checklists as Checklist[]).find(
      c => c.id === this.editableChecklist?.id
    )!;
  }

  updateChecklistItems(closeDialog: boolean): void {
    this.$store.dispatch("updateChecklistItems", {
      items: this.items,
      checklistId: this.editableChecklist?.id
    });

    if (closeDialog) this.emitClose();
    else {
      // update the selected checklist
      this.$store.commit(
        "setEditableChecklist",
        JSON.parse(JSON.stringify(this.getChecklist()))
      );
    }
  }

  handleDeleteItem(itemId: number): void {
    const itemExists = this.items.find(i => i.itemId === itemId);
    if (itemExists) {
      this.itemToDelete = itemExists;
      this.toggleDialog("confirm");
    }
  }

  deleteChecklistItem(): void {
    if (this.itemToDelete) {
      const itemId = this.itemToDelete.itemId;
      this.items.splice(
        this.items.findIndex(x => x.itemId === itemId),
        1
      );
    }

    this.toggleDialog("confirm");
  }

  emitClose(): void {
    this.$emit("closeDialog");
  }
}
</script>

<style></style>
