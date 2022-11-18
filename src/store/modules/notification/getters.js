import getterTypes from './getter_types';

const getters = {
  [getterTypes.GET_NOTIFICATION_LIST]: (state) => state.notificationList,
  [getterTypes.GET_NOTIFICATION_LIST_POPUP]: (state) =>
    state.notificationPopupList,
  [getterTypes.GET_NOTIFICATION_QUANTITY]: (state) =>
    state.notificationQuantity,
  [getterTypes.GET_UNREAD_COUNT]: (state) => state.unreadCount, 
  [getterTypes.GET_SEARCH_TEXT]: (state) => state.searchText,
};

export default getters;
