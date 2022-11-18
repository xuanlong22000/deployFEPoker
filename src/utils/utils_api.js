import axios from 'axios';
import localStorageUtils from '@/utils/utils_local_storage';
import router from '@/router';
const localStorage = localStorageUtils.getService();
import store from '@/store/store.js';
import appMutationTypes from '@/store/app/mutation_types';
import userMutationTypes from '@/store/modules/user/mutation_types';
import jwtUtils from '@/utils/utils_jwt';

const service = axios.create({
  baseURL: process.env.VUE_APP_SOCKET_SERVER,
  timeout: process.env.VUE_APP_TIMEOUT,
});

service.interceptors.request.use(
  (config) => {
    const user_token = localStorage.getService().getToken();
    if (user_token) {
      config.headers['Authorization'] = 'Bearer ' + user_token;
    }
    config.headers['Content-type'] = 'application/json';
    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

service.interceptors.response.use(
  (response) => {
    return Promise.resolve(response);
  },
  async function (error) {
    if (error.response.status === 401) {
      if (router.currentRoute.name === 'landing-page')
        return Promise.reject(error);
      const refreshToken = localStorage.getService().getRefreshToken();
      const decodedToken = jwtUtils.decodeJwt(refreshToken);
      if (!decodedToken || decodedToken.exp * 1000 < Date.now()) {
        store.commit(appMutationTypes.SET_SNACKBAR, {
          type: 'warning',
          visible: true,
          text: 'You have been logged out because your session has expired!',
        });
        store.commit(userMutationTypes.MUTATE_SIGNOUT);
        router.push({ name: 'landing-page' });
        return;
      }
      const { data } = await service.post(`/user/refresh-token`, {
        refreshToken: refreshToken,
      });
      localStorage.getService().setToken(data.userToken);
      localStorage.getService().setRefreshToken(data.refreshToken);
      service.defaults.headers.common['Authorization'] =
        'Bearer ' + data.userToken;
      return service(error.config);
    }
    if (error.response.status === 403) {
      store.commit(appMutationTypes.SET_SNACKBAR, {
        type: 'warning',
        visible: true,
        text: error.response.statusText,
      });
      const listRouteNotDirect = ['project-detail', 'user-management', 'notifications'];
      if (listRouteNotDirect.includes(router.currentRoute.name)) return;
      router.push({ name: 'project-list' });
      return;
    }
    // if (error.response.status === 400) {
    //   store.commit(appMutationTypes.SET_SNACKBAR, {
    //     type: 'warning',
    //     visible: true,
    //     text: error.response.statusText,
    //   });
    //   router.push({ name: 'project-list' });
    //   return;
    // }
    if (error.response.status === 404) {
      router.replace({ path: '/error/not-found' });
      return;
    }
    if (error.response.status === 500) {
      router.push({ name: 'internal-server' });
      return;
    }
    return Promise.reject(error);
  }
);

const getRequest = (url, params = '') => {
  return service.request({
    method: 'get',
    url: url,
    responseType: 'json',
    params: params,
  });
};

const putRequest = (url, data = {}) => {
  return service.request({
    method: 'put',
    url: url,
    responseType: 'json',
    data: data,
  });
};

const patchRequest = (url, data = {}) => {
  return service.request({
    method: 'patch',
    url: url,
    responseType: 'json',
    data: data,
  });
};

const postRequest = (url, data = {}) => {
  return service.request({
    method: 'post',
    url: url,
    responseType: 'json',
    data: data,
  });
};

const deleteRequest = (url, data = {}) => {
  return service.request({
    method: 'delete',
    url: url,
    responseType: 'json',
    data: data,
  });
};

export {
  service,
  getRequest,
  postRequest,
  putRequest,
  patchRequest,
  deleteRequest,
};
