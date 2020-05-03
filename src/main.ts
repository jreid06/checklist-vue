import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./registerServiceWorker";
import { BootstrapVue, BootstrapVueIcons } from "bootstrap-vue";

Vue.use(BootstrapVue);
Vue.use(BootstrapVueIcons);

import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
import vuetify from "./plugins/vuetify";

Vue.config.productionTip = false;

router.beforeEach((to, from, next) => {
  if (!store.getters.isDataLoaded) {
    console.log('init app');
    store.dispatch('loadChecklists');
    store.dispatch('setAppMode');
  }

  next();
})

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount("#app");
