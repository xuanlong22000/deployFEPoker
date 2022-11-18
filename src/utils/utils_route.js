import MESSAGE from '@/utils/utils_message';
import store from '@/store/store';
import projectActions from '@/store/modules/project/action_types';
import router from '@/router';

const checkBacklogMessageAndExcute = async (message, projectId) => {
  const backlogQuantity =
    store.state.projectModule.projectDetail.backlogQuantity;
  const pageIndex = router.currentRoute.query.pageIndex;
  switch (message) {
    case MESSAGE.BACKLOG_NOT_EXISTED:
      if (backlogQuantity % 10 === 1 && pageIndex > 1) {
        await router.push({
          name: 'backlog-list',
          query: { projectId: projectId, pageIndex: +pageIndex - 1 },
        });
        await store.dispatch(projectActions.ACT_GET_DETAIL_BY_ID, {
          id: projectId,
          pageIndex: +pageIndex - 1,
        });
        return;
      }
      await store.dispatch(projectActions.ACT_GET_DETAIL_BY_ID, {
        id: projectId,
        pageIndex: +pageIndex,
      });
      break;
    case MESSAGE.NOT_AUTHOR_PERFORM:
      await store.dispatch(projectActions.ACT_GET_DETAIL_BY_ID, {
        id: projectId,
      });
      break;
    default:
  }
};

const checkProjectMessageAndExcute = async message => {
  switch (message) {
    case MESSAGE.PROJECT_NOT_EXISTED:
      await store.dispatch(projectActions.ACT_FETCH_GET_ALL_PROJECTS);
      break;
    case MESSAGE.NOT_AUTHOR_PERFORM:
      await store.dispatch(projectActions.ACT_GET_DETAIL_BY_ID);
      break;
    default:
  }
};

export { checkBacklogMessageAndExcute, checkProjectMessageAndExcute };
