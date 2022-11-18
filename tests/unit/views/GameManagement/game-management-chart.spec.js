import { shallowMount, createLocalVue } from '@vue/test-utils';
import GameManagementChart from '@/views/GameManagement/GameManagementChart.vue';
import Vuex from 'vuex';
import gameModule from '../../../../src/store/modules/game';
import actionTypes from '../../../../src/store/modules/game/action_types';
import Vuetify from 'vuetify';

const localVue = createLocalVue();

localVue.use(Vuex);

afterEach(() => {
  jest.clearAllMocks();
});

describe('GameManagementModal.vue', () => {
  let actions;
  let store;
  const localVue = createLocalVue();
  localVue.use(Vuex);
  describe('Props', () => {
    let state, getters, actions, vuetify, store, mutations;
    let wrapperFactory = (localVue, vuetify, propsData, store) => {
      return shallowMount(GameManagementChart, {
        localVue,
        vuetify,
        propsData,
        store,
      });
    };
    beforeEach(() => {
      vuetify = new Vuetify();
      actions = {
        [actionTypes.GET_GAME]: jest.fn(),
      };
      store = new Vuex.Store({ getters, actions });
    });
    describe('labels prop', () => {
      it('Should return default value when not pass labels props', async () => {
        const propsData = {};
        const wrapper = wrapperFactory(localVue, vuetify, propsData, store);
        expect(wrapper.props().labels).toEqual([]);
      });

      it('Should return prop value when pass labels props', async () => {
        const labels = [1, 2, 3];
        const propsData = { labels };
        const wrapper = wrapperFactory(localVue, vuetify, propsData, store);
        expect(wrapper.props().labels).toEqual(labels);
      });
    });

    describe('data prop', () => {
      it('Should return default value when not pass data props', async () => {
        const propsData = {};
        const wrapper = wrapperFactory(localVue, vuetify, propsData, store);
        expect(wrapper.props().data).toEqual([]);
      });

      it('Should return prop data value when pass members props', async () => {
        const data = [1, 2, 3];
        const propsData = { data };
        const wrapper = wrapperFactory(localVue, vuetify, propsData, store);
        expect(wrapper.props().data).toEqual(data);
      });
    });

    describe('all props', () => {
      it('Should return default value when not pass props data', async () => {
        const propsData = {};
        const wrapper = wrapperFactory(localVue, vuetify, propsData, store);
        expect(wrapper.props().data).toEqual([]);
        expect(wrapper.props().labels).toEqual([]);
      });

      it('Should return prop data value when pass members props', async () => {
        const data = [1, 2, 3];
        const labels = [1, 2, 3];
        const propsData = { data, labels };
        const wrapper = wrapperFactory(localVue, vuetify, propsData, store);
        expect(wrapper.props().data).toEqual(data);
        expect(wrapper.props().labels).toEqual(labels);
      });
    });

    describe('Methods', () => {
      let getters, actions, vuetify, store, propsData;
      let wrapperFactory = (localVue, vuetify, propsData, store, data) => {
        return shallowMount(GameManagementChart, {
          localVue,
          vuetify,
          propsData,
          store,
          data,
        });
      };
      actions = {
        [actionTypes.GET_GAME]: jest.fn(),
      };
      beforeEach(() => {
        jest.clearAllMocks();
        store = new Vuex.Store({ getters, actions });
      });

      it('Should call getGame component created', async () => {
        let wrapper = wrapperFactory(localVue, vuetify, propsData, store);
        const getGameMethod = jest
          .spyOn(GameManagementChart, 'created')
          .mockImplementation(() => {
            return true;
          });
        const getGame = wrapper.vm.getGame();
        expect(getGameMethod).toHaveBeenCalledTimes(0);
      });
    });
  });
});
