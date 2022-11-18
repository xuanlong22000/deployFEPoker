<template>
  <div class="invite-block">
    <div class="invite-header text-center">
      <v-icon size="26" color="black">fas fa-user-plus</v-icon>
      <span class="invite-title">Add new members</span>
      <span class="note">Add new members to your project</span>
    </div>
    <div class="members-info-block">
      <v-autocomplete
        class="search-fill mb-3"
        prepend-inner-icon="mdi-magnify"
        v-model="selectedProject"
        :items="listProject"
        dense
        filled
        solo
        :filter="filterProjectName"
        @change="onChange()"
        hide-details
        label="Search project"
        item-text="name"
        return-object
      >
        <template v-slot:selection="data">
          <span class="members-name-block">{{ data.item.project_name }}</span>
        </template>
        <template v-slot:item="data">
          <template>
            <v-list-item-content>
              <v-list-item-title
                v-html="data.item.project_name"
              ></v-list-item-title>
            </v-list-item-content>
          </template>
        </template>
      </v-autocomplete>

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
            :items="listUserNotMember"
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
              <span>{{ data.item.name }}</span>
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
              <v-icon>mdi-close-box-outline</v-icon>
            </v-btn>
          </template>
          <span>Delete</span>
        </v-tooltip>
      </div>
      <div v-if="error.includes(true)" class="error-message">
        Duplicate field names are not allowed
      </div>
    </div>
    <div class="btn-block d-flex justify-space-between">
      <v-btn class="add-member" text @click="addRow">Add new member +</v-btn>
      <v-btn
        class="cus-btn-secondary"
        @click="addMembers"
        :loading="loading"
        :disabled="
          selectedUsers.length === 0 ||
          this.selectedUsers.some((user) => user === null) ||
          selectedProject === null ||
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
import userActions from '@/store/modules/user/action_types';
import userGetters from '@/store/modules/user/getter_types';
import appGetters from '@/store/app/getter_types';
import { mapActions, mapGetters, mapMutations } from 'vuex';
import utils_role from '@/utils/utils_role';
import projectMemberActions from '@/store/modules/project_member/action_types';
import { getPMProject, getWithSystemRole } from '@/api/api_user.js';
import { getAll } from '@/api/api_project.js';
import ROLE from '@/utils/utils_role';
import actionTypes from '@/store/modules/project/action_types';
import MESSAGE from '@/utils/utils_message';
import mutationType from '@/store/app/mutation_types';
import socket from '@/socket/socket';

export default {
  name: 'invite-popup',
  data() {
    return {
      memberInfoNum: 1,
      memberInfos: [],
      name: '',
      loading: false,
      selectedUsers: [null],
      listProject: [],
      selectedProject: null,
      error: [false],
    };
  },

  computed: {
    ...mapGetters({
      userNotMember: userGetters.GET_USER_NOT_MEMBER,
    }),
    listUserNotMember() {
      const arrUserNotMember = this.memberInfos.filter(
        (f) => f.system_role_id !== 1 && f.active
      );
      return arrUserNotMember;
    },
  },

  methods: {
    ...mapMutations({
      setSnackBar: mutationType.SET_SNACKBAR,
    }),
    ...mapActions({
      getUserNotMember: userActions.ACT_FETCH_GET_USER_NOT_MEMBER,
      createResult: appGetters.GET_CREATE_RESULT,
      fetchAddMembers: projectMemberActions.ACT_FETCH_ADD_MEMBERS,
      getUserList: userActions.ACT_GET_ALL,
      getProject: actionTypes.ACT_GET_PROJECT_BY_ID,
    }),

    validate() {
      this.resetError();
      const idArr = this.selectedUsers.map((user) => user.user_id);
      for (let i = 0; i < idArr.length; i++) {
        const idx = idArr.lastIndexOf(idArr[i]);
        if (idx !== -1 && idx !== i) {
          this.error[idx] = true;
          this.error[i] = true;
          break;
        }
      }
    },
    onChange() {
      this.selectedUsers = [null];
    },
    resetError() {
      this.error.fill(false);
    },

    addNewMember() {
      this.memberInfoNum++;
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
    filterProjectName(item, query) {
      const value = this.normalizeString(item.project_name).includes(
        this.normalizeString(query)
      );
      return value;
    },

    async addMembers() {
      try {
        const data = await this.getProject({
          id: this.selectedProject?.project_id,
        });
        const res = await getPMProject();
        const checkAddMember = data?.users.some(
          (item) => item.user_id === this.selectedUsers[0].user_id
        );

        const isPM = res.data.projects.some(
          (item) => item.project_id == this.projectId
        );
        const response = await getWithSystemRole();
        const isAdmin = response.data.system_role.name === ROLE.ADMIN;

        if (!checkAddMember) {
          let memberInfos = this.selectedUsers.map((user) => {
            if (user) {
              return {
                userId: user.user_id,
                roleId: utils_role.MEMBER,
                email: user.email,
              };
            }
          });
          this.loading = true;
          const { type, text } = await this.fetchAddMembers({
            memberInfos: memberInfos,
            projectId: this.selectedProject?.project_id,
          });
          this.setSnackBar({
            type,
            visible: true,
            text,
          });
          this.loading = false;
          if (this.createResult) {
            this.$emit('closePopup', 'unload');
            await this.$root.$emit('refetchUserList');
          } else {
            this.$emit('closePopup', 'unload');
          }
          this.selectedUsers = [null];
          this.memberInfoNum = 1;
          await this.getProject({ id: this.selectedProject?.project_id });
          this.selectedProject = null;
          await socket.updateUserList();
        } else if (!isPM && !isAdmin) {
          this.setSnackBar({
            type: 'warning',
            visible: true,
            text: MESSAGE.NOT_PM_IN_PROJECT,
          });
          this.$emit('closePopup', 'unload');
        } else {
          this.setSnackBar({
            type: 'warning',
            visible: true,
            text: MESSAGE.MENBER_ALREADY_EXITSTS,
          });
          if (this.createResult) {
            this.$emit('closePopup', 'load');
          } else {
            this.$emit('closePopup', 'unload');
          }
        }
      } catch (error) {
        this.$emit('closePopup', 'unload');
        console.log(error);
      }
    },
    addRow() {
      // this.selectedUsers[this.memberInfoNum] = null;
      // this.memberInfoNum++;
      this.selectedUsers.push(null);
    },
    deleteMember(index) {
      this.selectedUsers.splice(index, 1);
      this.validate();
    },
    closePopup() {
      this.$emit('closePopup');
      this.selectedUsers = [null];
      this.selectedProject = null;
      this.error = [false];
    },
    async fetchMemberToAdd() {
      const res = await getWithSystemRole();
      const isAdmin = res.data.system_role.name === ROLE.ADMIN;
      if (isAdmin) {
        const res = await getAll(1, 100);
        this.listProject = res.data.projects.projects;
      } else {
        const { data } = await getPMProject();
        const findByProjects = data.projects.map((e) => +e?.project_id);
        await this.getUserNotMember({ projectIds: findByProjects });
        this.memberInfos = this.userNotMember;
        this.isAdmin = res.data.system_role.name === ROLE.ADMIN;
        this.listProject = data.projects;
      }
    },
  },

  created() {
    this.fetchMemberToAdd();
  },

  watch: {
    async selectedProject(newVal) {
      await this.getUserNotMember({ projectIds: [newVal?.project_id] });
      this.memberInfos = this.userNotMember;
    },
  },
};
</script>

<style scoped>
.members-name-block {
  overflow: hidden !important;
  text-overflow: ellipsis !important;
}
</style>
