import action_types from './action_types';
import {
  addMembers,
  checkIsMember,
  checkIsProjectManagement,
} from '@/api/api_project_member';
import appMutationTypes from '@/store/app/mutation_types';
import MESSAGE from '@/utils/utils_message';
const actions = {
  [action_types.ACT_FETCH_ADD_MEMBERS]: async (
    { commit, dispatch },
    payload
  ) => {
    try {
      const res = await addMembers(payload);
      if (res.status === 400) {
        // commit(appMutationTypes.SET_SNACKBAR, {
        //   type: 'error',
        //   visible: true,
        //   text: res.statusText,
        // });
        return { type: 'error', text: res.statusText };
      }
      if (res.status === 200) {
        // commit(appMutationTypes.SET_SNACKBAR, {
        //   type: 'success',
        //   visible: true,
        //   text: res.statusText,
        // });
        return { type: 'success', text: MESSAGE.ADD_MEMBER_SUCCESS };
      }
      commit(appMutationTypes.SET_CREATE_RESULT, true);
      dispatch('project/ACT_GET_PROJECT_BY_ID', { id: payload.projectId });
      return res.statusText;
    } catch (error) {
      commit(appMutationTypes.SET_CREATE_RESULT, false);

      // commit(appMutationTypes.SET_SNACKBAR, {
      //   type: 'error',
      //   visible: true,
      //   text: error.response.statusText,
      // });
      return { type: 'error', text: error.response.statusText };
    }
  },
  [action_types.ACT_FETCH_IS_MEMBER]: async ({ commit }, payload) => {
    try {
      const res = await checkIsMember(payload);
      if (res.status === 400) {
        return { type: 'error', text: res.statusText };
      }
      if (res.status === 200) {
        if (res.data === false) {
          commit(appMutationTypes.SET_SNACKBAR, {
            type: 'warning',
            visible: true,
            text: MESSAGE.MENBER_DOES_NOT_EXITSTS,
          });
        }
        return res.data;
      }
      return res.statusText;
    } catch (error) {
      return { type: 'error', text: error.response.statusText };
    }
  },
  [action_types.ACT_FETCH_IS_PROJECT_MANAGEMENT]: async (
    { commit },
    payload
  ) => {
    try {
      const res = await checkIsProjectManagement(payload);
      if (res.status === 400) {
        return { type: 'error', text: res.statusText };
      }
      if (res.status === 200) {
        if (res.data === false) {
          commit(appMutationTypes.SET_SNACKBAR, {
            type: 'warning',
            visible: true,
            text: MESSAGE.NOT_PM_IN_PROJECT,
          });
        }
        return res.data;
      }
      return res.statusText;
    } catch (error) {
      return { type: 'error', text: error.response.statusText };
    }
  },
};

export default actions;
