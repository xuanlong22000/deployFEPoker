<template>
  <v-row class="backlog-card" v-if="backlog">
    <v-col class="id-card">
      <span>{{ ID + 1 }}</span>
    </v-col>
    <v-col cols="3">
      <span v-bind:title="backlog.backlogName" class="backlog-name">
        {{ backlog.backlogName }}
      </span>
    </v-col>
    <v-col cols="2">
      <span>{{ backlog.createDate }}</span>
    </v-col>
    <v-col cols="2">
      <span>{{ backlog.members !== 0 ? backlog.members : '-' }}</span>
    </v-col>
    <v-col class="average-card" cols="1">
      <span>{{ backlog.average !== 0 ? backlog.average : '-' }}</span>
    </v-col>
    <v-col cols="3" class="btn-block">
      <div class="btn-block-edit-delete">
        <div
          :class="{
            displayNoneBtn:
              this.currentUser.userId !== this.backlog.backlogOwnerId &&
              this.backlog.currentUserRole === 'Member',
          }"
        >
          <div v-if="!canEdit()">
            <v-tooltip top>
              <template v-slot:activator="{ on, attrs }">
                <div v-bind="attrs" v-on="on">
                  <v-btn
                    class="btn-edit mr-4"
                    icon
                    @click="
                      handleUpdateDialogStatus(true);
                      handleChangeSelectedBacklog(backlog);
                    "
                    :disabled="!canEdit()"
                  >
                    <img src="@/assets/images/pen-to-square-solid.svg" alt="" />
                  </v-btn>
                </div>
              </template>
              <span style="color: white">The game is playing</span>
            </v-tooltip>
          </div>
          <div v-else>
            <v-btn
              class="btn-edit mr-4"
              icon
              @click="
                handleUpdateDialogStatus(true);
                handleChangeSelectedBacklog(backlog);
              "
            >
              <img src="@/assets/images/pen-to-square-solid.svg" alt="" />
            </v-btn>
          </div>
        </div>
        <div
          :class="{
            displayNoneBtn:
              this.currentUser.userId !== this.backlog.backlogOwnerId &&
              this.backlog.currentUserRole === 'Member',
          }"
        >
          <div v-if="!canEdit()">
            <v-tooltip top>
              <template v-slot:activator="{ on, attrs }">
                <div v-on="on" v-bind="attrs">
                  <v-btn
                    class="btn-delete"
                    icon
                    @click="deleteBacklog"
                    :disabled="!canEdit()"
                  >
                    <img src="@/assets/images/trash-alt-regular.svg" alt="" />
                  </v-btn>
                </div>
              </template>
              <span class="tooltip" style="color: white">
                The game is playing
              </span>
            </v-tooltip>
          </div>
          <div v-else>
            <v-btn class="btn-delete" icon @click="deleteBacklog">
              <img src="@/assets/images/trash-alt-regular.svg" alt="" />
            </v-btn>
          </div>
        </div>
      </div>
      <transition
        v-if="backlog.button.buttonType === 'Create Game'"
        name="bounce"
        mode="out-in"
      >
        <button
          v-bind:key="backlog.button.buttonType"
          class="btn-backlog ml-4 cus-btn-secondary"
          text="Create Game"
          width="100px"
          height="40px"
          v-if="backlog.button.buttonType === 'Create Game'"
          @click="create"
        >
          Create Game
        </button>
      </transition>

      <transition
        v-if="backlog.button.buttonType === 'Join Game'"
        name="bounce"
        mode="out-in"
      >
        <button
          v-bind:key="backlog.button.buttonType"
          class="btn-backlog ml-4 cus-btn-secondary"
          text="Join Game"
          width="100px"
          height="40px"
          v-if="backlog.button.buttonType === 'Join Game'"
          @click="joinGame"
        >
          Join Game
        </button>
      </transition>

      <transition
        v-if="backlog.button.buttonType === 'View Game'"
        name="bounce"
        mode="out-in"
      >
        <button
          v-bind:key="backlog.button.buttonType"
          class="btn-backlog ml-4 cus-btn-secondary"
          text="View Game"
          width="100px"
          height="40px"
          :class="{ 'view-game': true }"
          v-if="backlog.button.buttonType === 'View Game'"
          @click="viewGame"
        >
          View Game
        </button>
      </transition>
    </v-col>
    <v-dialog v-model="dialog" disabled width="unset">
      <confirm-dialog
        class="confirm-dialog-delete"
        @processConfirmDialog="processConfirmDialog"
        :confirmDialogInfo="confirmDialogInfo"
        :detail="detail"
        :backlog="backlog"
      ></confirm-dialog>
    </v-dialog>
  </v-row>
</template>

