<template>
  <div>
    <v-dialog
      v-model="dialogOpen"
      scrollable
      persistent
      :max-width="maxWidth"
      :dark="darkMode"
    >
      <v-card>
        <v-card-title>
          <span class="headline text-capitalize">{{ mode }} Checklist</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="formData.checklistName"
                  label="Checklist Name"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-divider></v-divider>
                <DateTimePicker
                  :dateObject="formData.checklistDates"
                  :resetPicker="reset"
                  @dateTimeChange="updateDateTimes"
                  @pickerReset="reset = false"
                />
              </v-col>
              <v-col cols="12" class="text-left">
                <h6>Checklist Colour</h6>
                <v-color-picker
                  v-model="formData.checklistColor"
                  class="checklist-dialog-form-item--color-picker mb-5"
                  hide-inputs
                  hide-canvas
                  width="100%"
                ></v-color-picker>
                <v-text-field
                  label="Selected Colour HEX Code"
                  :value="formData.checklistColor"
                  readonly
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <div class="">
                  <div class="d-flex">
                    <div class="flex-grow-1 pr-4">
                      <v-text-field
                        v-model="formData.checklistListItemName"
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
                  <div class="d-flex flex-wrap">
                    <template
                      v-if="!isEditMode && formData.checklistItems.length"
                    >
                      <template v-if="formData.checklistItems.length">
                        <v-chip
                          close
                          close-icon="mdi-close-outline"
                          v-for="item in formData.checklistItems"
                          :key="item.itemId"
                          class="mr-2 mb-2"
                          @click:close="deleteChecklistItem(item.itemId)"
                        >
                          {{ item.itemName }}
                        </v-chip>
                      </template>
                    </template>
                    <template
                      v-else-if="isEditMode && formData.checklistItems.length"
                    >
                      <ChecklistItem
                        class="mr-2"
                        v-for="item in formData.checklistItems"
                        :item="item"
                        :key="item.itemId"
                        @deleteChecklistItem="deleteChecklistItem"
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
                </div>
              </v-col>
              <v-col cols="12">
                <v-textarea
                  name="input-7-1"
                  label="Description (optional)"
                  auto-grow
                  v-model="formData.checklistDescription"
                ></v-textarea>
              </v-col>
            </v-row>
          </v-container>
          <small>*indicates required field</small>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="emitClose">Close</v-btn>
          <v-btn color="blue darken-1" text @click="handleChecklistSubmission">
            {{ buttonActionText }}
          </v-btn>
          <v-btn
            v-if="isEditMode"
            color="red darken-1"
            text
            @click="handleDeleteChecklist"
          >
            Delete Checklist
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <ConfirmDialog
      dialogContentType="deleteChecklist"
      :checklist="itemToDelete"
      :dialogOpen="isConfirmDialogOpen"
      @reject="toggleDialog('confirm')"
      @confirm="deleteChecklist"
    />
    <v-snackbar v-model="snackbar" :top="true" :timeout="0" color="#a82e28">
      <b>Name, Start & End date are required</b>
      <v-btn dark text @click="snackbar = false">
        Close
      </v-btn>
    </v-snackbar>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Watch } from "vue-property-decorator";
import {
  Checklist,
  ChecklistDateTimeObject,
  ChecklistItem as ChecklistItemInterface,
  ChecklistInterface
} from "../classes/Checklist";
import DateTimePicker from "@/components/DateTimePicker.vue";
import {
  ChecklistFormData,
  ChecklistFormDataInterface
} from "@/classes/ChecklistFormData";
import ChecklistItem from "@/components/ChecklistItem.vue";
import { mixins } from "vue-class-component";
import DialogMixin from "../mixins/DialogMixin";
import ConfirmDialog from "./ConfirmDialog.vue";

@Component({
  components: {
    DateTimePicker,
    ChecklistItem,
    ConfirmDialog
  }
})
export default class ChecklistDialog extends mixins(DialogMixin) {
  @Prop({ default: false }) dialogOpen!: boolean;
  @Prop({ default: false }) darkMode!: boolean;
  @Prop({ default: "700px" }) maxWidth!: string;
  @Prop({ default: "create" }) mode!: "create" | "edit";
  @Prop({ default: 0 }) editChecklistId!: number;

