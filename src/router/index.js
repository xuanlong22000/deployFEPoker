import Vue from 'vue';
import VueRouter from 'vue-router';
import localStorageUtils from '@/utils/utils_local_storage';
const localStorage = localStorageUtils.getService();
import { checkValidToken } from '@/api/api_user.js';
if (!process || process.env.NODE_ENV !== 'test') {
  Vue.use(VueRouter);
}
// Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'landing-page',
    meta: { title: 'Planning Poker' },
    component: () => import('@/views/LandingPage/LandingPage'),
  },
  {
    path: '/reset-password/:resetToken',
    name: 'reset-password',
    meta: { title: 'Reset password' },
    component: () => import('@/views/ResetPasswordPage/ResetPasswordPage'),
    props: true,
  },
  {
    path: '',
    component: () => import('@/views/MainPage/MainPage.vue'),
    children: [
      {
        path: '/backlog',
        name: 'backlog-list',
        component: () =>
          import('@/views/ProductBacklogList/ProductBacklogList'),
        meta: { title: 'Backlogs - Planning Poker' },
        props: (route) => ({
          projectId: route.query.projectId + '',
          pageIndex: parseInt(route.query.pageIndex),
        }),
      },
      {
        path: '/notification',
        name: 'notification-page',
        meta: { title: 'Notification' },
        props: (route) => ({
          page: route.query.page ? +route.query.page : 1,
          size: route.query.size ? +route.query.size : 10,
          searchText: route.query.searchText ? route.query.searchText : '',
        }),
        component: () =>
          import('@/views/NotificationPage/NotificationPage.vue'),
      },
      {
        path: '/user-profile',
        name: 'user-profile-page',
        meta: { title: 'User Profile' },
        component: () => import('@/views/UserProfile/UserProfilePage.vue'),
      },
      {
        path: '/user-details/:id',
        name: 'user-details',
        meta: { title: 'User Details' },
        component: () => import('@/views/UserManagement/UserDetails.vue'),
      },
      {
        path: '/create-project',
        name: 'create-project',
        component: () => import('@/views/EditProject/CreateProject.vue'),
        meta: { title: 'Create - Project' },
      },
      {
        path: '/project-detail/:id',
        name: 'project-detail',
        component: () => import('@/views/EditProject/UpdateProject.vue'),
        meta: { title: 'Update - Project' },
      },
      {
        path: '/project',
        name: 'project-list',
        component: () => import('@/views/Project/ProjectList'),
        meta: { title: 'Projects - Planning Poker' },
      },
      {
        path: '/game-management/:id',
        name: 'game-management',
        meta: { title: 'Game management - Planning Poker' },
        component: () => import('../views/GameManagement/GameManagement.vue'),
      },
      {
        path: '/game-report',
        name: 'game-report',
        meta: { title: 'Game report - Planning Poker' },
        component: () => import('../views/GameManagement/GameReport.vue'),
      },
      {
        path: '/game',
        name: 'game-screen',
        meta: { title: 'Game - Planning Poker' },
        component: () => import('../views/GamePage/GameScreen.vue'),
      },
      {
        path: '/user-management',
        name: 'user-management',
        component: () => import('@/views/UserManagement/UserManagement.vue'),
        meta: { title: 'User Management' },
      },
      {
        path: '/endgame',
        name: 'game-end',
        meta: { title: 'Game - Planning Poker' },
        component: () => import('@/views/GameEndScreen/GameEnd.vue'),
        props: true,
      },
    ],
  },
  {
    path: '/error',
    name: 'error',
    component: () => import('@/views/ErrorPage/ErrorPage'),
    children: [
      {
        path: 'denied-access',
        name: 'denied-access',
        component: () => import('@/views/ErrorPage/ErrorDeniedAccess'),
        meta: { title: 'Error 403 - Forbidden' },
      },
      {
        path: 'other-error',
        name: 'other-error',
        component: () => import('@/views/ErrorPage/ErrorOther'),
        meta: { title: 'Other error' },
      },
      {
        path: 'invalid-token',
        name: 'invalid-token',
        meta: { title: 'Invalid token' },
        component: () => import('../views/ErrorPage/ErrorToken'),
      },
      {
        path: 'internal-server',
        name: 'internal-server',
        meta: { title: 'Error 500 - Internal Server Error' },
        component: () => import('../views/ErrorPage/ErrorInternalServer.vue'),
      },
    ],
  },
  {
    path: '/game-guest',
    name: 'game-guest',
    meta: { title: 'Game Guest' },
    component: () => import('@/views/GamePage/GameScreen.vue'),
    props: true,
  },
  {
    path: '/end-game-guest',
    name: 'game-end-guest',
    meta: { title: 'Game - Planning Poker' },
    component: () => import('@/views/GameEndScreen/GameEnd.vue'),
    props: true,
  },
  {
    path: '*',
    component: () => import('@/views/ErrorPage/ErrorPage'),
    children: [
      {
        path: '*',
        name: 'not-found',
        component: () => import('@/views/ErrorPage/ErrorNotFound'),
        meta: { title: 'Error 404 - Not found' },
      },
    ],
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
  scrollBehavior() {
    return { x: 0, y: 0 };
  },
});

const arr = routes[2].children.filter((m) => m.name !== 'game-screen');
const arrName = arr.map((m) => m.name);
const checkToken = async () => {
  const user_token = localStorage.getService().getToken();
  if (!user_token) {
    return false;
  } else {
    const activeToken = await checkValidToken();
    if (activeToken.status === 200) {
      return true;
    }
    return false;
  }
};
router.beforeEach(async (to, from, next) => {
  document.title = to.meta.title;
  const result = await checkToken();
  if (result === false) {
    if (arrName.includes(to.name)) {
      next({ name: 'landing-page' });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
