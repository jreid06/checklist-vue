import { ChecklistItem, ChecklistDateTimeObject } from "@/classes/Checklist";

export interface ChecklistFormDataInterface {
    checklistName: string;
    checklistColor: string;
    checklistDescription: string | null;
    checklistItems: ChecklistItem[];
    checklistDates: ChecklistDateTimeObject;
    checklistListItemName: string;
}

export class ChecklistFormData {
    checklistName!: string ;
    checklistColor!: string;
    checklistDescription: string | null = null;
    checklistItems: ChecklistItem[] = [];
    checklistDates!: ChecklistDateTimeObject;
    checklistListItemName!: string;

    constructor(params: ChecklistFormDataInterface | null) {
        this.checklistName = params ? params.checklistName : "";
        this.checklistColor = params ? params.checklistColor : "";
        this.checklistDescription = params ? params.checklistDescription : null;
        this.checklistItems = params ? params.checklistItems : [];
        this.checklistDates = params ? params.checklistDates : { startDate: null, startTime: null, endDate: null, endTime: null};
        this.checklistListItemName = params ? params.checklistListItemName : "";
    }

}