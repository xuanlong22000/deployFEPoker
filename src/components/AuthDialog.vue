<template>
  <v-row justify="center" class="container">
    <v-dialog
      v-if="!isMobile()"
      v-model="dialogStatus"
      persistent
      width="500px"
      transition="dialog-bottom-transition"
      :fullscreen="isfullscreen ? true : false"
    >
      <component
        v-bind:isfullscreen="isfullscreen"
        :is="component"
        :email="email"
      ></component>
    </v-dialog>
  </v-row>
</template>

<script>
import SigninForm from '../views/LandingPage/SigninForm.vue';
import SignupForm from '../views/LandingPage/SignupForm.vue';
import CheckEmailPopup from '../views/LandingPage/SentEmailPopup.vue';
import ForgotPasswordForm from '../views/LandingPage/ForgotPasswordForm.vue';
import ResetPasswordForm from '../views/ResetPasswordPage/ResetPasswordForm.vue';
export default {
  props: ['dialog', 'component', 'email'],
  data() {
    return {
      dialogStatus: false,
      isfullscreen: false,
      window: {
        width: 0,
      },
    };
  },
  components: {
    SigninForm,
    SignupForm,
    CheckEmailPopup,
    ForgotPasswordForm,
    ResetPasswordForm,
  },
  watch: {
    dialog() {
      this.dialogStatus = this.dialog;
    },
  },
  methods: {
    isMobile() {
      if (
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        )
      ) {
        if (this.window.width > 1024) {
          this.isfullscreen = false;
        } else {
          this.isfullscreen = true;
        }
      } else {
        if (this.window.width > 1024) {
          this.isfullscreen = false;
        } else {
          this.isfullscreen = true;
        }
      }
    },
    handleResize() {
      this.window.width = window.innerWidth;
    },
  },
  created() {
    window.addEventListener('resize', this.handleResize);
    this.handleResize();
  },
  destroyed() {
    window.removeEventListener('resize', this.handleResize);
  },
};
</script>

<style lang="css" scoped>
.container {
  overflow: auto !important;
}
</style>
