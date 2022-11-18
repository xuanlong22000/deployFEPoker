<template>
  <div class="header-main">
    <div class="header-main-container">
      <div class="top-title-block">
        <top-title :title="title" class="top-title"></top-title>
      </div>
    </div>
    <div class="content">
      <project-form
        v-on:openInvitePopup="openInvitePopup"
        :mode="1"
        :projectId="+$route.params.id"
        :memberList="members"
      />
    </div>
    <v-dialog
      v-model="isOpenInviteDialog"
      max-width="622px"
      transition="dialog-top-transition"
      persistent
    >
      <!-- <div class="btn-close-block" absolute>
      <v-btn class="btn-close">
        <v-icon color="#8e8e8e">mdi-close</v-icon>
      </v-btn>
    </div> -->
      <InvitePopupWrap>
        <invite-popup
          :project="project"
          @closePopup="closePopup"
          :isOpen="isOpenInviteDialog"
          :mode="1"
        />
      </InvitePopupWrap>
    </v-dialog>
  </div>
</template>

<script>
import socket from '@/socket/socket';
import TopTitle from '@/components/TopTitle.vue';
import ProjectForm from './ProjectForm.vue';
import { mapGetters, mapActions, mapMutations } from 'vuex';
import actionTypes from '@/store/modules/project/action_types';
import userActions from '@/store/modules/user/action_types';
import InvitePopup from './InvitePopup.vue';
import InvitePopupWrap from '@/components/InvitePopup.vue';
import mutationType from '@/store/app/mutation_types';
import MESSAGE from '@/utils/utils_message';
import jwtDecode from 'jwt-decode';
import localStorageUtils from '@/utils/utils_local_storage';

export default {
  name: 'create-project',
  components: {
    TopTitle,
    ProjectForm,
    InvitePopup,
    InvitePopupWrap,
  },
  data() {
    return {
      title: '',
      isOpenInviteDialog: false,
      userList: null,
    };
  },
  computed: {
    ...mapGetters({
      project: 'project/GET_PROJECT',
      userNotMember: 'user/GET_USER_NOT_MEMBER',
      members: 'project/GET_MEMBER',
    }),
  },
  methods: {
    ...mapActions({
      getProject: actionTypes.ACT_GET_PROJECT_BY_ID,
      fetchGetUserNotMember: userActions.ACT_FETCH_GET_USER_NOT_MEMBER,
      getMember: actionTypes.ACT_FETCH_GET_ALL_MEMBERS,
      getUserWithSystemRole: userActions.ACT_FETCH_WITH_SYSTEM_ROLE,
    }),
    ...mapMutations({
      setSnackBar: mutationType.SET_SNACKBAR,
    }),
    async closePopup() {
      this.isOpenInviteDialog = false;
      await this.getProject({ id: this.$route.params.id });
      await this.getMember({ id: +this.$route.params.id });
      await this.fetchGetUserNotMember({ projectIds: [this.$route.params.id] });
      this.userList = this.userNotMember;
    },
    async openInvitePopup() {
      const data = await this.getProject({ id: this.$route.params.id });
      if (data.mess === "This project doesn't exist!") {
        this.setSnackBar({
          type: 'error',
          visible: true,
          text: data.mess,
        });
        this.$router.push({ name: 'project-list' });
      }
      if (!data.del_flg) {
        this.isOpenInviteDialog = true;
        await this.fetchGetUserNotMember({
          projectIds: [this.$route.params.id],
        });
        this.userList = this.userNotMember;
      } else {
        this.setSnackBar({
          type: 'warning',
          visible: true,
          text: MESSAGE.PM_DELETE_PROJECT,
        });
        await this.$router.push({ name: 'project-list' }).catch(() => {});
      }
    },
  },
  async created() {
    await this.getProject({ id: this.$route.params.id });
    if (!this.project) {
      this.$router.push({ name: 'project-list' });
    }
    await this.getMember({ id: this.$route.params.id });
    this.title = this.project.project_name;
    try {
      const decodedToken = jwtDecode(localStorageUtils.getService().getToken());
      await this.getUserWithSystemRole({ id: decodedToken.userId }).then(
        (res) => {
          if (!this.project.pm && res.system_role_id != 1) {
            this.$router.push({ name: 'project-list' });
            this.setSnackBar({
              type: 'warning',
              visible: true,
              text: MESSAGE.NOT_PM_IN_PROJECT,
            });
            return;
          }
          if (
            res.system_role_id !== 1 &&
            this.project.pm.user_id !== decodedToken.userId
          ) {
            this.$router.push({ name: 'project-list' });
            this.setSnackBar({
              type: 'warning',
              visible: true,
              text: MESSAGE.NOT_PM_IN_PROJECT,
            });
          }
          socket.ondeleteProject(() => {
            this.$router.push({ name: 'project-list' });
            this.setSnackBar({
              type: 'error',
              visible: true,
              text: "This project doesn't exist!",
            });
          });
        }
      );
    } catch (error) {
      console.log('error in UpdateProject', error);
    }
  },
  async mounted() {
    await this.fetchGetUserNotMember({ projectIds: [this.$route.params.id] });
    this.userList = this.userNotMember;
  },
};
</script>
<style scoped>
.btn-add-member {
  letter-spacing: 0px !important;
  font: normal 400 15px Roboto !important;
  padding-left: -4px !important;
}
.btn-close-block {
  position: absolute;
  top: -10px;
  right: -10px;
}
.fa-solid {
  margin: 0;
}
</style>
