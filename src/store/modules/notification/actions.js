import actionTypes from './action_types';
import mutationTypes from './mutation_types';
import router from '@/router';
import {
  getNotificationApi,
  getNotificationApiPopup,
  updateNotification,
  changeStatusApi,
  getUnreadCountApi,
  changeToReadStatus,
  searchNotification,
} from '@/api/api_notification.js';
import MESSAGE from '@/utils/utils_message';
const actions = {
  [actionTypes.GET_NOTIFICATION_LIST]: async ({ commit }, payload) => {
    try {
      const page = payload?.page;
      const size = payload?.size;
      const res = await getNotificationApi(page, size);
      await getUnreadCountApi();
      commit(mutationTypes.SET_UNREAD_COUNT, res.data.unreadCount);
      commit(mutationTypes.SET_NOTIFICATION, res.data.rows);
      commit(mutationTypes.SET_NOTIFICATION_QUANTITY, res.data.count);
    } catch (error) {
      commit('SET_SNACKBAR', {
        type: 'error',
        visible: true,
        text: MESSAGE.SERVER_ERROR,
      });
    }
  },
  [actionTypes.GET_NOTIFICATION_LIST_POPUP]: ({ commit }, payload) => {
    getNotificationApiPopup(payload.userId)
      .then(res => {
        commit(mutationTypes.SET_NOTIFICATION_POPUP, res.data);
      })
      .catch(() => {
        commit('SET_SNACKBAR', {
          type: 'error',
          visible: true,
          text: MESSAGE.SERVER_ERROR,
        });
      });
  },
  [actionTypes.ACCEPT_INVITE_GAME_NOTIFICATION]: (
    { commit, dispatch },
    data
  ) => {
    updateNotification(data)
      .then(res => {
        if (res.status === 200) {
          router.push(`/game?id=${data.router_link}&projectId=${data.project_noti_id}`);
          dispatch(actionTypes.GET_NOTIFICATION_LIST);
        }
      })
      .catch((error) => {
        commit('SET_SNACKBAR', {
          type: 'error',
          visible: true,
          text: error.response.statusText,
        });
      });
  },
  [actionTypes.CHANGE_NOTIFICATION_STATUS]: async ({ commit }, payload) => {
    try {
      const { page, size } = payload;
      await changeStatusApi(page, size);
      return true;
    } catch {
      commit('SET_SNACKBAR', {
        text: 'Error',
        visible: true,
        type: 'error',
      });
      return false;
    }
  },
  [actionTypes.CHANGE_TO_READ_STATUS]: async ({ commit }, payload) => {
    try {
      const ids = payload;
      await changeToReadStatus({ notificationIds: ids });
      return true;
    } catch {
      commit('SET_SNACKBAR', {
        text: 'Error',
        visible: true,
        type: 'error',
      });
      return false;
    }
  },
  [actionTypes.GET_NOTIFICATION_QUANTITY]: async ({ commit }) => {
    try {
      const res = await getNotificationApi();
      if (res.status === 200) {
        commit(mutationTypes.SET_NOTIFICATION_QUANTITY, res.count);
      }
    } catch (error) {
      commit('SET_SNACKBAR', {
        text: 'Error',
        visible: true,
        type: 'error',
      });
    }
  },
  [actionTypes.GET_UNREAD_COUNT]: async ({ commit }) => {
    try {
      const res = await getUnreadCountApi();
      if (res.status === 200) {
        commit(mutationTypes.SET_UNREAD_COUNT, res.data);
      }
    } catch (error) {
      commit('SET_SNACKBAR', {
        text: 'Error',
        visible: true,
        type: 'error',
      });
    }
  },
  [actionTypes.ACT_SEARCH]: async ({ commit }, val) => {
    try {
      const res = await searchNotification(
        val.keyword,
        val.currentPage,
        val.pageSize
      );
      if (res.status === 200) {
        commit(mutationTypes.SET_UNREAD_COUNT, res.data.unreadCount);
        commit(mutationTypes.SET_NOTIFICATION, res.data.rows);
        commit(mutationTypes.SET_NOTIFICATION_QUANTITY, res.data.count);
      }
    } catch (error) {
      commit('SET_SNACKBAR', {
        type: 'error',
        visible: true,
        text: MESSAGE.ERROR_GET_DATA,
      });
    }
  },
};

export default actions;
