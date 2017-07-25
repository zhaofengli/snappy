import Vue from 'vue';
import Vuex from 'vuex';

import files from './modules/files';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    online: true,
  },
  modules: {
    files,
  },
  mutations: {
    setOnlineStatus(state, online) {
      state.online = online;
    },
  },
});
