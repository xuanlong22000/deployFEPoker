<template>
  <div class="timeline">
    <div class="timeline-event">
      <div
        class="timeline-event__icon"
        :style="
          action === 4 || action === 7 || action === 10
            ? 'border-color: red'
            : 'border-color: #2196F3'
        "
      >
        <img
          :src="
            action
              ? handleActionIcon(action)
              : '@/assets/images/material-error-outline.svg'
          "
          alt=""
        />
      </div>
      <div class="timeline-event__content">
        <p class="timeline-event__content__title">
          {{ description }}
        </p>
        <p class="timeline-event__content__datetime">
          {{ formatDate(created_date) }}
        </p>
      </div>
      <!-- <div class="timeline-event_dashed" :style="dashHeight !== 0 ? {'height': dashHeight + 'px'} : {'height': '0px'}"></div> -->
    </div>
  </div>
</template>

<script>
import time from '../utils/utils_format_date';
import ACTIVITY_LOG_TYPES from '../constants/const_activity_log_type';
export default {
  name: 'activity-log-item',
  props: {
    action: { required: true, type: Number },
    description: { required: true, type: String },
    // id: { required: true, type: Number },
    created_date: { required: true, type: String },
  },
  data() {
    return {};
  },
  methods: {
    formatDate(daytime) {
      return time(daytime);
    },
    handleActionIcon(action) {
      var imageName = '';
      var images = require.context('../assets/images/');
      var paths = '';
      switch (action) {
        case (action = ACTIVITY_LOG_TYPES.type.CREATE_PROJECT_ID):
          imageName = 'icon-metro-pencil';
          paths = images('./' + imageName + '.svg');
          break;
        case (action = ACTIVITY_LOG_TYPES.type.UPDATE_PROJECT_ID):
          imageName = 'icon-metro-pencil';
          paths = images('./' + imageName + '.svg');
          break;
        case (action = ACTIVITY_LOG_TYPES.type.JOIN_PROJECT_ID):
          imageName = 'icon-join-project';
          paths = images('./' + imageName + '.svg');
          break;
        case (action = ACTIVITY_LOG_TYPES.type.DELETE_PROJECT_ID):
          imageName = 'icon-delete';
          paths = images('./' + imageName + '.svg');
          break;
        case (action = ACTIVITY_LOG_TYPES.type.CREATE_BACKLOG_ID):
          imageName = 'icon-metro-pencil';
          paths = images('./' + imageName + '.svg');
          break;
        case (action = ACTIVITY_LOG_TYPES.type.UPDATE_BACKLOG_ID):
          imageName = 'icon-metro-pencil';
          paths = images('./' + imageName + '.svg');
          break;
        case (action = ACTIVITY_LOG_TYPES.type.DELETE_BACKLOG_ID):
          imageName = 'icon-delete';
          paths = images('./' + imageName + '.svg');
          break;
        case (action = ACTIVITY_LOG_TYPES.type.CREATE_GAME_ID):
          imageName = 'icon-metro-pencil';
          paths = images('./' + imageName + '.svg');
          break;
        case (action = ACTIVITY_LOG_TYPES.type.JOIN_GAME_ID):
          imageName = 'icon-join-game';
          paths = images('./' + imageName + '.svg');
          break;
        case (action = ACTIVITY_LOG_TYPES.type.DELETE_GAME_ID):
          imageName = 'icon-delete';
          paths = images('./' + imageName + '.svg');
          break;
        default:
          break;
      }
      return paths;
    },
  },
};
</script>

<style lang="scss" scoped>
.timeline {
  display: flex;
  flex-direction: column;
  &-event {
    position: relative;
    display: flex;
    border-radius: 8px;
    align-items: center;
    gap: 14px;
    overflow: visible;
    &-title {
      // -webkit-box-orient: vertical;
      // -webkit-line-clamp: 1;
      // display: -webkit-box;
      font: normal normal normal 16px/17px Roboto;
      letter-spacing: 0px;
      margin-bottom: 5px;
      min-width: 90%;
      opacity: 1;
      overflow: hidden;
      text-align: left;
    }
    &__icon {
      width: 50px;
      height: 50px;
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: white;
      border-radius: 100rem;
      border-width: 1px;
      border-style: solid;
      z-index: 2;
      img {
        width: 14px;
        height: 14px;
      }
    }
    &__content {
      align-items: center;
      justify-content: center;
      overflow: hidden;
      &__title {
        // -webkit-box-orient: vertical;
        // -webkit-line-clamp: 2;
        // display: -webkit-box;
        max-width: 100%;
        flex-wrap: nowrap;
        text-overflow: ellipsis;
        font: normal normal normal 14px/17px Roboto;
        letter-spacing: 0px;
        margin-bottom: 5px;
        min-width: 90%;
        opacity: 1;
        overflow: hidden;
        text-align: left;
        margin-right: 20px;
        @media only screen and (max-width: 768px) {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
      &__datetime {
        text-align: left;
        font: normal normal normal 14px Roboto;
        letter-spacing: 0px;
        line-height: 17px;
        color: #8e8e8e;
        opacity: 1;
        margin-bottom: 0px;
        font-weight: 300;
      }
    }
    &_dashed {
      // content: '';
      justify-content: center;
      align-items: center;
      position: absolute;
      border: none;
      width: 2px;
      // height: 25px;
      transform: translate(25px, 35px);
      background-size: 3px 100%, 100% 3px;

      // style dashed
      background-image: linear-gradient(#8e8e8e 75%, rgba(178, 176, 176, 0) 0%);
      background-position: right;
      background-size: 1px 8px;
      background-repeat: repeat-y;
    }
  }
}
</style>
