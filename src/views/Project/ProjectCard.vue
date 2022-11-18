import { colors } from '@/utils/utils_color_chart';
<template>
  <v-card class="project-card-wrapper d-flex align-start flex-column">
    <div class="logo d-flex flex-column align-center mt-11">
      <div class="logo-img d-flex justify-center">
        <img
          v-if="this.project.project_avatar"
          :src="this.project.project_avatar"
          class="project-img"
        />
        <img v-else src="../../assets/images/icon-fire.svg" />
      </div>
      <span class="project-name">
        {{ project.project_name }}
      </span>
    </div>

    <div class="avatar-block">
      <div class="avatar-line">
        <v-avatar
          v-for="(user, index) in selectedUsers.slice(0, 3)"
          :key="index"
          class="avatar"
          min-width="35"
          width="35"
          height="35"
          absolute
          v-show="user.system_role_id != 1"
        >
          <span
            v-if="
              user.avatar ===
              'https://res.cloudinary.com/dvnchwzbe/image/upload/v1647422427/napa%20planning%20poker/avatar-account_v4r9ti.png'
            "
            class="avatar-text"
          >
            {{ getNameCharacter(user.name) }}
          </span>
          <img v-else :src="user.avatar" />
        </v-avatar>
        <v-avatar
          class="avatar-add"
          v-if="selectedUsers.length > 3"
          min-width="35"
          width="35"
          height="35"
          absolute
        >
          <span class="avatar-text">+{{ selectedUsers.length - 3 }}</span>
        </v-avatar>

        <v-avatar
          class="avatar"
          style="background-color: #2196f3"
          min-width="35"
          width="35"
          height="35"
          @click.stop.prevent="openInvitePopup"
          v-if="this.checkPM"
        >
          <span>
            <v-icon size="15px" dark color="width">fa-solid fa-plus</v-icon>
          </span>
        </v-avatar>
      </div>
    </div>

    <div
      class="project-backlog d-flex justify-space-between align-center d-flex"
    >
      <div class="backlog-items d-flex">
        <div class="backlog-icon-container">
          <img src="../../assets/images/doc.svg" class="backlog-icon" />
        </div>
        <div class="backlog-item">
          <div>
            {{
              project.product_backlogs.length > 0
                ? showBacklog(this.countBackLog)
                : 0 + ' Backlog'
            }}
          </div>
        </div>
      </div>

      <div class="backlog-items d-flex">
        <div class="backlog-icon-container">
          <img src="../../assets/images/clock.svg" class="backlog-icon" />
        </div>
        <div class="backlog-item">
          <div>
            {{
              project.start_date != '9999/12/31'
                ? distanceFromNow(project.create_date)
                : '----/--/--'
            }}
          </div>
        </div>
      </div>
    </div>
    <div
      class="project-backlog d-flex justify-space-between align-center d-flex mt-3"
    >
      <div class="backlog-items d-flex align-center">
        <div class="backlog-icon-container">
          <img src="../../assets/images/user.svg" class="backlog-icon" />
        </div>
        <div class="backlog-item">
          <div>
            {{
              selectedUsers.length > 0
                ? countMember(selectedUsers)
                : 0 + ' Member'
            }}
          </div>
        </div>
      </div>

      <div class="backlog-items d-flex align-center">
        <div class="backlog-icon-container">
          <img src="../../assets/images/pocker.svg" class="backlog-icon" />
        </div>
        <div class="backlog-item">
          <div>
            {{ showGame(this.count) }}
          </div>
        </div>
      </div>
    </div>
    <div class="project-line"></div>
    <div class="project-progress d-flex justify-space-between align-center">
      <div>Progress</div>
      <div
        class="progress-text d-flex align-center"
        v-if="this.timeGame.length > 0 || this.project.time_create_game"
        :style="{ height: '24px' }"
      >
        <v-icon
          class="progress-icon"
          v-if="this.timeGame.length > 0 || this.project.time_create_game"
          :style="{ 'background-color': 'transparent !important' }"
        >
          far fa-clock
        </v-icon>
        <div v-if="this.timeGame.length > 0 || this.project.time_create_game">
          {{ getTime(this.project.time_create_game) }}
        </div>
      </div>
      <div
        class="progress-text d-flex"
        v-else
        :style="{
          height: '24px',
          'background-color': 'transparent !important',
        }"
      >
        <v-icon class="progress-icon" :style="{ display: 'none' }">
          far fa-clock
        </v-icon>
        <div v-if="this.timeEndGame.length > 0">{{ timeNew }}</div>
      </div>
    </div>
    <div class="project-line-bottom d-flex">
      <div class="line-bottom-items"></div>
      <div class="line-bottom-items"></div>
      <div class="line-bottom-items"></div>
    </div>
    <v-dialog
      v-model="isOpenInviteDialog"
      max-width="622px"
      transition="dialog-top-transition"
      persistent
    >
      <InvitePopupWrap>
        <invite-popup
          :mode="1"
          :project="project"
          :pmId="Number(this.project)"
          :isOpen="isOpenInviteDialog"
          :memberList="selectedUsers"
          @selectedUsers="handleSelectedUsers"
          @closePopup="closePopup"
        />
      </InvitePopupWrap>
    </v-dialog>
  </v-card>
