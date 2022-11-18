<template>
  <div class="header-main">
    <!-- <div class="popup-notification" v-if="isPopup">
      <popup-notification @closePopup="isPopup = false"></popup-notification>
    </div> -->
    <div class="header-main-container">
      <div class="top-title-block">
        <top-title class="notification-title" title="Notification"></top-title>
      </div>

      <div class="header-main-buttons">
        <div class="header-main-search">
          <v-img
            class="img-search"
            src="@/assets/images/magnifying-glass-solid.svg"
          ></v-img>
          <v-text-field
            class="input-search"
            placeholder="Search notification..."
            solo
            @input="debounceSearch"
            v-model="keySearch"
          ></v-text-field>
        </div>
      </div>
    </div>

    <div class="notification-wrap" v-if="notificationQuantity > 0">
      <div
        class="notification-list"
        v-for="(item, index) in groupItems"
        :key="index"
      >
        <div class="headline-time">
          <h2 class="headline-time-title">
            {{ isTodayOrYesterday(item.date) }}
          </h2>
          <hr class="headline-time-dashed" />
        </div>
        <!-- v-for="notificationItem in item.notifications" -->
        <notification-item
          :data="item.notifications"
          :key="index"
        ></notification-item>
        <!-- <notification-item
          v-for="notificationItem in notificationList"
          :data="notificationItem"
          :key="notificationItem.id"
        ></notification-item> -->
      </div>
    </div>
    <div class="text-center">
      <v-pagination
        :style="[
          ids.length < 10
            ? {
                bottom: '26px',
                position: 'absolute',
                left: '50%',
                transform: 'translateX(-50%)',
              }
            : null,
        ]"
        class="mt-3"
        v-model="currentPage"
        :length="Math.ceil(notificationQuantity / size)"
        :total-visible="5"
        @input="handlePageChange"
        next-icon="mdi-menu-right"
        prev-icon="mdi-menu-left"
        v-if="notificationQuantity / size > 1"
      ></v-pagination>
    </div>
    <div
      v-if="notificationQuantity === 0 || notificationList.length === 0"
      class="empty-data d-flex justify-center mt-10"
    >
      <img
        class="icon-not-found"
        src="@/assets/images/icon-not-found.svg"
        alt=""
      />
      <div class="text-not-found">No data available</div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex';
