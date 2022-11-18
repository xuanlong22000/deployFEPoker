import {
  getRequest,
  deleteRequest,
  postRequest,
  putRequest,
} from '@/utils/utils_api';
const _URL = '/project-member';

const changeRoleApi = (data) => {
  return putRequest(`${_URL}`, data);
};

const addMembers = (data) => {
  return postRequest(`${_URL}/add-members`, data);
};

const deleteMember = (userId, projectId) => {
  return deleteRequest(`${_URL}?projectId=${projectId}&userId=${userId}`);
};

const getAllMember = () => {
  return getRequest(`${_URL}/`);
};

const getAllByUserId = (userId) => {
  return getRequest(`${_URL}/user/${userId}`);
};

const checkCanDelete = (params) => {
  return getRequest(`${_URL}/check-can-delete`, params)
}

const checkIsMember = (params) => {
  return getRequest(`${_URL}/check-is-member`, params)
}

const checkIsProjectManagement = (params) => {
  return getRequest(`${_URL}/check-is-project-management`, params)
}

export {
  changeRoleApi,
  addMembers,
  deleteMember,
  getAllMember,
  getAllByUserId,
  checkCanDelete,
  checkIsMember,
  checkIsProjectManagement
};
