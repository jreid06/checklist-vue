<template>
  <v-toolbar
    class="date-toolbar px-3 py-2"
    :dark="isDarkMode"
    elevation="0"
    short
    dense
  >
    <v-btn height="36" icon @click="today">
      <v-icon>mdi-alarm</v-icon>
      <div>Today</div>
    </v-btn>

    <v-btn height="36" icon @click="addDays(1)">
      <v-icon>mdi-alarm</v-icon>
      <div>Tomorrow</div>
    </v-btn>

    <v-btn height="36" icon @click="addDays(2)">
      <v-icon>mdi-alarm</v-icon>
      <div><v-icon small>mdi-plus</v-icon>2 days</div>
    </v-btn>

    <v-btn height="36" icon @click="addDays(7)">
      <v-icon>mdi-alarm</v-icon>
      <div><v-icon small>mdi-plus</v-icon>A Week</div>
    </v-btn>
  </v-toolbar>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { ChecklistDateTimeObject } from "../classes/Checklist";

@Component
export default class DateTimeToolbar extends Vue {
  @Prop({ required: true }) keyName!: keyof ChecklistDateTimeObject;

  today(): void {
    const today = new Date();
    const month =
      today.getMonth() + 1 < 10
        ? `0${today.getMonth() + 1}`
        : today.getMonth() + 1;
    const day = today.getDate() < 10 ? `0${today.getDate()}` : today.getDate();
    const formatted = `${today.getFullYear()}-${month}-${day}`;
    this.$emit("updateDate", { key: this.keyName, data: formatted });
  }

  addDays(days: number): void {
    const date = new Date();
    date.setDate(date.getDate() + days);

    const month =
      date.getMonth() + 1 < 10
        ? `0${date.getMonth() + 1}`
        : date.getMonth() + 1;
    const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
    const formatted = `${date.getFullYear()}-${month}-${day}`;
    this.$emit("updateDate", { key: this.keyName, data: formatted });
  }

  get isDarkMode(): boolean {
    return this.$store.getters.isDarkMode;
  }
}
</script>
<style lang="scss">
@import "@/assets/scss/Media.scss";
.date-toolbar {
  border-radius: 10px;

  .v-btn {
    width: initial !important;
  }

  .v-toolbar__content {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;

    .v-btn {
      margin-left: 0 !important;
      @include for-size(tablet-portrait) {
        margin-left: initial;
      }
    }

    @include for-size(tablet-portrait) {
      flex-wrap: no-wrap;
    }
  }
}
</style>