import getterTypes from '@/store/modules/notification/getter_types';
import TopTitle from '@/components/TopTitle.vue';
import NotificationItem from '@/views/NotificationPage/NotificationItem.vue';
import localStorageUtils from '@/utils/utils_local_storage';
import socket from '@/socket/socket';
import notificationActions from '@/store/modules/notification/action_types';
import noticationMutations from '@/store/modules/notification/mutation_types';
export default {
  name: 'NotificationPage',
  components: { TopTitle, NotificationItem },
  props: {
    page: {
      type: Number,
      default: 1,
    },
    size: {
      type: Number,
      default: 10,
    },
    searchText: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      title: 'Notification',
      isPopup: true,
      currentPage: this.page,
      currentUserId: null,
      ids: 0,
      keySearch: '',
      groupItems: {},
    };
  },
  methods: {
    ...mapMutations({
      setSearchText: noticationMutations.SET_SEARCH_TEXT,
    }),
    ...mapActions({
      fetchNotification: notificationActions.GET_NOTIFICATION_LIST,
      changeToReadStatus: notificationActions.CHANGE_TO_READ_STATUS,
      getUnreadCount: notificationActions.GET_UNREAD_COUNT,
      searchNotificationList: notificationActions.ACT_SEARCH,
    }),
    onGroupByDate() {
      // this gives an object with dates as keys
      const groups = this.notificationList.reduce((groups, notification) => {
        const date = notification.create_date.split('T')[0];
        if (!groups[date]) {
          groups[date] = [];
        }
        groups[date].push(notification);
        return groups;
      }, {});
      // Edit: to add it in the array format instead
      const groupArrays = Object.keys(groups).map((date) => {
        return {
          date,
          notifications: groups[date],
        };
      });
      return (this.groupItems = groupArrays);
    },
    isTodayOrYesterday(date) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      if (yesterday.toDateString() === new Date(date).toDateString()) {
        return 'Yesterday';
      } else if (new Date().toDateString() === new Date(date).toDateString()) {
        return 'Today';
      } else {
        return date;
      }
    },
    async handlePageChange() {
      this.$router
        .push({
          name: 'notification-page',
          query: { page: this.currentPage, size: this.size },
        })
        .catch(() => {});
      await this.searchNotificationList({
        keyword: this.keySearch,
        currentPage: this.currentPage,
        pageSize: this.size,
      });
      this.onGroupByDate();
    },
    async debounceSearch() {
      this.currentPage = 1;
      this.$router
        .push({
          name: 'notification-page',
          query: {
            page: this.currentPage,
            size: this.size,
          },
        })
        .catch(() => {});
      await this.searchNotificationList({
        keyword: this.keySearch,
        currentPage: this.currentPage,
        pageSize: this.size,
      });
      this.onGroupByDate(this.notificationList);
    },
  },
  computed: {
    ...mapGetters({
      notificationList: getterTypes.GET_NOTIFICATION_LIST,
      notificationQuantity: getterTypes.GET_NOTIFICATION_QUANTITY,
    }),
  },
  async created() {
    const currentUser = JSON.parse(
      localStorageUtils.getService().getCurrentUser()
    );
    this.currentUserId = currentUser.userId;
    await this.searchNotificationList({
      keyword: this.searchText,
      currentPage: this.currentPage,
      pageSize: this.size,
    });
    socket.onGetNotification(async () => {
      await this.searchNotificationList({
        keyword: this.keySearch,
        currentPage: this.currentPage,
        pageSize: this.size,
      });
    });
    this.onGroupByDate(this.notificationList);
  },
  async beforeUpdate() {
    this.ids = this.notificationList.map((notification) => notification.id);
    if (this.$route.name !== 'notification-page') {
      await this.changeToReadStatus(this.ids);
      await this.getUnreadCount();
    }
  },
  async updated() {
    if (this.$route.name !== 'notification-page') {
      await this.changeToReadStatus(this.ids);
      await this.getUnreadCount();
    }
  },
};
</script>

<style scoped lang="scss">
.header-main-search {
  position: relative;
  width: 311px;
  height: 40px;
  margin-right: 0px !important;
}
.headline-time {
  height: 24px;
  display: flex;
  align-items: center;
  gap: 17px;
  margin-top: 5px;
  &-title {
    text-align: left;
    font: normal normal bold 20px/24px Roboto;
    letter-spacing: 0px;
    color: #000000;
    opacity: 1;
    white-space: nowrap;
  }
  &-dashed {
    display: flex;
    justify-content: center;
    align-items: center;
    border: none;
    width: 100%;
    height: 1px;
    line-height: 1;
    background-size: 3px 100%, 100% 3px;
    background-image: repeating-linear-gradient(
        #8e8e8e,
        transparent 8px,
        transparent 8px
      ),
      repeating-linear-gradient(
        90deg,
        #8e8e8e,
        #8e8e8e 8px,
        transparent 8px,
        transparent 15px
      );
  }
}
.popup-notification {
  height: 100%;
}
.notification-title {
  text-align: left;
  font: normal normal bold 30px/37px Roboto;
  letter-spacing: 0px;
  color: #000000 !important;
  opacity: 1;
}
.notification-wrap {
  background: #ffffff 0% 0% no-repeat padding-box;
  box-shadow: 0px 3px 6px #00000029;
  border-radius: 20px;
  padding-bottom: 10px;
  padding-top: 25px;
  padding-left: 25px;
  padding-right: 25px;
}
.notification-list {
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
  opacity: 1;
  gap: 20px;
}

@media screen and (max-width: 768px) {
  .notification-wrap {
    padding-left: 12px;
    padding-right: 12px;
    margin-top: -20px;
  }
  .notification-list {
    gap: 10px;
  }
}
</style>
