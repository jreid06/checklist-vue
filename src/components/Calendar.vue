<template>
  <div class="checklist-calendar mb-3">
    <v-sheet tile height="54" color="grey lighten-3" class="d-flex">
      <v-btn icon class="ma-2" @click="$refs.calendar.prev()">
        <v-icon>mdi-chevron-left</v-icon>
      </v-btn>
      <v-select
        v-model="type"
        :items="types"
        dense
        outlined
        hide-details
        class="ma-2"
        label="type"
      ></v-select>
      <v-select
        v-model="weekday"
        :items="weekdays"
        dense
        outlined
        hide-details
        label="weekdays"
        class="ma-2"
      ></v-select>
      <v-spacer></v-spacer>
      <v-btn icon class="ma-2" @click="$refs.calendar.next()">
        <v-icon>mdi-chevron-right</v-icon>
      </v-btn>
    </v-sheet>
    <v-calendar
      ref="calendar"
      v-model="value"
      :weekdays="weekday"
      :type="type"
      :events="allEvents"
      :event-overlap-mode="mode"
      :event-overlap-threshold="30"
      :event-color="getEventColor"
      @change="allEvents"
    ></v-calendar>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { CalendarEvent } from "vuetify";
import { Checklist } from "../classes/Checklist";

@Component
export default class ChecklistCalendar extends Vue {
  type = "month";
  types = ["month", "week", "day"];
  mode = "stack";
  weekday = [1, 2, 3, 4, 5, 6, 0];
  weekdays = [
    { text: "Mon - Sun", value: [1, 2, 3, 4, 5, 6, 0] },
    { text: "Mon - Fri", value: [1, 2, 3, 4, 5] },
    { text: "Sat & Sun", value: [6, 0] }
  ];
  value = "";

  get allEvents(): CalendarEvent[] {
    const checklists = this.$store.getters.getChecklists as Checklist[];
    return checklists.map(c => {
      return {
        name: c.title,
        start: c.dates.startDate,
        end: c.dates.endDate,
        color: c.color
      } as CalendarEvent;
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getEventColor(event: any) {
    return event.color;
  }

  formatDate(a: Date, withTime: boolean) {
    return withTime
      ? `${a.getFullYear()}-${a.getMonth() +
          1}-${a.getDate()} ${a.getHours()}:${a.getMinutes()}`
      : `${a.getFullYear()}-${a.getMonth() + 1}-${a.getDate()}`;
  }
}
</script>
