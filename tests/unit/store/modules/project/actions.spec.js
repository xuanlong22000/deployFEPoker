import actions from '@/store/modules/project/actions.js';
import actionTypes from '@/store/modules/project/action_types';
import * as projectApi from '@/api/api_project.js';

afterEach(() => {
  jest.clearAllMocks();
});

describe('projectActions', () => {
  describe('deleteById', () => {
    const context = {
      commit: jest.fn(),
    };
    it('response 200 - get successfully', async () => {
      let payload = { id: 1, pageIndex: 1, pageSize: 10 };
      const getDetailById = await jest.spyOn(projectApi, 'getDetailById').mockImplementation(() => {
        return Promise.resolve({ data: {projectDetail: {}} });
      });
      await actions[actionTypes.ACT_GET_DETAIL_BY_ID](context, payload);
      expect(context.commit).toHaveBeenCalledTimes(1);
      expect(getDetailById).toHaveBeenCalledTimes(1);
    });
    it('response 204 - no content', async() => {
      let payload = { id: 1, pageIndex: 1, pageSize: 10 };
      const getDetailById = await jest.spyOn(projectApi, 'getDetailById').mockImplementation(() => {
        return Promise.resolve({ data: null, message: 'No content' });
      });
      await actions[actionTypes.ACT_GET_DETAIL_BY_ID](context, payload);
      expect(context.commit).toHaveBeenCalledTimes(1);
      expect(getDetailById).toHaveBeenCalledTimes(1);
    });
  });
});