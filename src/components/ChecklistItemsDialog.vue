<template>
  <v-dialog
    v-model="dialogOpen"
    scrollable
    persistent
    :max-width="maxWidth"
    :dark="darkMode"
  >
    <v-card v-if="editableChecklist">
      <v-card-title>
        <v-list-item-avatar :color="editableChecklist.color">
        </v-list-item-avatar>
        <span class="headline text-capitalize">{{
          editableChecklist.title
        }}</span>
        <v-spacer></v-spacer>
        <div class="d-flex">
          <div class="flex-grow-1 pr-4">
            <v-text-field
              v-model="formData.itemName"
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
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12">
              <div class="">
                <template v-if="items.length">
                  <div
                    v-for="item in items"
                    :key="item.itemId"
                    :style="{ height: '30px' }"
                    class="d-flex mr-2 mb-2 border rounded"
                  >
                    <v-checkbox
                      v-model="item.itemStatus"
                      :label="item.itemName"
                      class="checklist-checkbox mr-2"
                    ></v-checkbox>
                    <v-icon @click="deleteChecklistItem(item.itemId)">
                      mdi-close-outline
                    </v-icon>
                  </div>
                </template>
                <template v-else>
                  <v-alert
                    class=""
                    type="info"
                    outlined
                    width="100%"
                    elevation="2"
                  >
                    No list items created
                  </v-alert>
                </template>
              </div>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="emitClose">Cancel</v-btn>
        <v-btn color="blue darken-1" text @click="updateChecklistItems(false)">
          Save
        </v-btn>
        <v-btn color="blue darken-1" text @click="updateChecklistItems(true)">
          Save & close
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import { Checklist, ChecklistItem } from "@/classes/Checklist";

@Component
export default class ChecklistItemsDialog extends Vue {
  @Prop({ default: "700px" }) maxWidth!: string;
  @Prop({ default: false }) dialogOpen!: boolean;
  @Prop({ default: false }) darkMode!: boolean;

  items: ChecklistItem[] = [];
  formData: { itemName: string } = {
    itemName: ""
  };

  @Watch("editableChecklist")
  onEditchecklistChange(checklist: Checklist) {
    if (checklist) {
      this.items = JSON.parse(JSON.stringify(checklist.items));
    }
  }

  get editableChecklist(): Checklist | undefined {
    const checklist = this.$store.getters.getEditableChecklist as
      | Checklist
      | undefined;

    if (checklist) {
      return checklist;
    }

    return checklist as undefined;
  }

  addChecklistItem(): void {
    if (!this.formData.itemName) return;
    const item: ChecklistItem = {
      itemId: Date.now(),
      itemName: this.formData.itemName,
      itemStatus: false
    };

    this.items.push(item);
    this.formData.itemName = "";
  }

  getChecklist(): Checklist {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return (this.$store.getters.checklists as Checklist[]).find(
      c => c.id === this.editableChecklist?.id
    )!;
  }

  updateChecklistItems(closeDialog: boolean): void {
    this.$store.dispatch("updateChecklistItems", {
      items: this.items,
      checklistId: this.editableChecklist?.id
    });

    if (closeDialog) this.emitClose();
    else {
      // update the selected checklist
      this.$store.commit(
        "setEditableChecklist",
        JSON.parse(JSON.stringify(this.getChecklist()))
      );
    }
  }

  deleteChecklistItem(itemId: number): void {
    this.items.splice(
      this.items.findIndex(x => x.itemId === itemId),
      1
    );
  }

  emitClose(): void {
    this.$emit("closeDialog");
  }
}
</script>

<style></style>
