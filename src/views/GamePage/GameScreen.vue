<template>
  <div class="for-game-guest">
    <div
      v-if="!isFinish"
      :class="{ off_sidebar: !onSideBar, isDisableSideBar: onSideBar }"
      class="game-screen"
    >
      <!-- <div>
        <top-title
          :title="game ? (game.gameName ? game.gameName : 'No Name') : 'NoName'"
        ></top-title>
      </div> -->
      <div class="wrap-poker-table">
        <div
          class="poker-table"
          :class="{ endAlignPlayer: getShowPlayers.length === 3 }"
        >
          <div class="poker-table-a" v-if="getShowPlayers.length > 1">
            <div class="selected_card selected_card-row">
              <div
                class="selected_card-item"
                :class="{
                  activePlayer:
                    getShowPlayers[0].story_point !== null &&
                    getShowPlayers[0].story_point <= 999,
                }"
              >
                <div
                  v-if="
                    (players.isOwner ||
                      projectDetails.project.pmId === getCurrentUserId() ||
                      getShowPlayers[0].isCurrentUser) &&
                    getShowPlayers[0].story_point !== null &&
                    getShowPlayers[0].story_point <= 999
                  "
                >
                  {{ getShowPlayers[0].story_point }}
                </div>
                <img
                  v-else-if="
                    getShowPlayers[0].story_point !== null &&
                    getShowPlayers[0].story_point <= 999
                  "
                  src="@/assets/images/icon-logo-white.svg"
                  alt=""
                />
              </div>
              <div
                class="name_player"
                :title="
                  getNamePlayer(getShowPlayers[0].email) ||
                  getShowPlayers[0].email
                "
              >
                {{
                  getNamePlayer(getShowPlayers[0].email)
                    ? getNamePlayer(getShowPlayers[0].email)
                    : getShowPlayers[0].email
                }}
              </div>
            </div>
          </div>
          <div class="poker-table-total">
            <div
              class="poker-table-top"
              :class="{ centerPlayer: getShowPlayers.length <= 4 }"
            >
              <div
                v-for="(item, index) in slicePlayer(getShowPlayers.slice(2), 1)"
                :key="index"
              >
                <div class="selected_card selected_card-row">
                  <div
                    class="selected_card-item"
                    :class="{
                      activePlayer:
                        item.story_point !== null && item.story_point <= 999,
                    }"
                  >
                    <div
                      v-if="
                        projectDetails.project &&
                        (players.isOwner ||
                          projectDetails.project.pmId === getCurrentUserId() ||
                          item.isCurrentUser) &&
                        item.story_point !== null &&
                        item.story_point <= 999
                      "
                    >
                      {{ item.story_point }}
                    </div>
                    <img
                      v-else-if="
                        item.story_point !== null && item.story_point <= 999
                      "
                      src="@/assets/images/icon-logo-white.svg"
                      alt=""
                    />
                  </div>
                  <div
                    class="name_player"
                    :title="getNamePlayer(item.email) || item.email"
                  >
                    {{
                      getNamePlayer(item.email)
                        ? getNamePlayer(item.email)
                        : item.email
                    }}
                  </div>
                </div>
              </div>
              <div
                class="selected_card selected_card-row"
                v-if="getShowPlayers.length === 1"
              >
                <div
                  class="selected_card-item"
                  :class="{
                    activePlayer:
                      getShowPlayers[0].story_point !== null &&
                      getShowPlayers[0].story_point <= 999,
                  }"
                >
                  <div
                    v-if="
                      projectDetails.project &&
                      (players.isOwner ||
                        projectDetails.project.pmId === getCurrentUserId() ||
                        getShowPlayers[0].isCurrentUser) &&
                      getShowPlayers[0].story_point !== null &&
                      getShowPlayers[0].story_point <= 999
                    "
                  >
                    {{ getShowPlayers[0].story_point }}
                  </div>

                  <img
                    v-else-if="
                      getShowPlayers[0].story_point !== null &&
                      getShowPlayers[0].story_point <= 999
                    "
                    src="@/assets/images/icon-logo-white.svg"
                    alt=""
                  />
                </div>
                <div
                  class="name_player"
                  :title="
                    getNamePlayer(getShowPlayers[0].email) ||
                    getShowPlayers[0].email
                  "
                >
                  {{
                    getNamePlayer(getShowPlayers[0].email)
                      ? getNamePlayer(getShowPlayers[0].email)
                      : getShowPlayers[0].email
                  }}
                </div>
              </div>
            </div>

            <notification-card
              :message="isDisable ? 'Waiting for players....' : game.gameName"
            ></notification-card>

            <div
              class="poker-table-bottom"
              :class="{
                centerPlayer:
                  getShowPlayers.length === 4 ||
                  slicePlayer(getShowPlayers.slice(2), 0).length === 1,
              }"
              v-if="getShowPlayers.length > 1"
            >
              <div
                v-for="(item, index) in slicePlayer(getShowPlayers.slice(2), 0)"
                :key="index"
              >
                <div class="selected_card selected_card-row">
                  <div
                    class="selected_card-item"
                    :class="{
                      activePlayer:
                        item.story_point !== null && item.story_point <= 999,
                    }"
                  >
                    <div
                      v-if="
                        projectDetails.project &&
                        (players.isOwner ||
                          projectDetails.project.pmId === getCurrentUserId() ||
                          item.isCurrentUser) &&
                        item.story_point !== null &&
                        item.story_point <= 999
                      "
                    >
                      {{ item.story_point }}
                    </div>
                    <img
                      v-else-if="
                        item.story_point !== null && item.story_point <= 999
                      "
                      src="@/assets/images/icon-logo-white.svg"
                      alt=""
                    />
                  </div>
                  <div
                    class="name_player"
                    :title="getNamePlayer(item.email) || item.email"
                  >
                    {{
                      getNamePlayer(item.email)
                        ? getNamePlayer(item.email)
                        : item.email
                    }}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="poker-table-a" v-if="getShowPlayers.length > 1">
            <div class="selected_card selected_card-row">
              <div
                class="selected_card-item"
                :class="{
                  activePlayer:
                    getShowPlayers[1].story_point !== null &&
                    getShowPlayers[1].story_point <= 999,
                }"
              >
                <div
                  v-if="
                    projectDetails.project &&
                    (players.isOwner ||
                      projectDetails.project.pmId === getCurrentUserId() ||
                      getShowPlayers[1].isCurrentUser) &&
                    getShowPlayers[1].story_point !== null &&
                    getShowPlayers[1].story_point <= 999
                  "
                >
                  {{ getShowPlayers[1].story_point }}
                </div>
                <img
                  v-else-if="
                    getShowPlayers[1].story_point !== null &&
                    getShowPlayers[1].story_point <= 999
                  "
                  src="@/assets/images/icon-logo-white.svg"
                  alt=""
                />
              </div>
              <div
                class="name_player"
                :title="
                  getNamePlayer(getShowPlayers[1].email) ||
                  getShowPlayers[1].email
                "
              >
                {{
                  getNamePlayer(getShowPlayers[1].email)
                    ? getNamePlayer(getShowPlayers[1].email)
                    : getShowPlayers[1].email
                }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <list-poker-card
        :initSelectedItem="selectedCard"
        :getInputCard="getInputCard"
        :getSelectedCard="getSelectedCard"
      ></list-poker-card>

      <div class="wrap-btn-confirm">
        <textarea
          v-model="comment"
          placeholder="Story description..."
          class="input-comment"
          :class="{ inputCommentDisable: isDisable }"
          type="text"
          :disabled="isDisable"
        ></textarea>
        <button
          @click="onClickConfirm()"
          class="cus-btn-secondary submit-btn"
          :disabled="!comment && !checkSelectedCard"
          :class="{ btnSubmitDisable: isDisable }"
          height="32px"
        >
          Submit
        </button>
      </div>
    </div>
    <GameEnd
      v-if="isFinish"
      :messageEndGame="messageEndGame"
      :titleEndGame="game.gameName"
    ></GameEnd>
  </div>
</template>

<script>
import ListPokerCard from './ListPokerCard.vue';

import NotificationCard from './NotificationCard.vue';
// import TopTitle from '@/components/TopTitle.vue';
import { mapGetters } from 'vuex';
import { mapActions, mapMutations } from 'vuex';
import socket from '@/socket/socket';
import localStorageService from '@/utils/utils_local_storage.js';
import jwt_decode from 'jwt-decode';
import actionTypes from '@/store/modules/game/action_types';
import getterTypes from '@/store/modules/game/getter_types';
import projectActions from '@/store/modules/project/action_types';
import projectGetters from '@/store/modules/project/getter_types';
import mutationTypes from '@/store/modules/game/mutation_types';
import event from '@/socket/event';
import MESSAGE from '@/utils/utils_message';
import appMutations from '@/store/app/mutation_types.js';
import userActions from '@/store/modules/user/action_types';
import userGetter from '@/store/modules/user/getter_types';
import GameEnd from '../GameEndScreen/GameEnd.vue';
import { getGameApi } from '@/api/api_game';

export default {
  components: {
    NotificationCard,
    GameEnd,

    ListPokerCard,
    // TopTitle,
  },
  name: 'GameScreen',
  data() {
    return {
      title: 'Pick your card',
      selectedCard: null,
      status: false,
      comment: '',
      onSideBar: false,
      name: 'NO NAME',
      currentGameId: null,
      players: {},
      projectDetails: {},
      results: [],
      currentPlayers: '',
      isFinish: false,
      messageEndGame: '',
      checkKick: false,
    };
  },
  methods: {
    ...mapMutations({
      setSnackbar: appMutations.SET_SNACKBAR,
      setAccessGame: mutationTypes.ACCESS_GAME,
    }),
    ...mapActions({
      getProjectDetail: projectActions.ACT_GET_DETAIL_BY_ID,
      getGame: actionTypes.GET_GAME,
      submitGame: actionTypes.SUBMIT_GAME,
      accessGameGuest: actionTypes.ACCESS_GAME_GUEST,
      accessGame: actionTypes.ACCESS_GAME,
      enableCard: actionTypes.ENABLE_CARD,
      disableCard: actionTypes.DISABLE_CARD,
      startGame: actionTypes.START_GAME,
      setHistory: actionTypes.SET_HISTORY,
      getUserList: userActions.ACT_GET_ALL,
    }),
    checkSelectedCard() {
      return this.selectedCard >= 0 && this.selectedCard <= 999;
    },
    getCurrentEmail() {
      const token = jwt_decode(localStorageService.getToken());
      return token.email;
    },
    getToken() {
      if (this.onSideBar) {
        return localStorageService.getService().getToken();
      } else {
        if (this.$route.query.token) {
          return this.$route.query.token;
        }
      }
    },
    getGameId() {
      if (this.$route.query.id) {
        return +this.$route.query.id;
      } else {
        const payload = jwt_decode(this.getToken());
        if (payload && payload.game_id) {
          return payload.game_id;
        } else {
          return this.currentGameId;
        }
      }
    },
    activePlayer(array, name) {
      const emailActive = this.results.filter((e) => {
        if (e.name === name) {
          return e.email;
        }
        return emailActive;
      });
      if (emailActive.length != 0) {
        return array.some((e) => {
          return e.email === emailActive[0].email;
        });
      } else {
        return false;
      }
    },
    slicePlayer(array, key) {
      if (key === 1) {
        return array.slice(0, Math.ceil(array.length / 2));
      } else {
        return array.slice(Math.ceil(array.length / 2));
      }
    },
    getEmail() {
      const payload = jwt_decode(this.getToken());
      if (payload) return payload.email;
    },
    getCurrentUserId() {
      const payload = jwt_decode(this.getToken());
      if (payload) return payload.userId;
    },
    getName() {
      const payload = jwt_decode(this.getToken());
      if (payload) return payload.email_guest;
    },
    getSelectedCard(number) {
      if (this.isDisable) return;
      // this.getShowPlayers = this.getShowPlayers.map(item => {
      //   if (item.email === this.user.email)
      //     return {
      //       ...item,
      //       point: this.selectedCard === number ? null : number,
      //     };
      //   return item;
      // });
      if (!this.selectedCard && this.selectedCard !== 0) {
        this.status = !this.status;
        this.selectedCard = number;
      } else {
        if (this.selectedCard === number) {
          this.selectedCard = null;
          this.status = !this.status;
        } else {
          this.selectedCard = number;
        }
      }
    },
    getInputCard(number) {
      if (this.isDisable) return;
      this.selectedCard = number;
      this.status = true;
    },
    async onClickConfirm() {
      const token = this.getToken();
      if (this.isDisable) return;
      const data = {
        selectedCard: this.selectedCard,
        comment: this.comment,
      };
      if (this.onSideBar) {
        data.isUser = true;
        data.gameId = this.getGameId();
      } else {
        data.isUser = false;
        data.token = token;
      }
      const payload = await jwt_decode(token);
      data.selectedCard = this.selectedCard;
      data.email = payload.email_guest;
      data.gameId = this.getGameId();
      await this.submitGame(data);
    },
    getNamePlayer(value) {
      let getName = '';
      this.results.map((item) => {
        if (item.email === value) {
          getName = item.name;
        }
      });
      return getName;
    },
    async initGame() {
      await this.getGame({
        id: this.getGameId(),
        token: this.$route.query.token,
      });
      const getListAllUser = await this.getUserList({
        keyword: this.keySearch || '',
        currentPage: this.currentPage || '',
        pageSize: this.pageSize || '',
        token: this.$route.query.token,
      });
      this.results = getListAllUser.filter(({ email: id1 }) =>
        this.showPlayers.some(({ email: id2 }) => id2 === id1)
      );

      this.currentPlayers = this.results.filter(
        (item) => item.user_id !== this.getCurrentUserId()
      );

      this.selectedCard =
        this.showPlayers.find((item) => item.email === this.user.email)
          ?.story_point || null;
    },
  },
  computed: {
    ...mapGetters({
      projectDetail: projectGetters.GET_DETAIL_BY_ID,
      game: getterTypes.GET_ACCESS_GAME,
      snackbar: getterTypes.GET_GAME_SNACKBAR,
      isDisable: getterTypes.GET_STATUS_CARD,
      history: getterTypes.GET_HISTORY,
      showPlayers: getterTypes.GET_PLAYERS,
      user: userGetter.GET_PROFILE,
    }),
    getShowPlayers() {
      if (this.$route.name === 'game-guest') {
        return [];
      } else {
        const listPlayers = this.showPlayers.map((player) => ({
          ...player,
          isCurrentUser: player.email === this.user.email,
          story_point:
            player.email === this.user.email
              ? this.selectedCard
              : player.story_point,
        }));
        return listPlayers.filter((item) => item.status);
      }
    },
  },
  watch: {
    game: {
      handler() {
        if (this.game.isOwner === true || this.game.isStart) {
          this.enableCard();
          if (this.game.isOwner === true && !this.game.isStart) {
            socket.ownerStartGame(this.getGameId(), this.game.project_id);
          }
        } else {
          this.disableCard();
        }
      },
      immediate: true,
    },
  },
  async created() {
    await this.initGame();
  },
  async mounted() {
    const token = this.$route.query.token;
    const gameId = this.getGameId();
    if (token) {
      this.onSideBar = false;
      await this.accessGameGuest(token);
    } else {
      if (localStorageService.getToken()) {
        this.onSideBar = true;
        await this.accessGame(gameId);
        this.currentGameId = gameId;
      } else {
        this.$router.push('/');
        this.setHistory(this.$route.fullPath);
      }
    }
    if (this.getName()) {
      this.name = this.getName();
    } else {
      this.name = localStorageService.getName();
    }

    try {
      const result = await getGameApi(this.getGameId(), token);
      this.players = result.data;
      const projectDetails = await this.getProjectDetail({
        id: this.$route.query.projectId,
        keyword: '',
        pageIndex: 1,
        pageSize: 10,
        game_id: this.getGameId(),
        token: token,
      });
      this.projectDetails = projectDetails;
      await this.initGame();
      this.comment = this.getShowPlayers.filter(
        (item) => item.email === this.getCurrentEmail()
      )[0]?.comment;
    } catch (error) {
      console.log('error', error);
    }
    socket.onDeleteBacklog(async () => {
      try {
        await this.getGame({
          id: this.getGameId(),
          email: this.getCurrentEmail(),
          userId: this.getCurrentUserId(),
        });
      } catch (error) {
        if (!token) {
          this.$router.replace({
            name: 'backlog-list',
            query: { projectId: this.$route.query.projectId, pageIndex: 1 },
          });
          this.setSnackbar({
            type: 'error',
            visible: true,
            text: MESSAGE.BACKLOG_NOT_EXISTED,
          });
        } else {
          this.$router.replace(
            `/end-game-guest?title=${this.game.gameName}&token=guest&message=${MESSAGE.BACKLOG_NOT_EXISTED}`
          );
        }
      }
    });

    socket.ondeleteProject(async () => {
      try {
        await this.getGame({
          id: this.getGameId(),
          email: this.getCurrentEmail(),
          userId: this.getCurrentUserId(),
        });
      } catch (error) {
        if (!token) {
          this.$router.push({ name: 'project-list' });
          this.setSnackbar({
            type: 'error',
            visible: true,
            text: MESSAGE.PROJECT_NOT_EXISTED,
          });
        } else {
          this.$router.replace(
            `/end-game-guest?title=${this.game.gameName}&token=guest&message=${MESSAGE.PROJECT_NOT_EXISTED}`
          );
        }
      }
    });

    socket.getInstance().on(event.GAME_START, async () => {
      this.isFinish = false;
      this.enableCard();
      if (this.checkKick) {
        this.isFinish = true;
      }
    });
    socket.getInstance().on(event.GAME_RESET, () => {
      this.isFinish = false;

      if (this.game.isOwner) {
        window.close();
      }
      if (!token) {
        for (let i in this.getShowPlayers) {
          this.getShowPlayers[i].story_point = null;
        }
      }
      if (this.checkKick) {
        this.isFinish = true;
      }
      this.disableCard();
      this.comment = '';
      this.selectedCard = null;
      this.status = false;
      this.initGame();
    });
    socket.getInstance().on(event.GAME_FINISH, () => {
      this.messageEndGame = 'Thank you for playing this game...';
      this.isFinish = true;
    });
    socket.getInstance().on(event.BE_KICKED_PROJECT, () => {
      this.messageEndGame = 'Sorry! You were kicked from this project';
      this.isFinish = true;
      this.checkKick = true;
    });
    socket.getInstance().on(event.RESET_GAME_DISCONNECT, () => {
      this.$router.push('/');
    });
    socket.getInstance().on(event.SOMEONE_OFF_GAME, () => {
      this.initGame();
    });
    socket.getInstance().on(event.OWNER_KICK_PLAYER, async () => {
      if (token) {
        socket.getInstance().emit(event.OFF_JOIN_GAME);
        this.messageEndGame = MESSAGE.YOU_ARE_KICKED;
        this.isFinish = true;
        this.checkKick = true;
      } else {
        this.messageEndGame = MESSAGE.YOU_ARE_KICKED;
        this.isFinish = true;
        this.checkKick = true;
        socket.getInstance().emit(event.OFF_JOIN_GAME);
      }
    });
    socket.getInstance().on(event.DELETE_BACKLOG, () => {
      this.setSnackbar({
        type: 'error',
        visible: true,
        text: MESSAGE.BACKLOG_NOT_EXISTED,
      });
      this.$router.go(-1);
    });
    socket.getInstance().on(event.SOMEONE_JOIN_GAME, async () => {
      if (!token) {
        this.initGame();
      }
    });
    socket.getInstance().on(event.SOMEONE_SUBMIT, () => {
      if (!token) {
        this.getGame({
          id: this.getGameId(),
          email: this.user.email,
        });
      }
    });
  },
  beforeDestroy() {
    const gameId = this.getGameId();
    const email = this.getEmail();
    this.setAccessGame('');
    if (email && gameId) {
      socket.getInstance().emit(event.OFF_JOIN_GAME, email, gameId);
      socket.removeAllListeners();
    }
  },
};
</script>
<style scoped>
* {
  font-family: Roboto;
}
.snackbar {
  top: 56px;
}
.endAlignPlayer {
  align-items: flex-end !important;
}
.game-screen {
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
  top: 0;
  margin-left: 250px;
  margin-left: 0;
}
.for-game-guest {
  height: 100%;
}
.game-screen.off_sidebar {
  padding: 60px 40px;
}
.row-notification-card {
  display: flex;
  justify-content: center;
  align-items: center;
}
.selected_card-row {
  height: 100%;
  padding: 0px 17px 0px;
}
.displayNoneCard {
  display: none !important;
}
.selected_card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 16px 13px;
}

