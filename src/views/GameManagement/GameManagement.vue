<template>
  <div>
    <div class="main-wrapper">
      <div class="main-top-title">
        <top-title
          :title="titleGameManagement"
          style="margin-bottom: 0"
        ></top-title>

        <div class="button-container">
          <div
            class="btn-invite-player button-container-button"
            v-if="isGameOwner && !isStartGame"
          >
            <CustomButton
              class="btn btn-start-game"
              text="Start game"
              @click="onStartGame"
              style="color: #ffffff"
              :disabled="isStartGame"
              :iconSize="22"
            ></CustomButton>
            <CustomButton
              class="btn cus-btn-secondary"
              icon="mdi-account-plus"
              text="Invite player"
              :iconSize="22"
              :disabled="isStartGame"
              @click="onClickInvitePlayer()"
            ></CustomButton>
            <!-- :disabled="isStartGame || game.end_game !== null" -->
          </div>

          <div
            class="btn-invite-player button-container-button"
            v-if="
              isGameOwner &&
              isStartGame &&
              !isFinishGame &&
              game.end_game === null
            "
          >
            <CustomButton
              class="btn pporange"
              @click="onResetGame"
              text="Reset game"
            ></CustomButton>

            <CustomButton
              class="btn cus-btn-secondary"
              @click="onFinishGame"
              text="Finish game"
            ></CustomButton>
          </div>
          <div
            class="btn-invite-player button-container-button"
            v-if="
              isGameOwner &&
              isStartGame &&
              !isFinishGame &&
              game.end_game !== null
            "
          >
            <CustomButton
              class="btn btn-start-game"
              @click="onResetGame"
              text="Reset game"
              style="color: #ffffff"
            ></CustomButton>
            <CustomButton
              class="btn cus-btn-secondary"
              text="Delete game"
              height="50px"
              @click="onDeleteGame"
            ></CustomButton>
          </div>
        </div>
      </div>

      <div
        class="main-container"
        v-if="game && game.players && game.players.length > 0"
      >
        <div class="game-info">
          <div class="left-content">
            <div class="content-table table-game-manager">
              <div class="table-fix-head">
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Status</th>
                      <th>Comment</th>
                      <th>Card&nbsp;</th>
                      <th v-if="isGameOwner">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="player in players" :key="player.email">
                      <td
                        class="player-name"
                        style="min-width: 320px; max-width: 320px"
                      >
                        <div>
                          <v-avatar
                            minHeight="35"
                            minWidth="35"
                            width="35"
                            height="35"
                            class="avatar"
                          >
                            <span
                              v-if="
                                getAvatarPlayer(player.email) ===
                                  'https://res.cloudinary.com/dvnchwzbe/image/upload/v1647422427/napa%20planning%20poker/avatar-account_v4r9ti.png' ||
                                getAvatarPlayer(player.email) === ''
                              "
                              class="avatar-text"
                            >
                              {{ getNameCharacter(player.email) }}
                            </span>
                            <img v-else :src="getAvatarPlayer(player.email)" />
                          </v-avatar>
                        </div>

                        <div class="player-name-text">
                          <p style="font-weight: bold">
                            {{ getNamePlayer(player.email) }}
                          </p>
                          <p class="email">
                            {{ player.email }}
                          </p>
                        </div>
                      </td>
                      <td
                        class=""
                        v-if="!player.status"
                        style="min-width: 148px; max-width: 148px"
                      >
                        Waiting
                      </td>
                      <transition
                        v-if="player.status"
                        v-bind:key="player.status"
                        name="bounce"
                        mode="out-in"
                      >
                        <td
                          class="status"
                          v-if="player.status"
                          style="min-width: 148px; max-width: 148px"
                        >
                          Joined
                        </td>
                      </transition>

                      <td style="min-width: 324px; max-width: 324px">
                        <div class="player-comment" v-show="player.comment">
                          <i>
                            <img
                              src="@/assets/images/message-solid.svg"
                              alt=""
                            />
                          </i>
                          <div :data-comment="player.comment">
                            {{ player.comment }}
                          </div>
                        </div>
                      </td>
                      <td class="" style="min-width: 100px; max-width: 100px">
                        <div class="point-card">
                          <div v-if="player.story_point">
                            {{ player.story_point }}
                          </div>
                          <div v-else-if="player.story_point === 0">
                            {{ player.story_point }}
                          </div>
                          <div v-else>?</div>
                        </div>
                      </td>
                      <td class="" style="width: 52px" v-if="isGameOwner">
                        <v-btn
                          icon
                          color="#FA0012"
                          @click="deletePlayer(player.email, 'deletePlayer')"
                          :style="{
                            marginLeft: '9px',
                            color: 'transparent !important',
                          }"
                          :class="{
                            hiddenBtn: player.email === getCurrentEmail(),
                          }"
                        >
                          <i class="game-action">
                            <img
                              src="@/assets/images/trash-can-solid-game.svg"
                              alt=""
                            />
                          </i>
                        </v-btn>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div class="content-report">
                <div class="content-report-text">Temporary AVG</div>
                <div class="content-report-number">
                  {{ temporaryAverage }}
                </div>
                <a class="content-report-link" @click="showReport">
                  View Report
                </a>
                <img
                  class="content-report-icon"
                  src="@/assets/images/group3181.svg"
                  alt=""
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="empty-data d-flex justify-center mt-10">
        <img
          class="icon-not-found"
          src="@/assets/images/icon-not-found.svg"
          alt=""
        />
        <div class="text-not-found">No data available</div>
      </div>
      <v-pagination
        :value="+page"
        :length="Math.ceil(totalPlayers / 10)"
        class="mt-3 pagination"
        :total-visible="5"
        @input="handlePageChange"
        next-icon="mdi-menu-right"
        prev-icon="mdi-menu-left"
        v-if="totalPlayers > 10"
      ></v-pagination>
    </div>
    <button
      class="main-btn"
      :style="{ zIndex: 0 }"
      v-if="
        isGameOwner &&
        isStartGame &&
        !isFinishGame &&
        game.end_game === null &&
        players.find((item) => item.email === this.getCurrentEmail()) &&
        !players.find((item) => item.email === this.getCurrentEmail()).status
      "
      @click="joinGame"
    >
      <v-avatar
        minHeight="70"
        minWidth="70"
        width="70"
        height="70"
        display="flex"
        justify-content="flex-end"
        class="btn-join"
      >
        <div class="btn-join__div">
          <img class="btn-join__img" src="@/assets/images/icon-logo.svg" />
          <span class="btn-join__span">Join</span>
        </div>
      </v-avatar>
    </button>
    <v-dialog v-model="dialog" v-if="dialog" disabled width="unset" persistent>
      <confirm-dialog
        class="confirm-dialog"
        @processConfirmDialog="processConfirmDialog"
        :confirmDialogInfo="confirmDialogInfo"
      ></confirm-dialog>
    </v-dialog>
    <v-dialog
      class="dialog pa-5"
      v-model="inviteMemberDialog"
      max-width="500"
      height="100%"
      persistent
    >
      <InvitePopupWrap>
        <GameManagementModal
          v-if="game.product_backlog"
          :resetInvitationForm="resetInvitationForm"
          :members="members"
          :isStartGame="isStartGame"
          :gameId="game.game_id"
          :onCloseDialog="onCloseDialog"
          :invitedList="totalPlayers"
          :dialogStatus="inviteMemberDialog"
          :projectId="game.product_backlog.project.project_id"
        ></GameManagementModal>
      </InvitePopupWrap>
    </v-dialog>
    <v-dialog
      class="dialog pa-5"
      v-model="reportDialog"
      height="320px"
      max-width="280px"
      width="280px"
    >
      <GameManagementChart
        v-if="summaryPlayers.length > 0"
        :data="summaryPlayers"
        :labels="summaryStoryPoints"
        :key="chartKey"
      ></GameManagementChart>
    </v-dialog>
    <v-dialog
      v-model="dialogFinish"
      width="unset"
      height="100%"
      v-if="!isFinishGame"
    >
      <v-card class="text-center confirm-dialog">
        <div class="invite-block-wrap">
          <div @click="closeDialog()" class="close-btn">
            <div>+</div>
          </div>
        </div>
        <img src="@/assets/images/20943756 [Converted]-01.svg" alt="" />
        <div class="title-text dialog-title">{{ confirmDialogInfo.title }}</div>
        <div class="content-detail dialog-detail" color="#8e8e8e !important">
          {{ confirmDialogInfo.detail }}
        </div>
        <div class="btn-block">
          <v-btn
            class="cus-btn-reset cus-btn-margin-right cus-btn-primary cus-btn-secondary"
            @click="onResetGame()"
          >
            Reset Game
          </v-btn>
          <v-btn class="cus-btn-viewreport cus-btn-primary" @click="showReport">
            View Report
          </v-btn>
        </div>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from 'vuex';
