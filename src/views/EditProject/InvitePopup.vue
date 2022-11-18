<template>
  <div class="invite-block">
    <div class="invite-header text-center">
      <v-icon size="26" color="black">fas fa-user-plus</v-icon>
      <span class="invite-title">Add new members</span>
      <span class="note">
        <!-- {{ 'Add new members to ' + project.project_name + ' project!' }}! -->
        Add new members to
        <span class="note-name">{{ project.project_name }}</span>
        project!
      </span>
    </div>
    <div class="members-info-block">
      <div
        class="member-info"
        v-for="(user, index) in selectedUsers"
        :key="index"
      >
        <div class="member-info-input">
          <v-autocomplete
            class="search-fill"
            v-model="selectedUsers[index]"
            prepend-inner-icon="mdi-magnify"
            :items="inviteListUser"
            dense
            filled
            solo
            hide-details
            label="Search by full name"
            :filter="filterName"
            return-object
            item-text="name"
            @input="validate"
          >
            <template v-slot:selection="data">
              <span class="user-name">{{ data.item.name }}</span>
            </template>
            <template v-slot:append-outer>
              <v-text-field
                class="role"
                readonly
                dense
                filled
                hide-details
                solo
                value="Member"
              ></v-text-field>
            </template>
            <template v-slot:item="data">
              <template>
                <v-list-item-content>
                  <v-list-item-title
                    v-html="data.item.name"
                  ></v-list-item-title>
                  <v-list-item-subtitle
                    v-html="data.item.email"
                  ></v-list-item-subtitle>
                </v-list-item-content>
              </template>
            </template>
          </v-autocomplete>
        </div>
        <v-tooltip right>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              v-bind="attrs"
              v-on="on"
              class="btn-delete"
              @click="deleteMember(index)"
              icon
              :disabled="selectedUsers.length === 1"
            >
              <v-icon size="26">mdi-close-box-outline</v-icon>
            </v-btn>
          </template>
          <span>Delete</span>
        </v-tooltip>
      </div>
      <span v-if="error.includes(true)" class="error-message">
        Duplicate field names are not allowed
      </span>
    </div>
    <div class="btn-block d-flex justify-space-between">
      <v-btn
        class="add-member"
        text
        @click="addRow"
        :disabled="error.includes(true)"
      >
        Add new row +
      </v-btn>
      <v-btn
        class="cus-btn-secondary"
        @click="addMembers"
        :loading="loading"
        :disabled="
          selectedUsers.length === 0 ||
          this.selectedUsers.some((user) => user === null) ||
          error.includes(true)
        "
      >
        <v-icon left dark size="16">fas fa-user-plus</v-icon>
        Add members
      </v-btn>
    </div>
  </div>
</template>

<script>
import socket from '@/socket/socket';
import projectMemberActions from '@/store/modules/project_member/action_types';
import userGetters from '@/store/modules/user/getter_types';
import appGetters from '@/store/app/getter_types';
import { mapGetters, mapActions, mapMutations } from 'vuex';
import utils_role from '@/utils/utils_role';
import actionTypes from '@/store/modules/project/action_types';
import userActions from '@/store/modules/user/action_types';
import projectGetters from '@/store/modules/project/getter_types';
import MESSAGE from '@/utils/utils_message';
import mutationType from '@/store/app/mutation_types';
import { getPMProject, getWithSystemRole } from '@/api/api_user.js';
import ROLE from '@/utils/utils_role';
import projectActions from '@/store/modules/project/action_types';

