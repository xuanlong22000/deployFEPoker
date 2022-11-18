<template>
  <div class="notification">
    <div
      v-for="(item, index) in data"
      :key="item.id"
      class="notification-item"
      :class="{
        unread: item.status === 'Unread',
      }"
    >
      <div class="notification-time">
        <div class="notification-wrap">
          <p class="notification-time-appeared">
            {{ times(item.create_date) }}
          </p>
          <div class="notification-avatar hide">
            <img :src="getImgUrl(item.notification_type_id)" alt="" />
          </div>
          <button
            class="cus-btn-secondary hide"
            @click="
              item.notification_type_id !== 1
                ? goToBacklog(
                    item.project_noti_id,
                    item.product_backlog_id,
                    index
                  )
                : goToGame(item.router_link, item.project_noti_id, index)
            "
          >
            View Details
          </button>
        </div>
      </div>
      <div class="notification-des">
        <div class="notification-avatar">
          <img :src="getImgUrl(item.notification_type_id)" alt="" />
        </div>
        <div class="notification-content">
          <p class="notification-des-p" v-html="item.content">
            <!-- {{ data.content }} -->
          </p>
          <div class="notification-time">
            <p class="notification-time-p">
              {{ formatDate(item.create_date) }}
            </p>
          </div>
          <!-- <div>
            <button
              @click="handleInvite(data)"
              v-if="
                item.notification_type_id === 1 && item.status !== 'Accepted'
              "
              class="thin-btn cus-btn-primary"
            >
              Accept Invite
            </button>
          </div> -->
        </div>
      </div>
      <button
        class="cus-btn-secondary show"
        @click="
          item.notification_type_id !== 1
            ? goToBacklog(item.project_noti_id, item.product_backlog_id, index)
            : goToGame(item.router_link, item.project_noti_id, index)
        "
      >
        View Details
      </button>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex';
