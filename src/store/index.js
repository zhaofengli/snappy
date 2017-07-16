import Vue from 'vue';
import Vuex from 'vuex';

import files from './modules/files';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
  },
  modules: {
    files,
  },
});
