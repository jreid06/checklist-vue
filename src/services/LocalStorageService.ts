export const checkListsKey = "checkLists_vue";
export const modeKey = "appDarkLightMode_vue";

export class LocalStorageService {

    static itemExists(key: string): boolean {
        if (localStorage.getItem(key)) return true;

        return false;
    }

    static deleteItem(key: string): void {
        localStorage.removeItem(key);
    }

    static setData<T>(key: string, data: T): void {
        localStorage.setItem(key, JSON.stringify(data));
    }

    static getDataItem<T>(key: string, type: any): T | null {
        return new type(JSON.parse(localStorage.getItem(key)!));
    }

    static getData<T>(key: string): T | null {
        return JSON.parse(localStorage.getItem(key)!);
    }

}