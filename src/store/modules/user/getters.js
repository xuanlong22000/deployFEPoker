import gettersType from './getter_types';

const getters = {
  [gettersType.GET_CURRENT_USER]: state => state.current,
  [gettersType.GET_LIST_USERS]: state => state.listUsers,
  [gettersType.GET_USER_NOT_MEMBER]: state => state.usersNotMember,
  [gettersType.GET_PROFILE]: state => state.profile,
  [gettersType.GET_IS_LOGIN]: state => state.isLogin,
  [gettersType.GET_WITH_SYSTEM_ROLE]: state => state.user,
  [gettersType.GET_IS_ONLINE]: state => state.listUsersOnline,
};

export default getters;
