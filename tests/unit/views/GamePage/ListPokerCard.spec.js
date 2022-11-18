import ListPokerCard from '@/views/GamePage/ListPokerCard';
import { createLocalVue, shallowMount } from '@vue/test-utils';
import Vuetify from 'vuetify';
import Vuex from 'vuex';
import gameActions from '@/store/modules/game/action_types';
import gameGetters from '@/store/modules/game/getter_types.js';
import gameMutations from '@/store/modules/game/mutation_types.js';
jest.mock('jwt-decode');

afterEach(() => {
  jest.clearAllMocks();
});

describe('ListPokerCard.vue', () => {
  const localVue = createLocalVue();
  localVue.use(Vuex);
  describe('Props', () => {
    let getters, actions, vuetify, store, mutations;
    let wrapperFactory = (localVue, vuetify, propsData, store) => {
      return shallowMount(ListPokerCard, {
        localVue,
        vuetify,
        propsData,
        store,
      });
    };
    beforeEach(() => {
      vuetify = new Vuetify();
      getters = {
        [gameGetters.GET_DETAIL_BY_ID]: jest.fn(),
      };
      actions = {
        [gameActions.ACT_GET_DETAIL_BY_ID]: jest.fn(),
      };
      store = new Vuex.Store({ getters, actions });
    });
    describe('listNumber props', () => {
      it('Case 1: Should return list deafault when not have param listnumber ', () => {
        const defaultValue = [0, 1, 3, 5, 8, 13, 21, 34, 55, 89];
        const propsData = {};
        const wrapper = wrapperFactory(
          localVue,
          vuetify,
          propsData,
          store,
          data
        );
        expect(wrapper.props().listNumber()).toEqual(defaultValue);
      });

      it('Case 2: Should return list when true param listNumber ', () => {
        const listNumber = () => [0, 2, 4, 6, 7, 9];
        const propsData = { listNumber };
        const wrapper = wrapperFactory(localVue, vuetify, propsData, store);
        expect(wrapper.props().listNumber()).toEqual([0, 2, 4, 6, 7, 9]);
      });
    });

    describe('isDisable props', () => {
      it('Case 1: Should return true when props isDiable is true', () => {
        const isDisable = true;
        const propsData = { isDisable };
        const wrapper = wrapperFactory(localVue, vuetify, propsData, store);
        expect(wrapper.props().isDisable).toEqual(true);
      });
      it('Case 1: Should return true when props isDiable is true', () => {
        const isDisable = true;
        const propsData = { isDisable };
        const wrapper = wrapperFactory(localVue, vuetify, propsData, store);
        expect(wrapper.props().isDisable).toEqual(true);
      });
    });
  });

  describe('Method', () => {
    let getters, actions, vuetify, store;
    let wrapperFactory = (localVue, vuetify, propsData, store, data) => {
      return shallowMount(ListPokerCard, {
        localVue,
        vuetify,
        propsData,
        store,
        data,
      });
    };
    beforeEach(() => {
      jest.clearAllMocks();
    });
    describe('onClickCardItem', () => {
      it('Case 1: should not call getSelectedCard when props isDisable(true) ', async () => {
        const isDisable = true;

        const propsData = { isDisable, getSelectedCard: jest.fn() };
        const wrapper = wrapperFactory(localVue, vuetify, propsData, store);

        expect(wrapper.vm.getSelectedCard).toHaveBeenCalledTimes(0);
      });

      it('Case 2 should call getSelectedCard and set selcetedItem null when props isDisable(fasle) ', async () => {
        const cardItem = 3;
        const isDisable = false;
        const getSelectedCard = function() {
          return true;
        };
        const data = () => {
          return { selectedItem: 10 };
        };
        const propsData = { isDisable, getSelectedCard: jest.fn() };
        const wrapper = wrapperFactory(
          localVue,
          vuetify,
          propsData,
          store,
          data
        );
        wrapper.vm.onClickCardItem(cardItem);
        expect(wrapper.vm.selectedItem).toBe(3);
        expect(wrapper.vm.getSelectedCard).toHaveBeenCalledTimes(1);
      });
      it('Case 3 should call getSelectedCard and set selcetedItem value when props isDisable(fasle) an selectedCard eual item ', async () => {
        const cardItem = 3;
        const isDisable = false;
        const data = function() {
          return {
            selectedItem: 3,
          };
        };
        const propsData = { isDisable, getSelectedCard: jest.fn() };
        const wrapper = wrapperFactory(
          localVue,
          vuetify,
          propsData,
          store,
          data
        );
        wrapper.vm.onClickCardItem(cardItem);
        expect(wrapper.vm.selectedItem).toBeNull();
        expect(wrapper.vm.getSelectedCard).toHaveBeenCalledTimes(1);
      });
    });
    describe('onChangeInput', () => {
      let actions, store, mutations;
      beforeEach(() => {
        actions = {
          actionClick: jest.fn(),
          actionInput: jest.fn(),
        };
        mutations = {
          [gameActions.GAME_SNACKBAR]: jest.fn(),
        };
        store = new Vuex.Store({
          actions,
          mutations,
        });
      });
      it('Case 1: should  call getSelectedCard when props number is string number', async () => {
        const number = '23';

        const propsData = { getInputCard: jest.fn() };
        const wrapper = wrapperFactory(localVue, vuetify, propsData, store);
        wrapper.vm.onChangeInput(number);

        expect(wrapper.vm.getInputCard).toHaveBeenCalledTimes(1);
      });
      it('Case 2: should not call getSelectedCard when props number is string', async () => {
        const number = 'String';

        const propsData = { getInputCard: jest.fn() };
        const wrapper = wrapperFactory(localVue, vuetify, propsData, store);
        wrapper.vm.onChangeInput(number);

        expect(wrapper.vm.getInputCard).toHaveBeenCalledTimes(0);
      });
      it('Case 3: should not call getSelectedCard when props number is float', async () => {
        const number = '23.3';

        const propsData = { getInputCard: jest.fn() };
        const wrapper = wrapperFactory(localVue, vuetify, propsData, store);
        wrapper.vm.onChangeInput(number);

        expect(wrapper.vm.getInputCard).toHaveBeenCalledTimes(0);
      });
      it('Case 4: should not call getSelectedCard when props number is negative', async () => {
        const number = '-45';

        const propsData = { getInputCard: jest.fn() };
        const wrapper = wrapperFactory(localVue, vuetify, propsData, store);
        wrapper.vm.onChangeInput(number);

        expect(wrapper.vm.getInputCard).toHaveBeenCalledTimes(0);
      });
      it('Case 4: should not call getSelectedCard when props number is over 999', async () => {
        const number = '1000';

        const propsData = { getInputCard: jest.fn() };
        const wrapper = wrapperFactory(localVue, vuetify, propsData, store);
        wrapper.vm.onChangeInput(number);

        expect(wrapper.vm.getInputCard).toHaveBeenCalledTimes(0);
      });
    });

    describe('onFocusInput', () => {
      it('Case 1: should set selectedItem null when call) ', async () => {
        const data = function() {
          return {
            selectedItem: 3,
          };
        };
        const propsData = { onFocusInput: jest.fn() };
        const wrapper = wrapperFactory(
          localVue,
          vuetify,
          propsData,
          store,
          data
        );
        wrapper.vm.onFocusInput();

        expect(wrapper.vm.selectedItem).toBeNull();
      });
    });
  });
});