</template>

<script>
import InvitePopupWrap from '@/components/InvitePopup.vue';
import localStorageUtils from '@/utils/utils_local_storage';
import ROLE from '@/utils/utils_role.js';
import jwtDecode from 'jwt-decode';
import moment from 'moment';
import { mapActions, mapGetters, mapMutations } from 'vuex';
import projectActions from '../../store/modules/project/action_types';
import userActions from '../../store/modules/user/action_types';
import InvitePopup from '../EditProject/InvitePopup';
import actionTypes from '@/store/modules/project/action_types';
import mutationType from '@/store/app/mutation_types';
import MESSAGE from '@/utils/utils_message';
import { getWithSystemRole } from '@/api/api_user.js';
import socket from '@/socket/socket';
import notificationActions from '@/store/modules/notification/action_types';
export default {
  name: 'project-card',
  components: { InvitePopup, InvitePopupWrap },
  props: {
    project: {
      type: Object,
    },
    mode: {
      type: Number,
    },
  },
  data() {
    return {
      selectedUsers: this.project.users.length > 0 ? this.project.users : [],
      isOpenInviteDialog: false,
      countBackLog: 0,
      count: 0,
      timeNew: '',
      timeEndGame: [],
      timeGame: [],
      currentUserId: null,
      role: ROLE,
      checkPM: false,
    };
  },
  computed: {
    ...mapGetters({
      userNotMember: 'user/GET_USER_NOT_MEMBER',
    }),
  },
  methods: {
    ...mapActions({
      fetchGetUserNotMember: userActions.ACT_FETCH_GET_USER_NOT_MEMBER,
      getMember: projectActions.ACT_FETCH_GET_ALL_MEMBERS,
      getProjectDetail: projectActions.ACT_GET_DETAIL_BY_ID,
      getUserWithSystemRole: userActions.ACT_FETCH_WITH_SYSTEM_ROLE,
      getProject: actionTypes.ACT_GET_PROJECT_BY_ID,
      getUnreadCount: notificationActions.GET_UNREAD_COUNT,
    }),
    ...mapMutations({
      setSnackBar: mutationType.SET_SNACKBAR,
    }),
    getNameCharacter(value) {
      return value.toUpperCase().split(' ')[value.split(' ').length - 1][0];
    },
    async openInvitePopup() {
      const response = await getWithSystemRole();
      const isAdmin = response.data.system_role.name === ROLE.ADMIN;
      if (!isAdmin) {
        // Check for project exist
        const data = await this.getProject({ id: this.project.project_id });
        if (!data) {
          this.setSnackBar({
            type: 'error',
            visible: true,
            text: MESSAGE.PROJECT_NOT_EXISTED,
          });
          return;
        }

        // Check for PM
        const havePM = data.users.find(
          (pm) => pm.user_id === this.currentUserId
        );
        if (havePM?.user_id !== this.currentUserId) {
          this.setSnackBar({
            type: 'warning',
            visible: true,
            text: MESSAGE.NOT_PM_IN_PROJECT,
          });
          setTimeout(() => {
            this.$router.go(0);
          }, 500);
          return;
        }

        await this.fetchGetUserNotMember({
          projectIds: [this.project.project_id],
        });
        this.userList = this.userNotMember;
        this.isOpenInviteDialog = true;
      } else if (isAdmin) {
        await this.fetchGetUserNotMember({
          projectIds: [this.project.project_id],
        });
        this.userList = this.userNotMember;
        this.isOpenInviteDialog = true;
      }
    },
    async closePopup() {
      this.isOpenInviteDialog = false;
      const newMembers = await this.getMember({ id: this.project.project_id });
      this.selectedUsers = newMembers.filter(
        (member) => member.system_role_id != 1
      );
      await this.fetchGetUserNotMember({
        projectIds: [this.project.project_id],
      });
      this.userList = this.userNotMember;
    },
    handleSelectedUsers(data) {
      this.selectedUsers = [...this.selectedUsers, ...data];
    },
    distanceFromNow(value) {
      return moment(value).fromNow(true);
    },
    showBacklog(value) {
      return value > 1 ? value + ' Backlogs' : value + ' Backlog';
    },
    showGame(value) {
      return value > 1 ? value + ' games' : value + ' game';
    },
    countMember(value) {
      const member = value.filter(
        (member) => member.system_role_id !== 1
      ).length;
      return member > 1 ? member + ' Members' : member + ' Member';
    },
    getTime(value) {
      return moment(value).fromNow();
    },
  },
  async created() {
    const gameBacklog = await this.getProjectDetail({
      id: this.project.project_id,
      pageIndex: 0,
      pageSize: 0,
      keyword: '',
    });
    this.countBackLog = gameBacklog.backlogQuantity;
    gameBacklog.backlogList.map((item) =>
      item.lastGame ? ++this.count : this.count
    );
    this.timeEndGame = gameBacklog.backlogList.map((item) => {
      if (!item?.lastGame?.create_game) {
        return 0;
      }
      return new Date(item?.lastGame?.create_game).getTime();
    });
    this.timeGame = this.timeEndGame.filter(function (item) {
      return item !== 0;
    });
    if (
      !Math.min(...this.timeGame) == 0 &&
      Math.max(...this.timeGame) != 0 &&
      this.timeGame.length != 0
    ) {
      this.timeNew = moment(Math.max(...this.timeGame)).fromNow();
    }

    socket.onDeleteBacklog(() => {
      this.getProjectDetail();
    });
    socket.onCreateBacklog(() => {
      this.getProjectDetail();
      this.getUnreadCount();
    });

    const decodedToken = jwtDecode(localStorageUtils.getService().getToken());
    this.currentUserId = decodedToken.userId;
    const checkUserRole = await this.getUserWithSystemRole({
      id: this.currentUserId,
    });
    if (
      checkUserRole.system_role.name === this.role.ADMIN ||
      this.currentUserId === this.project.pmId
    ) {
      this.checkPM = true;
    }
  },
  async mounted() {
    await this.fetchGetUserNotMember({ projectIds: [this.$route.params.id] });
    this.userList = this.userNotMember;
  },
};
</script>