<script>
// import CustomButton from '@/components/CustomButton.vue';
import ConfirmDialog from '@/components/ConfirmDialog.vue';
import { mapGetters, mapMutations, mapActions } from 'vuex';
import backlogActions from '@/store/modules/product_backlog/action_types';
import projectActions from '@/store/modules/project/action_types';
import projectGetters from '@/store/modules/project/getter_types';
import gameActions from '@/store/modules/game/action_types';
import gameGetters from '@/store/modules/game/getter_types';
import appGetters from '@/store/app/getter_types.js';
import notificationActions from '@/store/modules/notification/action_types';

import socket from '@/socket/socket';
import appMutations from '@/store/app/mutation_types.js';
import MESSAGE from '@/utils/utils_message';
import ROLE from '@/utils/utils_role';
import jwt_decode from 'jwt-decode';
import localStorageUtil from '@/utils/utils_local_storage';

export default {
  name: 'ProductBacklogCard',
  inject: [
    'handleUpdateDialogStatus',
    'handleChangeSelectedBacklog',
    'project_id',
  ],
  components: {
    // CustomButton,
    ConfirmDialog,
  },
  props: {
    backlog: {
      type: Object,
    },
    ID: Number,
    checkRole: Object,
  },
  data: () => {
    return {
      dialog: false,
      title: '',
      detail: '',
      status: true,
      currentUser: null,
      confirmDialogInfo: {
        title: 'Confirm delete?',
        question: 'Do you really want to delete these record?',
        detail: 'This process cannot be undone.',
      },
    };
  },
  computed: {
    ...mapGetters({
      createResult: appGetters.GET_CREATE_RESULT,
      deleteResult: appGetters.GET_DELETE_RESULT,
      projectDetail: projectGetters.GET_DETAIL_BY_ID,
      currentProject: projectGetters.GET_PROJECT,
      currentGame: gameGetters.GET_GAME_MANAGEMENT,
    }),
  },

  methods: {
    ...mapMutations({
      setSnackbar: appMutations.SET_SNACKBAR,
    }),
    ...mapActions({
      createGame: gameActions.ACT_CREATE,
      deleteBacklogById: backlogActions.ACT_DELETE_BY_BACKLOG_ID,
      getProjectDetail: projectActions.ACT_GET_DETAIL_BY_ID,
      fetchGetProjectById: projectActions.ACT_GET_PROJECT_BY_ID,
      getGameById: gameActions.GET_GAME,
      getUnreadCount: notificationActions.GET_UNREAD_COUNT,
    }),
    async create() {
      await this.createGame({
        backlogId: this.backlog.backlogId,
        projectId: this.backlog.projectId,
      });
      if (this.createResult) {
        this.$router.push({
          name: 'game-management',
          params: { id: this.createResult.game_id },
          query: {
            name: this._props.backlog.backlogName,
            projectId: this._props.backlog.projectId,
          },
        });
      } else {
        const Message = await this.createGame({
          backlogId: this.backlog.backlogId,
          projectId: this.backlog.projectId,
        });
        this.setSnackbar({
          type: 'error',
          text: Message,
          visible: true,
        });
        if (Message === "This backlog doesn't exist!") {
          if (
            this.backlog.backlogQuantity % 10 === 1 &&
            this.backlog.pageIndex > 1
          ) {
            this.$emit('handle-page-change', this.backlog.pageIndex - 1);
          } else {
            this.$router.go();
          }
        } else {
          this.$emit('reload-backlog');

          // setTimeout(() => {
          // this.$router.push('/project');
          // }, 500);
        }
      }
      this.getUnreadCount();
    },
    getCurrentEmail() {
      const token = jwt_decode(localStorageUtil.getToken());
      return token.email;
    },
    async joinGame() {
      const lastGame = await this.backlog.lastGame;
      await this.getGameById({ id: lastGame.gameId });

      if (this.currentGame) {
        if (this.currentUser.userId === lastGame.ownerGameId) {
          this.$router.push({
            name: 'game-management',
            params: { id: lastGame.gameId },
            query: {
              name: this._props.backlog.backlogName,
              projectId: this._props.backlog.projectId,
            },
          });
          return;
        }
        if (
          this.backlog.games.players.filter(
            (item) => item.email === this.getCurrentEmail()
          )[0]?.status
        ) {
          this.setSnackbar({
            type: 'warning',
            text: 'You are already join game in somewhere!',
            visible: true,
          });
          return;
        }
        await this.$router.push(
          `/game?id=${lastGame.gameId}&projectId=${this._props.backlog.projectId}`
        );
      } else {
        setTimeout(() => {
          this.$router.go();
        }, 500);
      }
    },
    async viewGame() {
      const lastGame = this.backlog.lastGame;
      await this.getGameById({ id: lastGame.gameId });
      if (this.currentGame) {
        this.$router.push({
          name: `game-management`,
          params: { id: lastGame.gameId },
          query: {
            name: this._props.backlog.backlogName,
            projectId: this._props.backlog.projectId,
          },
        });
      } else {
        setTimeout(() => {
          this.$router.go();
        }, 500);
      }
    },
    edit() {
      this.$emit('update-backlog', true);
    },
    async deleteBacklog() {
      // Delete with Role Admin, PM, PBO
      let lastGame = this.backlog.lastGame;
      if (!lastGame || !lastGame.startGame || lastGame.endGame) {
        this.dialog = true;
        return;
      }
      if (lastGame.startGame && !lastGame.endGame) {
        this.setSnackbar({
          type: 'warning',
          text: MESSAGE.NOT_DELETE_GAME_PLAYING,
          visible: true,
        });
        return;
      }
    },
    async processConfirmDialog(result) {
      if (result === 'Ok') {
        // const lastGameId = this.backlog?.lastGame?.gameId;
        await this.deleteBacklogById({
          backlogId: this.backlog.backlogId,
          projectId: this.backlog.projectId,
        });
        socket.deleteBacklog(this.backlog.backlogId);
        if (this.deleteResult) {
          if (
            this.backlog.backlogQuantity % 10 === 1 &&
            this.backlog.pageIndex > 1
          ) {
            this.$emit('handle-page-change', this.backlog.pageIndex - 1);
          }
          await this.getProjectDetail({
            id: this.backlog.projectId,
            pageIndex: this.backlog.pageIndex,
            pageSize: this.backlog.pageSize,
            keyword: '',
          });
          this.dialog = false;
        } else {
          const Message = await this.deleteBacklogById({
            backlogId: this.backlog.backlogId,
            projectId: this.backlog.projectId,
          });
          if (Message === "This backlog doesn't exist!") {
            if (
              this.backlog.backlogQuantity % 10 === 1 &&
              this.backlog.pageIndex > 1
            ) {
              this.$emit('handle-page-change', this.backlog.pageIndex - 1);
            }
          }
          if (Message === "This project doesn't exist!") {
            this.$router.push({ path: `/project` });
          }
          await this.getProjectDetail({
            id: this.backlog.projectId,
            pageIndex: this.backlog.pageIndex,
            pageSize: this.backlog.pageSize,
            keyword: '',
          });
          this.dialog = false;
        }
      }
      if (result === 'Cancel') {
        this.dialog = false;
      }
    },
    canEdit() {
      const lastGame = this.backlog.lastGame;
      if (
        this.backlog.currentUserRole === ROLE.MEMBER &&
        this.currentUser.userId !== this.backlog.backlogOwnerId
      ) {
        return false;
      }
      if (!lastGame || !lastGame.startGame || lastGame.endGame) {
        return true;
      }
      return false;
    },
  },

  async created() {
    this.currentUser = jwt_decode(localStorageUtil.getToken());
    this.getUnreadCount();
  },
};
</script>

