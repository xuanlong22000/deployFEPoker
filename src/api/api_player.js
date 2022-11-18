import { getRequest, deleteRequest } from '../utils/utils_api';
const OBJ_URL = 'player';

const kickPlayerApi = (email, gameId) => {
  return deleteRequest(`${OBJ_URL}`, { game_id: gameId, email: email });
};

const getAllInvalidPlayer = (gameId) => {
  return getRequest(`${OBJ_URL}/${gameId}`);
};

const getGamePlayers = (gameId, page, size, token) => {
  return getRequest(`${OBJ_URL}/game/${gameId}?token=${token}`, { page, size });
};

export { kickPlayerApi, getAllInvalidPlayer, getGamePlayers };
