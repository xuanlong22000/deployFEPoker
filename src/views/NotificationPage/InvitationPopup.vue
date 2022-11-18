<template>
  <v-card class="model-content py-8 px-16">
    <button @click="$emit('closePopup')" class="close-icon rounded-circle">
      <i class="fas fa-times"></i>
    </button>
    <i class="fa-solid fa-bell icon-header"></i>
    <p class="popup-title">Notification</p>
    <p class="popup-description">Please accept to start joining the game</p>
    <div class="popup-form">
      <div class="popup-group" v-for="popupItem in popup" :key="popupItem.id">
        <div>
          <p class="popup-group-p">{{ popupItem.content }}</p>
        </div>
        <div class="btn-group">
          <button class="accept-btn">Accept</button>
          <button class="cancel-btn">Cancel</button>
        </div>
      </div>
    </div>
  </v-card>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import actionTypes from '@/store/modules/notification/action_types';
import getterTypes from '@/store/modules/notification/getter_types';
import localStorageUtils from '@/utils/utils_local_storage';
export default {
  name: 'invitation-popup',
  data() {
    return {};
  },
  methods: {
    ...mapActions({
      fetchNotification: actionTypes.GET_NOTIFICATION_LIST_POPUP,
    }),
  },
  computed: {
    ...mapGetters({
      popup: getterTypes.GET_NOTIFICATION_LIST_POPUP,
    }),
  },
  watch: {
    popup: {
      handler() {},
      immediate: true,
    },
  },
  async created() {
    const currentUser = JSON.parse(
      localStorageUtils.getService().getCurrentUser()
    );
    await this.fetchNotification({ userId: currentUser.userId });
  },
};
</script>

<style lang="scss" scoped>
.popup-container {
  height: 100%;
  max-height: 100vh;
}
.popup-row {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.popup-title {
  margin-bottom: 7px !important;
  text-align: left;
  font: normal normal bold 20px/24px Roboto;
  letter-spacing: 0px;
  color: #000000;
  opacity: 1;
}
.icon-header {
  font-size: 47px;
  margin-bottom: 12px;
}
.popup-form {
  width: 455px;
}
.popup-group {
  width: 100%;
  max-width: 455px;
  height: auto;
  max-height: 45px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 18px;
  box-shadow: 0px 3px 6px #00000029;
  border-radius: 5px;
}
.popup-group-p {
  text-align: left;
  font: normal normal normal 16px/19px Roboto;
  letter-spacing: 0px;
  color: #424242d8;
  opacity: 1;
  border-radius: 5px;
  padding: 10px 16px;
  font-weight: 300;
  margin: 0;
}
.popup-description {
  text-align: left;
  font: normal normal normal 16px/19px Roboto;
  font-weight: 300;
  letter-spacing: 0px;
  color: #8e8e8e;
  opacity: 1;
}
.btn-group {
  display: flex;
  justify-content: center;
  align-items: center;
}
.close-icon {
  font-size: 20px;
  background-color: #fff;
  background: #ffffff 0% 0% no-repeat padding-box;
  box-shadow: 0px 3px 6px #00000029;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 30px;
  height: 30px;
  font-weight: 100;
  position: absolute;
  top: -13px;
  right: -13px;
  border-radius: 5px !important;
}
.close-icon i {
  color: #8e8e8e;
}

.model-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
  padding: 32px 70px;
  background: #ffffff 0% 0% no-repeat padding-box;
  box-shadow: 0px 3px 6px #00000029 !important;
  border: none;
  position: relative;
  width: auto;
}

.form-group p:nth-child(1) {
  width: 234px;
  height: 40px;
  background: #ffffff 0% 0% no-repeat padding-box;
  box-shadow: 0px 3px 6px #00000029;
  border-radius: 5px;
  color: #424242d8;
  padding: 10px 16px;
  font-size: 16px;
  margin-right: 20px;
  font-weight: 300;
  margin-bottom: 0;
}

input {
  width: 149px;
  height: 40px;
  background: #ffffff 0% 0% no-repeat padding-box;
  box-shadow: 0px 3px 6px #00000029;
  border-radius: 5px;
  color: #1691ef;
  padding: 10px 16px;
  font-size: 16px;
  margin-right: 10px;
  font-weight: 300;
  margin-bottom: 0;
}

.reset-btn {
  color: #8e8e8e;
  border: none;
  font-size: 16px;
  width: 103px;
  height: 41px;
  background: #545b62 0% 0% no-repeat padding-box;
  box-shadow: 0px 0px 5px #3597e2;
  border-radius: 5px;
  font-weight: 500;
  color: #ffffff;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 16px;
}

.accept-btn {
  border: none;
  font-size: 16px;
  width: 65px;
  border-radius: 5px;
  height: 30px;
  background: #7854c0 0% 0% no-repeat padding-box;
  box-shadow: 0px 0px 5px #9c30afb5;
  font-weight: 300;
  color: #ffffff;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 15px;
  opacity: 1;
}
.cancel-btn {
  border: none;
  font-size: 16px;
  width: 65px;
  border-radius: 5px;
  height: 30px;
  background: #eb907d 0% 0% no-repeat padding-box;
  box-shadow: 0px 0px 5px #d48271;
  font-weight: 300;
  color: #ffffff;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 15px;
  opacity: 1;
}
@media screen and (max-width: 768px) {
  .popup-group {
    max-width: 400px;
  }
  .popup-form {
    width: 330px;
  }
  .accept-btn,
  .cancel-btn {
    width: 45px;
    height: 25px;
    font-size: 12px;
  }
}
</style>
