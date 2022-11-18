import mutationTypes from './mutation_types';

const mutations = {
  [mutationTypes.SET_GAME]: (state, game) => {
    state.gameManagement = game;
  },
  [mutationTypes.SET_PLAYERS]: (state, players) => {
    state.players = players;
  },
  [mutationTypes.SET_USERS]: (state, users) => {
    state.users = users;
  },
  [mutationTypes.SET_SUMMARY_STORY_POINTS]: (state, summaryStoryPoints) => {
    state.summaryStoryPoints = summaryStoryPoints;
  },
  [mutationTypes.SET_SUMMARY_PLAYERS]: (state, summaryPlayers) => {
    state.summaryPlayers = summaryPlayers;
  },
  [mutationTypes.SET_ALERT]: (state, alert) => {
    state.alert = alert;
  },
  [mutationTypes.SET_SELECTED_EMAILS]: (state, selectedEmails) => {
    state.selectedEmails = selectedEmails;
  },
  [mutationTypes.SET_ENTERED_EMAILS]: (state, enteredEmails) => {
    state.enteredEmails = enteredEmails;
  },
  [mutationTypes.SET_MEMBERS]: (state, members) => {
    state.members = members;
  },
  [mutationTypes.SET_IS_START_GAME]: (state, isStartgame) => {
    state.isStartGame = isStartgame;
  },
  [mutationTypes.SET_IS_RESET_GAME]: (state, isResetGame) => {
    state.isResetGame = isResetGame;
  },
  [mutationTypes.SET_IS_FINISH_GAME]: (state, isFinishGame) => {
    state.isFinishGame = isFinishGame;
  },
  [mutationTypes.ACCESS_GAME]: (state, game) => {
    state.game = game;
  },
  [mutationTypes.ACCESS_GAME_GUEST]: (state, game) => {
    state.game = game;
  },
  [mutationTypes.GAME_SNACKBAR]: (state, snackbar) => {
    state.snackbar = snackbar;
  },
  [mutationTypes.ENABLE_CARD]: state => {
    state.isDisable = false;
  },
  [mutationTypes.DISABLE_CARD]: state => {
    state.isDisable = true;
  },
  [mutationTypes.SET_HISTORY]: (state, route) => {
    state.history = route;
  },
  [mutationTypes.SET_TOTAL_PLAYERS]: (state, totalPlayers) => {
    state.totalPlayers = totalPlayers;
  },
};
export default mutations;
