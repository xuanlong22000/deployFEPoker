import mutationTypes from './mutation_types';

const mutations = {
  [mutationTypes.SET_ACTIVITY_LOG]: (state, id) => {
    state.activityLogList = id;
  }
};
export default mutations;
