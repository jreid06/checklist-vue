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
import { Component, Vue, Watch } from "vue-property-decorator";

@Component
export default class DateTimePicker extends Vue {
  picker: {
    startTime: string | null;
    startDate: string | null;
    endTime: string | null;
    endDate: string | null;
  } = {
    startDate: null,
    startTime: null,
    endDate: null,
    endTime: null
  };

  startDate = false;
  startTime = false;

  endDate = false;
  endTime = false;

  @Watch("picker", { deep: true })
  onDateTimeChange() {
    this.$emit("dateTimeChange", this.picker);
  }
}
</script>
<style lang="scss"></style>
