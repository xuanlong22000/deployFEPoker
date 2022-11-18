import Vue from 'vue';
import Vuetify from 'vuetify';
import Vuex from 'vuex';
import { createLocalVue } from '@vue/test-utils';

Vue.config.productionTip = false;
Vue.use(Vuetify);
Vue.use(Vuex);

const localVue = createLocalVue();
const vuetify = new Vuetify({
  theme: {
    themes: {
      light: {
        // pp: plan poker
        ppblue: '#3597e2',
        ppred: '#eb907d',
        ppviolet: '#7854c0',
        ppgreen: '#73B436'
      },
    },
  },
});

localVue.use(vuetify);

export default {
  localVue,
  vuetify,
};