<style lang="scss" scoped>
.none-project {
  margin: 0 auto;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  width: fit-content;
  max-width: 150px;
  border-radius: 5px;
  color: #fc4c4c;
  font-size: 16px;
  margin-bottom: 2px;
  padding: 0 4px;
}
.pm-name {
  font-size: 16px;
}
.project-card-wrapper {
  border-radius: 8px;
  padding: 8px 15px 20px 15px;
  box-shadow: rgba(50, 50, 93, 0.25) 0px 2px 5px -1px,
    rgba(0, 0, 0, 0.3) 0px 1px 3px -1px;
  cursor: pointer;
  &:hover {
    background-color: #f2f4f5;
  }
  &:active {
    background-color: #e1e2e3;
  }
  .mt-11 {
    margin-top: 42px !important;
    align-items: flex-start !important;
  }
  .logo {
    width: 100%;
    .logo-img {
      align-items: center !important;
      width: 60px;
      height: 60px;
      background-color: #dcdadab3;
      padding: 13px 0px 13px 0px;
      border-radius: 50%;
      position: absolute;
      top: -32px;
      left: 50%;
      transform: translateX(-50%);
      .project-img {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        object-fit: cover;
      }
    }
    .project-name {
      white-space: nowrap;
      max-width: 63%;
      overflow: hidden;
      justify-content: flex-start !important;
      text-overflow: ellipsis;
      font: normal normal bold 16px/18px Roboto;
    }
  }
  .date-start-block,
  .date-end-block {
    padding: 0px 12px 0px 12px;
    border-radius: 10px;
    box-shadow: 0px 3px 6px #00000029;
    height: 30px;
    width: 142px;
    .date-start {
      color: #ffffff;
    }
  }
  .date-start-block {
    background-color: #64b5f6;
  }
  .date-end-block {
    background-color: #fc4c4c;
  }

  .avatar-block {
    margin-top: 10px;
    display: flex;
    justify-content: center;
    margin-bottom: 15px;
    min-height: 35px;
    .avatar-line {
      display: flex;
      column-gap: 4px;
    }

    .avatar {
      box-shadow: 0px 3px 6px #3597e273;
      .avatar-text {
        font: normal normal bold 16px/35px Roboto;
        text-transform: uppercase;
      }
    }
  }
  .project-backlog {
    width: 100%;
    height: 17px;

    .backlog-items {
      align-items: center;
      justify-content: center;
      .backlog-icon-container {
        width: 22px;
        margin-right: 10px;
        text-align: center;
        height: 17px;
        line-height: 17px;
        .backlog-icon {
          font-size: 15px;
          background: var(--unnamed-color-616161) 0% 0% no-repeat padding-box;
        }
      }

      .backlog-item {
        font: normal normal normal 14px/17px Roboto;
      }
    }
  }
  .project-line {
    width: 100%;
    height: 1px;
    background-color: #ececec;
    margin: 14px 0 10px;
  }
  .project-progress {
    width: 100%;
    font: normal normal bold 12px/14px Roboto;

    &.project-progress:first-child {
      font-weight: 600;
    }
    .progress-text {
      background-color: #d7e9ff8c;
      padding: 5px 5px;
      height: 100%;
      border-radius: 5px;
      font-weight: 500;
      display: flex;
      text-align: center;
      .progress-icon {
        line-height: 100%;
        font-size: 12px;
        margin-right: 4px;
        display: inline-block;
      }
    }
  }
  .project-line-bottom {
    margin-top: 5px;
    width: 100%;
    gap: 4px;
    .line-bottom-items {
      background-color: #3597e2;
      height: 4px;
      width: 33%;
      border-radius: 10px;
    }
  }
}
.avatar img {
  object-fit: cover !important;
}
</style>
