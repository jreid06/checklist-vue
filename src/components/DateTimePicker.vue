<template>
  <div class="date-time-picker--wrapper">
    <div class="d-flex flex-no-wrap">
      <div class="flex-grow-1 mr-1">
        <v-menu
          ref="startDate"
          v-model="startDate"
          :close-on-content-click="false"
          :return-value.sync="picker.startDate"
          transition="scale-transition"
          offset-y
          min-width="290px"
        >
          <template v-slot:activator="{ on }">
            <v-text-field
              v-model="picker.startDate"
              label="Start Date"
              readonly
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker v-model="picker.startDate" no-title scrollable>
            <v-spacer></v-spacer>
            <v-btn text color="primary" @click="startDate = false"
              >Cancel</v-btn
            >
            <v-btn
              text
              color="primary"
              @click="$refs.startDate.save(picker.startDate)"
              >OK</v-btn
            >
          </v-date-picker>
        </v-menu>
      </div>
      <!--  -->
      <div class="flex-grow-1 ml-1">
        <v-menu
          ref="startTime"
          v-model="startTime"
          :close-on-content-click="false"
          :nudge-right="40"
          :return-value.sync="picker.startTime"
          transition="scale-transition"
          offset-y
          max-width="290px"
          min-width="290px"
        >
          <template v-slot:activator="{ on }">
            <v-text-field
              v-model="picker.startTime"
              label="Start Time"
              readonly
              v-on="on"
            ></v-text-field>
          </template>
          <v-time-picker
            v-if="startTime"
            v-model="picker.startTime"
            full-width
            @click:minute="$refs.startTime.save(picker.startTime)"
          ></v-time-picker>
        </v-menu>
      </div>
    </div>

    <div class="d-flex flex-no-wrap">
      <div class="flex-grow-1 mr-1">
        <v-menu
          ref="endDate"
          v-model="endDate"
          :close-on-content-click="false"
          :return-value.sync="picker.endDate"
          transition="scale-transition"
          offset-y
          min-width="290px"
        >
          <template v-slot:activator="{ on }">
            <v-text-field
              v-model="picker.endDate"
              label="End Date"
              readonly
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker v-model="picker.endDate" no-title scrollable>
            <v-spacer></v-spacer>
            <v-btn text color="primary" @click="endDate = false">Cancel</v-btn>
            <v-btn
              text
              color="primary"
              @click="$refs.endDate.save(picker.endDate)"
              >OK</v-btn
            >
          </v-date-picker>
        </v-menu>
      </div>
      <!--  -->
      <div class="flex-grow-1 ml-1">
        <v-menu
          ref="endTime"
          v-model="endTime"
          :close-on-content-click="false"
          :nudge-right="40"
          :return-value.sync="picker.endTime"
          transition="scale-transition"
          offset-y
          max-width="290px"
          min-width="290px"
        >
          <template v-slot:activator="{ on }">
            <v-text-field
              v-model="picker.endTime"
              label="End Time"
              readonly
              v-on="on"
            ></v-text-field>
          </template>
          <v-time-picker
            v-if="endTime"
            v-model="picker.endTime"
            full-width
            @click:minute="$refs.endTime.save(picker.endTime)"
          ></v-time-picker>
        </v-menu>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Watch, Prop } from "vue-property-decorator";
import { ChecklistDateTimeObject } from "../classes/Checklist";

@Component
export default class DateTimePicker extends Vue {
  @Prop({ required: true }) dateObject!: ChecklistDateTimeObject;
  @Prop({ default: false }) resetPicker!: boolean;
  picker: ChecklistDateTimeObject = {
    startDate: this.pickerDates.startDate,
    startTime: this.pickerDates.startTime,
    endDate: this.pickerDates.endDate,
    endTime: this.pickerDates.endTime
  };

  startDate = false;
  startTime = false;

  endDate = false;
  endTime = false;
  counter = 0;

  @Watch("picker", { deep: true })
  onDateTimeChange() {
    this.$emit("dateTimeChange", this.picker);
  }

  @Watch("dateObject", { deep: true, immediate: true })
  onDateTimeUpdate(dateObject: ChecklistDateTimeObject) {
    this.picker = dateObject;
  }

  @Watch("resetPicker", { immediate: true })
  onDateResetChange(reset: boolean) {
    if (reset) {
      this.picker = this.dateObject;
      this.$emit("pickerReset");
    }
  }

  get pickerDates(): ChecklistDateTimeObject {
    return {
      startDate: this.dateObject.startDate,
      startTime: this.dateObject.startTime,
      endDate: this.dateObject.endDate,
      endTime: this.dateObject.endTime
    };
  }
}
</script>
<style lang="scss"></style>
