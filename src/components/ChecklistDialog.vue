<template>
  <v-dialog v-model="dialogOpen" persistent :max-width="maxWidth">
    <v-card>
      <v-card-title>
        <span class="headline">Create Checklist</span>
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
              <v-divider></v-divider>
            </v-col>
            <v-col cols="12" class="text-left">
              <h6>Checklist Colour</h6>
              <v-color-picker
                v-model="formData.checklistColor"
                class="checklist-dialog-form-item--color-picker"
                hide-inputs
                hide-canvas
                width="100%"
              ></v-color-picker>
              <v-divider></v-divider>
              <v-text-field
                label="Selected Colour HEX Code"
                :value="formData.checklistColor"
                readonly
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <!-- <v-divider></v-divider> -->
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
                    <v-btn color="primary" @click="addChecklistItem">
                      Add item
                    </v-btn>
                  </div>
                </div>
                <div class="d-flex">
                  <template v-if="formData.checklistItems.length">
                    <v-chip
                      close
                      close-icon="mdi-close-outline"
                      v-for="item in formData.checklistItems"
                      :key="item.itemId"
                      @click:close="deleteChecklistItem(item.itemId)"
                    >
                      {{ item.itemName }}
                    </v-chip>
                  </template>
                  <template v-else>
                    <v-alert
                      class=""
                      type="info"
                      border="top"
                      width="100%"
                      colored-border
                      elevation="2"
                    >
                      No list items created
                    </v-alert>
                  </template>
                </div>
              </div>
              <!-- <v-divider></v-divider> -->
            </v-col>
            <v-col cols="12">
              <!-- <v-alert
                class="mb-2"
                type="info"
                max-height="60"
                border="top"
                width="100%"
                colored-border
                elevation="2"
              >
                Use controls below to select <b>Start</b> &amp; <b>End</b> dates
                for this checklist
              </v-alert> -->
              <v-divider></v-divider>
              <DateTimePicker @dateTimeChange="updateDateTimes" />
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
        <v-btn color="blue darken-1" text @click="saveChecklist">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import {
  Checklist,
  ChecklistDateTimeObject,
  ChecklistItem,
  ChecklistInterface
} from "../classes/Checklist";
import DateTimePicker from "@/components/DateTimePicker.vue";
import { ChecklistFormData } from "@/classes/ChecklistFormData";

@Component({
  components: {
    DateTimePicker
  }
})
export default class ChecklistDialog extends Vue {
  @Prop({ default: false }) dialogOpen!: boolean;
  @Prop({ default: "700px" }) maxWidth!: string;
  @Prop({ default: "create" }) mode!: string;
  @Prop({ default: 0 }) editChecklistId!: number;

  formDataSaved = false;
  tempFormData = {
    key: "temp-form-data--checklist-dialog",
    data: null
  };
  formData: ChecklistFormData = new ChecklistFormData(null);

  get dialogMode(): string {
    return this.mode;
  }

  get editableChecklist(): Checklist | undefined {
    return this.$store.getters.getEditableChecklist;
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
    const item: ChecklistItem = {
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

  saveChecklist(): void {
    const data: ChecklistInterface = {
      id: this.randomID(),
      title: this.formData.checklistName,
      dates: this.formData.checklistDates,
      description: this.formData.checklistDescription || null,
      items: this.formData.checklistItems,
      color: this.formData.checklistColor
    };

    if (
      !this.formData.checklistName ||
      !this.formData.checklistDates.startDate
    ) {
      alert("missing fields");
      return;
    }

    const newChecklist = new Checklist(data);
    this.$store.dispatch("saveChecklist", newChecklist);
    this.formData = new ChecklistFormData(null);
    this.emitClose();
  }
}
</script>
<style lang="scss"></style>
