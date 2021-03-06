<template>
  <div class=" mb-3">
    <v-container>
      <v-row>
        <v-col cols="12" class="position-relative">
          <v-toolbar
            class="w-100"
            flat
            :color="!isDarkMode ? 'white' : '#000'"
            :dark="isDarkMode"
          >
            <v-container>
              <v-row>
                <v-col cols="6" md="2">
                  <v-btn
                    class="mr-4"
                    :dark="isDarkMode"
                    :outlined="true"
                    @click="setToday"
                  >
                    Today
                  </v-btn>
                </v-col>

                <v-col cols="6" md="2">
                  <v-menu bottom right :dark="isDarkMode">
                    <template v-slot:activator="{ on }">
                      <v-btn v-on="on" :dark="isDarkMode" :outlined="true">
                        <span>{{ typeToLabel[type] }}</span>
                        <v-icon right>mdi-menu-down</v-icon>
                      </v-btn>
                    </template>
                    <v-list :dark="isDarkMode">
                      <v-list-item @click="type = 'day'">
                        <v-list-item-title>Day</v-list-item-title>
                      </v-list-item>
                      <v-list-item @click="type = 'week'">
                        <v-list-item-title>Week</v-list-item-title>
                      </v-list-item>
                      <v-list-item @click="type = 'month'">
                        <v-list-item-title>Month</v-list-item-title>
                      </v-list-item>
                      <v-list-item @click="type = '4day'">
                        <v-list-item-title>4 days</v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </v-col>

                <v-col cols="12" md="8">
                  <div class="d-flex">
                    <v-btn
                      fab
                      text
                      small
                      color="grey darken-2"
                      @click="$refs.calendar.prev()"
                    >
                      <v-icon small>mdi-chevron-left</v-icon>
                    </v-btn>
                    <v-toolbar-title class="flex-grow-1">
                      {{ title }}
                    </v-toolbar-title>
                    <v-btn
                      fab
                      text
                      small
                      color="grey darken-2"
                      @click="$refs.calendar.next()"
                    >
                      <v-icon small>mdi-chevron-right</v-icon>
                    </v-btn>
                  </div>
                </v-col>
              </v-row>
            </v-container>
          </v-toolbar>
        </v-col>
        <v-col cols="12" class="checklist-calendar">
          <v-calendar
            class="checklist-calendar-component mt-5"
            ref="calendar"
            :color="isDarkMode ? '#000' : '#fff'"
            :dark="isDarkMode"
            v-model="value"
            :weekdays="weekday"
            :type="type"
            :events="allEvents"
            :event-overlap-mode="mode"
            :event-overlap-threshold="30"
            :event-color="getEventColor"
            @change="handleChange"
            @click:event="handleEventClicked"
          ></v-calendar>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
<script lang="ts">
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Component, Vue } from "vue-property-decorator";
import { CalendarEvent, CalendarTimestamp } from "vuetify";
import {
  Checklist,
  ChecklistDateTimeObject,
  ChecklistItem
} from "../classes/Checklist";

interface ChecklistCalendarEvent extends CalendarEvent {
  id: number;
  name: string;
  start: string;
  end: string;
  color: string;
  dates: ChecklistDateTimeObject;
  description: string;
  items: ChecklistItem[];
}

@Component
export default class ChecklistCalendar extends Vue {
  type = "week";
  typeToLabel = {
    month: "Month",
    week: "Week",
    day: "Day",
    "4day": "4 Days"
  };
  mode = "stack";
  currentdate = {
    month: "xcvxv",
    year: 0
  };
  start: string | null = null;
  end: string | null = null;
  weekday = [1, 2, 3, 4, 5, 6, 0];
  weekdays = [
    { text: "Mon - Sun", value: [1, 2, 3, 4, 5, 6, 0] },
    { text: "Mon - Fri", value: [1, 2, 3, 4, 5] },
    { text: "Sat & Sun", value: [6, 0] }
  ];
  value = "";

  get isDarkMode(): boolean {
    return this.$store.getters.isDarkMode;
  }

  get title() {
    return `${new Date(this.currentdate.month || Date.now()).toLocaleString(
      "default",
      {
        month: "long"
      }
    )} ${this.currentdate.year || new Date(Date.now()).getFullYear()}`;
  }

  handleChange(e: { start: CalendarTimestamp }) {
    Vue.set(this.currentdate, "month", e.start.date);
    Vue.set(this.currentdate, "year", e.start.year);
  }

  get allEvents(): ChecklistCalendarEvent[] {
    const checklists = this.$store.getters.getChecklists as Checklist[];
    return checklists.map(c => {
      const { dates } = c;
      const { startTime, startDate, endTime, endDate } = dates;

      const startTimetest = `${startDate}-${
        startTime ? startTime : null
      }`.split("-");
      const endTimetest = `${endDate}-${endTime ? endTime : null}`.split("-");

      return {
        name: c.title,
        start: this.formatDateTime(startTimetest, "-"),
        end: this.formatDateTime(endTimetest, "-"),
        color: c.color,
        dates: c.dates,
        id: c.id,
        description: c.description,
        items: c.items
      } as ChecklistCalendarEvent;
    });
  }

  formatDateTime(date: string[], delimeter: string): string {
    for (let i = 0; i < date.length; i++) {
      if (date[i] === "null") {
        date.splice(i, 1);
      }
    }

    return date.join(delimeter);
  }

  setToday() {
    this.value = Date.now().toString();
  }

  handleEventClicked({ event }: { event: ChecklistCalendarEvent }) {
    const checklist = new Checklist({
      color: event.color,
      title: event.name,
      dates: event.dates,
      description: event.description,
      id: event.id,
      items: event.items
    });

    this.$emit("editChecklistItem", {
      id: checklist.id,
      dialogName: "checklistItem"
    });
  }

  getEventColor(event: ChecklistCalendarEvent) {
    return event.color;
  }
}
</script>
<style lang="scss">
.checklist-calendar {
  height: 600px;
  overflow: auto;
  &::-webkit-scrollbar {
    display: none;
  }
}

.v-toolbar {
  height: initial !important;
  &__content {
    height: initial !important;
  }
}
</style>
