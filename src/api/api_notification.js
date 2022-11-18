import { getRequest, putRequest } from '@/utils/utils_api';
const NOTIFICATION_URL = '/notification';

const getNotificationApi = (page = 1, size = 10) => {
  return getRequest(`${NOTIFICATION_URL}/user?page=${page}&size=${size}`);
};

const getNotificationApiPopup = (userId) => {
  return getRequest(`${NOTIFICATION_URL}/user/popup/${userId}`);
};

const updateNotification = (data) => {
  return putRequest(`${NOTIFICATION_URL}/accept-game/${data.id}`);
};
const changeStatusApi = (page, size) => {
  return putRequest(`${NOTIFICATION_URL}?page=${page}&size=${size}`);
};

const changeToReadStatus = (ids) => {
  return putRequest(`${NOTIFICATION_URL}/read`, ids);
};

const getUnreadCountApi = () => {
  return getRequest(`${NOTIFICATION_URL}/unread`);
};

const searchNotification = (keyword = '', page = 1, size = 10) => {
  return getRequest(
    `${NOTIFICATION_URL}/search?keyword=${keyword}&page=${page}&size=${size}`
  );
};
export {
  getNotificationApi,
  getNotificationApiPopup,
  changeStatusApi,
  getUnreadCountApi,
  updateNotification,
  changeToReadStatus,
  searchNotification,
};
