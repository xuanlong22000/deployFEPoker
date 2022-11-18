import actions from '@/store/modules/game/actions.js';
import actionTypes from '@/store/modules/game/action_types';
import * as gameApi from '@/api/api_game.js';

afterEach(() => {
  jest.clearAllMocks();
});
describe('gameActions', () => {
  describe('ACCESS_GAME', () => {
    const context = {
      commit: jest.fn(),
    };

    it('response 200 - access successfully', async () => {
      const getAccessGame = await jest
        .spyOn(gameApi, 'getAccessGame')
        .mockImplementation(() => {
          return Promise.resolve({ data: { game_id: 1 } });
        });
      await actions[actionTypes.ACCESS_GAME](context);
      expect(context.commit).toHaveBeenCalledTimes(1);
      expect(getAccessGame).toHaveBeenCalledTimes(1);
    });

    it('response 400 - access fail', async () => {
      const getAccessGame = await jest
        .spyOn(gameApi, 'getAccessGame')
        .mockImplementation(() => {
          return Promise.reject({
            response: {
              status: 400,
              statusText: 'Create fail!',
            },
          });
        });
      await actions[actionTypes.ACCESS_GAME](context);
      expect(context.commit).toHaveBeenCalledTimes(0);
      expect(getAccessGame).toHaveBeenCalledTimes(1);
    });
    it('response 500 access fail via system', async () => {
      const getAccessGame = await jest
        .spyOn(gameApi, 'getAccessGame')
        .mockImplementation(() => {
          return Promise.reject({
            response: {
              status: 500,
              statusText: 'Something error when connect game screen!',
            },
          });
        });
      await actions[actionTypes.ACCESS_GAME](context);
      expect(context.commit).toHaveBeenCalledTimes(0);
      expect(getAccessGame).toHaveBeenCalledTimes(1);
    });
  });
  describe('ACCESS_GAME_GUEST', () => {
    const context = {
      commit: jest.fn(),
    };

    it('response 200 - access successfully', async () => {
      const getAccessGameGuest = await jest
        .spyOn(gameApi, 'getAccessGameGuest')
        .mockImplementation(() => {
          return Promise.resolve({ data: { game_id: 1 } });
        });
      await actions[actionTypes.ACCESS_GAME_GUEST](context);
      expect(context.commit).toHaveBeenCalledTimes(1);
      expect(getAccessGameGuest).toHaveBeenCalledTimes(1);
    });

    it('response 400 - access fail', async () => {
      const getAccessGameGuest = await jest
        .spyOn(gameApi, 'getAccessGameGuest')
        .mockImplementation(() => {
          return Promise.reject({
            response: {
              status: 400,
              statusText: ' GAME ALREADY START!',
            },
          });
        });
      await actions[actionTypes.ACCESS_GAME_GUEST](context);
      expect(context.commit).toHaveBeenCalledTimes(0);
      expect(getAccessGameGuest).toHaveBeenCalledTimes(1);
    });

    it('response 500 access fail via system', async () => {
      const getAccessGameGuest = await jest
        .spyOn(gameApi, 'getAccessGameGuest')
        .mockImplementation(() => {
          return Promise.reject({
            response: {
              status: 500,
              statusText: ' Something error when connect game screen!',
            },
          });
        });
      await actions[actionTypes.ACCESS_GAME_GUEST](context);
      expect(context.commit).toHaveBeenCalledTimes(0);
      expect(getAccessGameGuest).toHaveBeenCalledTimes(1);
    });
  });
  describe('SUBMIT_GAME', () => {
    const context = {
      commit: jest.fn(),
    };

    it('response 200 - access successfully', async () => {
      const submitGame = await jest
        .spyOn(gameApi, 'submitGame')
        .mockImplementation(() => {
          return Promise.resolve({ data: { game_id: 1 } });
        });
      await actions[actionTypes.SUBMIT_GAME](context);
      expect(context.commit).toHaveBeenCalledTimes(1);
      expect(submitGame).toHaveBeenCalledTimes(1);
    });

    it('response 400 - access fail', async () => {
      const submitGame = await jest
        .spyOn(gameApi, 'submitGame')
        .mockImplementation(() => {
          return Promise.reject({
            response: {
              status: 400,
              statusText: ' GAME ALREADY START!',
            },
          });
        });
      await actions[actionTypes.SUBMIT_GAME](context);
      expect(context.commit).toHaveBeenCalledTimes(0);
      expect(submitGame).toHaveBeenCalledTimes(1);
    });

    it('response 500 access fail via system', async () => {
      const submitGame = await jest
        .spyOn(gameApi, 'submitGame')
        .mockImplementation(() => {
          return Promise.reject({
            response: {
              status: 500,
              statusText: ' Something error when connect game screen!',
            },
          });
        });
      await actions[actionTypes.SUBMIT_GAME](context);
      expect(context.commit).toHaveBeenCalledTimes(0);
      expect(submitGame).toHaveBeenCalledTimes(1);
    });
  });
});
