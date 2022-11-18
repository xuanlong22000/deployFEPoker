import actions from '@/store/modules/game/actions.js';
import actionTypes from '@/store/modules/game/action_types';
import * as gameApi from '@/api/api_game.js';

afterEach(() => {
  jest.clearAllMocks();
})
describe('gameActions', () => {
  describe('create', () => {
    const context = {
      commit: jest.fn(),
    };
    it('response 200 - create successfully', async () => {
      let payload = { backlogId: 1, userId: 1 };
      const create = await jest.spyOn(gameApi, 'create').mockImplementation(() => {
        return Promise.resolve({ data: { game_id: 1 } });
      });
      await actions[actionTypes.ACT_CREATE](context, payload);
      expect(context.commit).toHaveBeenCalledTimes(2);
      expect(create).toHaveBeenCalledTimes(1);
    });
    it('response 400 - create fail', async() => {
      let payload = { backlogId: 1, userId: 1 };
      const create = await jest.spyOn(gameApi, 'create').mockImplementation(() => {
        return Promise.reject({response: {
          status: 400,
          statusText: 'Create fail!'
        }});
      });
      await actions[actionTypes.ACT_CREATE](context, payload);
      expect(context.commit).toHaveBeenCalledTimes(2);
      expect(create).toHaveBeenCalledTimes(1);
    });
  });
});
