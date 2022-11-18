<template>
  <div>
    <div class="main-wrapper create-project-screen">
      <div class="header-main">
        <div class="header-main-container">
          <div class="top-title-block">
            <top-title title="Create Project"></top-title>
          </div>
        </div>
      </div>
      <div class="content">
        <project-form
          :mode="0"
          :memberList="selectedUsers"
          @setPmId="handleSetPMId"
          @openInvitePopup="openInvitePopup"
          @handleRemoveSelectedUser="handleRemoveSelectedUser"
        />
      </div>
      <v-dialog
        v-model="isOpenInviteDialog"
        max-width="622px"
        transition="dialog-top-transition"
        persistent
      >
        <InvitePopupWrap>
          <invite-popup
            :mode="0"
            :project="project"
            :pmId="pmId"
            :isOpen="isOpenInviteDialog"
            :memberList="selectedUsers"
            @selectedUsers="handleSelectedUsers"
            @closePopup="closePopup"
          />
        </InvitePopupWrap>
      </v-dialog>
    </div>
  </div>
</template>

<script>
import TopTitle from '@/components/TopTitle.vue';
import ProjectForm from './ProjectForm.vue';
import InvitePopup from './InvitePopup.vue';
import InvitePopupWrap from '@/components/InvitePopup.vue';
import userActions from '@/store/modules/user/action_types';
import { mapActions } from 'vuex';
import jwtDecode from 'jwt-decode';
import localStorageUtils from '@/utils/utils_local_storage';

export default {
  name: 'create-project',
  components: { TopTitle, ProjectForm, InvitePopup, InvitePopupWrap },
  data() {
    return {
      isOpenInviteDialog: false,
      selectedUsers: [],
      project: {
        project_name: 'new',
        project_id: '-1',
      },
      pmId: null,
      currentUserId: '',
    };
  },
  methods: {
    ...mapActions({
      fetchGetUserNotMember: userActions.ACT_FETCH_GET_USER_NOT_MEMBER,
      getUserWithSystemRole: userActions.ACT_FETCH_WITH_SYSTEM_ROLE,
    }),

    async closePopup() {
      this.isOpenInviteDialog = false;
      await this.fetchGetUserNotMember({ projectIds: ['-1'] });
    },
    async openInvitePopup() {
      await this.fetchGetUserNotMember({
        projectIds: ['-1'],
      });
      this.isOpenInviteDialog = true;
    },
    handleSelectedUsers(data) {
      this.selectedUsers = [...this.selectedUsers, ...data];
    },
    handleSetPMId(pmId) {
      this.selectedUsers = this.selectedUsers.filter(
        user => user.user_id !== pmId
      );
      this.pmId = pmId;
    },
    handleRemoveSelectedUser(item) {
      this.selectedUsers = this.selectedUsers.filter(
        user => user.user_id !== item.user_id
      );
    },
  },
  async created() {
    const decodedToken = jwtDecode(localStorageUtils.getService().getToken());
    this.currentUserId = decodedToken.userId;
    this.loading = true;
    await this.getUserWithSystemRole({ id: this.currentUserId }).then(res => {
      if (res.system_role_id !== 1) {
        this.$router.push({ name: 'project-list' });
      }
    });
  },
};
</script>
