import localStorageUtils from '@/utils/utils_local_storage';

const state = () => ({
  current: localStorageUtils.getCurrentUser() || null,
  listUsers: null,
  usersNotMember: null,
  profile: null,
  isLogin: false,
  user: null,
  listUsersOnline: null,
});

export default state;
