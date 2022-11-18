import mutationsType from './mutation_types';
import localStorageUtils from '@/utils/utils_local_storage';

const mutations = {
  [mutationsType.MUTATE_LOGIN]: (state, val) => {
    state.current = val.userInfo;
    localStorageUtils.setCurrentUser(JSON.stringify(val.userInfo));
    localStorageUtils.setToken(val.userToken);
    localStorageUtils.setRefreshToken(val.refreshToken);
    localStorageUtils.setName(val.userInfo.name);
  },
  [mutationsType.MUTATE_SET_LIST_USERS]: (state, val) => {
    state.listUsers = val;
  },
  [mutationsType.MUTATE_SIGNOUT]: state => {
    state.current = {};
    localStorageUtils.clearToken();
    localStorageUtils.clearRefreshToken();
    localStorageUtils.clearCurrentUser();
    localStorageUtils.clearName();
  },
  [mutationsType.MUTATE_SET_USER_NOT_MEMBER]: (state, usersNotMember) => {
    state.usersNotMember = usersNotMember;
  },
  [mutationsType.MUTATE_SET_PROFILE]: (state, profile) => {
    state.profile = profile;
  },
  [mutationsType.MUTATE_SET_IS_LOGIN]: (state, isLogin) => {
    state.isLogin = isLogin;
  },
  [mutationsType.MUTATE_SET_IS_ONLINE]: (state, listUsersOnline) => {
    state.listUsersOnline = listUsersOnline;
  },
  [mutationsType.MUTATE_SET_WITH_SYSTEM_ROLE]: (state, user) =>
    (state.user = user),
};

export default mutations;