import actionTypes from '@/store/modules/notification/action_types';
import projectActions from '@/store/modules/project/action_types';
import notification from '../../constants/const_notification_types';
import time from '../../utils/utils_format_date';
import gameActions from '@/store/modules/game/action_types';
import gameGetters from '@/store/modules/game/getter_types';
import productBacklogActions from '@/store/modules/product_backlog/action_types';
import notificationActions from '@/store/modules/notification/action_types';
import jwt_decode from 'jwt-decode';
import localStorageUtil from '@/utils/utils_local_storage';
import appMutations from '@/store/app/mutation_types.js';
import MESSAGE from '@/utils/utils_message';
import router from '@/router';
export default {
  name: 'notification-item',
  props: ['data', 'index'],
  data() {
    return {};
  },
  computed: {
    ...mapGetters({
      getPlayers: gameGetters.GET_PLAYERS,
      getGames: gameGetters.GET_GAME_MANAGEMENT,
    }),
  },
  methods: {
    ...mapMutations({
      setSnackbar: appMutations.SET_SNACKBAR,
    }),
    ...mapActions({
      cancelNotification: actionTypes.DELETE_NOTIFICATION_LIST,
      acceptNotification: actionTypes.ACCEPT_INVITE_GAME_NOTIFICATION,
      fetchGetAllProjects: projectActions.ACT_FETCH_GET_ALL_PROJECTS,
      getProjectById: projectActions.ACT_GET_PROJECT_BY_ID,
      getGameById: gameActions.GET_GAME,
      getProjectDetail: projectActions.ACT_GET_DETAIL_BY_ID,
      changeToReadStatus: notificationActions.CHANGE_TO_READ_STATUS,
      getUnreadCount: notificationActions.GET_UNREAD_COUNT,
      getBacklogById: productBacklogActions.ACT_GET_BY_BACKLOG_ID,
      getAccessGame: actionTypes.ACCESS_GAME,
    }),
    times(daytime) {
      return time(daytime);
    },
    getCurrentEmail() {
      const token = jwt_decode(localStorageUtil.getToken());
      return token.email;
    },
    formatDate(date) {
      const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      };

      return (
        new Date(date)
          .toLocaleDateString('en-us', options)

          // Change the comma "," character appearing 2nd time in string
          .replace(/^(.+?,.+?),\s*/g, '$1\n')
      );
    },
    getImgUrl(notificationTypeId) {
      // Returns the name of the image based on the id of the message
      var imageName = '';
      var images = require.context('../../assets/images/');
      var paths = '';
      switch (notificationTypeId) {
        case (notificationTypeId = notification.type.INVITATION_TYPE_ID):
          imageName = 'icon-invite';
          paths = images('./' + imageName + '.svg');
          break;
        case (notificationTypeId = notification.type.MESSAGE_TYPE_ID):
          imageName = 'icon-create-backlog';
          paths = images('./' + imageName + '.svg');
          break;
        case (notificationTypeId = notification.type.CHANGE_ROLE_TYPE_ID):
          imageName = 'icon-admin-change-role';
          paths = images('./' + imageName + '.svg');
          break;
        case (notificationTypeId = notification.type.ADD_MEMBER_TYPE_ID):
          imageName = 'icon-add-member';
          paths = images('./' + imageName + '.svg');
          break;
        default:
          break;
      }
      return paths;
    },

    async handleInvite(data) {
      await this.acceptNotification({
        id: data.id,
        router_link: data.router_link,
      });
    },

    async goToBacklog(projectId, backlogId, index) {
      await this.changeToReadStatus([this.data[index].id]);
      await this.getUnreadCount();
      await this.fetchGetAllProjects({
        page: this.currentPage,
        size: this.pageSize,
      });
      try {
        if (backlogId !== null) {
          const checkBacklogExist = await this.getBacklogById(backlogId);
          if (checkBacklogExist?.mess === undefined) {
            await this.$router
              .push(`/backlog?projectId=${projectId}&pageIndex=1`)
              .catch(() => {});
          }
          return;
        }
        if (projectId !== null) {
          const getProject = await this.getProjectById({ id: projectId });
          if (!getProject.mess) {
            this.$router
              .push(`/backlog?projectId=${projectId}&pageIndex=1`)
              .catch(() => {});
          }
        }
      } catch (error) {
        if (router.currentRoute.name === 'notification-page') {
          this.setSnackbar({
            type: 'error',
            text: MESSAGE.PROJECT_NOT_EXISTED,
            visible: true,
          });
        }
      }
    },

    async goToGame(gameId, projectId, index) {
      await this.changeToReadStatus([this.data[index].id]);
      await this.getUnreadCount();

      try {
        if (gameId !== null) {
          await this.getGameById({ id: gameId });
          if (
            this.getGames.players.filter(
              (item) => item.email === this.getCurrentEmail()
            )[0]?.status
          ) {
            this.setSnackbar({
              type: 'warning',
              text: MESSAGE.GAME_ALREADY_JOINED,
              visible: true,
            });
          } else if (this.getGames.end_game !== null) {
            this.setSnackbar({
              type: 'error',
              text: MESSAGE.GAME_ALREADY_FINISH,
              visible: true,
            });
          } else if (
            !this.getGames.players.filter(
              (item) => item.email === this.getCurrentEmail()
            )[0]?.email &&
            this.getGames.start_game !== null
          ) {
            this.setSnackbar({
              type: 'error',
              text: MESSAGE.GAME_ALREADY_START,
              visible: true,
            });
          } else {
            await this.$router.push(
              `/game?id=${gameId}&projectId=${projectId}`
            );
          }
        }
        if (projectId !== null) {
          await this.getProjectById({ id: projectId });
        }
      } catch (error) {
        // this.setSnackbar({
        //   type: 'error',
        //   text: MESSAGE.GAME_NOT_EXISTED,
        //   visible: true,
        // });
        console.log(error);
      }
    },
  },
};
</script>

