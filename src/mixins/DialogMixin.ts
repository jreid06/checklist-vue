import { Component, Vue, Mixins } from 'vue-property-decorator';

@Component
export default class DialogMixin extends Vue {
    isChecklistDialogOpen = false;
    isChecklistItemDialogOpen = false;
    isConfirmDialogOpen = false;

    get editableChecklist(): boolean {
        return !!this.$store.getters.getEditableChecklist;
    }

    get dialogMode(): "create" | "edit" {
        return this.editableChecklist ? "edit" : "create";
    }

    handleConfirmDialog(): void {
        this.isConfirmDialogOpen = !this.isConfirmDialogOpen;
    }

    handleChecklistDialog(): void {
        this.isChecklistDialogOpen = !this.isChecklistDialogOpen;

        if (!this.isChecklistDialogOpen && this.editableChecklist) {
            this.$store.commit("removeEditableChecklist");
        }
    }

    handleChecklistItemDialog(): void {
        this.isChecklistItemDialogOpen = !this.isChecklistItemDialogOpen;

        if (!this.isChecklistItemDialogOpen && this.editableChecklist) {
            this.$store.commit("removeEditableChecklist");
        }
    }

    toggleDialog(dialogName: string): void {
        if (dialogName === "checklist") this.handleChecklistDialog();

        if (dialogName === "checklistItem") this.handleChecklistItemDialog();

         if (dialogName === "confirm") this.handleConfirmDialog();
    }

}