import {
  getRequest,
  putRequest,
  postRequest,
  deleteRequest,
} from '@/utils/utils_api';
const GAME_URL = '/game';

const getGameApi = (gameId, token) => {
  return getRequest(`${GAME_URL}/${gameId}?token=${token}`);
};

const finishGameApi = gameId => {
  return putRequest(`${GAME_URL}/finish/${gameId}`);
};

const resetGameApi = gameId => {
  return putRequest(`${GAME_URL}/reset/${gameId}`);
};

const invitePlayersApi = (players, gameId) => {
  return postRequest(`${GAME_URL}/invite/${gameId}`, players);
};

const startGameApi = gameId => {
  return putRequest(`${GAME_URL}/start/${gameId}`);
};

const deleteGameApi = gameId => {
  return deleteRequest(`${GAME_URL}/${gameId}`, {});
};

const getAccessGameGuest = token => {
  return getRequest(`${GAME_URL}/join-game/mail?token=${token}`);
};
const getAccessGame = gameId => {
  return getRequest(`${GAME_URL}/join-game/user/${gameId}`);
};
const submitGame = data => {
  const body = {
    selectedCard: data.selectedCard,
    comment: data.comment,
  };
  if (data.isUser) {
    return putRequest(`${GAME_URL}/submit/user/${data.gameId}`, body);
  } else {
    return putRequest(`${GAME_URL}/submit/mail?token=${data.token}`, body);
  }
};

const create = (backlogId, projectId) => {
  return postRequest(`${GAME_URL}`, { backlogId, projectId });
};

export {
  getGameApi,
  invitePlayersApi,
  startGameApi,
  resetGameApi,
  finishGameApi,
  deleteGameApi,
  getAccessGameGuest,
  getAccessGame,
  submitGame,
  create,
};
