<template>
  <div class="user-item row" v-if="user" @click="gotoDetails(user)">
    <div>
      <div class="user-infor">
        <div class="user-info__avatar">
          <v-avatar class="avatar" min-width="60" width="60" height="60">
            <span
              v-if="
                user.avatar ===
                'https://res.cloudinary.com/dvnchwzbe/image/upload/v1647422427/napa%20planning%20poker/avatar-account_v4r9ti.png'
              "
              class="avatar-text"
            >
              {{ getNameCharacter(user.name) }}
            </span>

            <img v-else :src="user.avatar" alt="" width="900" height="889" />
          </v-avatar>
          <label v-show="checkOnline" class="avatar-dots"></label>
        </div>
      </div>
    </div>
    <div class="user-info">
      <div class="user-info__about">
        <div class="user-info__name">{{ user.name }}</div>
        <div class="user-info__email">{{ user.email }}</div>
        <div class="user-info__role">
          {{ user.roleText }}
        </div>
      </div>
    </div>
    <div class="user-info__icon">
      <v-dialog v-model="userModal" max-width="700" persistent>
        <user-popup
          v-if="userModal"
          @closeModal="refreshDataCloseModal"
          :user="user"
          :key="Math.random()"
          :currentUserProject="currentUserProject"
          :keySearch="keySearch"
        />
      </v-dialog>
      <v-dialog v-model="deleteModal" max-width="580" persistent>
        <delete-user-popup
          @closeModal="refreshDataCloseModal(1)"
          :user="user"
          :key="Math.random()"
          :userId="user.id"
          :keySearch="keySearch"
        />
      </v-dialog>
      <v-menu v-show="shown" :close-on-click="closeOnClick" bottom offset-y>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            color="#2196F3"
            class="ma-2 icon-click"
            v-bind="attrs"
            v-on="on"
            icon
          >
            <v-icon class="icon-triple-dot">mdi-dots-vertical</v-icon>
          </v-btn>
        </template>

        <v-list v-show="shown" class="user-info__popup">
          <div class="user-info__edit" v-show="isAdmin" @click="openMenuModal">
            Change Role
          </div>
          <div class="user-info__delete" @click="openUserModal">
            <div>Delete</div>
          </div>
        </v-list>
      </v-menu>
    </div>
  </div>
</template>

<script>
import UserPopup from './UserPopup.vue';
import DeleteUserPopup from './DeleteUserPopup.vue';
import { getWithSystemRole } from '@/api/api_user.js';
import ROLE from '@/utils/utils_role';
import userGetter from '@/store/modules/user/getter_types';
import actionTypes from '@/store/modules/activity_log/action_types';
import getterTypes from '@/store/modules/activity_log/getter_types';
import { mapActions, mapGetters } from 'vuex';

export default {
  components: {
    UserPopup,
    DeleteUserPopup,
  },
  props: ['user', 'currentUserProject', 'keySearch', 'index'],
  data() {
    return {
      userModal: false,
      deleteModal: false,
      joinedProjectList: [],
      currentUser: {},
      currentPage: this.$route.query.page || 1,
      pageSize: this.$route.query.size || 10,
      isAdmin: null,
      shown: true,
      closeOnClick: true,
      projectRole: [],
      checkOnline: false,
    };
  },
  computed: {
    ...mapGetters({
      listUsersOnline: userGetter.GET_IS_ONLINE,
      activityLogList: getterTypes.GET_ACTIVITY_LOG_LIST,
    }),
  },

  inject: ['refetchUserList'],
  provide() {
    return {
      gotoDetails: this.gotoDetails,
    };
  },

  methods: {
    ...mapActions({
      fetchActivityLog: actionTypes.GET_ACTIVITY_LOG_LIST,
    }),
    openMenuModal() {
      this.userModal = true;
    },
    openUserModal() {
      this.deleteModal = true;
    },
    async closeMenu() {
      this.shown = false;
    },
    async openMenu() {
      this.shown = true;
    },

    userBelongProject(project) {
      const filterProject = this.currentUserProject.find((item) => {
        return item.project_id === project.projectId;
      });
      if (filterProject) return true;
      else return false;
    },
    async refreshDataCloseModal(check) {
      if (check == 1) {
        this.deleteModal = false;
      } else {
        this.userModal = false;
      }
      // this.refetchUserList();
    },
    getNameCharacter(value) {
      return value.toUpperCase().split(' ')[value.split(' ').length - 1][0];
    },

    gotoDetails(user) {
      this.$router.push({
        name: 'user-details',
        params: { id: user.user_id },
        query: {
          id: user.user_id,
          currentPage: 1,
          pageSize: 10,
        },
      });
    },
    async fetchUserList() {
      await this.refetchUserList();
      const res = await getWithSystemRole();
      this.isAdmin = res.data.system_role.name === ROLE.ADMIN;
    },
  },
  watch: {
    listUsersOnline() {
      if (
        typeof this.listUsersOnline?.find(
          (item) => item.id === this.user.user_id
        ) === 'object'
      ) {
        this.checkOnline = true;
      } else {
        this.checkOnline = false;
      }
    },
  },

  async created() {
    await this.fetchUserList();

    if (
      typeof this.listUsersOnline?.find(
        (item) => item.id === this.user.user_id
      ) === 'object'
    ) {
      this.checkOnline = true;
    } else {
      this.checkOnline = false;
    }
  },
};
</script>

