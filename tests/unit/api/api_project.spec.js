import * as api from '@/utils/utils_api';
import * as projectApi from '@/api/api_project';

afterEach(() => {
  jest.clearAllMocks();
});

const PROJECT_URL = '/project';
describe('gameApi', () => {
  describe('getDetailById', () => {
    it('response 200 - create successfully', async () => {
      let id = 1,
        pageIndex = 1,
        pageSize = 10;
      const getRequest = await jest
        .spyOn(api, 'getRequest')
        .mockImplementation(() => {
          return Promise.resolve({ data: { project: {} } });
        });
      await projectApi.getDetailById(id, pageIndex, pageSize);
      expect(getRequest).toHaveBeenCalledTimes(1);
      expect(getRequest).toHaveBeenCalledWith(
        `${PROJECT_URL}?projectId=${id}&pageIndex=${pageIndex}&pageSize=${pageSize}`
      );
    });
    it('response 400 - create fail', async () => {
      let id = 1,
        pageIndex = 1,
        pageSize = 10;
      const getRequest = await jest
        .spyOn(api, 'getRequest')
        .mockImplementation(() => {
          return Promise.reject({
            response: {
              status: 400,
              statusText: 'Create fail!',
            },
          });
        });
      try {
        await projectApi.getDetailById(id, pageIndex, pageSize);
      } catch (error) {
        expect(getRequest).toHaveBeenCalledTimes(1);
        expect(getRequest).toHaveBeenCalledWith(
          `${PROJECT_URL}?projectId=${id}&pageIndex=${pageIndex}&pageSize=${pageSize}`
        );
      }
    });
  });
});
