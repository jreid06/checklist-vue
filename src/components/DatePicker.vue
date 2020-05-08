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
        <v-date-picker v-if="endTime" v-model="date" value="llss" full-width>
          <v-spacer></v-spacer>
          <v-btn text color="primary" @click="endTime = false">Cancel</v-btn>
          <v-btn text color="primary" @click="$refs.dialog.save(date)"
            >OK</v-btn
          >
        </v-date-picker>
      </v-dialog>
    </template>

    <template v-if="type === 'menu'">
      <v-menu
        :dark="isDarkMode"
        ref="endDate"
        v-model="endTime"
        :close-on-content-click="false"
        :return-value.sync="date"
        transition="scale-transition"
        offset-y
        min-width="290px"
      >
        <template v-slot:activator="{ on }">
          <v-text-field
            v-model="date"
            :label="pickerLabel"
            readonly
            v-on="on"
          ></v-text-field>
        </template>
        <v-date-picker v-model="date" no-title scrollable>
          <v-spacer></v-spacer>
          <v-btn text color="primary" @click="endTime = false">Cancel</v-btn>
          <v-btn text color="primary" @click="$refs.endDate.save(date)"
            >OK</v-btn
          >
        </v-date-picker>
      </v-menu>
    </template>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";

@Component
export default class DatePicker extends Vue {
  @Prop({ required: true }) keyToUpdate!: string;
  @Prop({ required: true }) value!: string;
  @Prop({ default: "custom label" }) pickerLabel!: string;
  @Prop({ default: "dialog" }) type!: "dialog" | "menu";

  @Watch("value", { immediate: true })
  onValueChange(value: string) {
    this.date = value;
  }

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
