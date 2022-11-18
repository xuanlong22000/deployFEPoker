import { getRequest, deleteRequest, postRequest, putRequest } from '@/utils/utils_api';
const BACKLOG_URL = '/product-backlog';

const getById = id => {
  return getRequest(`${BACKLOG_URL}/${id}`)
}

const deleteById = (backlogId, projectId) => {
  return deleteRequest(`${BACKLOG_URL}/${backlogId}`, {projectId});
};

const createProductBacklog = newBacklog => {
  return postRequest(BACKLOG_URL, newBacklog);
};

const updateProductBacklog = (id, updatedBacklog) => {
  return putRequest(`${BACKLOG_URL}/${id.backlogId}`, updatedBacklog);
};

export { getById, deleteById, createProductBacklog, updateProductBacklog };
