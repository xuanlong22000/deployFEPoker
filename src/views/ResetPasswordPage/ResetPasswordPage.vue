<template>
  <v-app>
    <div class="landing-page-screen px-lg-16 px-md-8 px-sm-4 px-xs-2 py-10">
      <a href="#" class="logo">
        <img src="@/assets/images/logo.svg" alt="logo" />
      </a>
      <AuthDialog :dialog="show" component="ResetPasswordForm" />
    </div>
  </v-app>
</template>

<script>
import AuthDialog from '@/components/AuthDialog.vue';
import { verifyToken } from '@/api/api_user.js';

export default {
  props: {
    resetToken: {
      type: String,
    },
  },

  data() {
    return {
      show: false,
    };
  },

  components: { AuthDialog },

  provide() {
    return {
      resetToken: this.resetToken,
      handleDialogStatus: this.handleDialogStatus,
    };
  },

  methods: {
    changeComponent(component) {
      this.component = component;
    },
    handleDialogStatus(status) {
      this.dialog = status;
    },
  },

  async created() {
    const response = await verifyToken(this.resetToken);
    if (response.status === 400) {
      this.$router.push({ name: 'invalid-token' });
    }
    this.show = true;
  },
};
</script>

<style lang="css" scoped>
.landing-page-screen {
  height: 100vh;
  background-image: url('../../assets/images/banner-desktop.jpg');
  background-size: cover;
  background-position: center;
  overflow-y: auto;
}
</style>