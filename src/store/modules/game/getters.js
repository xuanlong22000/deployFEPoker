import getterTypes from './getter_types';

const getters = {
  [getterTypes.GET_GAME_MANAGEMENT]: (state) => state.gameManagement,
  [getterTypes.GET_SUMMARY_STORY_POINTS]: (state) => state.summaryStoryPoints,
  [getterTypes.GET_SUMMARY_PLAYERS]: (state) => state.summaryPlayers,
  [getterTypes.GET_USERS]: (state) => state.users,
  [getterTypes.GET_PLAYERS]: (state) => state.players,
  [getterTypes.GET_MEMBERS]: (state) => state.members,
  [getterTypes.GET_ALERT]: (state) => state.alert,
  [getterTypes.GET_IS_START_GAME]: (state) => state.isStartGame,
  [getterTypes.GET_ACCESS_GAME]: (state) => state.game,
  [getterTypes.GET_ACCESS_GAME_GUEST]: (state) => state.game,
  [getterTypes.GET_GAME_SNACKBAR]: (state) => state.snackbar,
  [getterTypes.GET_STATUS_CARD]: (state) => state.isDisable,
  [getterTypes.GET_HISTORY]: (state) => state.history,
  [getterTypes.GET_FINISH_GAME]: (state) => state.isFinishGame,
  [getterTypes.GET_TOTAL_PLAYERS]: (state) => state.totalPlayers,
};

export default getters;
