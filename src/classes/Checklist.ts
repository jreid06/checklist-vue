export interface AppIChecklist {
    title: string;
    dateStart: Date;
    dateEnd: Date;
    description: string | null;
}

export class Checklist implements AppIChecklist {
    title!: string;
    dateStart!: Date;
    dateEnd!: Date;
    description!: string | null;

    constructor(params: AppIChecklist) {
        this.title = params.title;
        this.dateStart = params.dateStart;
        this.dateEnd = params.dateEnd;
        this.description = params.description || null;
    }

    getName(): string {
        return this.title;
    }

    changeDateStart(newDate: Date): void {
        this.dateStart = new Date(newDate);
    }

    changeDateEnd(newDate: Date): void {
        this.dateEnd = new Date(newDate);
    }

}