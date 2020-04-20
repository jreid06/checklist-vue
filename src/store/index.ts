import Vue from "vue";
import Vuex, { StoreOptions } from "vuex";
import { Checklist, ChecklistInterface } from '../classes/Checklist';
import { LocalStorageService, checkListsKey } from '../services/LocalStorageService';

Vue.use(Vuex);

export default new Vuex.Store<any>({
  state: {
    dataLoaded: false,
    checklists: []
  },
  getters: {
    checklists: (state: AppState) => {
      return state.checklists;
    },
    isDataLoaded: (state: AppState) => {
      return state.dataLoaded;
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
  }