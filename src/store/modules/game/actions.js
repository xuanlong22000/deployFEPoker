import actionTypes from './action_types';
import mutationTypes from './mutation_types';
import {
  finishGameApi,
  resetGameApi,
  startGameApi,
  invitePlayersApi,
  getGameApi,
  deleteGameApi,
  getAccessGame,
  getAccessGameGuest,
  submitGame,
  create,
} from '@/api/api_game';
import { kickPlayerApi, getGamePlayers } from '@/api/api_player';
import MESSAGE from '@/utils/utils_message';
import jwt_decode from 'jwt-decode';
import router from '@/router';
import socket from '@/socket/socket.js';
import localStorageService from '@/utils/utils_local_storage.js';
import appMutationTypes from '@/store/app/mutation_types.js';

const actions = {
  [actionTypes.GET_GAME]: async ({ commit, dispatch }, payload) => {
    try {
      let game;
      let isOwner;
      let summary;

      await getGameApi(payload.id, payload.token)
        .then((res) => {
          game = res.data.game;
          isOwner = res.data.isOwner;
          summary = res.data.summary;
        })
        .catch((err) => {
          if (err.response.status === 500) {
            router.reload();
          } else if (err.response.status === 400) {
            if (
              router.currentRoute.name === 'notification-page' &&
              err.response.statusText === MESSAGE.BACKLOG_NOT_EXISTED
            ) {
              commit('SET_SNACKBAR', {
                type: 'error',
                visible: true,
                text: MESSAGE.GAME_NOT_EXISTED,
              });
            } else {
              commit('SET_SNACKBAR', {
                type: 'error',
                visible: true,
                text: err.response.statusText,
              });
            }
            // router.go(-1);
          }
        });

      const players = game.players;
      const users = game.product_backlog.project.users;
      const summaryStoryPoints = summary.story_point;
      const summaryPlayers = summary.players;
      const members = game.product_backlog.project.users.map((user) => {
        return user.email;
      });
      const email = payload.email;
      const projectId = game.product_backlog.project_id;
      socket.joinManagement({
        email,
        gameId: game.game_id,
        projectId,
        isOwner,
      });

      commit(mutationTypes.SET_GAME, game);
      // players.forEach(player => {
      //   if (users.find(user => user.email === player.email)) {
      //     player['name'] = users.name;
      //   }
      // });
      // commit(mutationTypes.SET_PLAYERS, players);
      const token = payload.token;
      const { page = 1, size = 10 } = router.currentRoute.query;
      dispatch(actionTypes.GET_PLAYERS, {
        gameId: game.game_id,
        page,
        size,
        token,
      });
      commit(mutationTypes.SET_TOTAL_PLAYERS, players.length);
      commit(mutationTypes.SET_USERS, users);
      commit(mutationTypes.SET_MEMBERS, members);
      commit(mutationTypes.SET_SUMMARY_PLAYERS, summaryPlayers);
      commit(mutationTypes.SET_SUMMARY_STORY_POINTS, summaryStoryPoints);

      game.start_game
        ? commit(mutationTypes.SET_IS_START_GAME, true)
        : commit(mutationTypes.SET_IS_START_GAME, false);
      game.end_game
        ? commit(mutationTypes.SET_IS_FINISH_GAME, false)
        : commit(mutationTypes.SET_IS_FINISH_GAME, false);
    } catch (error) {
      if (error.response.statusText === MESSAGE.BACKLOG_NOT_EXISTED) {
        commit(mutationTypes.SET_GAME, null);
        commit('SET_SNACKBAR', {
          type: 'error',
          visible: true,
          text: error.response.statusText,
        });
        // setTimeout(() => {
        //   router.push({
        //     path: `/backlog?projectId=${error.response.data.projectId}&pageIndex=1`,
        //   });
        // }, 500);
      } else {
        commit(mutationTypes.SET_GAME, null);
        commit('SET_SNACKBAR', {
          type: 'error',
          visible: true,
          text: error.response.statusText,
        });
        setTimeout(() => {
          router.push({
            path: `/project`,
          });
        }, 1);
      }
    }
  },
  [actionTypes.KICK_PLAYER]: async ({ commit, dispatch }, payload) => {
    const email = payload.email;
    const gameId = payload.game_id;
    const projectId = payload.projectId;
    const { page = 1, size = 10 } = router.currentRoute.query;

    const getListUser = () => {
      dispatch(actionTypes.GET_GAME, { id: gameId });
      dispatch(actionTypes.GET_PLAYERS, {
        gameId: gameId,
        page,
        size,
        projectId,
      });
    };
    kickPlayerApi(email, gameId)
      .then(() => {
        getListUser();
        commit('SET_SNACKBAR', {
          type: 'success',
          visible: true,
          text: MESSAGE.KICK_PLAYER_SUCCESS,
        });
      })
      .catch((error) => {
        console.log('error', error);
        getListUser();
        commit('SET_SNACKBAR', {
          type: 'error',
          visible: true,
          text: MESSAGE.PLAYER_NOT_FOUND,
        });
      });
  },
  [actionTypes.FINISH_GAME]: async ({ commit, dispatch }, payload) => {
    try {
      const data = await finishGameApi(payload.game_id);
      if (data.status === 200) {
        dispatch(actionTypes.GET_GAME, { id: payload.game_id });
        socket.ownerFinish(payload.game_id);
        commit('SET_SNACKBAR', {
          type: 'success',
          visible: true,
          text: MESSAGE.FINISH_GAME_SUCCESS,
        });
        commit(mutationTypes.SET_IS_FINISH_GAME, true);
        return true;
      } else {
        commit('SET_SNACKBAR', {
          type: 'error',
          visible: true,
          text: MESSAGE.PLAYER_NOT_CHOOSE_CARD,
        });
        return false;
      }
    } catch (error) {
      commit('SET_SNACKBAR', {
        type: 'error',
        visible: true,
        text: MESSAGE.PLAYER_NOT_CHOOSE_CARD,
      });
      return false;
    }
  },

  [actionTypes.RESET_GAME]: async ({ commit, dispatch }, payload) => {
    resetGameApi(payload.game_id)
      .then((data) => {
        if (data.status === 200) {
          dispatch(actionTypes.GET_GAME, { id: payload.game_id });
          commit(mutationTypes.SET_IS_RESET_GAME, true);
          commit(mutationTypes.SET_IS_START_GAME, false);
          commit('SET_SNACKBAR', {
            type: 'success',
            visible: true,
            text: MESSAGE.RESET_GAME_SUCCESS,
          });
        } else {
          commit('SET_SNACKBAR', {
            type: 'error',
            visible: true,
            text: data.statusText,
          });
        }
      })
      .catch((error) => {
        commit('SET_SNACKBAR', {
          type: 'error',
          visible: true,
          text: error.response.statusText,
        });
      });
  },

  [actionTypes.INVITE_PLAYERS]: async ({ commit, dispatch }, payload) => {
    if (payload.players.length > 0) {
      const getList = () => {
        const { page = 1, size = 10 } = router.currentRoute.query;
        dispatch(actionTypes.GET_GAME, { id: payload.game_id });
        dispatch(actionTypes.GET_PLAYERS, {
          gameId: payload.game_id,
          page,
          size,
        });
      };
      invitePlayersApi({ players: payload.players }, payload.game_id)
        .then(() => {
          getList();
          commit('SET_SNACKBAR', {
            type: 'success',
            visible: true,
            text: MESSAGE.INVITE_PLAYERS_SUCCESS,
          });
        })
        .catch((error) => {
          console.log('error', error);
          getList();
          commit('SET_SNACKBAR', {
            type: 'error',
            visible: true,
            text: MESSAGE.INVITE_PLAYERS_FAIL,
          });
        });
    } else {
      commit('SET_SNACKBAR', {
        type: 'error',
        visible: true,
        text: MESSAGE.NO_ONE_TO_INVITE,
      });
    }
  },

  [actionTypes.START_GAME]: async ({ commit, dispatch }, payload) => {
    startGameApi(payload.game_id)
      .then((data) => {
        if (data.status === 200) {
          socket.ownerStartGame(payload.game_id, payload.project_id);
          dispatch(actionTypes.GET_GAME, { id: payload.game_id });
          commit('SET_SNACKBAR', {
            type: 'success',
            visible: true,
            text: MESSAGE.START_GAME_SUCCESS,
          });
          commit(mutationTypes.SET_IS_START_GAME, true);
        } else {
          commit('SET_SNACKBAR', {
            type: 'error',
            visible: true,
            text: data.response.statusText,
          });
        }
      })
      .catch(() => {
        commit('SET_SNACKBAR', {
          type: 'success',
          visible: true,
          text: MESSAGE.START_GAME_SUCCESS,
        });
      });
  },
  [actionTypes.DELETE_GAME]: ({ commit }, payload) => {
    const gameId = payload.game_id;
    deleteGameApi(gameId)
      .then((data) => {
        if (data.status === 200) {
          // router.go(-1);
          commit('SET_SNACKBAR', {
            type: 'success',
            visible: true,
            text: MESSAGE.DELETE_GAME_SUCCESS,
          });
        } else {
          commit('SET_SNACKBAR', {
            type: 'error',
            visible: true,
            text: data.statusText,
          });
        }
      })
      .catch((error) => {
        commit('SET_SNACKBAR', {
          type: 'error',
          visible: true,
          text: error.response.statusText,
        });
        router.go(-1);
      });
  },

  [actionTypes.ACCESS_GAME_GUEST]: (context, token) => {
    getAccessGameGuest(token)
      .then(async (res) => {
        if (res.status === 400) {
          await router.push({
            name: 'game-end-guest',
            query: {
              title: res.data.gameName,
              message: res.statusText,
              error: true,
            },
          });
        } else {
          const payload = await jwt_decode(token);
          context.commit(mutationTypes.ACCESS_GAME_GUEST, res.data);
          socket.emitJoinGame(payload.email_guest, payload.game_id);
        }
      })
      .catch((err) => {
        if (err.response.status === 400) {
          router.push({
            name: 'game-end-guest',
            query: {
              title: err.response.data.gameName,
              message: err.response.statusText,
              token: token,
            },
          });
        }
      });
  },
  [actionTypes.ACCESS_GAME]: (context, gameId) => {
    getAccessGame(gameId)
      .then(async (res) => {
        if (res.status === 400) {
          router.push(
            `/endgame?title=${res.data.gameName}&message=${res.statusText}&error=true`
          );
        } else {
          context.commit(mutationTypes.ACCESS_GAME, res.data);
          const token = localStorageService.getService().getToken();
          const payload = await jwt_decode(token);
          socket.emitJoinGame(payload.email, gameId, res.data.projectId);
        }
      })
      .catch((err) => {
        context.commit(mutationTypes.ACCESS_GAME, '');
        if (err.response.statusText === 'Game already started') {
          context.commit(appMutationTypes.SET_SNACKBAR, {
            type: 'error',
            visible: true,
            text: err.response.statusText,
          });
          // router.push('/notification');
        } else {
          router.replace(
            `/endgame?title=${err.response.data.gameName}&message=Thank you for playing this game...`
          );
        }
      });
  },
  [actionTypes.SUBMIT_GAME]: (context, data) => {
    submitGame(data)
      .then(() => {
        context.commit(appMutationTypes.SET_SNACKBAR, {
          type: 'success',
          visible: true,
          text: MESSAGE.GAME_SUBMIT_SUCCESS,
        });
        socket.emitSubmitgame(
          data.email,
          data.gameId,
          data.selectedCard,
          data.comment
        );
      })
      .catch((err) => {
        if (err.response.status === 400) {
          if (data.selectedCard > 999) {
            context.commit(appMutationTypes.SET_SNACKBAR, {
              type: 'error',
              visible: true,
              text: MESSAGE.SELECT_CARD_MUST_A_NUMBER,
            });
          } else if (!data.selectedCard && data.selectedCard !== 0) {
            context.commit(appMutationTypes.SET_SNACKBAR, {
              type: 'error',
              visible: true,
              text: MESSAGE.NOT_EMPTY_CARD,
            });
          } else if (typeof data.selectedCard !== 'number') {
            context.commit(appMutationTypes.SET_SNACKBAR, {
              type: 'error',
              visible: true,
              text: MESSAGE.SELECT_CARD_MUST_A_NUMBER,
            });
          } else if (!data.comment) {
            context.commit(appMutationTypes.SET_SNACKBAR, {
              type: 'error',
              visible: true,
              text: MESSAGE.NOT_EMPTY_COMMENT,
            });
          } else if (data.comment.length > 255) {
            context.commit(appMutationTypes.SET_SNACKBAR, {
              type: 'error',
              visible: true,
              text: MESSAGE.OVER_LENGTH_COMMENT,
            });
          }
        }
      });
  },
  [actionTypes.ENABLE_CARD]: (context) => {
    context.commit(mutationTypes.ENABLE_CARD);
  },
  [actionTypes.DISABLE_CARD]: (context) => {
    context.commit(mutationTypes.DISABLE_CARD);
  },
  [actionTypes.ACT_CREATE]: async (context, payload) => {
    try {
      let res = await create(payload.backlogId, payload.projectId);
      context.commit(appMutationTypes.SET_SNACKBAR, {
        type: 'success',
        visible: true,
        text: MESSAGE.CREATE_SUCCESS,
      });
      context.commit(appMutationTypes.SET_CREATE_RESULT, res.data);
      return res.statusText;
    } catch (error) {
      if (error.response.status === 400) {
        context.commit(appMutationTypes.SET_SNACKBAR, {
          type: 'error',
          visible: true,
          text: error.response.statusText,
        });
        router.go(0);
        return error.response.statusText;
      } else if (error.response.statusText === MESSAGE.PROJECT_NOT_EXISTED) {
        // router.replace('/project');
        router.go(0);
      } else if (error.response.statusText === MESSAGE.NOT_AUTHOR_PERFORM) {
        router.go(0);
      }
      // else if (error.response.statusText === MESSAGE.NOT_AUTHOR_PERFORM) {
      //   router.go(0)
      // }
      context.commit(appMutationTypes.SET_CREATE_RESULT, null);
    }
  },
  [actionTypes.SET_HISTORY]: async (context, route) => {
    context.commit(mutationTypes.SET_HISTORY, route);
  },
  [actionTypes.GET_PLAYERS]: async (context, payload) => {
    try {
      const { gameId, page, size, projectId, token } = payload;
      try {
        const {
          data: { count, rows },
        } = await getGamePlayers(gameId, page, size, token);
        context.commit(mutationTypes.SET_TOTAL_PLAYERS, count);
        context.commit(mutationTypes.SET_PLAYERS, rows);
      } catch (error) {
        if (error.response.statusText === "This backlog doesn't exist!") {
          router.push('/project');
        } else {
          router.replace(`/backlog?projectId=${projectId}&pageIndex=1`);
        }
      }
    } catch (error) {
      context.commit(appMutationTypes.SET_SNACKBAR, {
        type: 'error',
        visible: true,
        text: error.response.statusText,
      });
    }
  },
};

export default actions;
