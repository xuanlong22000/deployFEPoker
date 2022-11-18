import mutationsType from './mutation_types';
import snackbarActions from '@/store/app/action_types';
import actionType from './action_types';
import {
  getAll,
  signup,
  getUserNotMember,
  resetUserToken,
  searchUser,
  getWithSystemRole,
} from '@/api/api_user';
import MESSAGE from '@/utils/utils_message';
import { changeRoleApi } from '@/api/api_project_member';

const actions = {
  [actionType.ACT_LOGIN]: ({ commit }, val) => {
    commit(mutationsType.MUTATE_LOGIN, val);
  },
  [actionType.ACT_GET_ALL]: async ({ commit }, val) => {
    try {
      const res = await getAll(
        val?.currentPage,
        val?.pageSize,
        val?.token,
        val?.projectIds
      );
      commit(mutationsType.MUTATE_SET_LIST_USERS, res.data.users);
      return res.data.users;
    } catch (error) {
      commit(snackbarActions.SET_SNACKBAR, {
        type: 'error',
        visible: true,
        text: MESSAGE.ERROR_GET_DATA,
      });
    }
  },
  [actionType.ACT_SIGNOUT]: ({ commit }, val) => {
    commit(mutationsType.MUTATE_SIGNOUT, val);
  },
  [actionType.ACT_SIGNUP]: async (context, newUser) => {
    return await signup(newUser);
  },
  [actionType.ACT_FETCH_GET_USER_NOT_MEMBER]: async ({ commit }, payload) => {
    try {
      const res = await getUserNotMember(payload.projectIds);
      commit(mutationsType.MUTATE_SET_USER_NOT_MEMBER, res.data);
    } catch (error) {
      commit(snackbarActions.SET_SNACKBAR, {
        type: 'error',
        visible: true,
        text: error.response.statusText,
      });
    }
  },
  [actionType.ACT_CHANGE_ROLE]: async ({ commit, dispatch }, payload) => {
    const data = payload.data.map((item) => {
      item.project_member.role_id = +item.project_member.role_id;
      return item.project_member;
    });
    try {
      const res = await changeRoleApi({ userId: payload.userId, data });
      if (res.status === 200) {
        dispatch(actionType.ACT_GET_ALL, {
          keyword: payload.keySearch,
          currentPage: payload.currentPage,
          pageSize: payload.pageSize,
        });
        commit('SET_SNACKBAR', {
          type: 'success',
          visible: true,
          text: res.statusText,
        });
      }
    } catch (error) {
      commit(snackbarActions.SET_SNACKBAR, {
        type: 'error',
        visible: true,
        text: error.response.statusText,
      });
    }
  },
  [actionType.ACT_RESET_USER_TOKEN]: async ({ commit }) => {
    const res = await resetUserToken();
    commit(mutationsType.MUTATE_RESET_USER_TOKEN, res.data.newToken);
  },
  [actionType.ACT_SEARCH]: async ({ commit }, val) => {
    try {
      const res = await searchUser(
        val?.keyword,
        val?.currentPage,
        val?.pageSize,
        val?.projectIds
      );
      commit(mutationsType.MUTATE_SET_LIST_USERS, res.data.users);
    } catch (error) {
      commit(snackbarActions.SET_SNACKBAR, {
        type: 'error',
        visible: true,
        text: MESSAGE.ERROR_GET_DATA,
      });
    }
  },
  [actionType.ACT_FETCH_WITH_SYSTEM_ROLE]: async ({ commit }, payload) => {
    try {
      const res = await getWithSystemRole(payload.id);
      commit(mutationsType.MUTATE_SET_WITH_SYSTEM_ROLE, res.data);
      return res.data;
    } catch (error) {
      commit(snackbarActions.SET_SNACKBAR, {
        type: 'error',
        visible: true,
        text: MESSAGE.ERROR_GET_DATA,
      });
    }
  },
};
export default actions;
