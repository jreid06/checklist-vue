<template>
  <div>
    <template v-if="type === 'dialog'">
      <v-dialog
        ref="dialog"
        v-model="endTime"
        :return-value.sync="date"
        persistent
        :dark="isDarkMode"
        width="290px"
      >
        <template v-slot:activator="{ on }">
          <v-text-field
            v-model="date"
            :label="pickerLabel"
            readonly
            v-on="on"
          ></v-text-field>
        </template>
        <v-time-picker v-if="endTime" v-model="date" full-width>
          <v-spacer></v-spacer>
          <v-btn text color="primary" @click="endTime = false">Cancel</v-btn>
          <v-btn text color="primary" @click="$refs.dialog.save(date)"
            >OK</v-btn
          >
        </v-time-picker>
      </v-dialog>
    </template>

    <template v-if="type === 'menu'">
      <v-menu
        ref="endTime"
        v-model="endTime"
        :dark="isDarkMode"
        :close-on-content-click="false"
        :nudge-right="40"
        :return-value.sync="date"
        transition="scale-transition"
        offset-y
      >
        <template v-slot:activator="{ on }">
          <v-text-field
            v-model="date"
            :label="pickerLabel"
            readonly
            v-on="on"
          ></v-text-field>
        </template>
        <v-time-picker
          :dark="isDarkMode"
          v-if="endTime"
          landscape
          ampm-in-title
          v-model="date"
          full-width
          @click:minute="$refs.endTime.save(date)"
        ></v-time-picker>
      </v-menu>
    </template>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";

@Component
export default class TimePicker extends Vue {
  @Prop({ required: true }) keyToUpdate!: string;
  @Prop({ default: "custom label" }) pickerLabel!: string;
  @Prop({ default: "dialog" }) type!: "dialog" | "menu";

  @Watch("date", { deep: true })
  onDateChange(date: string) {
    this.$emit("dateUpdated", { data: date, key: this.keyToUpdate });
  }

  get isDarkMode(): boolean {
    return this.$store.getters.isDarkMode;
  }

  date: string | null = null;
  endTime = false;
}
</script>
<style lang="scss"></style>
