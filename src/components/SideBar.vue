<template>
  <div>
    <div style="text-align: center">
      <div class="avatar-block">
        <div class="avatar-image">
          <!-- <img src="@/assets/images/avatar-account.png" alt="avatar-image" /> -->

          <img :src="avatar" v-if="avatar" alt="avatar-image" />
          <div v-else class="avatar-replace">
            {{ currentUserName.split('')[0].toUpperCase() }}
          </div>
        </div>
        <img
          src="@/assets/images/checked-icon.png"
          alt="user-status"
          class="avatar-status"
        />
      </div>
      <p class="avatar-name">{{ currentUserName }}</p>
    </div>
    <v-list flat>
      <v-list-group
        v-for="navLink in navLinks"
        :key="navLink.text"
        :append-icon="null"
        link
        v-model="navLink.active"
      >
        <v-list-item
          slot="activator"
          :to="navLink.route"
          class="nav-link"
          link
          :elevation="4"
          @click="
            (navLink.text === 'Sign Out' && signOutAndDirectHome()) ||
              (navLink.text === 'Notification' && directNotification());
            updateNotification(navLink.text);
          "
          active-class="deep-white--text text--accent-4"
          :class="{ navActive: navLink.active }"
        >
          <v-list-item-icon>
            <v-icon
              :style="{ color: color(navLink.text) }"
              class="icon"
              :class="{ 'on-notification': navLink.on }"
            >
              {{ navLink.icon }}
            </v-icon>
          </v-list-item-icon>
          <v-list-item-title class="test">
            <span
              :style="{
                fontWeight: fontWeight(navLink.text),
                color: color(navLink.text),
              }"
            >
              {{ navLink.text }}
            </span>
          </v-list-item-title>
          <v-icon
            v-if="navLink.text === 'Management' && !navLink.active"
            :style="{
              color: color(navLink.text),
            }"
            style="font-size: 19px; margin-left: 18px !important"
          >
            fas fa-solid fa-angle-down
          </v-icon>
          <v-icon
            v-if="navLink.text === 'Management' && navLink.active"
            :style="{
              color: color(navLink.text),
            }"
            style="font-size: 19px; margin-left: 18px !important"
          >
            fas fa-solid fa-angle-up
          </v-icon>
          <span
            v-if="navLink.text === 'Notification' && unreadNotiCount !== 0"
            :style="{ fontWeight: fontWeight(navLink.text) }"
            class="notification-count"
            :key="unreadNotiCount"
            :class="{ active: navLink.text === unreadNotiCount > 0 }"
          >
            {{ unreadNotiCount }}
          </span>
        </v-list-item>
        <v-list-item
          class="sub-link ml-4 pl-8"
          v-for="sub in navLink.sublinks"
          :key="sub.text"
          :to="sub.route"
          link
          :elevation="4"
          @click="updateNotification(sub.text, sub.route)"
        >
          <div class="line-sub-menu"></div>
          <div
            class="sub-menu-parent"
            :style="{ backgroundColor: backgroundColor(sub.text) }"
          >
            <v-list-item-icon
              style="margin-top: 8px !important; margin-right: 7px !important"
            >
              <v-icon
                style="font-size: 20px !important"
                :style="{
                  color: color(sub.text),
                }"
              >
                {{ sub.icon }}
              </v-icon>
            </v-list-item-icon>
            <v-list-item-title color="#ffffff">
              <span
                :style="{
                  color: color(sub.text),
                }"
              >
                {{ sub.text }}
              </span>
            </v-list-item-title>
          </div>
        </v-list-item>
      </v-list-group>
    </v-list>

    <v-dialog v-model="dialog" width="unset" height="100%" persistent>
      <v-card class="text-center exit-dialog">
        <img
          class="image-exit"
          src="@/assets/images/delete-account.svg"
          alt=""
        />
        <div class="title-text dialog-title">{{ message }}</div>
        <div class="content-detail dialog-detail">
          <div>The system will close in {{ countDown }} seconds.</div>
          <div>If you have questions or complaints, please contact us.</div>
        </div>
        <div class="btn-block">
          <v-btn
            class="cus-btn-home cus-btn-secondary cus-btn-margin-right"
            @click="signOutAndDirectHome"
          >
            Home
          </v-btn>
          <v-btn
            class="cus-btn-contact cus-btn-primary"
            href="mailto:thaobo.186@gmail.com"
          >
            Contact Us
          </v-btn>
        </div>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import { mapActions, mapGetters, mapMutations } from 'vuex';
