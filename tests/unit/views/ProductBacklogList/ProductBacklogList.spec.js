import ProductBacklogList from '@/views/ProductBacklogList/ProductBacklogList';
import { createLocalVue, shallowMount } from '@vue/test-utils';
import Vuetify from 'vuetify';
import Vuex from 'vuex';
import projectActions from '@/store/modules/project/action_types';
import projectGetters from '@/store/modules/project/getter_types.js';

import input from './input.js';
jest.mock('jwt-decode');

afterEach(() => {
  jest.clearAllMocks();
});

describe('ProductBacklogList.vue', () => {
  const localVue = createLocalVue();
  localVue.use(Vuex);
  localVue.use(Vuetify);
  describe('Props', () => {
    let getters, actions, vuetify, store;
    let wrapperFactory = (localVue, vuetify, propsData, store) => {
      return shallowMount(ProductBacklogList, {
        localVue,
        vuetify,
        propsData,
        store,
      });
    };
    beforeEach(() => {
      vuetify = new Vuetify();
      getters = {
        [projectGetters.GET_DETAIL_BY_ID]: () => input.projectDetail[0],
      };
      actions = {
        [projectActions.ACT_GET_DETAIL_BY_ID]: jest.fn(),
      };
      store = new Vuex.Store({ getters, actions });
    });
    it('Case 1: projectId passed with string value  ', () => {
      let projectId = '1';
      let propsData = { projectId };
      let wrapper = wrapperFactory(localVue, vuetify, propsData, store);
      expect(wrapper.props().projectId).toBe(projectId);
    });
    it('Case 2: pageIndex passed with number value  ', () => {
      let pageIndex = 1;
      let propsData = { pageIndex };
      let wrapper = wrapperFactory(localVue, vuetify, propsData, store);
      expect(wrapper.props().pageIndex).toBe(pageIndex);
    });
  });

  describe('Computed', () => {
    let getters, actions, vuetify, store;
    let wrapperFactory = (localVue, vuetify, propsData, store) => {
      return shallowMount(ProductBacklogList, {
        localVue,
        vuetify,
        propsData,
        store,
      });
    };
    beforeEach(() => {
      vuetify = new Vuetify();
      getters = {
        [projectGetters.GET_DETAIL_BY_ID]: () => input.projectDetail[0],
      };
      actions = {
        [projectActions.ACT_GET_DETAIL_BY_ID]: jest.fn(),
      };
      store = new Vuex.Store({ getters, actions });
    });

    it('Case 1: !lastGame - Role Admin - Return Create Game (true)  ', () => {
      const backlog = input.projectDetail[0].backlogList[0];
      expect(ProductBacklogList.computed.processButton(backlog)).toStrictEqual({
        buttonType: 'Create Game',
        buttonStatus: true,
      });
    });

    it('Case 2: !lastGame - Role PM - Return Create Game (true)  ', () => {
      const backlog = input.projectDetail[1].backlogList[0];
      expect(ProductBacklogList.computed.processButton(backlog)).toStrictEqual({
        buttonType: 'Create Game',
        buttonStatus: true,
      });
    });

    it('Case 3: !lastGame - Role BO - Return Create Game (true)  ', () => {
      const backlog = input.projectDetail[2].backlogList[0];
      expect(ProductBacklogList.computed.processButton(backlog)).toStrictEqual({
        buttonType: 'Create Game',
        buttonStatus: true,
      });
    });

    it('Case 4: !lastGame - Role Member - Return Join Game (false)  ', () => {
      const backlog = input.projectDetail[3].backlogList[0];
      expect(ProductBacklogList.computed.processButton(backlog)).toStrictEqual({
        buttonType: 'Join Game',
        buttonStatus: false,
      });
    });

    it('Case 5: !startGame - Role Admin - Return Join Game (true)  ', () => {
      const backlog = input.projectDetail[4].backlogList[0];
      expect(ProductBacklogList.computed.processButton(backlog)).toStrictEqual({
        buttonType: 'Join Game',
        buttonStatus: true,
      });
    });

    it('Case 6: !startGame - Role PM - Return Join Game (true)  ', () => {
      const backlog = input.projectDetail[5].backlogList[0];
      expect(ProductBacklogList.computed.processButton(backlog)).toStrictEqual({
        buttonType: 'Join Game',
        buttonStatus: true,
      });
    });

    it('Case 7: !startGame - Role BO - Return Join Game (true)  ', () => {
      const backlog = input.projectDetail[6].backlogList[0];
      expect(ProductBacklogList.computed.processButton(backlog)).toStrictEqual({
        buttonType: 'Join Game',
        buttonStatus: true,
      });
    });

    it('Case 8: !startGame - Role Member - Return Join Game (true)  ', () => {
      const backlog = input.projectDetail[7].backlogList[0];
      expect(ProductBacklogList.computed.processButton(backlog)).toStrictEqual({
        buttonType: 'Join Game',
        buttonStatus: true,
      });
    });

    it('Case 9: !endGame - Role Admin - Return View Game (true)  ', () => {
      const backlog = input.projectDetail[8].backlogList[0];
      expect(ProductBacklogList.computed.processButton(backlog)).toStrictEqual({
        buttonType: 'View Game',
        buttonStatus: true,
      });
    });

    it('Case 10: !endGame - Role PM - Return View Game (true)  ', () => {
      const backlog = input.projectDetail[9].backlogList[0];
      expect(ProductBacklogList.computed.processButton(backlog)).toStrictEqual({
        buttonType: 'View Game',
        buttonStatus: true,
      });
    });

    it('Case 11: !endGame - Role BO - Return View Game (true)  ', () => {
      const backlog = input.projectDetail[10].backlogList[0];
      expect(ProductBacklogList.computed.processButton(backlog)).toStrictEqual({
        buttonType: 'View Game',
        buttonStatus: true,
      });
    });

    it('Case 12: !endGame - Role Member - Return View Game (true)  ', () => {
      const backlog = input.projectDetail[11].backlogList[0];
      expect(ProductBacklogList.computed.processButton(backlog)).toStrictEqual({
        buttonType: 'Join Game',
        buttonStatus: false,
      });
    });
    
    it('Case 13: endGame - Role Admin - Return View Game (true)  ', () => {
      const backlog = input.projectDetail[12].backlogList[0];
      expect(ProductBacklogList.computed.processButton(backlog)).toStrictEqual({
        buttonType: 'View Game',
        buttonStatus: true,
      });
    });

    it('Case 14: endGame - Role PM - Return View Game (true)  ', () => {
      const backlog = input.projectDetail[13].backlogList[0];
      expect(ProductBacklogList.computed.processButton(backlog)).toStrictEqual({
        buttonType: 'View Game',
        buttonStatus: true,
      });
    });

    it('Case 15: endGame - Role BO - Return View Game (true)  ', () => {
      const backlog = input.projectDetail[14].backlogList[0];
      expect(ProductBacklogList.computed.processButton(backlog)).toStrictEqual({
        buttonType: 'View Game',
        buttonStatus: true,
      });
    });

    it('Case 16: endGame - Role Member - Return View Game (true)  ', () => {
      const backlog = input.projectDetail[15].backlogList[0];
      expect(ProductBacklogList.computed.processButton(backlog)).toStrictEqual({
        buttonType: 'View Game',
        buttonStatus: true,
      });
    });
  });
  describe('Watcher', () => {
    let getters, actions, vuetify, store;
    let wrapperFactory = (localVue, vuetify, propsData, store) => {
      return shallowMount(ProductBacklogList, {
        localVue,
        vuetify,
        propsData,
        store,
      });
    };
    beforeEach(() => {
      vuetify = new Vuetify();

    });
    it('Case 1: projectDetail null - Not change projectDetail ', () => {
      getters = {
        [projectGetters.GET_DETAIL_BY_ID]: () => null,
      };
      actions = {
        [projectActions.ACT_GET_DETAIL_BY_ID]: jest.fn(),
      };
      store = new Vuex.Store({ getters, actions });
      let wrapper = wrapperFactory(localVue, vuetify, null, store);
      expect(wrapper.vm.projectDetail).toBe(null);
    });

    it('Case 2: !backlogList - Not change projectDetail ', () => {
      getters = {
        [projectGetters.GET_DETAIL_BY_ID]: () => input.projectDetail[16],
      };
      actions = {
        [projectActions.ACT_GET_DETAIL_BY_ID]: jest.fn(),
      };
      store = new Vuex.Store({ getters, actions });
      let wrapper = wrapperFactory(localVue, vuetify, null, store);
      expect(wrapper.vm.projectDetail.backlogList.length).toBe(0);
    });

    it('Case 3: backlogList - Change projectDetail ', () => {
      getters = {
        [projectGetters.GET_DETAIL_BY_ID]: () => input.projectDetail[0],
      };

      let processButton = jest.spyOn(ProductBacklogList, 'processButton').mockImplementation(() => {
        return { buttonType: 'Create Game', buttonStatus: true };
      })
      store = new Vuex.Store({ getters });
      let wrapper = shallowMount(ProductBacklogList, {localVue, store});
      expect(processButton).toHaveBeenCalledTimes(1);
    });
  })
});
