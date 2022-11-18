import actionTypes from './action_types';
import mutationTypes from './mutation_types';
import appMutationTypes from '@/store/app/mutation_types';

import {
  getDetailById,
  create,
  getById,
  update,
  getAll,
  deleteById,
  getAllMember,
  search,
  checkGamePlaying,
  getEditById,
} from '@/api/api_project';
import router from '@/router';
import MESSAGE from '@/utils/utils_message';
import socket from '@/socket/socket';

const actions = {
  [actionTypes.ACT_GET_DETAIL_BY_ID]: async (context, payload) => {
    try {
      let res = await getDetailById(
        payload.id,
        payload.pageIndex,
        payload.pageSize,
        payload.keyword,
        payload.game_id,
        payload?.token
      );
      if (res.status === 204) {
        return true;
      }
      if (res.status === 200) {
        context.commit(mutationTypes.SET_DETAIL_BY_ID, res.data);
        return res.data;
      }
    } catch (error) {
      if (error.response?.status === 400) {
        context.commit('SET_SNACKBAR', {
          type: 'warning',
          visible: true,
          text: error.response.statusText,
        });
        router.push({ name: 'project-list' });
        return;
      }
      if (error.response?.status === 403) {
        context.commit(appMutationTypes.SET_SNACKBAR, {
          type: 'warning',
          visible: true,
          text: error.response.statusText,
        });
      }
      return false;
    }
  },
  [actionTypes.ACT_CREATE]: async (context, payload) => {
    try {
      let res = await create(payload);
      if (res.status === 200) {
        context.commit('SET_SNACKBAR', {
          type: 'success',
          visible: true,
          text: res.statusText,
        });
        return res.data;
      } else {
        context.commit('SET_SNACKBAR', {
          type: 'error',
          visible: true,
          text: res.statusText,
        });
      }
    } catch (error) {
      context.commit('SET_SNACKBAR', {
        type: 'error',
        visible: true,
        text: MESSAGE.SERVER_ERROR,
      });
    }
  },
  [actionTypes.ACT_GET_PROJECT_BY_ID]: async (context, payload) => {
    try {
      let res = await getById(payload.id);
      let project = res.data;
      const pm = project.users.find(
        (user) => user.project_member.role_id === 1
      );
      if (res.status === 200) {
        context.commit(mutationTypes.SET_PROJECT, { ...project, pm });
        return project;
      }
    } catch (error) {
      context.commit('SET_SNACKBAR', {
        type: 'error',
        visible: true,
        text: error.response.statusText,
      });
      let res = await search('', 1, 12);
      if (res.status === 204) {
        context.commit(mutationTypes.SET_ALL_PROJECTS, []);
        return;
      }
      context.commit(mutationTypes.SET_ALL_PROJECTS, res.data);
      return { mess: error.response.statusText };
    }
  },
  [actionTypes.ACT_UPDATE_PROJECT_BY_ID]: async (context, payload) => {
    try {
      if (payload.data.end_date) {
        const start = new Date(payload.data.start_date);
        const end = new Date(payload.data.end_date);
        if (start > end) {
          context.commit('SET_SNACKBAR', {
            type: 'error',
            visible: true,
            text: MESSAGE.DATE_END_ERROR,
          });
          return;
        }
      }
      let res = await update(payload.id, {
        data: payload.data,
        userId: payload.userId,
        isUpdate: payload.isUpdate,
      });
      if (!payload.isUpdateProjectNone) {
        if (res.status === 200) {
          context.commit('SET_SNACKBAR', {
            type: 'success',
            visible: true,
            text: res.statusText,
          });
          router.push('/project');
          return true;
        } else {
          context.commit('SET_SNACKBAR', {
            type: 'error',
            visible: true,
            text: res.statusText,
          });
          return false;
        }
      }
      return true;
    } catch (error) {
      if (error.response.status == 406) {
        context.commit('SET_SNACKBAR', {
          type: 'warning',
          visible: true,
          text: error.response.statusText,
        });
      } else {
        context.commit('SET_SNACKBAR', {
          type: 'error',
          visible: true,
          text: error.response.statusText,
        });
        router.push('/project');
      }
      return false;
    }
  },
  [actionTypes.ACT_FETCH_GET_ALL_PROJECTS]: async (context, payload) => {
    let res = await getAll(payload.page, payload.size);
    if (res.status === 204) {
      context.commit(mutationTypes.SET_ALL_PROJECTS, []);
      return;
    }
    context.commit(mutationTypes.SET_ALL_PROJECTS, res.data.projects);
  },
  [actionTypes.ACT_FETCH_GET_ALL_MEMBERS]: async (context, payload) => {
    let res = await getAllMember(payload.id);
    if (res.status === 204) {
      context.commit(mutationTypes.SET_ALL_MEMBERS, []);
      return;
    }
    if (!res.data) {
      context.commit(mutationTypes.SET_ALL_MEMBERS, []);
    } else {
      context.commit(mutationTypes.SET_ALL_MEMBERS, res.data);
      return res.data;
    }
  },
  [actionTypes.ACT_FETCH_DELETE_PROJECT]: async (context, payload) => {
    try {
      let res = await deleteById(payload.projectId);
      if (!res) {
        context.commit(appMutationTypes.SET_SNACKBAR, {
          type: 'error',
          visible: true,
          text: MESSAGE.NOT_DELETE_GAME_PLAYING,
        });
        return;
      }
      socket.deleteProject(payload.projectId);
      context.commit(appMutationTypes.SET_SNACKBAR, {
        type: 'success',
        visible: true,
        text: res.statusText,
      });
      context.commit(appMutationTypes.SET_DELETE_RESULT, true);
      return true;
    } catch (error) {
      if (error.response.status === 400) {
        context.commit(appMutationTypes.SET_SNACKBAR, {
          type: 'error',
          visible: true,
          text: error.response.statusText,
        });
        return false;
      }
      context.commit(appMutationTypes.SET_DELETE_RESULT, false);
    }
  },
  [actionTypes.ACT_CHECK_PLAYING]: async (context, payload) => {
    try {
      let res = await checkGamePlaying(payload);
      if (res.status === 200) {
        return res.data.isPlaying;
      }
    } catch (error) {
      if (error.response.status === 400) {
        context.commit(appMutationTypes.SET_SNACKBAR, {
          type: 'error',
          visible: true,
          text: error.response.statusText,
        });
        return false;
      }
    }
  },
  [actionTypes.ACT_SEARCH_PROJECTS]: async (context, payload) => {
    let res = await search(payload.keyword, payload.page, payload.size);
    if (res.status === 204) {
      context.commit(mutationTypes.SET_ALL_PROJECTS, []);
      return;
    }
    context.commit(mutationTypes.SET_ALL_PROJECTS, res.data);
  },
  [actionTypes.ACT_FETCH_EDIT_BY_ID]: async (context, id) => {
    try {
      let res = await getEditById(id);
      if (res.status === 200) {
        return true;
      }
    } catch (error) {
      context.commit(appMutationTypes.SET_SNACKBAR, {
        type: error.response.status === 400 ? 'warning' : 'error',
        visible: true,
        text: error.response.statusText,
      });
      if (error.response.status === 400) {
        context.dispatch(actionTypes.ACT_GET_PROJECT_BY_ID, { id: id });
      }
      return false;
    }
  },
};

export default actions;
