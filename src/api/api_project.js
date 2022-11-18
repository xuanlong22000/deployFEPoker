import {
  getRequest,
  postRequest,
  putRequest,
  deleteRequest,
} from '@/utils/utils_api';
const PROJECT_URL = '/project';

const getDetailById = (
  id,
  pageIndex,
  pageSize,
  keyword,
  game_id = 0,
  token
) => {
  return getRequest(
    `${PROJECT_URL}?projectId=${id}&pageIndex=${pageIndex}&pageSize=${pageSize}&keyword=${keyword}&game_id=${game_id}&token=${token}`
  );
};

const create = (data) => {
  return postRequest(`${PROJECT_URL}`, data);
};

const getById = (id) => {
  return getRequest(`${PROJECT_URL}/${id}`);
};

const update = (id, data) => {
  return putRequest(`${PROJECT_URL}/${id}`, data);
};

const getAll = (page, size) => {
  // const getAll = () => {
  return getRequest(`${PROJECT_URL}/all?page=${page}&size=${size}`);
  // return getRequest(`${PROJECT_URL}/all`);
};
const search = (keyword, page = 1, size = 12) => {
  // const getAll = () => {
  return getRequest(
    `${PROJECT_URL}/search?keyword=${keyword}&page=${page}&size=${size}`
  );
  // return getRequest(`${PROJECT_URL}/all`);
};

const deleteById = (projectId) => {
  return deleteRequest(`${PROJECT_URL}/${projectId}`);
};

const getAllMember = (id) => {
  return getRequest(`${PROJECT_URL}-member?projectId=${id}`);
};

const checkGamePlaying = (data) => {
  return postRequest(`${PROJECT_URL}/playing`, data);
};

const getEditById = (id) => {
  return getRequest(`${PROJECT_URL}/edit/${id}`);
};

export {
  getDetailById,
  create,
  getById,
  update,
  getAll,
  deleteById,
  getAllMember,
  search,
  checkGamePlaying,
  getEditById,
};
