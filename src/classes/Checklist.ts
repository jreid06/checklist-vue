export interface ChecklistInterface {
    id: number;
    title: string;
    color: string;
    dates: ChecklistDateTimeObject;
    description: string | null;
    items: ChecklistItem[];
}

export interface ChecklistDateTimeObject {
    startTime: string | null;
    startDate: string | null;
    endTime: string | null;
    endDate: string | null;
}

export interface ChecklistItem {
  itemId: number;
  itemName: string;
  itemStatus: boolean;
}

export class Checklist implements ChecklistInterface {
    id!: number;
    title!: string;
    dates!: ChecklistDateTimeObject;
    description: string | null = null;
    color!: string;
    items: ChecklistItem[] = []

    constructor(params: ChecklistInterface) {
        this.id = params.id;
        this.title = params.title;
        this.dates = params.dates;
        this.description = params.description || null;
        this.color = params.color;
        this.items = params.items;
    }

    getItems(): ChecklistItem[] {
        return this.items;
    }

    completeItems(): ChecklistItem[] {
        return this.items.filter(i => i.itemStatus);
    }

    inCompleteItems(): ChecklistItem[] {
        return this.items.filter(i => !i.itemStatus);
    }

    getName(): string {
        return this.title;
    }

    changeDateStart(newDate: Date): void {
        this.dates.startDate = new Date(newDate).toUTCString();
    }

    changeDateEnd(newDate: Date): void {
        this.dates.endDate = new Date(newDate).toUTCString();
    }

}