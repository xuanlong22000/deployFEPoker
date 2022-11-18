import { getRequest } from '@/utils/utils_api';
const ACTIVITY_LOG_URL = '/activity-log';

const getActivityLogApi = (userId, projectId) => {
  return getRequest(`${ACTIVITY_LOG_URL}/${userId}/${projectId}`);
};
export {
  getActivityLogApi,
};
