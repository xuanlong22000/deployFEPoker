import { io } from 'socket.io-client';
import EVENT from './event';
let socket = (function () {
  let _instance = null;
  return {
    getInstance: function () {
      if (!_instance) {
        _instance = io(process.env.VUE_APP_SOCKET_SERVER);
      }
      return _instance;
    },
    // Game management
    joinManagement: function (email, gameId) {
      this.getInstance().emit(EVENT.JOIN_MANAGEMENT, email, gameId);
    },
    ownerInvitePlayers: function (gameId, players) {
      this.getInstance().emit(EVENT.OWNER_INVITE_PLAYERS, gameId, players);
    },
    ownerStartGame: function (gameId, projectId) {
      this.getInstance().emit(EVENT.OWNER_START_GAME, gameId, projectId);
    },
    ownerFinish: function (gameId, projectId) {
      this.getInstance().emit(EVENT.OWNER_FINISH_GAME, gameId, projectId);
    },
    ownerResetGame: function (gameId, projectId) {
      this.getInstance().emit(EVENT.OWNER_RESET_GAME, gameId, projectId);
    },
    ownerDeleteGame: function (gameId) {
      this.getInstance().emit(EVENT.OWNER_DELETE_GAME, gameId);
    },
    onOwnerDeleteGame: function (gameId) {
      this.getInstance().on(EVENT.ON_OWNER_DELETE_GAME, gameId);
    },
    someOneOffGame: function (playerEmail) {
      this.getInstance().emit(EVENT.SOMEONE_OFF_GAME, playerEmail);
    },
    kickPlayer: function (playerEmail, gameId) {
      this.getInstance().emit(EVENT.OWNER_KICK_PLAYER, playerEmail, gameId);
    },

    // Backlog
    createBacklog: function (projectId) {
      this.getInstance().emit(EVENT.CREATE_BACKLOG, projectId);
    },
    onCreateBacklog: function (projectId) {
      this.getInstance().on(EVENT.ON_CREATE_BACKLOG, projectId);
    },
    deleteBacklog: function (gameId) {
      this.getInstance().emit(EVENT.DELETE_BACKLOG, gameId);
    },
    onDeleteBacklog: function (gameId) {
      this.getInstance().on(EVENT.ON_DELETE_BACKLOG, gameId);
    },
    //project
    createProject: function () {
      this.getInstance().emit(EVENT.CREATE_PROJECT, 'create');
    },
    onCreateProject: function (projectId) {
      this.getInstance().on(EVENT.ON_CREATE_PROJECT, projectId);
    },
    deleteProject: function (projectId) {
      this.getInstance().emit(EVENT.DELETE_PROJECT, projectId);
    },
    ondeleteProject: function (projectId) {
      this.getInstance().on(EVENT.ON_DELETE_PROJECT, projectId);
    },
    //  update UserList
    updateUserList: function (gameId) {
      this.getInstance().emit(EVENT.UPDATE_USER_LIST, gameId);
    },
    onUpdateUserList: function (gameId) {
      this.getInstance().on(EVENT.ON_UPDATE_USER_LIST, gameId);
    },
    // Game
    offline: function (email, gameId) {
      this.getInstance().emit(EVENT.OFFLINE, email, gameId);
    },
    emitJoinGame: function (email, gameId, projectId) {
      this.getInstance().emit(EVENT.JOIN_GAME, email, gameId, projectId);
    },
    emitSubmitgame: function (email, gameId, selectedCard, comment) {
      this.getInstance().emit(
        EVENT.SUBMIT_GAME,
        email,
        gameId,
        selectedCard,
        comment
      );
    },
    onGameStart: function () {
      this.getInstance().on(EVENT.GAME_START, function () {});
    },
    onFinishGame: function (gameId) {
      this.getInstance().on(EVENT.GAME_FINISH, gameId);
    },
    onResetGame: function (gameId) {
      this.getInstance().on(EVENT.GAME_RESET, gameId);
    },
    offJoinGame: function (gameId) {
      this.getInstance().on(EVENT.OFF_JOIN_GAME, gameId);
    },
    onLoadBacklogs: function (loadBacklogs) {
      this.getInstance().on(EVENT.LOAD_BACKLOGS, loadBacklogs);
    },
    onStartGameBacklog: function (loadBacklogs) {
      this.getInstance().on(EVENT.GAME_START, loadBacklogs);
    },
    onFinishGameBacklog: function (loadBacklogs) {
      this.getInstance().on(EVENT.GAME_FINISH, loadBacklogs);
    },
    onResetGameBacklog: function (loadBacklogs) {
      this.getInstance().on(EVENT.GAME_RESET, loadBacklogs);
    },
    onDeleteGameBacklog: function (loadBacklogs) {
      this.getInstance().on(EVENT.DELETE_GAME, loadBacklogs);
    },
    onInvitePlayer: function (loadBacklogs) {
      this.getInstance().on(EVENT.INVITE_PLAYER, loadBacklogs);
    },
    emitJoinBacklog: function (userInfo) {
      this.getInstance().emit(
        EVENT.JOIN_BACKLOG,
        userInfo.email,
        userInfo.projectId,
        userInfo.role
      );
    },
    emitOffBacklogScreen: function () {
      this.getInstance().emit(EVENT.OFF_BACKLOG_SCREEN);
    },

    offLoadBacklog: function () {
      this.getInstance().off(EVENT.LOAD_BACKLOGS);
    },
    removeAllListeners: function () {
      this.getInstance().removeAllListeners();
    },
    emitConnectServer: function (userInfo) {
      this.getInstance().emit(EVENT.CONNECT_SERVER, userInfo);
    },
    emitDisconnectServer: function () {
      this.getInstance().emit(EVENT.DISCONNECT);
    },
    onGetNotification: function (getNotification) {
      this.getInstance().on(EVENT.GET_NOTIFICATION, getNotification);
    },
    onNotifyGametInvitation: function (showInvitationPopup) {
      this.getInstance().on(EVENT.NOTIFY_GAME_INVITATION, showInvitationPopup);
    },
    onGetUnreadCount: function (getUnreadCount) {
      this.getInstance().on(EVENT.GET_UNREAD_COUNT, getUnreadCount);
    },
    // USER SCREEN
    emitKickUserOutOfProject: function (projectId, email) {
      this.getInstance().emit(EVENT.KICK_OUT_PROJECT, projectId, email);
    },
    // DELETE_USER
    emitDeleteUser: function (userId) {
      this.getInstance().emit(EVENT.DELETE_USER, userId);
    },
    onWasDeleteUser: function (handleWasDeleteUser) {
      this.getInstance().on(EVENT.GET_DELETE_USER, handleWasDeleteUser);
    },
    emitCheckOnlineUser: function () {
      this.getInstance().emit(EVENT.CHECK_ONLINE);
    },
    onCheckOnlineUser: function (handle) {
      this.getInstance().on(EVENT.GET_CHECK_ONLINE, handle);
    },
    /*   SCREEN GAME MANAGEMENT    */
    onCheckUpdateNameGameManagement: function (handle) {
      this.getInstance().emit(EVENT.UPDATE_NAME_GAME_MANAGEMENT, handle);
    },
    checkUpdateNameManagement: function (handle) {
      this.getInstance().on(EVENT.ON_UPDATE_NAME_GAME_MANAGEMENT, handle);
    },
    /*   SCREEN BACKLOG LIST    */
    onCheckUpdateNameBacklogList: function (handle) {
      this.getInstance().emit(EVENT.UPDATE_NAME_GAME_MANAGEMENT, handle);
    },
    checkUpdateNameBacklogList: function (handle) {
      this.getInstance().on(EVENT.ON_UPDATE_NAME_GAME_MANAGEMENT, handle);
    },
  };
})();
export default socket;