<style lang="scss" scoped>
@keyframes sonar {
  0% {
    transform: scale(0.9);
    opacity: 1;
  }
  100% {
    transform: scale(2);
    opacity: 0;
  }
}
.avatar-dots {
  position: absolute;
  left: 54px;
  bottom: 33px;
  height: 15px;
  width: 15px;
  border-radius: 50%;
  background: #2196f3 0% 0% no-repeat padding-box;
  z-index: 1;
}

.avatar-dots::after {
  content: '';
  position: absolute;
  top: 0px;
  left: 0;
  border: 2px solid #2074ff;
  opacity: 0;
  border-radius: 50%;
  width: 100%;
  height: 100%;
  animation: 2s linear 0s infinite sonar;
}
.project-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}
.user-item {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  flex-direction: row;
  width: 318px;
  height: 121px;
  box-shadow: 0px 3px 6px #00000029;
  border-radius: 5px;
  cursor: pointer;
  &:hover {
    background-color: #f2f4f5;
  }
}

.user-info {
  width: 222px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  &__icon {
    position: absolute;
    top: -5px;
    right: -8px;
  }
  &__popup {
    min-width: 100px;
    font: normal normal normal 14px/17px Roboto;
  }
  &__edit {
    height: 30px;
    padding: 6px 15px;
    cursor: pointer;
    &:hover {
      background: #eff4f9 0% 0% no-repeat padding-box;
    }
  }
  &__delete {
    color: #f80d0d;
    height: 30px;
    padding: 6px 15px;
    cursor: pointer;
    &:hover {
      background: #eff4f9 0% 0% no-repeat padding-box;
    }
  }
}

.action {
  margin: 0;
}

.action i {
  font-size: 14px;
  cursor: pointer;
  width: 30px;
  height: 30px;
  border-radius: 5px;
  background-color: #3366ff;
  margin-left: 16px;
}
.avatar {
  box-shadow: 0px 3px 6px #3597e273;
  margin-left: 11px;
  .avatar-text {
    font: normal normal bold 23px/35px Roboto;
  }
}
.avatar img {
  object-fit: cover !important;
}

.user-info__email {
  margin-top: 5px !important;
  overflow: hidden;
  text-overflow: ellipsis;
}
.user-info__name {
  overflow: hidden;
  text-overflow: ellipsis;
}
.user-info__about {
  font: normal normal normal 14px/17px Roboto;
  letter-spacing: 0px;
  margin-left: 20px;
}
.user-info__role {
  margin-top: 15px;
  font: normal normal bold 14px/17px Roboto;
}

.row {
  display: flex;
  margin: 0;
  width: 100%;
  height: 121px;
  box-shadow: 0px 2px 6px #b6d7f1;
  background-color: #ffffff;
  position: relative;
}

.icon-triple-dot {
  font-size: 17px !important;
}
.v-btn:before {
  content: none !important;
}
.col:not(:first-child) {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px 0;
  text-align: center;
}

@media screen and (max-width: 768px) {
  .user-item {
    display: flex;
    width: 100% !important;
  }
  .user-info {
    &__email {
      width: 100%;
    }
    &__name {
      width: 100%;
    }
  }
  .row {
    width: 100% !important;
  }
}
</style>
