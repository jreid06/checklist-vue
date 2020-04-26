import Vue from "vue";
import Vuex, { StoreOptions } from "vuex";
import { Checklist, ChecklistInterface } from '../classes/Checklist';
import { LocalStorageService, checkListsKey } from '../services/LocalStorageService';

Vue.use(Vuex);

export default new Vuex.Store<any>({
  state: {
    dataLoaded: false,
    checklists: [],
    selectedChecklist: null
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
    updateChecklist(state: AppState, checklist: Checklist) {
      state.checklists.map((c) => {
        if (c.id === checklist.id) {
          Object.assign(c, checklist);
        }
      })
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
    }
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
  }