import userActions from '@/store/modules/user/action_types';
import socket from '@/socket/socket';
import notificationActions from '@/store/modules/notification/action_types';
import notificationGetters from '@/store/modules/notification/getter_types';
import userGetter from '@/store/modules/user/getter_types';
import { getWithSystemRole, getPMProject } from '@/api/api_user.js';
import ROLE from '@/utils/utils_role';
import mutationType from '@/store/app/mutation_types';
import MESSAGE from '@/utils/utils_message';
import localStorageUtils from '@/utils/utils_local_storage';
export default {
  name: 'SideBar',
  props: {
    currentUserName: {
      type: String,
      default: '',
    },
    avatar: {
      type: String,
    },
  },
  data() {
    return {
      drawer: true,
      navLinks: [
        {
          icon: 'fas fa-suitcase',
          text: 'Management',
          sublinks: [
            {
              icon: 'far fa-list-alt',
              text: 'Project List',
              route: '/project',
              isShow: false,
            },
            {
              icon: 'fas fa-users',
              text: 'User',
              route: '/user-management',
              isShow: false,
            },
          ],
          active: false,
        },
        {
          icon: 'far fa-bell',
          text: 'Notification',
          on: false,
          active: false,
        },
        {
          icon: 'fa-solid fa-user-tie',
          text: 'User Profile',
          route: '/user-profile',
          active: false,
        },
        {
          icon: 'fas fa-sign-out-alt',
          text: 'Sign Out',
        },
      ],
      isPM: false,
      isAdmin: false,
      dialog: false,
      message: MESSAGE.ACCOUNT_HAS_BEEN_DELETED,
      countDown: 5,
    };
  },
  computed: {
    ...mapGetters({
      notificationList: notificationGetters.GET_NOTIFICATION_LIST_POPUP,
      unreadNotiCount: notificationGetters.GET_UNREAD_COUNT,
      isLogin: userGetter.GET_IS_LOGIN,
    }),
    // unreadNotiCount() {
    //   return this.notificationList.reduce((pre, val) => {
    //     return val.status === 'Unread' ? pre : pre + 1;
    //   }, 0);
    // },
  },
  methods: {
    ...mapActions({
      signout: userActions.ACT_SIGNOUT,
      getNotificationQuantity: notificationActions.GET_NOTIFICATION_QUANTITY,
      getUnreadCount: notificationActions.GET_UNREAD_COUNT,
      fetchNotification: notificationActions.GET_NOTIFICATION_LIST,
    }),
    ...mapMutations({
      setSnackBar: mutationType.SET_SNACKBAR,
    }),
    signOutAndDirectHome() {
      this.signout();
      socket.getInstance().disconnect();
      this.$router.go({
        name: 'landing-page',
      });
    },
    directNotification() {
      this.$router
        .push({
          name: 'notification-page',
        })
        .catch((error) => {
          if (error.name === 'notification-page') {
            throw error;
          }
        });
    },
    directUserProfile() {
      this.$router.push({
        name: 'user-profile-page',
      });
    },
    fontWeight(text) {
      const paths = {
        '/user-management': 'User',
        '/project': 'Project List',
        '/backlog': 'Project List',
        '/game-management/:id': 'Project List',
        '/notification': 'Notification',
        '/user-profile': 'User Profile',
        '/create-project': 'Project List',
        '/game-report': 'Project List',
      };

      if (text === paths[this.$route.path]) return '400';
      return '300';
    },
    color(text) {
      const paths = {
        '/user-management': 'User',
        '/user-details/:id': 'User',
        '/project': 'Project List',
        '/backlog': 'Project List',
        '/game-management/:id': 'Project List',
        '/game': 'Project List',
        '/endgame': 'Project List',
        '/project-detail/:id': 'Project List',
        '/notification': 'Notification',
        '/user-profile': 'User Profile',
        '/create-project': 'Project List',
        '/game-report': 'Project List',
      };

      let matchedPath;
      if (
        this.$route.name !== 'game-management' &&
        this.$route.name !== 'project-detail' &&
        this.$route.name !== 'user-details'
      ) {
        matchedPath = paths[this.$route.path];
      } else {
        matchedPath = paths[this.$route.matched[1].path];
      }

      if (text === matchedPath) return '#ffffff';
      return '#D7E9FF8C';
    },
    backgroundColor(text) {
      const paths = {
        '/user-management': 'User',
        '/user-details/:id': 'User',
        '/project': 'Project List',
        '/backlog': 'Project List',
        '/game-management/:id': 'Project List',
        '/game': 'Project List',
        '/endgame': 'Project List',
        '/project-detail/:id': 'Project List',
        '/notification': 'Notification',
        '/user-profile': 'User Profile',
        '/create-project': 'Project List',
        '/game-report': 'Project List',
      };
      let matchedPath;
      if (
        this.$route.name !== 'game-management' &&
        this.$route.name !== 'project-detail' &&
        this.$route.name !== 'user-details'
      ) {
        matchedPath = paths[this.$route.path];
      } else {
        matchedPath = paths[this.$route.matched[1].path];
      }

      if (text === matchedPath) return '#D7E9FF8C';
      return 'transparent';
    },
    async updateNotification(text, route) {
      const { data } = await getPMProject();
      const res = await getWithSystemRole();
      this.isPM = data.projects.length !== 0;
      this.isAdmin = res.data.system_role.name === ROLE.ADMIN;
      if (!this.isPM && !this.isAdmin) {
        this.navLinks[0].sublinks = [
          {
            icon: 'far fa-list-alt',
            text: 'Project List',
            route: '/project',
            isShow: false,
          },
        ];

        if (
          '/user-management' === route &&
          window.location.pathname !== '/project'
        ) {
          this.$router.push('/project');
        }
      }
      if (text !== 'Sign Out') {
        await this.getUnreadCount();
      }
    },
    countDownTimer() {
      if (this.countDown > 0) {
        setTimeout(() => {
          this.countDown -= 1;
          this.countDownTimer();
          if (this.countDown === 0) {
            this.signOutAndDirectHome();
          }
        }, 1000);
      }
    },
  },

  mounted() {
    this.$root.$on('checkProjectList', async () => {
      const { data } = await getPMProject();
      const res = await getWithSystemRole();
      this.isPM = data.projects.length !== 0;
      this.isAdmin = res.data.system_role.name === ROLE.ADMIN;
      if (!this.isAdmin && !this.isPM) {
        this.navLinks[0].sublinks = [
          {
            icon: 'far fa-list-alt',
            text: 'Project List',
            route: '/project',
            isShow: false,
          },
        ];
      }
    });
    this.getUnreadCount();
  },

  async created() {
    const { data } = await getPMProject();
    const res = await getWithSystemRole();
    this.isPM = data.projects.length !== 0;
    this.isAdmin = res.data.system_role.name === ROLE.ADMIN;
    if (!this.isPM && !this.isAdmin) {
      this.navLinks[0].sublinks = [
        {
          icon: 'far fa-list-alt',
          text: 'Project List',
          route: '/project',
          isShow: false,
        },
      ];
    }
    await this.getUnreadCount();
    socket.onGetNotification(() => {
      setTimeout(() => {
        this.fetchNotification();
        this.getUnreadCount();
      }, 300);
    });
    socket.onGetUnreadCount(async () => {
      await this.getUnreadCount();
    });

    socket.onWasDeleteUser(() => {
      localStorageUtils.clearRefreshToken();
      this.dialog = true;
      this.countDownTimer();
    });
    const management = this.navLinks.find((nav) => {
      return nav.text === 'Management';
    });
    management.active = true;
  },
};
</script>
<style scoped>
.notification-count {
  padding: 4px 16px;
  background: #fff;
  color: #f80d0d;
  border-radius: 5px;
  font: normal normal 500 14px/15px Roboto;
  font-weight: bold !important  ;
  position: absolute;
  top: 15px;
  right: 8px;
  width: 20px;
  height: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.avatar {
  margin-top: 50px;
}

.avatar-block {
  margin-top: -20px;
  position: relative;
  display: inline-block;
}

.avatar-image {
  margin-top: 48px;
  display: flex;
  justify-content: center;
}
.avatar-image img {
  width: 140px;
  height: 140px;
  border: 2px solid #ffffff;
  border-radius: 50%;
  box-shadow: 0px 1px 4px rgb(0, 0, 2);
  object-fit: cover;
}

.avatar-replace {
  width: 140px;
  height: 140px;
  border: 2px solid #ffffff;
  border-radius: 50%;
  box-shadow: 0px 1px 4px rgb(0, 0, 2);
  background-color: #fff;

  display: flex;
  justify-content: center;
  align-items: center;

  font-size: 64px;
}
.avatar-status {
  width: 22px;
  position: absolute;
  bottom: 10px;
  right: 12px;
  box-shadow: 0px 1px 4px rgb(0 0 2);
  border-radius: 50%;
}

.avatar-name {
  font: 400 22px Roboto;
  color: #ffffff;
  margin-top: 18px;
  margin-left: 10px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 90%;
}

.v-list {
  margin-top: 30px;
}

.v-list-item {
  color: none;
  caret-color: none;
  border-radius: 4px;
  position: relative;
}
.sub-menu-parent {
  display: flex;
  color: none;
  caret-color: none;
  border-radius: 4px;
  position: relative;
  width: 162px;
  height: 38px;
}
.sub-menu-parent:hover {
  background-color: rgba(255, 255, 255, 0.3);
}

.line-sub-menu {
  width: 3px;
  height: 48px;
  background-color: white;
  margin-left: 5px;
  margin-right: 12px;
}

/* .v-icon {
  color: #ffffff !important;
} */

.v-image {
  width: 150px !important;
  border-radius: 50% !important;
}

.v-list-item__title {
  color: #ffffff !important;
  font: 300 19px Roboto;
}

.v-list-item__title span {
  line-height: 48px;
}

.v-list-item__icon {
  margin: 11px 11px 11px 11px !important;
}

.v-list-item--link:before {
  z-index: -1;
}
.v-list-group--active {
  color: #ffffff !important;
  caret-color: #ffffff !important;
}

.on-notification {
  color: red !important;
}

.exit-dialog {
  width: 500px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.image-exit {
  margin-top: 25px;
  width: 151px;
  height: 150px;
}

.dialog-title {
  font: normal normal bold 20px/24px Roboto;
  margin-top: 10px;
}

.dialog-detail {
  padding: 0 !important;
  font: normal normal normal 16px/19px Roboto;
  color: #8e8e8e;
  margin: 5px 50px 20px !important;
  letter-spacing: 0px;
}
.btn-block {
  display: flex;
  margin-bottom: 30px;
}

.cus-btn-home {
  height: 41px !important;
}
.cus-btn-contact {
  height: 41px !important;
}
.v-list .v-list-item--active {
  color: transparent;
}
.sub-link.v-list-item:not(.v-list-item--active):not(.v-list-item--disabled) {
  color: transparent !important;
}

.v-card__title.text-h5 {
  word-break: unset !important;
}
button.v-btn.v-btn--is-elevated.v-btn--has-bg.theme--light.v-size--default.red.darken-1 {
  color: white !important;
  float: right !important;
  height: 30px !important;
  padding: 0 7px !important;
}
.navActive .v-list-item__icon .v-icon,
.navActive .v-list-item__title span,
.navActive .v-icon {
  color: #ffffff !important;
}

@media screen and (max-width: 500px) {
  .exit-dialog {
    width: 100% !important;
  }
}
</style>
