import { shallowMount, createLocalVue } from '@vue/test-utils';
import GameManagement from '@/views/GameManagement/GameManagement.vue';
import Vuex from 'vuex';
import VueRouter from 'vue-router';
import Vuetify from 'vuetify';
import localStorageService from '@/utils/utils_local_storage.js';
import gameModule from '../../../src/store/modules/game';

import gameActions from '../../../src/store/modules/game/action_types';
import gameGetters from '../../../src/store/modules/game/getter_types';
import gameMutations from '@/store/modules/game/mutation_types.js';
import { storeMock } from './mocks';

jest.mock('jwt-decode');

describe('GameManagement.vue', () => {
  let localVue;
  let actions;
  let store;

  beforeEach(() => {
    localVue = createLocalVue();
    localVue.use(Vuex);
    localVue.use(VueRouter);
  });

  describe('Methods', () => {
    let state, getters, actions, vuetify, store, propsData;
    let wrapperFactory = (localVue, vuetify, propsData, store, routes) => {
      return shallowMount(GameManagement, {
        localVue,
        vuetify,
        propsData,
        store,
        mocks: {
          $route: routes,
        },
      });
    };

    beforeEach(() => {
      jest.clearAllMocks();
      vuetify = new Vuetify();
      actions = {
        [gameActions.GET_GAME]: jest.fn(),
        [gameActions.START_GAME]: jest.fn(),
        [gameActions.RESET_GAME]: jest.fn(),
        [gameActions.FINISH_GAME]: jest.fn(),
        [gameActions.DELETE_GAME]: jest.fn(),
        [gameActions.KICK_PLAYER]: jest.fn(),
      };
      getters = {
        [gameGetters.GET_GAME]: () => {
          return {};
        },
        [gameGetters.GET_USERS]: () => {
          return {};
        },
        [gameGetters.GET_PLAYERS]: () => {
          return {};
        },
        [gameGetters.GET_MEMBERS]: () => {
          return {};
        },
        [gameGetters.GET_SUMMARY_PLAYERS]: () => {
          return {};
        },
        [gameGetters.GET_SUMMARY_STORY_POINTS]: () => {
          return {};
        },
        [gameGetters.GET_ALERT]: () => {
          return {};
        },
      };
      store = new Vuex.Store({ actions });
    });

    describe('Test run methods when component mounted', () => {
      beforeEach(() => {
        jest
          .spyOn(GameManagement.methods, 'getToken')
          .mockImplementation(() => {
            return;
          });
        jest
          .spyOn(GameManagement.methods, 'getGameId')
          .mockImplementation(() => {
            return;
          });
        jest.spyOn(GameManagement, 'mounted').mockImplementation(() => {
          return true;
        });
      });

      it('Call getGame action when component created', async () => {
        const $route = {
          path: '/game-management/1',
          params: {
            id: 1,
          },
        };
        const tokenMock = 'abcxyz';
        const localGetToken = jest
          .spyOn(localStorageService.getService(), 'getToken')
          .mockImplementation(() => tokenMock);
        let wrapper = wrapperFactory(
          localVue,
          vuetify,
          propsData,
          store,
          $route
        );
        const token = wrapper.vm.getToken();
        expect(localGetToken).toHaveBeenCalledTimes(0);
        expect(token).not.toEqual(tokenMock);
      });

      it('Should call getGame when component is created', async () => {
        const $route = {
          path: '/game-management/1',
          params: {
            id: 1,
          },
        };
        const getGame = jest.spyOn(GameManagement, 'created');
        let wrapper = wrapperFactory(
          localVue,
          vuetify,
          propsData,
          store,
          $route
        );
        const getGameMethod = jest
          .spyOn(wrapper.vm, 'getGame')
          .mockImplementation(() => true);
        expect(getGame).toHaveBeenCalledTimes(1);
        expect(getGameMethod).toHaveBeenCalledTimes(1);
      });

      it('Should not call getGame method when route not contains params gameId', async () => {
        const $route = {
          path: '/game-management',
        };
        const getGame = jest.spyOn(GameManagement, 'created');
        let wrapper = wrapperFactory(
          localVue,
          vuetify,
          propsData,
          store,
          $route
        );
        const getGameMethod = jest
          .spyOn(wrapper.vm, 'getGame')
          .mockImplementation(() => true);
        expect(getGameMethod).toHaveBeenCalledTimes(0);
      });
    });

    describe('getGameId', () => {
      let propsData = {};
      beforeEach(() => {
        jest
          .spyOn(GameManagement.methods, 'getGameId')
          .mockImplementation(() => {
            return;
          });
        jest
          .spyOn(GameManagement.methods, 'getToken')
          .mockImplementation(() => {
            return;
          });
        jest.spyOn(GameManagement, 'mounted').mockImplementation(() => {
          return true;
        });
      });

      it('Should get gameId params in route', async () => {
        const gameIdRoute = 1;
        const $route = {
          path: '/game-management/1',
          params: {
            id: gameIdRoute,
          },
        };
        let wrapper = wrapperFactory(
          localVue,
          vuetify,
          propsData,
          store,
          $route
        );
        const gameId = wrapper.vm.getGameId();
        expect(gameId).toEqual(gameIdRoute);
      });

      it('Should not get gameId params in route', () => {
        const $route = {
          path: '/game-management',
        };
        let wrapper = wrapperFactory(
          localVue,
          vuetify,
          propsData,
          store,
          $route
        );
        const gameId = wrapper.vm.getGameId();
        expect(gameId).toEqual(undefined);
      });
    });
  });
});
