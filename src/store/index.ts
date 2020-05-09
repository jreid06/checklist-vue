import Vue from "vue";
import Vuex, { StoreOptions } from "vuex";
import { Checklist, ChecklistInterface, ChecklistItem } from '../classes/Checklist';
import { LocalStorageService, checkListsKey } from '../services/LocalStorageService';

Vue.use(Vuex);

export default new Vuex.Store<any>({
  state: {
    dataLoaded: false,
    checklists: [],
    selectedChecklist: null,
    currentMode: 'light'
  },
  getters: {
    checklists: (state: AppState) => {
      return state.checklists;
    },
    isDataLoaded: (state: AppState) => {
      return state.dataLoaded;
    },
    getEditableChecklist: (state: AppState) => {
      return state.selectedChecklist;
    },
    getChecklists: (state: AppState) => {
      return state.checklists;
    },
    getChecklist: (state: AppState, id: number) => {
      return state.checklists.find(x => x.id === id);
    },
    getAppMode: (state: AppState) => {
      return state.currentMode;
    },
    isDarkMode: (state: AppState) => state.currentMode === 'dark'
  },
  mutations: {
    addChecklist(state: AppState, checklist: Checklist) {
      state.checklists.push(checklist);
    },
    setEditableChecklist(state: AppState, checklist: Checklist) {
      state.selectedChecklist = checklist;
    }, 
    removeEditableChecklist(state: AppState) {
      state.selectedChecklist = null;
    },
    deleteChecklistItem(state: AppState, {checklistId, itemId}: {checklistId: number, itemId: number}) {
      const checklist = state.checklists.find(c => c.id === checklistId);
      if (checklist) {
        const checklistItemLocation = checklist.items.findIndex(x => x.itemId === itemId);
        state.checklists.find(c => c.id === checklistId)!.items.splice(checklistItemLocation, 1);
      }
    },
    updateChecklistItems(state: AppState, {items, checklistId}:{items: ChecklistItem[], checklistId: number}) {
      state.checklists.map((c) => {
        if (c.id === checklistId) {
          c.items = items;
        }
        return c;
      })
    },
    updateChecklist(state: AppState, checklist: Checklist) {
      state.checklists.map((c) => {
        if (c.id === checklist.id) {
          Object.assign(c, checklist);
        }
        return c;
      })
    },
    setAppMode(state: AppState, mode: "light" | "dark") {
      state.currentMode = mode;
    },
    deleteChecklist(state: AppState, checklistId: number) {
      const itemLocation = state.checklists.findIndex(x => x.id === checklistId);
      state.checklists.splice(itemLocation, 1);
    },  
    toggleLoadState(state: AppState) {
      state.dataLoaded = !state.dataLoaded;
    },
    initChecklistsFromStorage(state: AppState, checklists: Checklist[]) {
      state.checklists = checklists;
    }
  },
  actions: {
    loadChecklists({commit}) {
      const savedChecklists = LocalStorageService.getData<ChecklistInterface[]>(checkListsKey)?.map((ci) => new Checklist(ci));
      if (savedChecklists) {
        commit('toggleLoadState');
        commit('initChecklistsFromStorage', savedChecklists);
      }
    },
    updateChecklistsInStorage({ getters }) {
      LocalStorageService.setData(checkListsKey, getters.checklists);
    },
    updateChecklistItems({commit, dispatch}, data:{items: ChecklistItem[], checklistId: number}) {
      commit('updateChecklistItems', data);
      dispatch('updateChecklistsInStorage');
    },
    saveChecklist({commit, dispatch}, checklist: Checklist) {
      commit('addChecklist', checklist);
      dispatch('updateChecklistsInStorage');
    },
    updateChecklist({commit, dispatch}, checklist: Checklist) {
      commit('updateChecklist', checklist);
      dispatch('updateChecklistsInStorage');
    },
    deleteChecklist({commit, dispatch}, checklistId: number) {
      commit('deleteChecklist', checklistId);
      dispatch('updateChecklistsInStorage');
    },
    setAppMode({commit}) {
      const savedAppMode = LocalStorageService.getData<"light"|"dark">("appMode");
      if (savedAppMode) {
        commit('setAppMode', savedAppMode);
      }
    },
    updateAppMode({ commit }, mode: "light" | "dark") {
      commit('setAppMode', mode);
      LocalStorageService.setData("appMode", mode);
    },
  },
  modules: {}
} as VueXCustom );

interface VueXCustom extends StoreOptions<any> {
  state: AppState
}

interface AppState {
    checklists: Checklist[],
    dataLoaded: boolean;
    selectedChecklist: Checklist | null;
    currentMode: "light" | "dark";
  }