import actionTypes from './action_types';
import mutationTypes from './mutation_types';
import {
  getActivityLogApi,
} from '@/api/api_activity_log.js';
import MESSAGE from '@/utils/utils_message';
const actions = {
  [actionTypes.GET_ACTIVITY_LOG_LIST]: async ({ commit }, payload) => {
    try {
      const userId = payload.userId;
      const projectId = payload.projectId;
      const res = await getActivityLogApi(userId, projectId);
      commit(mutationTypes.SET_ACTIVITY_LOG, res.data);
    } catch (error) {
      commit('SET_SNACKBAR', {
        type: 'error',
        visible: true,
        text: MESSAGE.SERVER_ERROR,
      });
    }
  },
};

export default actions;
