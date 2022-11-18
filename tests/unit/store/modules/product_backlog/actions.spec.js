import actions from '@/store/modules/product_backlog/actions.js';
import actionTypes from '@/store/modules/product_backlog/action_types';
import * as backlogApi from '@/api/api_product_backlog.js';

afterEach(() => {
  jest.clearAllMocks();
})
describe('backlogAction', () => {
  describe('deleteById', () => {
    const context = {
      commit: jest.fn(),
    };
    it('response 200 - delete successfully', async () => {
      let payload = { backlogId: 1, projectId: 1 };
      const deleteById = await jest.spyOn(backlogApi, 'deleteById').mockImplementation(() => {
        return Promise.resolve({ data: { isDeleted: true } });
      });
      await actions[actionTypes.ACT_DELETE_BY_BACKLOG_ID](context, payload);
      expect(context.commit).toHaveBeenCalledTimes(2);
      expect(deleteById).toHaveBeenCalledTimes(1);
    });
    it('response 400 - delete fail', async() => {
      let payload = { backlogId: 1, projectId: 1 };
      const deleteById = await jest.spyOn(backlogApi, 'deleteById').mockImplementation(() => {
        return Promise.reject({response: {
          status: 400,
          statusText: 'Delete fail!'
        }});
      });
      await actions[actionTypes.ACT_DELETE_BY_BACKLOG_ID](context, payload);
      expect(context.commit).toHaveBeenCalledTimes(2);
      expect(deleteById).toHaveBeenCalledTimes(1);
    });
  });
});
