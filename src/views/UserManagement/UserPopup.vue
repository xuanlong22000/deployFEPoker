<template>
  <div class="wrapper">
    <div class="avatar-wrapper">
      <v-avatar class="avatar" min-width="35" width="35" height="35">
        <span
          v-if="
            user.avatar ===
              'https://res.cloudinary.com/dvnchwzbe/image/upload/v1647422427/napa planning poker/avatar-account_v4r9ti.png' ||
            !user.avatar
          "
        >
          {{ user.name.split('')[0].toUpperCase() }}
        </span>
        <img v-else :src="user.avatar" alt="Trulli" width="900" height="889" />
      </v-avatar>
      <div class="name">{{ user.name }}</div>
    </div>
    <div class="info-wrapper" ref="infoWrapper">
      <div class="information">
        <div class="item created">
          {{ user.create_date.split('T')[0].split('-').reverse().join('/') }}
        </div>
        <div class="item email">{{ user.email }}</div>
      </div>
      <div
        class="project-list"
        v-for="project in projects"
        :key="project.project_id"
      >
        <div v-if="project.project_name" class="project-name-wrapper">
          <div class="item project project-name">
            {{ project.project_name }}
          </div>
        </div>
        <div v-else class="item project project-name">
          <div>None</div>
        </div>
        <div class="item-select role" :class="{ 'disable-select': !isAdmin }">
          <select
            v-model="project.project_member.role_id"
            @change="ChangeDataProject(project, project.project_member.role_id)"
            :disabled="!isAdmin"
            :class="{ 'set-color-disable': !isAdmin }"
          >
            <option value="2" :selected="project.project_member.role_id === 2">
              Member
            </option>
            <option value="1" :selected="project.project_member.role_id === 1">
              Project Manager
            </option>
          </select>
          <v-icon class="select-icon">fa-solid fa-chevron-down</v-icon>
        </div>
      </div>
    </div>
    <div class="action">
      <button class="cus-btn-cancel" @click="$emit('closeModal')">
        Cancel
      </button>
      <button
        :disabled="!isAdmin"
        class="cus-btn-secondary"
        @click="submitChangeRole"
      >
        Accept
      </button>
    </div>
    <div class="close-btn" @click="$emit('closeModal')">
      <div>+</div>
    </div>
  </div>
</template>

<script>
// import { getJoinedProject } from '@/api/api_user.js';
import socket from '@/socket/socket';
import { mapActions, mapGetters, mapMutations } from 'vuex';
import mutationType from '@/store/app/mutation_types';
import userGetters from '@/store/modules/user/getter_types';
import userActions from '@/store/modules/user/action_types';
import ROLE from '@/utils/utils_role';
import actionTypes from '@/store/modules/project/action_types';

export default {
  props: {
    user: Object,
    currentUserProject: Array,
    keySearch: String,
  },
  inject: ['refetchUserList'],
  data() {
    return {
      projects: [],
      isChangeRole: false,
      currentUserId: 0,
      role: ROLE,
      isPM: false,
      isAdmin: false,
      dataUpdateProject: {},
      ProjectId: '',
      currentPage: this.$route.query.page || 1,
      pageSize: this.$route.query.size || 10,
    };
  },
  computed: {
    ...mapGetters({
      currentUser: userGetters.GET_WITH_SYSTEM_ROLE,
    }),
  },
  methods: {
    ...mapActions({
      fetchChangeRole: userActions.ACT_CHANGE_ROLE,
      getUserWithSystemRole: userActions.ACT_FETCH_WITH_SYSTEM_ROLE,
      updateProject: actionTypes.ACT_UPDATE_PROJECT_BY_ID,
    }),
    ...mapMutations({
      setSnackBar: mutationType.SET_SNACKBAR,
    }),

    async submitChangeRole() {
      if (this.isChangeRole) {
        const data = this.dataUpdateProject;
        const isSuccess = await this.updateProject({
          id: this.ProjectId,
          data,
          isUpdateProjectNone: true,
          userId: this.user.user_id,
          isUpdate: 0,
        });
        if (isSuccess) {
          await this.fetchChangeRole({
            userId: this.user.user_id,
            data: this.projects,
            keySearch: this.keySearch,
            currentPage: this.currentPage,
            pageSize: this.pageSize,
          });
        }
        this.isChangeRole = false;
      }
      this.$emit('closeModal');
      await this.refetchUserList();
      socket.deleteProject();
    },
    canChangeRole(project) {
      const filterProject = this.currentUserProject.find((item) => {
        return item.project_id === project.project_id;
      });
      if (filterProject) {
        return (
          filterProject.project_id === project.project_member.project_id &&
          filterProject.role_id === 1
        );
      } else {
        return false;
      }
    },
    ChangeDataProject(project, role_id) {
      this.isChangeRole = true;
      this.dataUpdateProject = {
        project_name: project.project_name,
        start_date: project?.start_date,
        end_date: project?.end_date,
        user_id: role_id == 1 ? this.user.user_id : null,
      };
      this.ProjectId = project.project_id;
    },
  },
  async created() {
    await this.getUserWithSystemRole({ id: this.currentUserId });
    this.currentUserId = this.currentUser.user_id;
    this.projects = this.user.projects;
    this.isAdmin = this.currentUser.system_role_id === 1;
  },
};
</script>