  formDataSaved = false;
  tempFormData = {
    key: "temp-form-data--checklist-dialog",
    data: null
  };
  formData: ChecklistFormData = new ChecklistFormData(null);
  reset = false;
  snackbar = false;
  itemToDelete: Checklist | null = null;

  @Watch("editableChecklist", { immediate: true })
  onEditMode(checklist: Checklist | undefined) {
    if (checklist) {
      const formDataInterface: ChecklistFormDataInterface = {
        checklistName: checklist.title,
        checklistColor: checklist.color,
        checklistDescription: checklist.description,
        checklistDates: checklist.dates,
        checklistItems: checklist.items,
        checklistListItemName: ""
      };

      this.itemToDelete = checklist;
      this.formData = new ChecklistFormData(formDataInterface);
    }
  }

  get isEditMode(): boolean {
    return this.mode === "edit";
  }

  get buttonActionText(): string {
    return this.isEditMode ? "Update" : "Save";
  }

  get editableChecklist(): Checklist | undefined {
    const checklist = this.$store.getters.getEditableChecklist as
      | Checklist
      | undefined;

    if (checklist) {
      return checklist;
    }

    this.formData = new ChecklistFormData(null);
    return checklist as undefined;
  }

  updateDateTimes(dateTimeObject: ChecklistDateTimeObject) {
    const { startTime, startDate, endTime, endDate } = dateTimeObject;
    this.$set(this.formData.checklistDates, "startTime", startTime);
    this.$set(this.formData.checklistDates, "startDate", startDate);
    this.$set(this.formData.checklistDates, "endTime", endTime);
    this.$set(this.formData.checklistDates, "endDate", endDate);
  }

  addChecklistItem(): void {
    if (!this.formData.checklistListItemName) return;
    const item: ChecklistItemInterface = {
      itemId: this.randomID(),
      itemName: this.formData.checklistListItemName,
      itemStatus: false
    };

    this.formData.checklistItems.push(item);
    this.formData.checklistListItemName = "";
  }

  deleteChecklistItem(id: number): void {
    const itemLocation = this.formData.checklistItems.findIndex(
      x => x.itemId === id
    );
    this.formData.checklistItems.splice(itemLocation, 1);
  }

  randomID(): number {
    return Date.now();
  }

  emitClose(): void {
    this.$emit("closeDialog");
  }

  handleChecklistSubmission(): void {
    const data: ChecklistInterface = {
      id:
        this.isEditMode && this.editableChecklist
          ? this.editableChecklist.id
          : this.randomID(),
      title: this.formData.checklistName,
      dates: this.formData.checklistDates,
      description: this.formData.checklistDescription || null,
      items: this.formData.checklistItems,
      color: this.formData.checklistColor
    };

    if (
      !this.formData.checklistName ||
      !this.formData.checklistDates.startDate ||
      !this.formData.checklistDates.endDate
    ) {
      this.snackbar = true;
      return;
    }

    const newChecklist = new Checklist(data);
    this.isEditMode
      ? this.$store.dispatch("updateChecklist", newChecklist)
      : this.$store.dispatch("saveChecklist", newChecklist);

    this.closeDialogActions();
  }

  closeDialogActions(): void {
    // close dialog cleanup actions
    this.formData = new ChecklistFormData(null);
    this.reset = true;
    this.emitClose();
  }

  handleDeleteChecklist(): void {
    if (this.editableChecklist) {
      this.itemToDelete = this.editableChecklist;
      this.toggleDialog("confirm");
    }
  }

  deleteChecklist(): void {
    this.editableChecklist
      ? this.$store.dispatch("deleteChecklist", this.editableChecklist.id)
      : null;

    this.toggleDialog("confirm");
    this.closeDialogActions();
  }
}
</script>
<style lang="scss"></style>
