import ProductBacklogCard from '@/views/ProductBacklogList/ProductBacklogCard';
import { createLocalVue, mount } from '@vue/test-utils';
import Vuetify from 'vuetify';
import Vuex from 'vuex';
import gameActions from '@/store/modules/game/action_types';
import appGetters from '@/store/app/getter_types.js';
import appMutations from '@/store/app/mutation_types.js';
import input from './input.js';
jest.mock('jwt-decode');

afterEach(() => {
  jest.clearAllMocks();
})
describe('ProductBacklogCard.vue', () => {
  const localVue = createLocalVue();
  localVue.use(Vuex);
  let vuetify;
  describe('Props', () => {
    let getters, mutations, actions, vuetify, store;
    const localVue = createLocalVue();
    localVue.use(Vuex);       
    vuetify = new Vuetify();
    it('Case 1: backlog - Show Create Game Button', () => {
      let backlog = input.props.backlog[0];
      let propsData = { backlog };
      mount(ProductBacklogCard, {
        localVue,
        vuetify,
        propsData,
      });
    });
    it('Case 2: backlog - Show Join Game Button', () => {
      let backlog = input.props.backlog[1];
      let propsData = { backlog };
      let wrapper = wrapperFactory(propsData);
      expect(wrapper.text()).toContain(backlog.backlogName);
      expect(wrapper.text()).toContain(backlog.createDate);
      expect(wrapper.text()).toContain(backlog.members);
      expect(wrapper.text()).toContain(backlog.average);
      expect(wrapper.find('.btn-backlog').text()).toContain('Join Game');
    });
    it('Case 3: backlog - Show View Game Button', () => {
      let backlog = input.props.backlog[2];
      let propsData = { backlog };
      let wrapper = wrapperFactory(propsData);
      expect(wrapper.text()).toContain(backlog.backlogName);
      expect(wrapper.text()).toContain(backlog.createDate);
      expect(wrapper.text()).toContain(backlog.members);
      expect(wrapper.text()).toContain(backlog.average);
      expect(wrapper.find('.btn-backlog').text()).toContain('View Game');
    });
  });

  describe('Event', () => {
    let getters, mutations, actions, vuetify, store;
    vuetify = new Vuetify();
    const mockRoute = {
      params: {
        id: 1,
      },
    };
    const mockRouter = {
      push: jest.fn(),
    };
    const mocks = {
      $route: mockRoute,
      $router: mockRouter,
    };
    let wrapperFactory = (localVue, vuetify, propsData, store, mocks) => {
      return mount(ProductBacklogCard, {
        localVue,
        vuetify,
        propsData,
        store,
        mocks,
      });
    };

    it('Case 1: Click create game - Success - Go to gamemanagement page', async () => {
      let backlog = input.event.backlog[0];
      let propsData = { backlog };
      getters = {
        [appGetters.GET_CREATE_RESULT]: () => input.event.game[0],
      };
      actions = {
        [gameActions.ACT_CREATE]: jest.fn(),
      };
      store = new Vuex.Store({ getters, actions });
      let wrapper = wrapperFactory(localVue, vuetify, propsData, store, mocks);
      await wrapper.find('.create-game').trigger('click');
      await expect(actions[gameActions.ACT_CREATE]).toHaveBeenCalled();
      expect(mockRouter.push).toHaveBeenCalledTimes(1);
      expect(mockRouter.push).toHaveBeenCalledWith({
        name: 'game-management',
        params: { id: mockRoute.params.id },
      });
    });

    it('Case 2: Click create game - Fail', async () => {
      let backlog = input.event.backlog[0];
      let propsData = { backlog };
      const getters = {
        [appGetters.GET_CREATE_RESULT]: () => null,
      };
      const actions = {
        [gameActions.ACT_CREATE]: jest.fn(),
      };
      store = new Vuex.Store({ getters, actions });
      let wrapper = wrapperFactory(localVue, vuetify, propsData, store, mocks);
      await wrapper.find('.create-game').trigger('click');
      await expect(actions[gameActions.ACT_CREATE]).toHaveBeenCalled();
    });

    it('Case 3: Click join game - Role Admin - Not GO - Go to game page', async () => {
      let backlog = input.event.backlog[4];
      let propsData = { backlog };
      let wrapper = wrapperFactory(localVue, vuetify, propsData, null, mocks);
      wrapper.setData({ currentUser: input.user.ADMIN });
      await wrapper.find('.join-game').trigger('click');
      expect(mockRouter.push).toHaveBeenCalledTimes(1);
      expect(mockRouter.push).toHaveBeenCalledWith({
        path: '/game',
        query: { id: mockRoute.params.id },
      });
    });

    it('Case 4: Click join game - Role Admin - GO - Go to game management page', async () => {
      let backlog = input.event.backlog[5];
      let propsData = { backlog };
      let wrapper = wrapperFactory(localVue, vuetify, propsData, null, mocks);
      wrapper.setData({ currentUser: input.user.ADMIN });
      await wrapper.find('.join-game').trigger('click');
      expect(mockRouter.push).toHaveBeenCalledWith({
        name: 'game-management',
        params: { id: mockRoute.params.id },
      });
    });

    it('Case 5: Click join game - Role PM - Not GO - Go to game page', async () => {
      let backlog = input.event.backlog[6];
      let propsData = { backlog };
      let wrapper = wrapperFactory(localVue, vuetify, propsData, null, mocks);
      wrapper.setData({ currentUser: input.user.PM });
      await wrapper.find('.join-game').trigger('click');
      expect(mockRouter.push).toHaveBeenCalledTimes(1);
      expect(mockRouter.push).toHaveBeenCalledWith({
        path: '/game',
        query: { id: mockRoute.params.id },
      });
    });

    it('Case 6: Click join game - Role PM - GO - Go to game management page', async () => {
      let backlog = input.event.backlog[7];
      let propsData = { backlog };
      let wrapper = wrapperFactory(localVue, vuetify, propsData, null, mocks);
      wrapper.setData({ currentUser: input.user.PM });
      await wrapper.find('.join-game').trigger('click');
      expect(mockRouter.push).toHaveBeenCalledTimes(1);
      expect(mockRouter.push).toHaveBeenCalledWith({
        name: 'game-management',
        params: { id: mockRoute.params.id },
      });
    });

    it('Case 7: Click join game - Role MEMBER - not BO - Go to game page', async () => {
      let backlog = input.event.backlog[8];
      let propsData = { backlog };
      let wrapper = wrapperFactory(localVue, vuetify, propsData, null, mocks);
      wrapper.setData({ currentUser: input.user.MEMBER });
      await wrapper.find('.join-game').trigger('click');
      expect(mockRouter.push).toHaveBeenCalledTimes(1);
      expect(mockRouter.push).toHaveBeenCalledWith({
        path: '/game',
        query: { id: mockRoute.params.id },
      });
    });

    it('Case 8: Click join game - Role MEMBER - BO - Not GO - Not go to game page', async () => {
      let backlog = input.event.backlog[9];
      let propsData = { backlog };
      let wrapper = wrapperFactory(localVue, vuetify, propsData, null, mocks);
      wrapper.setData({ currentUser: input.user.MEMBER });
      await wrapper.find('.join-game').trigger('click');
      expect(mockRouter.push).toHaveBeenCalledTimes(1);
      expect(mockRouter.push).toHaveBeenCalledWith({
        path: '/game',
        query: { id: mockRoute.params.id },
      });
    });

    
    it('Case 9: Click join game - Role MEMBER - BO - GO - Go to game management page', async () => {
      let backlog = input.event.backlog[10];
      let propsData = { backlog };
      let wrapper = wrapperFactory(localVue, vuetify, propsData, null, mocks);
      wrapper.setData({ currentUser: input.user.MEMBER });
      await wrapper.find('.join-game').trigger('click');
      expect(mockRouter.push).toHaveBeenCalledTimes(1);
      expect(mockRouter.push).toHaveBeenCalledWith({
        name: 'game-management',
        params: { id: mockRoute.params.id },
      });
    });

    it('Case 10: Click view game - !endGame - Role Admin - Go to game management page', async () => {
      let backlog = input.event.backlog[11];
      let propsData = { backlog };
      let wrapper = wrapperFactory(localVue, vuetify, propsData, null, mocks);
      wrapper.setData({ currentUser: input.user.ADMIN });
      await wrapper.find('.view-game').trigger('click');
      expect(mockRouter.push).toHaveBeenCalledTimes(1);
      expect(mockRouter.push).toHaveBeenCalledWith({
        name: 'game-management',
        params: { id: mockRoute.params.id },
      });
    });

    it('Case 11: Click view game - !endGame - Role PM - Go to game management page', async () => {
      let backlog = input.event.backlog[12];
      let propsData = { backlog };
      let wrapper = wrapperFactory(localVue, vuetify, propsData, null, mocks);
      wrapper.setData({ currentUser: input.user.PM });
      await wrapper.find('.view-game').trigger('click');
      expect(mockRouter.push).toHaveBeenCalledTimes(1);
      expect(mockRouter.push).toHaveBeenCalledWith({
        name: 'game-management',
        params: { id: mockRoute.params.id },
      });
    });

    it('Case 12: Click view game - !endGame - Role MEMBER - Go to game management page', async () => {
      let backlog = input.event.backlog[13];
      let propsData = { backlog };
      let wrapper = wrapperFactory(localVue, vuetify, propsData, null, mocks);
      wrapper.setData({ currentUser: input.user.MEMBER });
      await wrapper.find('.join-game').trigger('click');
      expect(wrapper.find('.disabledButton').exists()).toBe(true)
    });

    it('Case 13: Click view game - !endGame - Role MEMBER - BO -  Go to game management page', async () => {
      let backlog = input.event.backlog[14];
      let propsData = { backlog };
      let wrapper = wrapperFactory(localVue, vuetify, propsData, null, mocks);
      wrapper.setData({ currentUser: input.user.MEMBER });
      await wrapper.find('.view-game').trigger('click');
      expect(mockRouter.push).toHaveBeenCalledTimes(1);
      expect(mockRouter.push).toHaveBeenCalledWith({
        name: 'game-management',
        params: { id: mockRoute.params.id },
      });
    });

    it('Case 14: Click view game - endGame - Role ADMIN -  Go to game management page', async () => {
      let backlog = input.event.backlog[15];
      let propsData = { backlog };
      let wrapper = wrapperFactory(localVue, vuetify, propsData, null, mocks);
      wrapper.setData({ currentUser: input.user.MEMBER });
      await wrapper.find('.view-game').trigger('click');
      expect(mockRouter.push).toHaveBeenCalledTimes(1);
      expect(mockRouter.push).toHaveBeenCalledWith({
        name: 'game-management',
        params: { id: mockRoute.params.id },
      });
    });

    it('Case 15: Click view game - endGame - Role PM -  Go to game management page', async () => {
      let backlog = input.event.backlog[16];
      let propsData = { backlog };
      let wrapper = wrapperFactory(localVue, vuetify, propsData, null, mocks);
      wrapper.setData({ currentUser: input.user.MEMBER });
      await wrapper.find('.view-game').trigger('click');
      expect(mockRouter.push).toHaveBeenCalledTimes(1);
      expect(mockRouter.push).toHaveBeenCalledWith({
        name: 'game-management',
        params: { id: mockRoute.params.id },
      });
    });

    it('Case 15: Click view game - endGame - Role MEMBER -  Go to game management page', async () => {
      let backlog = input.event.backlog[17];
      let propsData = { backlog };
      let wrapper = wrapperFactory(localVue, vuetify, propsData, null, mocks);
      wrapper.setData({ currentUser: input.user.MEMBER });
      await wrapper.find('.view-game').trigger('click');
      expect(mockRouter.push).toHaveBeenCalledTimes(1);
      expect(mockRouter.push).toHaveBeenCalledWith({
        name: 'game-management',
        params: { id: mockRoute.params.id },
      });
    });

    it('Case 16: Click delete game - !lastGame - Role ADMIN - ConfirmDialog', async() => {
      let backlog = input.event.backlog[0];
      let propsData = { backlog };
      let wrapper = wrapperFactory(localVue, vuetify, propsData, null, mocks);
      await wrapper.find('.btn-delete').trigger('click');
      expect(wrapper.find('.confirm-dialog-delete').exists()).toBe(true);
    })

    it('Case 17: Click delete game - !lastGame - Role PM - ConfirmDialog', async() => {
      let backlog = input.event.backlog[1];
      let propsData = { backlog };
      let wrapper = wrapperFactory(localVue, vuetify, propsData, null, mocks);
      await wrapper.find('.btn-delete').trigger('click');
      expect(wrapper.find('.confirm-dialog-delete').exists()).toBe(true);
    })

    it('Case 18: Click delete game - !lastGame - Role BO - ConfirmDialog', async() => {
      let backlog = input.event.backlog[3];
      let propsData = { backlog };
      let wrapper = wrapperFactory(localVue, vuetify, propsData, null, mocks);
      await wrapper.find('.btn-delete').trigger('click');
      expect(wrapper.find('.confirm-dialog-delete').exists()).toBe(true);
    })

    it('Case 19: Click delete game - !startGame - Role ADMIN - ConfirmDialog', async() => {
      let backlog = input.event.backlog[4];
      let propsData = { backlog };
      let wrapper = wrapperFactory(localVue, vuetify, propsData, null, mocks);
      await wrapper.find('.btn-delete').trigger('click');
      expect(wrapper.find('.confirm-dialog-delete').exists()).toBe(true);
    })
    
    it('Case 20: Click delete game - !startGame - Role PM - ConfirmDialog', async() => {
      let backlog = input.event.backlog[6];
      let propsData = { backlog };
      let wrapper = wrapperFactory(localVue, vuetify, propsData, null, mocks);
      await wrapper.find('.btn-delete').trigger('click');
      expect(wrapper.find('.confirm-dialog-delete').exists()).toBe(true);
    })

    it('Case 21: Click delete game - !startGame - Role BO - ConfirmDialog', async() => {
      let backlog = input.event.backlog[9];
      let propsData = { backlog };
      let wrapper = wrapperFactory(localVue, vuetify, propsData, null, mocks);
      await wrapper.find('.btn-delete').trigger('click');
      expect(wrapper.find('.confirm-dialog-delete').exists()).toBe(true);
    })

    
    it('Case 22: Click delete game - endGame - Role ADMIN - ConfirmDialog', async() => {
      let backlog = input.event.backlog[15];
      let propsData = { backlog };
      let wrapper = wrapperFactory(localVue, vuetify, propsData, null, mocks);
      await wrapper.find('.btn-delete').trigger('click');
      expect(wrapper.find('.confirm-dialog-delete').exists()).toBe(true);
    })

    it('Case 23: Click delete game - endGame - Role PM - ConfirmDialog', async() => {
      let backlog = input.event.backlog[16];
      let propsData = { backlog };
      let wrapper = wrapperFactory(localVue, vuetify, propsData, null, mocks);
      await wrapper.find('.btn-delete').trigger('click');
      expect(wrapper.find('.confirm-dialog-delete').exists()).toBe(true);
    })

    it('Case 24: Click delete game - endGame - Role BO - ConfirmDialog', async() => {
      let backlog = input.event.backlog[18];
      let propsData = { backlog };
      let wrapper = wrapperFactory(localVue, vuetify, propsData, null, mocks);
      await wrapper.find('.btn-delete').trigger('click');
      expect(wrapper.find('.confirm-dialog-delete').exists()).toBe(true);
    })

    it('Case 25: Click delete game - endGame - Role MEMBER - Snackbar', async() => {
      let backlog = input.event.backlog[2];
      let propsData = { backlog };
      mutations = {
        [appMutations.SET_SNACKBAR]: jest.fn()
      };
      store = new Vuex.Store({ mutations });
      let wrapper = wrapperFactory(localVue, vuetify, propsData, store, mocks);
      await wrapper.find('.btn-delete').trigger('click');
      await expect(mutations[appMutations.SET_SNACKBAR]).toHaveBeenCalled();
    });

    





  });
});