import GameManagementChart from './GameManagementChart.vue';
import GameManagementModal from './GameManagementModal.vue';
import InvitePopupWrap from '@/components/InvitePopup.vue';
import TopTitle from '@/components/TopTitle.vue';
import localStorageUtil from '@/utils/utils_local_storage';
import jwt_decode from 'jwt-decode';
import socket from '@/socket/socket';
import actionTypes from '@/store/modules/game/action_types';
import CustomButton from '@/components/CustomButton.vue';
import EVENT from '../../socket/event';
import getterTypes from '../../store/modules/game/getter_types';
import mutationTypes from '@/store/modules/game/mutation_types';
import ConfirmDialog from '@/components/ConfirmDialog.vue';
import projectActions from '@/store/modules/project/action_types';
import appMutations from '@/store/app/mutation_types.js';
import MESSAGE from '@/utils/utils_message';
import { getAllInvalidPlayer } from '@/api/api_player';
import userGetters from '../../store/modules/user/getter_types';
import userActions from '../../store/modules/user/action_types';
import router from '@/router';

export default {
  components: {
    GameManagementChart,
    GameManagementModal,
    TopTitle,
    CustomButton,
    ConfirmDialog,
    InvitePopupWrap,
  },
  data() {
    return {
      dialog: false,
      dialogFinish: false,
      resetInvitationForm: false,
      isConnect: false,
      chartKey: 0,
      isGameOwner: false,
      loading: false,
      confirmDialogInfo: {
        title: '',
        question: '',
        detial: '',
      },
      checkDialog: '',
      email: '',
      inviteMemberDialog: false,
      reportDialog: false,
      titleGameManagement: '',
      results: [],
      total: '',
      size: 10,
      page: 1,
    };
  },

  computed: {
    ...mapGetters({
      game: getterTypes.GET_GAME_MANAGEMENT,
      players: getterTypes.GET_PLAYERS,
      users: getterTypes.GET_USERS,
      getListUsers: userGetters.GET_LIST_USERS,
      members: getterTypes.GET_MEMBERS,
      alert: getterTypes.GET_ALERT,
      summaryStoryPoints: getterTypes.GET_SUMMARY_STORY_POINTS,
      summaryPlayers: getterTypes.GET_SUMMARY_PLAYERS,
      isStartGame: getterTypes.GET_IS_START_GAME,
      isFinishGame: getterTypes.GET_FINISH_GAME,
      totalPlayers: getterTypes.GET_TOTAL_PLAYERS,
    }),
    temporaryAverage() {
      const totalPlayerSumitted = this.players.filter(
        (player) => player.story_point || player.story_point === 0
      );
      if (!totalPlayerSumitted.length) {
        return 0;
      }
      return this.players.reduce((temp, player) => {
        return (
          Math.round(
            (temp + player.story_point / totalPlayerSumitted.length) * 100
          ) / 100
        );
      }, 0);
    },
    listMembers() {
      return this.users.map((user) => {
        return user.email;
      });
    },
  },
  watch: {
    inviteMemberDialog(newStatus) {
      this.resetInvitationForm = !newStatus;
    },
    chartKey() {
      this.getAndSetPlayers();
    },
    async players() {
      const getListAllUser = await this.getUserList({
        keyword: this.keySearch,
        currentPage: undefined,
        size: this.size,
      });
      this.results = await getListAllUser.filter(({ email: id1 }) =>
        this.players.some(({ email: id2 }) => id2 === id1)
      );

      if (this.players.length === 0 && this.page > 1) {
        this.page = this.page - 1;
        this.$router.push({
          name: 'game-management',
          params: {
            id: this.getGameId(),
          },
          query: {
            page: this.page,
            size: this.size,
          },
        });
        await this.getAndSetPlayers();
      }
    },
  },
  methods: {
    ...mapActions({
      getGame: actionTypes.GET_GAME,
      startGame: actionTypes.START_GAME,
      resetGame: actionTypes.RESET_GAME,
      finishGame: actionTypes.FINISH_GAME,
      kickPlayers: actionTypes.KICK_PLAYER,
      deleteGame: actionTypes.DELETE_GAME,
      getProjectById: projectActions.ACT_GET_PROJECT_BY_ID,
      getUserList: userActions.ACT_GET_ALL,
      getPlayers: actionTypes.GET_PLAYERS,
    }),
    ...mapMutations({
      setEnteredEmails: mutationTypes.SET_ENTERED_EMAILS,
      setSelectedEmails: mutationTypes.SET_SELECTED_EMAILS,
      setSnackbar: appMutations.SET_SNACKBAR,
    }),
    async handlePageChange(value) {
      this.page = value;
      await this.$router
        .push({
          name: 'game-management',
          query: {
            page: this.page,
            size: this.size,
          },
        })
        .catch((error) => {
          console.log(error);
        });

      this.loading = true;
      await this.getAndSetPlayers();
      this.loading = false;
    },
    getGameId() {
      if (this.$route.params.id) {
        return +this.$route.params.id;
      }
    },
    getToken() {
      return jwt_decode(localStorageUtil.getToken());
    },
    getCurrentEmail() {
      const token = jwt_decode(localStorageUtil.getToken());
      return token.email;
    },
    getCurrentUserId() {
      const token = jwt_decode(localStorageUtil.getToken());
      return token.userId;
    },
    async onKickPlayer(player) {
      await this.kickPlayers({
        email: player,
        game_id: this.getGameId(),
        projectId: this.$route.query.projectId,
      });
      socket.kickPlayer(player, this.getGameId());
      this.chartKey++;
      this.dialog = false;
    },
    async onStartGame() {
      await this.getGame({ id: this.getGameId() });
      try {
        if (this.game) {
          let routeData = this.$router.resolve({
            name: 'game-screen',
            query: {
              id: this.getGameId(),
              projectId: this.$route.query.projectId,
            },
          });
          window.open(routeData.href, '_blank');
          this.chartKey++;
        }
      } catch (error) {
        console.log(error);
      }
    },
    async onFinishGame() {
      await this.getGame({ id: this.getGameId() });
      if (this.game) {
        const result = await this.finishGame({
          game_id: this.getGameId(),
        });
        if (result) {
          this.dialogFinish = true;
          this.confirmDialogInfo = {
            title: 'Thank You',
            detail: 'The game is finished you can view the report',
          };
        }
      }
    },
    async onResetGame() {
      await this.resetGame({
        game_id: this.getGameId(),
      });
      await this.getGame({ id: this.getGameId() });
      socket.ownerResetGame(
        this.getGameId(),
        this.game.product_backlog.project.project_id
      );
      this.chartKey++;
      this.dialogFinish = false;
    },
    onDeleteGame() {
      if (this.game) {
        this.dialog = false;
        this.deleteGame({
          game_id: this.getGameId(),
          project_id: this.game.product_backlog.project.project_id,
        });
        socket.ownerDeleteGame(this.getGameId());
        this.$router.replace({ name: 'backlog-list' });
      }
    },

    onCloseDialog() {
      this.inviteMemberDialog = false;
      this.setEnteredEmails([]);
    },
    closeDialog() {
      this.dialogFinish = false;
    },
    deletePlayer(email, deletePlayer) {
      this.confirmDialogInfo = {
        title: 'Confirm delete?',
        question: 'Do you want to click ' + email,
        detail: 'out of this game?',
      };
      this.checkDialog = deletePlayer;
      this.email = email;
      this.dialog = true;
    },
    processConfirmDialog(confirm) {
      if (confirm === 'Cancel') {
        this.dialog = false;
      }
      if (confirm === 'Ok') {
        if (this.checkDialog === 'deletePlayer') {
          this.onKickPlayer(this.email);
        } else if (this.checkDialog == 'deleteGame') {
          this.onDeleteGame();
        }
        this.dialog = false;
      }
    },
    async goToProject() {
      const checkProjectDetele = await this.getProjectById({
        id: this.game.product_backlog.project.project_id,
      });
      if (checkProjectDetele.del_flg) {
        this.setSnackbar({
          type: 'warning',
          visible: true,
          text: MESSAGE.PM_DELETE_PROJECT,
        });
        await this.$router.push({ name: 'project-list' });
      }
    },
    async showReport() {
      await this.getGame({ id: this.getGameId() });
      if (this.game) {
        this.$router.push({
          name: 'game-report',
          query: {
            id: this.getGameId(),
          },
        });
      }
    },

    async onClickInvitePlayer() {
      try {
        await getAllInvalidPlayer(this.getGameId());
        this.inviteMemberDialog = true;
      } catch (err) {
        if (err.response) {
          this.setSnackbar({
            type: 'error',
            visible: true,
            text: err.response.statusText,
          });
          router.go(-1);
        }
      }
      return;
    },
    checkDisableReport() {
      // :disabled="game.end_game === null || players.length===0 || summaryStoryPoints.every(point => point===null)"
      if (this.game.end_game === null) {
        return true;
      }
      if (this.players.length === 0) {
        return true;
      }
      if (this.summaryStoryPoints.every((point) => point === null)) {
        return true;
      }
      return false;
    },
    getNameCharacter(value) {
      let getCharacter = '';

      this.getAvaNameCharacter = value;
      getCharacter = this.getAvaNameCharacter.toUpperCase().split(' ')[
        this.getAvaNameCharacter.split(' ').length - 1
      ][0];

      return getCharacter;
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
    getAvatarPlayer(value) {
      let getAvatarPlayer = '';
      this.results.map((item) => {
        if (item.email === value) {
          getAvatarPlayer = item.avatar;
        }
      });
      return getAvatarPlayer;
    },
    async joinGame() {
      window.open(
        `/game?id=${this.$route.params.id}&projectId=${this.$route.query.projectId}`,
        '_blank'
      );
    },
    async getAndSetPlayers() {
      await this.getPlayers({
        gameId: this.getGameId(),
        page: this.page,
        size: this.size,
      });

      const getListAllUser = await this.getUserList({
        keyword: this.keySearch,
        currentPage: undefined,
        size: this.size,
      });
      this.results = await getListAllUser.filter(({ email: id1 }) =>
        this.players.some(({ email: id2 }) => id2 === id1)
      );

      this.total = this.players.map((item) => item.story_point);
    },
  },
  async created() {
    const { page = 1 } = this.$route.query;
    this.page = page;
    await this.getGame({
      id: this.getGameId(),
      email: this.getCurrentEmail(),
      userId: this.getCurrentUserId(),
    });
    this.titleGameManagement = this.game.product_backlog.product_backlog_name;

    await this.getAndSetPlayers();
    socket.onDeleteBacklog(async () => {
      try {
        await this.getGame({
          id: this.getGameId(),
          email: this.getCurrentEmail(),
          userId: this.getCurrentUserId(),
        });
      } catch (error) {
        console.log(error);
        this.$router.replace({
          name: 'backlog-list',
          query: { projectId: this.$route.query.projectId, pageIndex: 1 },
        });
      }
    });
    socket.ondeleteProject(() => {
      try {
        this.inviteMemberDialog = false;
        this.getGame({
          id: this.getGameId(),
          email: this.getCurrentEmail(),
          userId: this.getCurrentUserId(),
        });
      } catch (error) {
        console.log(error);
        this.$router.replace({ name: 'project-list' });
      }
    });
    socket.onOwnerDeleteGame((gameId) => {
      if (gameId === this.getGameId()) {
        this.$router.replace({
          name: 'backlog-list',
          query: { projectId: this.$route.query.projectId, pageIndex: 1 },
        });
      }
      // id: this.getGameId(),
    });
    socket.checkUpdateNameManagement(async () => {
      await this.getGame({ id: this.getGameId() });
      this.titleGameManagement = this.game.product_backlog.product_backlog_name;
    });
  },

  async mounted() {
    const currentUser = JSON.parse(localStorageUtil.getCurrentUser());
    setTimeout(() => {
      this.isGameOwner = this.game.user_id === currentUser.userId;
    }, 1000);

    socket.getInstance().on(EVENT.SOMEONE_JOIN_GAME, async () => {
      this.getGame({
        id: this.getGameId(),
        email: this.getCurrentEmail(),
      });
      const getListAllUser = await this.getUserList({
        keyword: this.keySearch,
        currentPage: this.currentPage,
        size: this.size,
      });
      this.results = await getListAllUser.filter(({ email: id1 }) =>
        this.players.some(({ email: id2 }) => id2 === id1)
      );
    });
    socket.getInstance().on(EVENT.SOMEONE_OFF_GAME, () => {
      this.getGame({
        id: this.getGameId(),
        email: this.getCurrentEmail(),
      });
    });
    socket.getInstance().on(EVENT.SOMEONE_SUBMIT, () => {
      this.getGame({
        id: this.getGameId(),
        email: this.getCurrentEmail(),
      });
      this.chartKey++;
    });
    socket.getInstance().on(EVENT.GAME_RESET, () => {});
    socket.getInstance().on(EVENT.OPENED_TAB_GAME, () => {
      this.inviteMemberDialog = false;
      this.getGame({
        id: this.getGameId(),
        email: this.getCurrentEmail(),
      });
      this.startGame({ game_id: this.getGameId() });
    });
    socket.getInstance().on(
      EVENT.BE_KICKED_PROJECT,
      (email) => {
        let nameUserKicked = email;
        if (this.getCurrentEmail() === email) {
          nameUserKicked = 'You';
          this.setSnackbar({
            type: 'warning',
            visible: true,
            text: `${nameUserKicked} was kicked out of project`,
          });
          this.$router.replace('/project');
        } else {
          this.setSnackbar({
            type: 'warning',
            visible: true,
            text: `${nameUserKicked} was kicked out of project`,
          });
        }
      },
      socket.getInstance().on(EVENT.GAME_AUTO_FINISHED, async () => {
        await this.getGame({
          id: this.getGameId(),
          email: this.getCurrentEmail(),
        });
        if (this.isGameOwner) {
          setTimeout(() => {
            this.setSnackbar({
              type: 'warning',
              visible: true,
              text: MESSAGE.GAME_AUTO_FINISHED,
            });
            this.dialogFinish = true;
            this.confirmDialogInfo = {
              title: 'Thank You',
              detail: 'The game is finished you can view the report',
            };
          }, 500);
        }
      })
    );
  },
  async beforeDestroy() {
    socket.getInstance().emit(EVENT.OFF_MANAGER_SCREEN);
    socket.getInstance().removeAllListeners();
  },
};
</script>
<style lang="scss" scoped>
.main-wrapper {
  background-color: #f4f6fa;
  .main-top-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 52px;
    /* margin-bottom: 16px; */
    .button-container {
      .button-container-button {
        display: flex;
        gap: 15px;
      }
    }
  }
}

