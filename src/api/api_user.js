import {
  postRequest,
  deleteRequest,
  getRequest,
  patchRequest,
} from '@/utils/utils_api';
const _URL = '/user';

const signin = (userInfo) => {
  return postRequest(`${_URL}/signin`, userInfo);
};

const resetPassword = (userInfo) => {
  return postRequest(`${_URL}/reset-password`, userInfo);
};

const verifyToken = (token) => {
  return postRequest(`${_URL}/reset-password/${token}`);
};

const requestResetPassword = (newPassword) => {
  return postRequest(`${_URL}/request-reset-password`, newPassword);
};

const getAll = (page, size, token) => {
  return getRequest(`${_URL}?page=${page}&size=${size}&token=${token}`);
};

const searchUser = (keyword, page, size, projectIds) => {
  return getRequest(
    `${_URL}/search?keyword=${keyword}&page=${page}&size=${size}`,
    {
      projectIds,
    }
  );
};

const signup = (userInfo) => {
  return postRequest(`${_URL}/signup`, userInfo);
};

const active = (token) => {
  return postRequest(`${_URL}/active/${token}`);
};

const getUserNotMember = (projectIds) => {
  return getRequest(`${_URL}/user-not-member`, {
    projectIds,
  });
};

const getJoinedProject = (userId) => {
  return getRequest(`${_URL}/getJoinedProject/${userId}`);
};

const deleteUser = (userId) => {
  return deleteRequest(`${_URL}/${userId}`);
};
const getAuthUserProfile = () => {
  return getRequest(`${_URL}/profile`);
};

const updateAuthUserProfile = (data) => {
  return patchRequest(`${_URL}/update-profile`, data);
};

const checkValidToken = () => {
  return postRequest(`${_URL}/check-valid-token`);
};

const getPMProject = () => {
  return getRequest(`${_URL}/get-pm-project`);
};

const getRole = () => {
  return getRequest(`${_URL}/getRole`);
};

const resetUserToken = () => {
  return getRequest(`${_URL}/reset-user-token`);
};

const getWithSystemRole = () => {
  return getRequest(`${_URL}/get-system-role`);
};

export {
  signin,
  resetPassword,
  verifyToken,
  requestResetPassword,
  signup,
  active,
  getAll,
  getUserNotMember,
  getJoinedProject,
  deleteUser,
  getAuthUserProfile,
  updateAuthUserProfile,
  checkValidToken,
  getPMProject,
  getRole,
  searchUser,
  resetUserToken,
  getWithSystemRole,
};
