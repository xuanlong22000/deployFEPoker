<template>
  <v-app>
    <div
      v-if="!isLoading"
      class="landing-page-screen px-lg-16 px-md-8 px-sm-4 px-xs-2 py-10"
    >
      <Header />
      <Section />
      <AuthDialog :dialog="dialog" :component="component" :email="email" />
    </div>
    <div
      class="loading-home-page px-lg-16 px-md-8 px-sm-4 px-xs-2 py-10"
      v-else
    >
      <LoadingPageHome />
    </div>
  </v-app>
</template>

<script>
import LoadingPageHome from '@/components/LoadingPageHome.vue';
import AuthDialog from '@/components/AuthDialog.vue';
import Header from './LandingHeader.vue';
import Section from './LandingSection.vue';
import { active, checkValidToken } from '@/api/api_user.js';
import { mapMutations } from 'vuex';
import mutationType from '@/store/app/mutation_types';
import localStorageUtils from '@/utils/utils_local_storage';

export default {
  components: { Header, Section, AuthDialog, LoadingPageHome },
  data: () => ({
    dialog: false,
    component: null,
    isLoading: true,
    email: '',
  }),

  provide() {
    return {
      handleDialogStatus: this.handleDialogStatus,
      changeComponent: this.changeComponent,
    };
  },

  methods: {
    ...mapMutations({
      setSnackBar: mutationType.SET_SNACKBAR,
    }),
    handleDialogStatus(status) {
      this.dialog = status;
    },

    changeComponent(cpn, email) {
      this.component = cpn;
      this.email = email;
    },
  },
  async created() {
    const token = this.$route.query.token;
    if (token) {
      const response = await active(token);
      if (response.status === 200) {
        this.$router.replace('/');
        this.setSnackBar({
          type: 'success',
          visible: true,
          text: 'Your account active successfully!',
        });
      } else {
        this.$router.replace('/');
        this.setSnackBar({
          type: 'error',
          visible: true,
          text: 'Your token invalid!',
        });
      }
    }

    // check is logged-in
    const isLoggedIn = await localStorageUtils.getToken();
    if (isLoggedIn) {
      const checkToken = await checkValidToken(isLoggedIn);
      if (checkToken?.status === 200)
        this.$router.push({
          name: 'project-list',
        });
    }
  },
  mounted() {
    setTimeout(() => (this.isLoading = false), 1000);
  },
};
</script>

<style lang="css" scoped>
.landing-page-screen {
  height: 100vh;
  background-image: url('../../assets/images/banner-desktop.jpg');
  background-size: cover;
  background-position: center;
  overflow-y: hidden;
  overflow-x: hidden;
}
.loading-home-page {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

@media (max-width: 425px) {
  .landing-page-screen {
    padding-top: 18px !important;
  }
}
</style>
