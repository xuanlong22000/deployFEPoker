import GameScreen from '@/views/GamePage/GameScreen';
import { createLocalVue, mount, shallowMount } from '@vue/test-utils';
import Vuetify from 'vuetify';
import Vuex from 'vuex';
import localStorageService from '@/utils/utils_local_storage.js';

import gameActions from '@/store/modules/game/action_types';
import gameGetters from '@/store/modules/game/getter_types.js';

var jwt = require('jsonwebtoken');

jest.mock('jwt-decode');

describe('GameScreen.vue', () => {
  let localVue;
  beforeEach(() => {
    localVue = createLocalVue();
    localVue.use(Vuex);
  });

  afterEach(() => {});
  describe('Methods', () => {
    let getters, actions, vuetify, store, propsData;
    let wrapperFactory = (localVue, vuetify, propsData, store, routes) => {
      return shallowMount(GameScreen, {
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
      getters = {
        [gameGetters.GET_ACCESS_GAME]: () => {
          return {
            gameName: 'Poker Card',
          };
        },
        [gameGetters.GET_GAME_SNACKBAR]: () => {
          return {
            status: 200,
            message: null,
          };
        },
        [gameGetters.GET_STATUS_CARD]: () => {
          return true;
        },
      };
      actions = {
        [gameActions.ACCESS_GAME]: jest.fn(),
      };
      store = new Vuex.Store({ getters, actions });
    });
    describe('getToken', () => {
      beforeEach(() => {
        jest.spyOn(GameScreen.methods, 'getName').mockImplementation(() => {
          return;
        });
        jest.spyOn(GameScreen.methods, 'getGameId').mockImplementation(() => {
          return;
        });
        jest.spyOn(GameScreen.methods, 'getEmail').mockImplementation(() => {
          return;
        });
        jest.spyOn(GameScreen, 'mounted').mockImplementation(() => {
          return true;
        });
      });
      it('Case 1: Should return the different token in storage when onSideBar false ', async () => {
        const $route = {
          path: '/game?id=1',
          query: {
            id: 1,
          },
        };
        let wrapper = wrapperFactory(
          localVue,
          vuetify,
          propsData,
          store,
          $route
        );
        wrapper.setData({ onSideBar: false });
        const tokenMock = '12a12-5s9f12ksflajf';
        const localGetToken = jest
          .spyOn(localStorageService.getService(), 'getToken')
          .mockImplementation(() => tokenMock);
        const token = wrapper.vm.getToken();
        expect(localGetToken).toHaveBeenCalledTimes(0);
        expect(token).not.toEqual(tokenMock);
      });
      it('Case 2 Should return the same token in storage when onSideBar true ', async () => {
        let wrapper = wrapperFactory(localVue, vuetify, propsData, store);
        wrapper.setData({ onSideBar: true });
        wrapper.vm.router;
        const tokenMock = '12a12-5s9f12ksflajf';
        const localGetToken = jest
          .spyOn(localStorageService.getService(), 'getToken')
          .mockImplementation(() => tokenMock);
        const token = wrapper.vm.getToken();
        expect(localGetToken).toHaveBeenCalledTimes(1);
        expect(token).toEqual(tokenMock);
      });
    });
    describe('getGameId', () => {
      let propsData = {};
      beforeEach(() => {
        jest.spyOn(GameScreen.methods, 'getName').mockImplementation(() => {
          return;
        });
        jest.spyOn(GameScreen.methods, 'getToken').mockImplementation(() => {
          return;
        });
        jest.spyOn(GameScreen.methods, 'getEmail').mockImplementation(() => {
          return;
        });
        jest.spyOn(GameScreen, 'mounted').mockImplementation(() => {
          return true;
        });
      });
      it('Case 1: Should get gameId in route if exists ', async () => {
        const gameIdRoute = 1;
        const $route = {
          path: '/game?id=1',
          query: {
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
      it('Case 2: Should get gameId in token if not exists  ', async () => {
        const $route = {
          path: '/game?id=1',
          query: {},
        };
        const payload = { email: 'nguyenviettantan@gmail.com', game_id: 1 };
        let wrapper = wrapperFactory(
          localVue,
          vuetify,
          propsData,
          store,
          $route
        );
        const gameId = wrapper.vm.getGameId();
        expect(gameId).not.toEqual(payload.game_id);
      });
    });
    describe('getEmail', () => {
      let propsData = {};
      beforeEach(() => {
        jest.spyOn(GameScreen.methods, 'getName').mockImplementation(() => {
          return;
        });
        jest.spyOn(GameScreen.methods, 'getGameId').mockImplementation(() => {
          return;
        });
        jest.spyOn(GameScreen, 'mounted').mockImplementation(() => {
          return true;
        });
      });
      it('Case 1: Should call getToken when execute', async () => {
        const getToken = jest
          .spyOn(GameScreen.methods, 'getToken')
          .mockImplementation(() => {
            return;
          });
        let wrapper = wrapperFactory(localVue, vuetify, propsData, store);
        wrapper.vm.getEmail();
        expect(getToken).toHaveBeenCalledTimes(1);
      });
    });
    describe('getName', () => {
      let propsData = {};
      beforeEach(() => {
        jest.spyOn(GameScreen.methods, 'getEmail').mockImplementation(() => {
          return;
        });
        jest.spyOn(GameScreen.methods, 'getGameId').mockImplementation(() => {
          return;
        });
        jest.spyOn(GameScreen, 'mounted').mockImplementation(() => {
          return true;
        });
      });
      it('Case 1: Should call getToken when execute', async () => {
        const getToken = jest
          .spyOn(GameScreen.methods, 'getToken')
          .mockImplementation(() => {
            return;
          });
        let wrapper = wrapperFactory(localVue, vuetify, propsData, store);
        wrapper.vm.getName();
        expect(getToken).toHaveBeenCalledTimes(1);
      });
    });

    describe('getSelectedCard', () => {
      beforeEach(() => {
        jest.spyOn(GameScreen.methods, 'getName').mockImplementation(() => {
          return;
        });
        jest.spyOn(GameScreen.methods, 'getGameId').mockImplementation(() => {
          return;
        });
        jest.spyOn(GameScreen.methods, 'getEmail').mockImplementation(() => {
          return;
        });
        jest.spyOn(GameScreen.methods, 'getToken').mockImplementation(() => {
          return;
        });
        jest.spyOn(GameScreen, 'mounted').mockImplementation(() => {
          return true;
        });
      });
      it('Case 1: Should return undefined when isDisable(true) ', async () => {
        const isDisable = false;

        const data = function() {
          return {
            status: false,
            selectedCard: null,
          };
        };
        const getters = {
          [gameGetters.GET_ACCESS_GAME]: () => {
            return {
              gameName: 'Poker Card',
            };
          },
          [gameGetters.GET_GAME_SNACKBAR]: () => {
            return {
              status: 200,
              message: null,
            };
          },
          [gameGetters.GET_STATUS_CARD]: () => {
            return isDisable;
          },
        };
        const actions = {
          [gameActions.ACCESS_GAME]: jest.fn(),
        };
        const store = new Vuex.Store({ getters, actions });
        let wrapper = shallowMount(GameScreen, {
          localVue,
          vuetify,
          data,
          store,
        });
        const selectedCard = wrapper.vm.getSelectedCard();
        wrapper.vm.getToken();
        expect(selectedCard).toBeUndefined();
      });

      it('Case 2: Should set status to true when isDisable(false) selectedCard(null) ', async () => {
        const isDisable = false;
        const selectedCard = null;

        const data = function() {
          return {
            status: false,
            selectedCard: selectedCard,
          };
        };

        const getters = {
          [gameGetters.GET_ACCESS_GAME]: () => {
            return {
              gameName: 'Poker Card',
            };
          },
          [gameGetters.GET_GAME_SNACKBAR]: () => {
            return {
              status: 200,
              message: null,
            };
          },
          [gameGetters.GET_STATUS_CARD]: () => {
            return isDisable;
          },
        };
        const actions = {
          [gameActions.ACCESS_GAME]: jest.fn(),
        };
        const store = new Vuex.Store({ getters, actions });
        let wrapper = shallowMount(GameScreen, {
          localVue,
          vuetify,
          data,
          store,
        });
        wrapper.vm.getSelectedCard();
        const status = wrapper.vm.status;
        expect(status).toBe(true);
      });
      it('Case 3: Should set selecetedCard to null when isDisable(true) selectedCard(number) is same to input ', async () => {
        const isDisable = false;
        const selectedCard = 5;
        const data = function() {
          return {
            status: false,
            selectedCard: selectedCard,
          };
        };

        const getters = {
          [gameGetters.GET_ACCESS_GAME]: () => {
            return {
              gameName: 'Poker Card',
            };
          },
          [gameGetters.GET_GAME_SNACKBAR]: () => {
            return {
              status: 200,
              message: null,
            };
          },
          [gameGetters.GET_STATUS_CARD]: () => {
            return isDisable;
          },
        };
        const actions = {
          [gameActions.ACCESS_GAME]: jest.fn(),
        };
        const store = new Vuex.Store({ getters, actions });
        let wrapper = shallowMount(GameScreen, {
          localVue,
          vuetify,
          data,
          store,
        });
        wrapper.vm.getSelectedCard(selectedCard);
        const selectedCardValue = wrapper.vm.selectedCard;
        expect(selectedCardValue).toBeNull();
      });
      it('Case 4: Should not set status to true when isDisable(true) selectedCard(number) is not the same to input ', async () => {
        const isDisable = false;
        const selectedCard = 5;
        const numberNotSame = 6;
        const data = function() {
          return {
            status: false,
            selectedCard: selectedCard,
          };
        };

        const getters = {
          [gameGetters.GET_ACCESS_GAME]: () => {
            return {
              gameName: 'Poker Card',
            };
          },
          [gameGetters.GET_GAME_SNACKBAR]: () => {
            return {
              status: 200,
              message: null,
            };
          },
          [gameGetters.GET_STATUS_CARD]: () => {
            return isDisable;
          },
        };
        const actions = {
          [gameActions.ACCESS_GAME]: jest.fn(),
        };
        const store = new Vuex.Store({ getters, actions });
        let wrapper = shallowMount(GameScreen, {
          localVue,
          vuetify,
          data,
          store,
        });
        wrapper.vm.getSelectedCard(numberNotSame);
        const status = wrapper.vm.status;
        expect(status).toBe(false);
      });
    });

    describe('getInputCard', () => {
      beforeEach(() => {
        jest.spyOn(GameScreen.methods, 'getName').mockImplementation(() => {
          return;
        });
        jest.spyOn(GameScreen.methods, 'getGameId').mockImplementation(() => {
          return;
        });
        jest.spyOn(GameScreen.methods, 'getEmail').mockImplementation(() => {
          return;
        });
        jest.spyOn(GameScreen.methods, 'getToken').mockImplementation(() => {
          return;
        });
        jest.spyOn(GameScreen, 'mounted').mockImplementation(() => {
          return true;
        });
      });
      it('Case 1: Should return undefined when isDisable(true) ', async () => {
        const isDisable = true;
        const data = function() {
          return {
            status: false,
            selectedCard: null,
          };
        };
        const getters = {
          [gameGetters.GET_ACCESS_GAME]: () => {
            return {
              gameName: 'Poker Card',
            };
          },
          [gameGetters.GET_GAME_SNACKBAR]: () => {
            return {
              status: 200,
              message: null,
            };
          },
          [gameGetters.GET_STATUS_CARD]: () => {
            return isDisable;
          },
        };
        const actions = {
          [gameActions.ACCESS_GAME]: jest.fn(),
        };
        const store = new Vuex.Store({ getters, actions });
        let wrapper = shallowMount(GameScreen, {
          localVue,
          vuetify,
          data,
          store,
        });
        const selectedCard = wrapper.vm.getInputCard();
        expect(selectedCard).toBeUndefined();
      });
      it('Case 2: Should set selectedCard and status when isDisable(false) ', async () => {
        const number = 4;
        const isDisable = false;
        const data = function() {
          return {
            status: false,
            selectedCard: null,
          };
        };
        const getters = {
          [gameGetters.GET_ACCESS_GAME]: () => {
            return {
              gameName: 'Poker Card',
            };
          },
          [gameGetters.GET_GAME_SNACKBAR]: () => {
            return {
              status: 200,
              message: null,
            };
          },
          [gameGetters.GET_STATUS_CARD]: () => {
            return isDisable;
          },
        };
        const actions = {
          [gameActions.ACCESS_GAME]: jest.fn(),
        };
        const store = new Vuex.Store({ getters, actions });
        let wrapper = shallowMount(GameScreen, {
          localVue,
          vuetify,
          data,
          store,
        });
        wrapper.vm.getInputCard(number);
        const selectedCard = wrapper.vm.selectedCard;
        const status = wrapper.vm.status;
        expect(selectedCard).toBe(number);
        expect(status).toBe(true);
      });
    });
  });
});
