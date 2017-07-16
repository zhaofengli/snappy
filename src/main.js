// == Vue & friends==
import Vue from 'vue';
import Vuetify from 'vuetify';

// == Styling ==
import 'webpack-material-design-icons';
import './stylus/main.styl';

// == Base component ==
import App from './App';

// == Router ==
import router from './router';

// == Vuex ==
import store from './store';

// == For your console pleasure ==
import Genosets from './snappy/Genosets';
import Genotypes from './snappy/Genotypes';
import Analyzer from './snappy/Analyzer';
import Utils from './snappy/Utils';

window.Genosets = Genosets;
window.Genotypes = Genotypes;
window.Analyzer = Analyzer;
window.Utils = Utils;

// == Vue modules ==
Vue.use(Vuetify);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App),
});
