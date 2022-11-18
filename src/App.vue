<template>
  <v-app>
    <transition name="fade">
      <router-view></router-view>
    </transition>
    <v-snackbar
      v-model="snackbar.visible"
      :color="snackbar.color"
      :multi-line="snackbar.mode === 'multi-line'"
      :timeout="snackbar.timeout"
      :bottom="true"
      :right="true"
    >
      <v-layout align-center pr-4>
        <v-icon class="pr-3" dark large size="20">{{ snackbar.icon }}</v-icon>
        <v-layout column>
          <div>
            <strong>{{ snackbar.title }}</strong>
          </div>
          <div>{{ snackbar.text }}</div>
        </v-layout>
      </v-layout>
    </v-snackbar>
  </v-app>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
export default {
  name: 'App',
  data() {
    return {
      currentUser: null,
    };
  },
  computed: {
    ...mapGetters({
      snackbar: 'GET_SNACKBAR',
      invitationPopup: 'GET_INVITATION_POPUP',
    }),
  },
  methods: {
    ...mapMutations({
      setInvitationPopup: 'SET_INVITATION_POPUP',
    }),
  },
};
</script>

<style scoped>
.v-main {
  background-color: #f4f6fa;
}
.fade-enter-active {
  transition: opacity 0.5s;
}

.fade-enter {
  opacity: 0;
}

* {
  font-family: 'Roboto';
}
</style>

<style lang="scss">
.v-dialog--fullscreen {
  min-width: 100%;
}
.close-btn {
  position: absolute;
  right: -10px;
  top: -10px;
  box-shadow: 0px 3px 6px rgb(143 117 117 / 15%);
  border-radius: 5px;
  padding: 6px;
  background: #ffffff;
  color: #8e8e8e;
  font: normal normal normal 20px/27px Roboto;
  cursor: pointer;
  width: 30px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1;
  border-bottom-left-radius: 5px !important;
  border-bottom-right-radius: 5px !important;
}
.close-btn:hover {
  transform: translateX(-3px) translateY(3px);
  animation: linear 1500ms;
  transition-duration: 0.3s;
  background: #ffffff;
  box-shadow: 0px 3px 6px rgb(143 117 117 / 15%);
}
.close-btn div {
  transform: rotate(45deg);
}
// .v-dialog {
//   @media only screen and (max-width: 768px) {
//     max-width: 95% !important;
//   }
// }
.avatar img {
  border: 1px solid #ffffff;
}
.v-dialog {
  overflow: unset !important;
  width: 100% !important;
  max-width: 450px;
  border-radius: 4px;
  .v-card,
  .v-application .rounded-xl {
    border-radius: 4px !important;
  }
  @media only screen and (max-width: 768px) {
    max-width: 95% !important;
  }
}

.header-main {
  .header-main-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 41px;
  }
  .header-main-buttons {
    display: flex;
    justify-content: center;
    align-items: center;

    button {
      // margin-right: 15px;
      width: auto !important;
    }
    .v-input__control {
      flex-direction: unset !important;
      min-height: 41px !important;

      .v-text-field__details {
        display: none !important;
      }
      .v-input__slot {
        margin: 0;
        font-size: 14px !important;
        padding-left: 55px !important;
      }
    }
    /*Search */
    .header-main-search {
      position: relative;
      width: 311px;
      height: 40px;
      .input-search {
        width: 100%;
        background: #ffffff 0% 0% no-repeat padding-box;
        border: 1px solid #3597e2;
        border-radius: 5px !important;
        box-shadow: none !important;
        opacity: 1;
        &::after {
          content: '';
          position: absolute;
          background-color: #3597e2;
          width: 1px;
          height: 32px;
          top: 12%;
          left: 45px;
        }
      }
      .img-search {
        position: absolute;
        left: 16px;
        top: 11px;
        z-index: 1;
        cursor: pointer;
      }
    }
  }
  .btn-create-block {
    display: flex;
    text-align: right;
    margin-bottom: 16px;
    margin-right: 0 !important;
  }
  .btn-create {
    box-shadow: 0px 0px 5px #3597e2 !important;
    padding: 16px 12px !important;
    letter-spacing: 0;
    width: 160px;
  }
  .btn-create-block button {
    background-color: rgb(53, 151, 226);
    border-color: rgb(53, 151, 226);
    width: 39%;
  }
  .btn-create-block .input-search {
    font: normal normal normal 14px/21px 'Roboto' !important;
  }
  .v-text-field .v-input__control .v-input__slot {
    min-height: 39px !important;
    box-shadow: none !important;
  }
  .v-text-field input {
    padding: 10px 0 8px !important;
  }
  .btn-create-block button i {
    font-size: 13px !important;
    left: 5px;
  }
  @media only screen and (max-width: 768px) {
    .header-main-container {
      flex-direction: column;
      align-items: start;
      margin-bottom: 0;
      .top-title-block {
        width: 60%;
      }
    }
    .header-main-buttons {
      flex-direction: column;
      align-items: start;
      width: 100% !important;
      button {
        width: 100% !important;
        margin-bottom: 30px !important;
        margin: 0;
      }
      .row {
        gap: 100px;
      }
      .mg-bt {
        margin-bottom: 25px;
      }
      .header-main-search {
        width: 100% !important;
        margin-bottom: 54px;
      }
      .input-search {
        width: 100%;
      }

      .cus-btn-primary,
      .cus-btn-secondary,
      .cus-btn-delete,
      .cus-btn-cancel {
        font-size: 12px;
        position: absolute;
        top: 20px;
        right: 23px;
        max-width: 123px !important;
      }
    }
  }
}