<style scoped>
span {
  font: 400 14px Roboto;
  color: black;
}

.backlog-card {
  /*border-radius: solid 1px #000000;*/
  box-shadow: 0px 2px 6px #b6d7f1;
  border-radius: 4px;
  margin-bottom: 4px;
  padding: 0px 8px;
  position: relative;
  /* gap: 15px; */
}
.backlog-card .col-2,
.backlog-card .col-1 {
  justify-content: center !important;
}

.backlog-card .col {
  justify-content: flex-start;
  padding: 28px 16px 26px !important;
}

.v-icon {
  font-size: 20px;
  padding: 10px;
}

.row {
  margin: 0;
  min-width: 840px;
  box-shadow: 0px 2px 6px #b6d7f1;
  background-color: #ffffff;
  background-color: #ffffff;
  position: relative;
}

.col {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px 0;
  flex-grow: 0 !important;
  /* text-align: center; */
}

.displayNoneBtn {
  visibility: hidden;
}

.btn-block-edit-delete {
  display: flex;
}

.createDate-card {
  margin-right: 79px;
}
.members-card {
  margin-right: 75px;
}
.average-card {
  margin-right: 25px;
}

.backlog-name {
  overflow-wrap: break-word;
  inline-size: 100%;
  line-height: 20px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

.btn-backlog {
  font: 500 14px Roboto !important;
  letter-spacing: 0;
}

.btn-block {
  display: grid;
  grid-template-columns: 1fr 1fr;
  justify-items: center;
  position: absolute;
  right: 34px;
  bottom: -11px;
}

.btn-edit {
  background: #eff4f9 0% 0% no-repeat padding-box;
  border-radius: 5px;
  margin-right: 10px;
}

.btn-delete {
  background: #eff4f9 0% 0% no-repeat padding-box;
  border-radius: 5px;
}

.btn-delete:focus::before {
  opacity: 0 !important;
}

.disabledButton {
  background-color: #f6ca8c !important;
  pointer-events: none;
}
.bounce-enter-active {
  animation: bounce-in 0.5s;
}
.bounce-leave-active {
  animation: bounce-in 0.5s reverse;
}
@media only screen and (max-width: 768px) {
  span {
    font-size: 12px;
  }
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
</style>