.selected_card-item {
  min-width: 48px;
  height: 80px;
  background-color: #8e8e8e;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  font: normal normal bold 25px/17px Roboto;
  color: #3993ff;
  font-weight: 500;
  padding: 0 4px;
}
.selected_card-name {
  font-size: 20px;
  font-weight: 500;
}
.wrap-btn-confirm {
  display: flex;
  justify-content: center;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  position: relative;
  max-width: 700px;
  width: 100%;
  height: 123px;
  margin: 0 auto;
  margin-top: 25px;
}
.btn-confirm {
  box-shadow: 0px 0px 5px #3597e2 !important;
  border: 1px solid #3597e2 !important;
  color: #3597e2 !important;
  padding: 24px 26px !important;
  border-radius: 5px !important;
  font-size: 16px !important;
  font-family: Roboto;
  margin-top: 30px;
}
.btn-confirm:hover {
  background: #3597e2 0% 0% no-repeat padding-box !important;
  box-shadow: 0px 0px 5px #3597e2 !important;
  color: #ffffff !important;
}
.btn-confirm {
  display: flex;
  justify-content: center;
  letter-spacing: 0;
  transition: 0.3s;
  height: 30px !important;
}
.wrap-top-title {
  padding: 30px 60px 0px 60px !important;
}
.activePlayer {
  background-color: #3597e2;
  color: #ffffff;
}
.input-comment {
  text-align: left;
  min-width: 100%;
  min-height: 123px;
  background: #ffffff 0% 0% no-repeat padding-box;
  box-shadow: 0px 0px 5px #3597e2;
  border-radius: 5px;
  opacity: 1;
  color: #424242d8;
  font: normal 400 15px Roboto;
  resize: none;
  padding: 13px 15px 18px;
}
.input-comment::placeholder {
  color: #00000080 !important;
  font: normal normal normal 16px/17px Chivo;
  color: #cccccc;
  opacity: 1;
  font-weight: 400 !important;
}
.input-comment:focus-visible {
  outline: #3597e2;
}
.inputCommentDisable {
  text-align: left;
  /* min-width: 700px;
  min-height: 123px; */
  background: #ffffff 0% 0% no-repeat padding-box;
  box-shadow: 0px 0px 5px transparent;
  border-radius: 5px;
  opacity: 1;
  color: #424242d8;
  font: normal 400 15px Roboto;
  resize: none;
  padding: 13px 15px 18px;
  border: 1px solid #aaaaaa;
}
.submit-btn {
  min-width: 76px !important;
  min-height: 41px !important;
  background-color: white;
  position: absolute;
  bottom: 15px;
  right: 15px;
  cursor: pointer;
}
.btnSubmitDisable {
  box-shadow: none !important;
  border: 1px solid #aaaaaa !important;
  color: #aaaaaa !important;
}

.btnSubmitDisable:hover {
  background: transparent !important;
}
.name_player {
  margin: 10px 0 0px 0;
  color: #000000;
  font: normal normal bold 16px/17px Roboto;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  width: 100px;
  text-align: center;
}
.wrap-poker-table {
  overflow-x: auto;
  overflow-y: hidden;
}

.poker-table {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 590px;
  /* flex-wrap: wrap; */
}
.poker-table-total {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 300px;
}
.poker-table-top {
  display: flex;
  padding: left;
  justify-content: center;
  width: 100%;
}
.poker-table-center {
  width: 100%;
  height: 150px;
  background: red;
}
.poker-table-bottom {
  display: flex;
  justify-content: center;
  width: 100%;
}
.centerPlayer {
  justify-content: center;
}
@media only screen and (max-width: 540px) {
  /* .input-comment {
    min-width: 320px;
  } */
}
</style>
