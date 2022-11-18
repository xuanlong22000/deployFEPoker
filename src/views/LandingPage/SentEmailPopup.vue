<template>
  <v-card class="px-16 py-10 wrap-popup-forgotpass">
    <div
      logo
      class="close-btn"
      @click="handleCloseForm"
      :color="!isfullscreen ? '#B1ADAD' : '#ffffff'"
    >
      <div>+</div>
    </div>

    <div class="de9tta-2 iemqlh cmc-modal-wrapper  ">
      <div class="dgbbt4-0 cioxTN" style="">
        <div class="dgbbt4-7 icon-email">
          <img
            src="https://s2.coinmarketcap.com/static/cloud/img/login/check.png?_=8241272"
          />
          <div class="dgbbt4-1 text-email" style="padding-top: 0px;">
            We've sent you an activation email
          </div>
          <div class="dgbbt4-2 infor-email">
            We’ve sent an email to
            <b style="color: #000;">{{ email }}</b>
            with a link to activate your account. Follow the instructions to
            complete the account registration.
          </div>
          <!-- <div
            class="dgbbt4-4 icISkE"
            style="font-size: 14px; color: var(--text-color);"
          >
            Resend your email if it doesn’t arrive in 00:44
          </div> -->
        </div>
      </div>
    </div>
  </v-card>
</template>

<script>
export default {
  inject: ["handleDialogStatus", "changeComponent"],
  props: {
    isfullscreen: Boolean,
    email: String,
  },
  data() {
    return {};
  },
  methods: {
    handleCloseForm() {
      this.handleDialogStatus(false);
    },
  },
};
</script>

<style lang="scss" scoped>
.wrap-popup-forgotpass {
  position: relative;
}
.icon-email {
  text-align: center;
  padding-top: 30px;
  padding-bottom: 35px;
}
.text-email {
  font-size: 24px;
  line-height: 34px;
  font-weight: 700;
}
.infor-email {
  font-size: 14px;
  margin-top: 4px;
  margin-bottom: 24px;
  color: #58667e;
  font-family: system-ui;
}

.v-dialog.v-dialog--active.v-dialog--persistent {
  width: 500px !important;
}

@media only screen and (min-width: 280px) and (max-width: 1024px) {
  .icon-email {
    text-align: center;
    padding-top: 6%;
  }
  .text-email {
    font-size: 18px;
    line-height: 34px;
    font-weight: 700;
    color: #000;
  }
  .infor-email {
    font-size: 13px;
    color: #58667e;
    padding: 0 10px;
    font-family: system-ui;
  }
  b {
    color: #000;
  }

  .v-dialog--fullscreen > .v-card {
    padding: 0 !important;
    position: absolute;
    left: 0;
    right: 0;
    margin-left: auto;
    margin-right: auto;
    width: 90%;
    height: auto !important;
    top: 30%;
    min-height: 0% !important;
    min-width: 0% !important;
    margin: auto !important;
  }
  .v-dialog.v-dialog--active.v-dialog--persistent.v-dialog--fullscreen {
    background: #2b2b2669 !important;
  }
}
@media only screen and (min-width: 768px) and (max-width: 1024px) {
  .v-dialog--fullscreen > .v-card {
    padding: 0 !important;
    position: absolute;
    left: 0;
    right: 0;
    margin-left: auto;
    margin-right: auto;
    width: 90%;
    height: auto !important;
    top: 30%;
    min-height: 0% !important;
    min-width: 0% !important;
    margin: auto !important;
  }
}
</style>

<style>
.v-dialog.v-dialog--active.v-dialog--persistent.v-dialog--fullscreen {
  background: #3434314e !important;
}
</style>