.bounce-enter-active {
  animation: bounce-in 0.5s;
}

.bounce-leave-active {
  animation: bounce-in 0.5s reverse;
}

.table-game-manager th {
  text-align: left !important;
}
.content-report {
  display: flex;
  justify-content: right;
  align-items: flex-end;
  margin-top: 5px;
  .content-report-text {
    font: normal normal bold 20px/17px Roboto;
  }
  .content-report-number {
    font: normal normal bold 20px/17px Roboto;
    color: #3597e2;
    margin-left: 4px;
  }
  .content-report-link {
    text-decoration: underline;
    font: italic normal normal 16px/17px Roboto;
    color: #2196f3;
    margin-left: 12px;
  }
  .content-report-icon {
    color: #2196f3;
    margin-left: 4px;
    margin-bottom: 4px;
  }
}
.player-name {
  display: flex;
  height: 75px;
  align-items: center;
  .player-name-text {
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    font: normal normal normal 14px/17px Roboto;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .email {
    flex: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
.player-comment {
  display: flex;
  align-items: center;

  i {
    margin-top: 6px;
    margin-right: 10px;
  }
  div {
    text-align: left;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 260px;
    white-space: nowrap;
  }
  &:hover div::before {
    content: '';
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
    border-top: 15px solid #ffffff;
    top: -13px;
    left: 0px;
    z-index: 3;
    position: absolute;
  }
  &:hover div[data-comment]::after {
    content: attr(data-comment);
    width: 268px;
    padding: 12px;
    bottom: 34px;
    left: -20px;
    position: absolute;
    background: #ffffff 0% 0% no-repeat padding-box;
    border: 1px solid #ececec;
    border-radius: 10px;
    color: #000000;
    z-index: 2;
    box-shadow: 0px 6px 6px #00000029;
    word-wrap: break-word;
    white-space: normal;
    word-break: break-word;
  }
}
.hiddenBtn {
  visibility: hidden;
}
@media screen and (max-width: 1024px) {
  .player-comment {
    &:hover div[data-comment]::after {
      width: 90%;
      margin-bottom: 15px;
      padding: 12px;
      bottom: 0px;
      left: 5%;
    }
    &:hover div::before {
      display: none;
    }
  }
}
@media screen and (max-width: 500px) {
  .player-comment {
    &:hover div[data-comment]::after {
      width: 90%;
      margin-bottom: 15px;
      padding: 12px;
      bottom: 0px;
      left: 5%;
    }
    &:hover div::before {
      display: none;
    }
  }
}

.avatar {
  box-shadow: 0px 3px 6px #3597e273;
  margin-right: 20px;
}
.point-card {
  width: 34px;
  height: 50px;
  background: #ffffff 0% 0% no-repeat padding-box;
  border: 2px solid #3993ff;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #3597e2;
  font: normal normal normal 18px/10px Roboto;
}
.game-action {
  padding: 8px 9px;
  background: #eff4f9 0% 0% no-repeat padding-box;
  border-radius: 5px;
  display: flex;
}

.v-col {
  padding: unset !important;
}

.btn {
  letter-spacing: 0;
  color: #ffffff;
  background: #3597e2 0% 0% no-repeat padding-box !important;
  height: 51px !important;
  font: normal normal bold 16px/17px Roboto;
  padding: 15px 0px !important;
  box-shadow: rgb(50 50 93 / 25%) 0px 2px 5px -1px,
    rgb(0 0 0 / 30%) 0px 1px 3px -1px !important;
  width: 158px !important;
}
.cus-btn-secondary {
  background-color: #f4f6fa !important ;
  border: 1px solid #2196f3 !important;
  box-shadow: 0px 0px 5px #3597e2 !important;

  &:hover {
    color: #ffffff !important;
    background-color: #2196f3 !important;
  }
  .v-btn_content {
    .icon {
      color: #2196f3 !important;
    }
  }
}
.main-btn {
  display: flex;
  justify-content: flex-end;
  position: fixed;
  bottom: 75px;
  right: 60px;
  z-index: 50;
  .btn-join {
    box-shadow: 0px 3px 6px var(--unnamed-color-3597e2);
    background: #ffffff 0% 0% no-repeat padding-box;
    box-shadow: 0px 3px 6px #3597e2;

    &__div {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    &__img {
      /* width: 16px; */
      height: 31px;
    }
    &__span {
      color: #2196f3;
      font-size: 14px;
    }
  }
}
.confirm-dialog {
  width: 500px;
  display: flex;
  background-color: #ffffff !important;
  flex-direction: column;
  align-items: center;
  img {
    margin-top: 30px;
  }
  .content-question {
    color: #8e8e8e;
  }
  .btn-block {
    display: flex;
    margin-bottom: 30px;
  }
  .dialog-title {
    font-size: 20px;
  }
  .dialog-detail {
    margin-bottom: 20px;
    color: #8e8e8e;
    padding: 0 10px;
    font-weight: lighter;
  }
  .cus-btn-reset {
    width: 108px;
    height: 41px;
    color: #2196f3;
    text-transform: capitalize;
    font-size: 14px;
    background: #ffffff 0% 0% no-repeat padding-box;
    box-shadow: 0px 0px 5px #3366ff;
    border: 1px solid #2196f3;
    border-radius: 5px;
    margin-right: 20px;
  }
  .cus-btn-viewreport {
    width: 108px;
    height: 41px;
    color: #ffffff;
    background-color: #2196f3;
    text-transform: capitalize;
    font-size: 14px;
    box-shadow: 0px 0px 5px #3366ff;
    border-radius: 5px;
  }
}

/* .btn-invite-player .theme--light.v-btn.v-btn--disabled.v-btn--has-bg {
  background-color: #c3e3fa !important;
  color: #ffffff !important;
} */

/* .btn-start-game .theme--light.v-btn.v-btn--disabled.v-btn--has-bg {
  background-color: #fce7b8 !important;
  color: #ffffff !important;
}

.btn-reset-game .theme--light.v-btn.v-btn--disabled.v-btn--has-bg {
  background-color: #f6c4ae !important;
  color: #ffffff !important;
}

.btn-finish-game .theme--light.v-btn.v-btn--disabled.v-btn--has-bg {
  background-color: #bbf8bb !important;
  color: #ffffff !important;
}

.btn-delete-game .theme--light.v-btn.v-btn--disabled.v-btn--has-bg {
  background-color: #fcc9c9 !important;
  color: #ffffff !important;
} */

/* .btn-show-report .theme--light.v-btn.v-btn--disabled.v-btn--has-bg {
  background-color: #eed9ee !important;
  color: #ffffff !important;
} */

.table-game-manager .delete-btn {
  background: #f7284a !important;
  width: 30px;
  height: 30px;
  font-size: 14px;
  cursor: pointer;
  border-radius: 5px;
  margin-left: 16px;
}
.pagination {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  bottom: 16px;
}
@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.25);
  }
  100% {
    transform: scale(1);
  }
}
@media screen and (max-width: 500px) {
  .main-btn {
    bottom: 50px;
    right: 20px;
  }
  .confirm-dialog {
    width: 100% !important;
  }
}
</style>
<style scoped src="@/assets/style/game-management.css"></style>
