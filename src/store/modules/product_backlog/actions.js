import actionTypes from './action_types';
import appMutationTypes from '@/store/app/mutation_types';
import { getById, deleteById } from '@/api/api_product_backlog';
import { checkBacklogMessageAndExcute } from '@/utils/utils_route';
import router from '@/router';
import MESSAGE from '../../../utils/utils_message';

const actions = {
  [actionTypes.ACT_GET_BY_BACKLOG_ID]: async (context, payload) => {
    try {
      let res = await getById(payload);
      if (res.statusText === MESSAGE.BACKLOG_NOT_EXISTED) {
        context.commit(appMutationTypes.SET_SNACKBAR, {
          type: 'error',
          visible: true,
          text: "This backlog doesn't exist!",
        });
        return { mess: res.statusText };
      }
    } catch (error) {
      context.commit(appMutationTypes.SET_SNACKBAR, {
        type: 'error',
        visible: true,
        text: error,
      });
      return { mess: error };
    }
  },
  [actionTypes.ACT_DELETE_BY_BACKLOG_ID]: async (context, payload) => {
    try {
      let res = await deleteById(payload.backlogId, payload.projectId);
      context.commit(appMutationTypes.SET_DELETE_RESULT, true);
      context.commit(appMutationTypes.SET_SNACKBAR, {
        type: 'success',
        visible: true,
        text: MESSAGE.DELETE_SUCCESS,
      });
      return res.statusText;
    } catch (error) {
      context.commit(appMutationTypes.SET_SNACKBAR, {
        type: 'error',
        visible: true,
        text: error.response.statusText,
      });

      context.commit(appMutationTypes.SET_DELETE_RESULT, false);
      await checkBacklogMessageAndExcute(
        error.response.statusText,
        payload.projectId
      );
      if (error.response.statusText === "This project doesn't exist!") {
        router.push({ name: 'project' }).catch(() => {});
      }
      // else {
      //   router.go(0)
      // }
      return error.response.statusText;
    }
  },
};

export default actions;