.fixed-50-height-btn {
  height: 50px !important;
}
.fixed-112-width-btn {
  width: 112px !important;
}
.fixed-85-width-btn {
  width: 85px !important;
}
.margin-right-btn-15 {
  margin-right: 15px !important;
}
.margin-right-btn-20 {
  margin-right: 20px !important;
}
.margin-top-btn-30 {
  margin-top: 30px !important;
}
.thin-btn {
  padding: 5px 22px !important;
  max-height: 27px !important;
  margin-top: 8px !important;
}

.cus-btn-primary,
.cus-btn-secondary,
.cus-btn-delete,
.cus-btn-cancel {
  height: 41px !important;
  max-width: 500px;
  min-width: 115px !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  border-radius: 5px !important;
  width: max-content;
  cursor: pointer;
  padding: 12px 16px !important;
  font-size: 14px;
  letter-spacing: 0px;
  // font-weight: bold;
  text-transform: unset !important;
  white-space: nowrap;
  outline: none;
}

.cus-btn-primary {
  background: #2196f3 !important;
  box-shadow: 0px 0px 5px #3597e2 !important;

  color: #ffffff !important;

  &:hover {
    background: #1976d2 !important;
  }
}

.cus-btn-secondary {
  border: 1px solid #3597e2 !important;
  box-shadow: 0px 0px 5px #3597e2 !important;

  color: #3597e2 !important;

  &:hover {
    background: #2196f3 !important;
    color: #ffffff !important;
  }
}

.cus-btn-margin-right {
  margin-right: 20px;
}
.cus-btn-cancel {
  background: #ececec !important;
  box-shadow: 0px 0px 5px #8e8e8e !important;
  border: 1px solid #ececec !important;

  color: #000000 !important;

  &:hover {
    background: #ececec !important;
    box-shadow: 0px 0px 5px #8e8e8e !important;
    border: 1px solid #3597e2 !important;
    color: #3597e2 !important;
  }
}

.cus-btn-delete {
  background: #f80d0d80 !important;
  box-shadow: 0px 0px 5px #f80d0d !important;
  border: 1px solid #f80d0d !important;

  line-height: 17px !important;
  color: #ffffff !important;

  &:hover {
    background: #f80d0d !important;
    color: #ffffff !important;
  }
}

.empty-data {
  color: #c9c8c8;
  font: normal 400 18px Roboto;
  flex-direction: column;
  align-items: center;
}
.icon-not-found {
  max-width: 270px !important;
  max-height: 270px !important;
  margin-bottom: 20px;
  @media only screen and (max-width: 768px) {
    max-width: 200px !important;
    max-height: 200px !important;
    margin-bottom: 10px;
  }
}
.text-not-found {
  color: #88a4b1;
  font-size: 20px;
  margin-bottom: 25px;
  font-weight: 300;
}
@media only screen and (max-width: 768px) {
  .v-application .error,
  .v-application .success,
  .v-application .warining {
    width: 100%;
  }
  .text-not-found {
    font-size: 16px;
  }
}
</style>