export default {
  name: 'invite-popup',
  props: {
    project: {
      type: Object,
    },
    isOpen: {
      type: Boolean,
    },
    mode: {
      type: Number,
    },
    pmId: {
      type: Number,
    },
    memberList: {
      type: Array,
    },
  },
  data() {
    return {
      inviteListUser: [],
      memberInfoNum: 1,
      selectedUsers: [null],
      name: '',
      loading: false,
      error: [false],
    };
  },
  computed: {
    ...mapGetters({
      createResult: appGetters.GET_CREATE_RESULT,
      userNotMember: userGetters.GET_USER_NOT_MEMBER,
      currentProject: projectGetters.GET_PROJECT,
    }),
    isError() {
      return this.error.includes(true);
    },
  },
  watch: {
    selectedUsers(val) {
      if (!val.length) {
        this.selectedUsers = [null];
        this.error = [false];
      }
    },
    isOpen(val) {
      if (!val) {
        this.error = [false];
      }
    },
    pmId() {
      if (this.mode === 1) this.inviteListUser = this.userNotMember;
      else if (this.mode === 0) this.filterInviteListUser();
    },
    memberList() {
      if (this.mode === 0) {
        this.filterInviteListUser();
        this.refetchProjectList();
      }
    },
  },
  methods: {
    ...mapMutations({
      setSnackBar: mutationType.SET_SNACKBAR,
      listProject: projectActions.ACT_SEARCH_PROJECTS,
    }),
    validate() {
      this.resetError();
      const idArr = this.selectedUsers.map((user) => user.user_id);
      for (let i = 0; i < idArr.length; i++) {
        const idx = idArr.lastIndexOf(idArr[i]);
        if (idx !== -1 && idx !== i) {
          this.error[idx] = true;
          break;
        }
      }
    },
    resetError() {
      this.error.fill(false);
    },
    normalizeString(str) {
      return str
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/Đ/g, 'D')
        .toLowerCase();
    },
    filterName(item, query) {
      const value = this.normalizeString(item.name && item.email).includes(
        this.normalizeString(query)
      );
      return value;
    },
    ...mapActions({
      fetchAddMembers: projectMemberActions.ACT_FETCH_ADD_MEMBERS,
      getProject: actionTypes.ACT_GET_PROJECT_BY_ID,
      fetchGetUserNotMember: userActions.ACT_FETCH_GET_USER_NOT_MEMBER,
      getMember: actionTypes.ACT_FETCH_GET_ALL_MEMBERS,
    }),
    addRow() {
      // this.selectedUsers[this.memberInfoNum] = null;
      // this.memberInfoNum++;
      this.selectedUsers.push(null);
      this.error.push(false);
      this.resetError();
    },
    deleteMember(index) {
      this.selectedUsers.splice(index, 1);
      this.resetError();
      this.validate();
    },
    async addMembers() {
      if (this.mode === 1) {
        await this.updateMembers();
        await this.fetchGetUserNotMember({
          projectIds: [this.$route.params.id || this.project.project_id],
        });
        this.inviteListUser = this.userNotMember;
        await socket.updateUserList();
      } else if (this.mode === 0) {
        this.$emit('closePopup', 'load');
        this.$emit(
          'selectedUsers',
          JSON.parse(JSON.stringify(this.selectedUsers))
        );
        this.selectedUsers = [null];
        this.memberInfoNum = 1;
      }
    },
    arraysEqual(array1, array2) {
      return array1.filter((object1) => {
        return !array2?.some((object2) => {
          return object1.user_id === object2.user_id;
        });
      });
    },
    async updateMembers() {
      const data = await this.getProject({ id: this.project.project_id });
      if (data.mess === "This project doesn't exist!") {
        this.$router.push({ name: 'project-list' });
        this.closePopup();
        return;
      }
      const checkListAddMember = this.arraysEqual(
        this.selectedUsers,
        data?.users
      );

      const res = await getPMProject();
      const isPM = res.data?.projects.some(
        (item) => item.project_id === this.project.project_id
      );
      const response = await getWithSystemRole();
      const isAdmin = response.data.system_role.name === ROLE.ADMIN;

      if (!data) {
        this.setSnackBar({
          type: 'error',
          visible: true,
          text: MESSAGE.PROJECT_NOT_EXISTED,
        });
        this.closePopup();
        return;
      }

      if (!isPM && !isAdmin) {
        if (data.mess === "This project doesn't exist!") {
          this.setSnackBar({
            type: 'error',
            visible: true,
            text: data.mess,
          });
          this.closePopup();
          setTimeout(() => {
            this.$router.history.current.path.includes('project-detail')
              ? this.$router.push({ name: 'project-list' })
              : this.refetchProjectList();
          }, 200);
          return;
        } else {
          this.setSnackBar({
            type: 'warning',
            visible: true,
            text: MESSAGE.NOT_PM_IN_PROJECT,
          });

          this.closePopup();
          setTimeout(() => {
            // this.$router.push({ name: 'project-list' });

            this.$router.history.current.path.includes('project-detail')
              ? this.$router.go(-1)
              : this.$router.go();
          }, 1000);
          return;
        }
      }

      if (checkListAddMember.length > 0) {
        let memberInfos = this.arraysEqual(this.selectedUsers, data.users).map(
          (user) => {
            if (user) {
              return {
                userId: user.user_id,
                roleId: utils_role.MEMBER,
                email: user.email,
              };
            }
          }
        );
        this.loading = true;
        const { type, text } = await this.fetchAddMembers({
          memberInfos: memberInfos,
          projectId: this.project.project_id,
        });
        this.setSnackBar({
          type,
          visible: true,
          text,
        });
        this.loading = false;
        if (this.createResult) {
          this.$emit('closePopup', 'load');
        } else {
          this.$emit('closePopup', 'unload');
        }
        this.selectedUsers = [null];
        this.memberInfoNum = 1;
        await this.getProject({ id: this.project.project_id });
      } else {
        this.setSnackBar({
          type: 'warning',
          visible: true,
          text: MESSAGE.MENBER_ALREADY_EXITSTS,
        });
        this.selectedUsers = [null];
        if (this.createResult) {
          this.$emit('closePopup', 'load');
        } else {
          this.$emit('closePopup', 'unload');
        }
      }
    },
    closePopup() {
      this.$emit('closePopup');
      this.selectedUsers = [null];
      this.memberInfoNum = 1;
    },
    filterInviteListUser() {
      const differentUser = this.userNotMember.filter((user) => {
        if (
          this.memberList.every((item) => item.user_id !== user.user_id) &&
          user.user_id !== this.pmId
        )
          return user;
      });
      this.inviteListUser = differentUser;
    },
    refetchProjectList() {
      this.listProject({
        keyword: this.keySearch,
        currentPage: this.currentPage,
        pageSize: this.pageSize,
      });
    },
  },
  created() {
    if (this.mode === 1) {
      this.inviteListUser = this.userNotMember;
    } else if (this.mode === 0) {
      this.filterInviteListUser();
    }
  },
};
</script>
<style scoped>
.invite-block-wrapper .invite-block .note {
  display: flex;
  justify-content: center;
}
.note .note-name {
  word-break: normal !important;
  white-space: nowrap !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
  max-width: 150px;
  margin: 0 3px;
}

.v-select__selections {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.v-select__selections span {
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
