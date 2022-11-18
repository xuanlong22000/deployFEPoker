<template>
  <div
    class="wrapper"
    :style="[
      this.activityLogList.length > 0
        ? { maxHeight: '614px' }
        : { height: 'auto' },
    ]"
  >
    <div class="container">
      <div class="header">
        <h3 class="header">Activity Log</h3>
      </div>
      <div class="content" v-if="this.activityLogList.length > 0">
        <div v-for="(item, index) in this.activityLogList" :key="item.id">
          <activity-log-item
            :key="index"
            :action="item.activity_log_type_id"
            :created_date="item.create_date"
            :description="item.activity_log_description"
          />
          <dash-line :style="listItemStyle(index)" />
        </div>
      </div>
      <div v-else class="empty-data d-flex justify-center">
        <img
          class="icon-not-found"
          src="@/assets/images/icon-not-found.svg"
          alt=""
        />
        <div class="text-not-found">No data available</div>
      </div>
    </div>
    <div class="close-btn" @click="$emit('closeModal', false)">
      <div>+</div>
    </div>
  </div>
</template>

<script>
import ActivityLogItem from './ActivityLogItem.vue';
import actionTypes from '@/store/modules/activity_log/action_types';
import getterTypes from '@/store/modules/activity_log/getter_types';
import { mapActions, mapGetters } from 'vuex';
import DashLine from './Dash.vue';
export default {
  name: 'activity-log-popup',
  data() {
    return {
      // lastElement: -1,
    };
  },
  components: { ActivityLogItem, DashLine },
  computed: {
    ...mapGetters({
      activityLogList: getterTypes.GET_ACTIVITY_LOG_LIST,
    }),
  },
  methods: {
    ...mapActions({
      fetchActivityLog: actionTypes.GET_ACTIVITY_LOG_LIST,
    }),
    listItemStyle(index) {
      let style = {};

      if (this.activityLogList.length == 1 && index === 0) {
        style.display = 'none';
        return style;
      }
      if (
        index === this.activityLogList.length - 1 &&
        this.activityLogList.length > 1
      ) {
        style.display = 'none';
        return style;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.v-dialog {
  border-radius: 15px !important;
}
.wrapper {
  position: relative;
  padding: 35px 35px;
  // box-shadow: 0px 3px 6px #00000029;
  border-radius: 5px;
  background: #ffffff;
  box-sizing: border-box;
  overflow: visible;
  user-select: none;
}
.wrapper > * {
  box-sizing: border-box;
}
.container {
  padding: 0px;
}
.header {
  text-align: left;
  font: normal normal bold 20px/24px Roboto;
  letter-spacing: 0px;
  color: #000000;
  margin-bottom: 20px;
}

.content {
  width: 100%;
  height: 500px;
  overflow: auto;
  &::-webkit-scrollbar {
    width: 1px;
    background-color: #f5f5f5;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background-color: rgb(196, 193, 193);
  }
  & > div:not(:last-child) {
    margin-bottom: 25px;
  }
  overflow-y: auto;
}
.empty-data {
  color: #c9c8c8;
  font: normal 400 18px Roboto;
  flex-direction: column;
  align-items: center;
}
.icon-not-found {
  width: 229px;
  height: 225px;
  margin-bottom: 15px;
}

@media screen and (max-width: 450px) {
  .wrapper {
    padding: 10px;
  }
  .btn {
    font: normal normal normal 10x/12px Roboto;
  }
  .close-btn {
    font: normal normal normal 16px/20px Roboto;
  }
}
</style>
