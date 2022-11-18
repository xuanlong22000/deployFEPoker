import * as api from '@/utils/utils_api';
import * as backlogApi from '@/api/api_product_backlog';

afterEach(() => {
  jest.clearAllMocks();
});
const BACKLOG_URL = '/product-backlog';
describe('backlogActions', () => {
  describe('deleteById', () => {
    it('response 200 - get successfully', async () => {
      let backlogId = 1,
        projectId = 1;
      const deleteRequest = await jest
        .spyOn(api, 'deleteRequest')
        .mockImplementation(() => {
          return Promise.resolve({ data: { isDeleted: true } });
        });
      await backlogApi.deleteById(backlogId, projectId);
      expect(deleteRequest).toHaveBeenCalledTimes(1);
      expect(deleteRequest).toHaveBeenCalledWith(
        `${BACKLOG_URL}/${backlogId}`,
        {
          projectId,
        }
      );
    });
    it('response 400 - delete fail', async () => {
      let backlogId = 1,
        projectId = 1;
      const deleteRequest = await jest
        .spyOn(api, 'deleteRequest')
        .mockImplementation(() => {
          return Promise.reject({
            response: {
              status: 400,
              statusText: 'Delete fail!',
            },
          });
        });
      try {
        await backlogApi.deleteById(backlogId, projectId);
      } catch (error) {
        expect(deleteRequest).toHaveBeenCalledTimes(1);
        expect(deleteRequest).toHaveBeenCalledWith(
          `${BACKLOG_URL}/${backlogId}`,
          {
            projectId,
          }
        );
      }
    });
  });
});
