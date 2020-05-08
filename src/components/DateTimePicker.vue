<template>
  <div class="date-time-picker--wrapper">
    <div class="d-flex flex-wrap mb-4">
      <v-sheet
        :dark="isDarkMode"
        :elevation="elevation"
        class="mx-auto p-3"
        width="100%"
      >
        <div class="flex-grow-1 mr-1 w-100">
          <DatePicker
            pickerLabel="Start Date"
            :value="picker.startDate"
            @dateUpdated="handleDateUpdates"
            keyToUpdate="startDate"
          />
          <DateTimeToolbar
            :keyName="'startDate'"
            @updateDate="handleDateUpdates"
          />
        </div>
        <!--  -->
        <div class="flex-grow-1 ml-1 mt-2">
          <TimePicker
            pickerLabel="Start Time"
            @dateUpdated="handleDateUpdates"
            keyToUpdate="startTime"
          />
        </div>
      </v-sheet>
    </div>

    <div class="d-flex flex-wrap">
      <v-sheet
        :dark="isDarkMode"
        :elevation="elevation"
        class="mx-auto p-3"
        width="100%"
      >
        <div class="flex-grow-1 mr-1 w-100">
          <DatePicker
            pickerLabel="End Date"
            :value="picker.endDate"
            @dateUpdated="handleDateUpdates"
            keyToUpdate="endDate"
          />
          <DateTimeToolbar
            :keyName="'endDate'"
            @updateDate="handleDateUpdates"
          />
        </div>
        <!--  -->
        <div class="flex-grow-1 ml-1 mt-2">
          <TimePicker
            pickerLabel="End Time"
            @dateUpdated="handleDateUpdates"
            keyToUpdate="endTime"
          />
        </div>
      </v-sheet>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Watch, Prop } from "vue-property-decorator";
import { ChecklistDateTimeObject } from "@/classes/Checklist";
import DateTimeToolbar from "@/components/DateTimeToolbar.vue";
import TimePicker from "@/components/TimePicker.vue";
import DatePicker from "@/components/DatePicker.vue";

@Component({ components: { DateTimeToolbar, TimePicker, DatePicker } })
export default class DateTimePicker extends Vue {
  @Prop({ required: true }) dateObject!: ChecklistDateTimeObject;
  @Prop({ default: false }) resetPicker!: boolean;
  picker: ChecklistDateTimeObject = {
    startDate: this.pickerDates.startDate,
    startTime: this.pickerDates.startTime,
    endDate: this.pickerDates.endDate,
    endTime: this.pickerDates.endTime
  };

  elevation = 5;
  startDate = false;
  startTime = false;

  endDate = false;
  endTime = false;
  counter = 0;

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

  handleDateUpdates({
    key,
    data
  }: {
    key: keyof ChecklistDateTimeObject;
    data: string;
  }): void {
    Vue.set(this.picker, key, data);
  }

  get pickerDates(): ChecklistDateTimeObject {
    return {
      startDate: this.dateObject.startDate,
      startTime: this.dateObject.startTime,
      endDate: this.dateObject.endDate,
      endTime: this.dateObject.endTime
    };
  }

  get isDarkMode(): boolean {
    return this.$store.getters.isDarkMode;
  }
}
</script>
<style lang="scss"></style>