<style scoped lang="scss">
.notification-des {
  align-items: center;
}
.notification {
  display: flex;
  flex-direction: column;
  gap: 10px;
  overflow-x: hidden;
  &-item {
    align-items: center;
    background: #ffffff 0% 0% no-repeat padding-box;
    border-radius: 10px;
    display: flex;
    justify-content: space-between;
    min-height: 50px;
    opacity: 1;
    padding: 10px 10px;
    width: 100%;
    &.unread {
      background: #d7e9ff8c;
    }
  }
  &-time {
    color: #8e8e8e;
    gap: 5px;
    &-p {
      font-weight: 300 !important;
      font: normal normal normal 14px/17px Roboto;
      letter-spacing: 0px;
      opacity: 1;
      text-align: left;
    }
    &-appeared {
      position: relative;
      font-weight: 300 !important;
      font: normal normal normal 14px/17px Roboto;
      letter-spacing: 0px;
      width: 50px;
      opacity: 1;
      text-align: left;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
  &-des {
    display: flex;
    gap: 8px;
    margin-left: 23px;
    width: 100%;
    &-p {
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1;
      display: -webkit-box;
      font: normal normal normal 16px/21px Roboto;
      letter-spacing: 0px;
      margin-bottom: 5px;
      min-width: 80%;
      opacity: 1;
      overflow: hidden;
      text-align: left;
    }
  }
  &-content {
    flex-direction: column;
    justify-content: flex-start;
    margin-right: 20px;
    &::first-letter {
      text-transform: capitalize !important;
    }
  }
  &-avatar {
    align-items: center;
    background-color: #3597e2;
    border-radius: 100rem;
    box-shadow: 0px 3px 6px #00000029;
    display: flex;
    flex-shrink: 0;
    height: 50px;
    justify-content: center;
    width: 50px;
    & img {
      height: 28px;
      object-fit: contain;
      width: 25px;
    }
    &-replace {
      border-radius: 50%;
      box-shadow: 0px 3px 6px #3597e273;
      font-size: 16px;
      height: 35px;
      object-fit: cover;
      width: 35px;
    }
  }
}
p {
  margin: 0;
}
.hide {
  align-items: center;
  display: none !important;
  justify-content: center;
}
.btn {
  background: #3597e2;
  border-radius: 5px;
  color: #ffffff;
  font-weight: 300;
  font: normal normal normal 15px/17px Roboto;
  margin-top: 8px;
  padding: 5px 22px;
}

@media screen and (max-width: 768px) {
  .notification {
    &-wrap {
      align-items: center;
      display: flex;
      flex-direction: row;
    }
    &-item {
      flex-direction: column;
      justify-content: left;
      padding: 10px 10px;
    }
    &-avatar {
      display: none;
    }
    &-time {
      font: normal normal normal 12px/14px Roboto;
      justify-content: space-between;
      width: 100%;
      &-p {
        font-weight: 300 !important;
        font: normal normal normal 12px/14px Roboto;
        letter-spacing: 0px;
        opacity: 1;
        text-align: left;
      }
      &-appeared {
        margin-right: 10px;
        min-width: auto;
      }
    }
    &-content {
      max-width: 500px;
    }
    &-avatar {
      height: 40px;
      width: 40px;
      & img {
        height: 17px;
        object-fit: contain;
        width: 15px;
      }
    }
    &-des {
      align-items: flex-start;
      gap: 8px;
      margin-left: 2px;
      padding-top: 4px;
      & i {
        margin-right: 10px;
      }
      &-p {
        margin-right: 7px;
        min-width: 80%;
        overflow: hidden;
        text-align: left;
        text-overflow: ellipsis;
      }
    }
    &.btn {
      margin-top: 5px;
      padding: 4px 10px;
    }
  }
  .cus-btn-secondary {
    font: normal normal bold 12px/17px Roboto;
    margin-left: auto;
    white-space: nowrap;
    width: 90px !important;
  }
  .btn-view-details {
    display: none;
    font: normal normal bold 12px/17px Roboto;
    margin-bottom: 1px;
    width: 90px;
  }
  .show {
    display: none !important;
    margin-right: 15px;
  }
  .hide {
    align-items: center;
    display: flex !important;
    justify-content: center;
  }
}
</style>
