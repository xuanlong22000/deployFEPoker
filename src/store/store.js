import Vue from 'vue';
import Vuex from 'vuex';
import userModule from './modules/user';
import gameModule from './modules/game';
import projectModule from './modules/project';
import backlogModule from './modules/product_backlog';
import appModule from "@/store/app";
import notificationModule from './modules/notification';
import activityLogModule from './modules/activity_log';
import projectMemberModule from "@/store/modules/project_member";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    gameModule,
    userModule,
    projectModule,
    backlogModule,
    appModule,
    notificationModule,
    activityLogModule,
    projectMemberModule,
  },
});
