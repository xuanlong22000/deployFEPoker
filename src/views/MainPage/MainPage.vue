<template>
  <v-app v-if="profile">
    <v-app-bar
      v-if="appBar"
      color="#3597e2"
      class="
        d-flex d-sm-none d-none d-sm-flex d-md-none d-none d-md-flex d-lg-none
      "
    >
      <v-app-bar-nav-icon @click="drawer = true"></v-app-bar-nav-icon>
      <div class="toolbar-title"><span>PLANNING POKER</span></div>
    </v-app-bar>
    <v-navigation-drawer
      app
      v-show="drawer"
      v-model="drawer"
      width="250px"
      src="@/assets/images/banner-sp.jpg"
      d-flex
      justify-center
      relative
      class="mx-auto overflow-hidden"
      height="100vh"
      dark
      :class="{
        hiddenSidebar:
          this.$route.name === 'game-screen' || this.$route.name === 'game-end',
      }"
    >
      <side-bar
        :currentUserName="currentUserName"
        :avatar="profile.avatar"
      ></side-bar>
    </v-navigation-drawer>
    <v-main
      :class="{
        fixPadding:
          this.$route.name === 'game-screen' || this.$route.name === 'game-end',
        fixPadding2:
          this.$route.name !== 'game-screen' && this.$route.name !== 'game-end',
      }"
      color="#f4f6fa"
    >
      <router-view class="content-page pl-15 pr-15 pt-16 pb-16"></router-view>
    </v-main>
  </v-app>
</template>

<script>
import SideBar from '@/components/SideBar.vue';
import localStorageUtils from '@/utils/utils_local_storage.js';
import userGetter from '@/store/modules/user/getter_types';
import { mapActions, mapGetters, mapMutations } from 'vuex';
import { getAuthUserProfile } from '@/api/api_user.js';
import userMutation from '@/store/modules/user/mutation_types';
import jwt_decode from 'jwt-decode';
import socket from '@/socket/socket';
import notificationActions from '@/store/modules/notification/action_types';
export default {
  name: 'MainPage',
  components: { SideBar },
  data() {
    return {
      mini: false,
      drawer: true,
      appBar: true,
      currentUserName: '',
      navLinks: [
        {
          icon: 'fas fa-suitcase',
          text: 'Management',
          sublinks: [
            { icon: 'far fa-list-alt', text: 'Project List' },
            { icon: 'fas fa-users', text: 'User' },
          ],
        },
        {
          icon: 'far fa-bell',
          text: 'Notification',
        },
        {
          icon: 'fas fa-sign-out-alt',
          text: 'Sign Out',
        },
      ],
    };
  },
  computed: {
    ...mapGetters({
      profile: userGetter.GET_PROFILE,
    }),
  },
  methods: {
    ...mapMutations({
      setProfile: userMutation.MUTATE_SET_PROFILE,
      setListUsersOnline: userMutation.MUTATE_SET_IS_ONLINE,
    }),
    ...mapActions({
      getUnreadCount: notificationActions.GET_UNREAD_COUNT,
    }),
  },
  watch: {
    drawer() {
      let nameRoute = this.$route.name;
      if (
        (nameRoute === 'game-screen' || nameRoute === 'game-end') &&
        this.$route.query.token
      ) {
        this.drawer = false;
        this.appBar = false;
      }
    },
  },
  async created() {
    const { data } = await getAuthUserProfile();
    this.userProfile = data;
    this.setProfile(data);
    this.currentUserName = localStorageUtils.getName();
    this.currentUser = jwt_decode(localStorageUtils.getToken());
    if (this.currentUser) {
      await socket.emitConnectServer({ userId: this.currentUser.userId });
      socket.emitCheckOnlineUser();

      socket.onCheckOnlineUser(idOnline => {
        this.setListUsersOnline(idOnline);
      });
    }
    let nameRoute = this.$route.name;
    if (
      (nameRoute === 'game-screen' || nameRoute === 'game-end') &&
      this.$route.query.token
    ) {
      this.drawer = false;
      this.appBar = false;
    }
  },
  async beforeUpdate() {
    await this.getUnreadCount();
  },
};
</script>

<style scoped lang="scss">
.v-app-bar {
  border-radius: 0 !important;
}
.v-toolbar {
  flex: none;
}
.v-toolbar__title {
  color: #ffffff !important;
  font: 500 20px Roboto;
  text-align: center;
  width: 100%;
  padding-left: 0 !important;
}
.v-navigation-drawer {
  border-radius: 0 !important;
  box-shadow: none;
}
.v-icon {
  color: #ffffff !important;
}
.toolbar-title {
  width: calc(100vw - 96px);
  display: flex;
  justify-content: center;
}
.toolbar-title span {
  color: #ffffff;
  font: 400 16px Roboto;
}

.content-page {
  background-color: #f4f6fa;
  height: 100%;
  position: relative;
  @media only screen and (max-width: 768px) {
    padding: 20px 15px !important;
  }
}
.hiddenSidebar {
  display: none;
}
.fixPadding {
  padding: 0 !important;
}

.fixPadding2 {
  padding: 0 0 0 250px !important;
}

@media only screen and (min-width: 280px) and (max-width: 1024px) {
  .fixPadding2 {
    padding: 0 !important;
  }
  .hiddenSidebar {
    display: block;
  }
  .content-page {
    max-width: 100%;
  }
}
</style>
