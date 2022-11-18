import mutationTypes from './mutation_types';

const mutations = {
  [mutationTypes.SET_NOTIFICATION]: (state, id) => {
    state.notificationList = id;
  },
  [mutationTypes.SET_NOTIFICATION_POPUP]: (state, id) => {
    state.notificationPopupList = id;
  },
  [mutationTypes.SET_NOTIFICATION_QUANTITY]: (state, id) => {
    state.notificationQuantity = id;
  },
  [mutationTypes.SET_UNREAD_COUNT]: (state, id) => {
    state.unreadCount = id;
  },
  [mutationTypes.SET_SEARCH_TEXT]: (state, searchText) => {
    state.searchText = searchText;
  },
};
export default mutations;
