import * as api from '@/utils/utils_api';
import * as gameApi from '@/api/api_game';

afterEach(() => {
  jest.clearAllMocks();
});

const GAME_URL = '/game';
describe('gameApi', () => {
  describe('create', () => {
    it('response 200 - create successfully', async () => {
      let backlogId = 1, projectId = 1;
      const postRequest = await jest.spyOn(api, 'postRequest').mockImplementation(() => {
        return Promise.resolve({ data: { game_id: 1 } });
      });
      await gameApi.create(backlogId, projectId);
      expect(postRequest).toHaveBeenCalledTimes(1);
      expect(postRequest).toHaveBeenCalledWith(`${GAME_URL}`, {backlogId, projectId});
    });
    it('response 400 - create fail', async () => {
      let backlogId = 1, projectId = 1;
      const postRequest = await jest
        .spyOn(api, 'postRequest')
        .mockImplementation(() => {
          return Promise.reject({
            response: {
              status: 400,
              statusText: 'Create fail!',
            },
          });
        });
      try {
        await gameApi.create(backlogId, projectId);
      } catch (error) {
        expect(postRequest).toHaveBeenCalledTimes(1);
        expect(postRequest).toHaveBeenCalledWith(`${GAME_URL}`, {
          backlogId,
          projectId,
        });
      }
    });
  });
});