<style scoped>
.v-dialog {
  border-radius: 15px !important;
}
.wrapper {
  position: relative;
  padding: 25px 30px;
  box-shadow: 0px 3px 6px #00000029;
  border-radius: 5px;
  background: #ffffff;
  box-sizing: border-box;
  overflow: visible;
}
.wrapper > * {
  box-sizing: border-box;
}
.avatar-wrapper {
  display: flex;
  align-items: center;
  gap: 7px;
}
.avatar {
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  box-shadow: 0px 3px 6px #3597e273;
}
.avatar img {
  object-fit: cover !important;
}
.info-wrapper {
  margin-top: 25px;
  padding: 6px 6px 6px 6px;
  max-height: 400px;
  overflow-y: auto;
}
.info-wrapper::-webkit-scrollbar-track {
  border-radius: 10px;
  background-color: #f5f5f5;
}

.info-wrapper::-webkit-scrollbar {
  width: 2px;
  background-color: #f5f5f5;
}

.info-wrapper::-webkit-scrollbar-thumb {
  border-radius: 10px;
  background-color: rgb(196, 193, 193);
}
.information {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr;
  gap: 20px;
  margin-top: 3px;
}
.project-list {
  margin-top: 26px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  row-gap: 26px;
}
.item,
.item-select {
  padding: 14px 12px;
  box-shadow: 0px 1px 6px #00000029;
  border-radius: 5px;
  position: relative;
  font-size: 14px;
  line-height: 17px;
  color: #8e8e8e;
  align-self: center;
  border: 1px solid transparent;
  position: relative;
  word-break: break-word;
}
.item::before,
.item::after {
  color: #000;
}
.item.project {
  position: static;
}
.project-name-wrapper {
  position: relative;
  font: normal normal normal 14px/17px Roboto;
}
.project-name-wrapper::after {
  content: 'Project';
  position: absolute;
  font-size: 12px;
  line-height: 14px;
  top: -6px;
  left: 6px;
  background: #ffffff;
  padding: 0 4px;
}
.project-name-wrapper:hover::after {
  color: #3597e2;
}
.item.project-name {
  display: inline-block;
  width: 100%;
  max-width: 304px;
  white-space: nowrap;
  overflow: hidden !important;
  text-overflow: ellipsis;
  height: 100%;
}
.item-select {
  padding: 0;
  width: 100%;
  height: 100%;
  --iconSize: 16px;
}
.item::after,
.item-select::after {
  font-size: 12px;
  line-height: 14px;
  position: absolute;
  top: -6px;
  left: 6px;
  background: #ffffff;
  padding: 0 4px;
}
.item::before,
.item-select::before {
  content: '*';
  position: absolute;
  top: -6px;
  left: 55px;
  background: #ffffff;
  padding: 0 4px;
}
.item-select::before {
  left: 35px;
}

.disable-select::before {
  z-index: 2;
  background: transparent;
}

.email::after {
  content: 'Email';
}
.email::before {
  left: 40px;
}
.role::after {
  content: 'Role';
}

.disable-select::after {
  z-index: 2;
  background: transparent;
}
.created::after {
  content: 'Created';
}
.project-name {
  text-overflow: ellipsis;
  white-space: nowrap;
  /* overflow: hidden; */
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
}
/* .project::after {
  content: 'Project';
}
.project::before {
  left: 48px;
} */
.set-color-disable {
  background: #f0f0f0;
}

.disable-select select {
  background: #f0f0f0;
}
.disable-select {
  pointer-events: none;
}
.item:hover::after,
.item-select:hover::after {
  color: #3597e2;
}
.item:hover::before,
.item-select:hover::before {
  color: #f80d0d;
}
.item:hover,
.item-select:hover {
  border: 1px solid #3597e2;
}
select {
  width: 100%;
  height: 100%;
  padding: 14px 12px;
  outline: none;
  color: #000000;
  font: normal normal normal 14px/17px Roboto;
  position: absolute;
  z-index: 1;
}
.select-icon {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  right: 10px;
  font-size: var(--iconSize);
}
.action {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
  gap: 20px;
}
.btn {
  padding: 6px 10px;
  color: #ffffff;
  border-radius: 5px;
  font: normal normal normal 14px/17px Roboto;
}
.accept-btn {
  background: #7854c0;
  box-shadow: 0px 0px 5px #9c30afb5;
}

.accept-btn:disabled {
  background: #c0c0c0;
}

.cancel-btn {
  background: #eb907d;
  box-shadow: 0px 0px 5px #d48271;
}
@media screen and (max-width: 768px) {
  .wrapper {
    padding: 24px 10px;
  }
  .info-wrapper {
    margin-top: 15px;
  }
  .information {
    grid-template-columns: 1fr;
    gap: 10px;
    margin-top: 4px;
  }
  .name {
    font-size: 14px;
    line-height: 16px;
    max-width: 90%;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .project-list {
    margin-top: 15px;
  }
  .item,
  .item-select {
    font-size: 10px;
    line-height: 12px;
  }
  .item::after,
  .item-select::after {
    font-size: 10px;
    line-height: 12px;
  }
  .item.project-name {
    max-width: 146px;
  }
  select {
    font: normal normal normal 10px/12px Roboto;
  }
  .btn {
    font: normal normal normal 10x/12px Roboto;
  }
  .close-btn {
    font: normal normal normal 16px/20px Roboto;
  }
}
</style>
