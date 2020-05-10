<template>
  <div
    v-if="checklistItem"
    class="border d-flex align-content-center mb-2 rounded px-3"
    :class="{ 'border-danger': !isComplete, 'border-success': isComplete }"
    @mouseleave="toggleEditMode(false)"
  >
    <v-checkbox
      :color="isComplete ? 'success' : 'red darken-3'"
      v-model="checklistItem.itemStatus"
      class="checklist-checkbox mr-2"
    >
      <template v-slot:label> </template>
    </v-checkbox>
    <div
      class="checklist-checkbox--content d-flex justify-content-center flex-no-wrap"
    >
      <div
        v-if="!editMode"
        class="checklist-checkbox--content--item-name pr-2 flex-1"
        @click="toggleEditMode(true)"
      >
        <p>{{ checklistItem.itemName }}</p>
      </div>
      <div class="d-flex flex-1" v-else>
        <v-text-field
          v-model="checklistItem.itemName"
          @keyup.13="toggleEditMode(false)"
        ></v-text-field>
        <v-icon
          :style="{ top: '-5px' }"
          @click="toggleEditMode(false)"
          class="px-2"
        >
          mdi-pencil-off-outline
        </v-icon>
      </div>
      <v-icon
        v-if="!editMode"
        class="px-3"
        :color="isComplete ? 'success' : '#a82e28'"
        :style="{ top: '-5px' }"
        @click="deleteChecklistItem"
      >
        mdi-close-outline
      </v-icon>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import { ChecklistItem } from "@/classes/Checklist";

@Component
export default class ChecklistItemDiv extends Vue {
  @Prop({ required: true }) item!: ChecklistItem;

  editMode = false;
  checklistItem: ChecklistItem | null = null;

  @Watch("item", { immediate: true })
  setComponentState(item: ChecklistItem) {
    this.checklistItem = item;
  }

  get isComplete(): boolean {
    return this.item.itemStatus;
  }

  deleteChecklistItem(): void {
    this.$emit("deleteChecklistItem", this.item.itemId);
  }

  toggleEditMode(status: boolean): void {
    this.editMode = status;
  }
}
</script>
<style lang="scss">
.checklist-checkbox {
  .v-input__control {
    top: -20px;
  }

  &--content {
    position: relative;
    top: 5px;

    &--item-name {
      display: flex;
      justify-content: center !important;
      flex-direction: column;
    }
  }
}
</style>
