<template>
  <div class="project-form" v-if="project && users">
    <form @submit.prevent="handleSubmit">
      <div class="project-form-block">
        <div class="project-form-group">
          <label class="project-form-label" for="">
            Project Name
            <span>*</span>
          </label>
          <input
            type="text"
            ref="projectName"
            v-model="project.project_name"
            :class="{ _error: error.project_name }"
            class="project-form-control"
          />
        </div>
        <div class="project-form-group">
          <label class="project-form-label">
            Project Manager
            <span>*</span>
          </label>
          <v-autocomplete
            solo
            flat
            background-color="transparent"
            class="project-form-control"
            id="pm-select"
            v-model="userId"
            height="45"
            placeholder="Select or search a person..."
            :items="selectUsers"
            item-text="name"
            item-value="user_id"
            :filter="filterName"
            :class="{ _error: error.pm }"
            :disabled="user.system_role.name !== role.ADMIN"
            :style="
              user.system_role.name !== role.ADMIN
                ? 'background: #f0f0f0 !important;'
                : ''
            "
            style="white-space: nowrap; padding: 0px; margin: 0px"
          >
            <template v-slot:selection="data">
              <span>{{ data.item.name }}</span>
            </template>
            <template v-slot:item="data">
              <template>
                <v-list-item-content style="width: 200px">
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
        <div v-if="errorMessage.project_name" class="project-form-group-error">
          {{ errorMessage.project_name }}
        </div>
        <div v-if="errorMessage.project_name"></div>
        <div class="project-form-group">
          <label class="project-form-label">
            Start Date
            <span>*</span>
          </label>
          <input
            class="project-form-control"
            type="date"
            autocomplete="off"
            ref="startDate"
            :value="project.start_date ? project.start_date.split('T')[0] : ''"
            @input="handleProject"
            format-value="yyyy-MM-dd"
            :class="{ _error: error.start_date }"
          />
          <img
            class="icon-calendar"
            src="@/assets/images/calendar-solid.svg"
            alt=""
          />
        </div>
        <div class="project-form-group">
          <label class="project-form-label">End Date</label>
          <input
            class="project-form-control"
            type="date"
            autocomplete="off"
            ref="endDate"
            :value="
              project.end_date
                ? project.end_date !== '9999-12-30T17:00:00.000Z'
                  ? project.end_date.split('T')[0]
                  : ''
                : ''
            "
            @input="handleProject"
          />
          <img
            class="icon-calendar"
            src="@/assets/images/calendar-solid.svg"
            alt=""
          />
        </div>
        <div class="project-form-group project-form-group-member">
          <label class="project-form-label">Project Images</label>
          <label class="project-form-input-image">
            <div class="project-form-upload">
              <div class="project-form-upload-name" v-if="this.nameAvatar">
                {{ this.nameAvatar === '' ? 'Choose file' : this.nameAvatar }}
              </div>
              <div class="project-form-upload-name" v-else>
                {{ project.name_avatar ? project.name_avatar : 'Choose file' }}
              </div>
              <v-icon class="pb-4" size="14" color="#000000">
                fa-regular fa-upload
              </v-icon>
            </div>
            <input
              class="project-form-input"
              type="file"
              accept="image/*"
              v-on:change="handleChangeAvatar"
              hidden
            />
          </label>
        </div>
        <div class="project-form-group project-form-group-member">
          <label class="project-form-label">Team</label>
          <div class="project-form-member-list">
            <v-tooltip bottom>
              <template v-slot:activator="{ on: tooltip }">
                <v-btn
                  @click="openInvitePopup"
                  type="button"
                  class="project-form-add-member-btn"
                  color="white"
                  dark
                  v-on="{ ...tooltip }"
                >
                  <i class="fa fa-plus" aria-hidden="true"></i>
                </v-btn>
              </template>
              <span>Add new members</span>
            </v-tooltip>

            <v-tooltip bottom v-for="(value, index) in listMember" :key="index">
              <template v-slot:activator="{ on: tooltip }">
                <div class="project-form-member-item" v-on="{ ...tooltip }">
                  <div
                    v-if="value.user_id !== user.user_id"
                    class="project-form-delete-member"
                    @click="handleDeleteMember(value)"
                  >
                    <v-icon size="8px" dark color="#FFFFFF" class="delete-icon">
                      mdi-window-close
                    </v-icon>
                  </div>
                  <img
                    v-if="
                      value.avatar !==
                      'https://res.cloudinary.com/dvnchwzbe/image/upload/v1647422427/napa%20planning%20poker/avatar-account_v4r9ti.png'
                    "
                    :src="value.avatar"
                    :title="value.name"
                  />
                  <div
                    v-else
                    class="project-form-member-avatar"
                    :title="value.name"
                  >
                    {{
                      value.name.toUpperCase().split(' ')[
                        value.name.split(' ').length - 1
                      ][0]
                    }}
                  </div>
                </div>
              </template>
              <span>{{ value.name }}</span>
            </v-tooltip>
          </div>
        </div>
      </div>

      <!-- <div class="project-form-block">


      </div> -->

      <div class="button-block">
        <button
          type="button"
          class="cus-btn-cancel margin-right-btn-15 fixed-112-width-btn"
          @click="$router.push({ name: 'project-list' })"
        >
          Cancel
        </button>

        <button
          type="submit"
          class="cus-btn-primary fixed-112-width-btn"
          v-if="mode === 0"
        >
          Create
        </button>
        <button
          type="submit"
          class="cus-btn-primary fixed-112-width-btn"
          v-if="mode === 1"
        >
          Save Project
        </button>
      </div>
    </form>
    <loader-overlay v-if="loaded"></loader-overlay>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from 'vuex';
import actionTypes from '@/store/modules/project/action_types';
import userActions from '@/store/modules/user/action_types';
import userGetter from '@/store/modules/user/getter_types';
import projectGetter from '@/store/modules/project/getter_types';
import projectMutation from '@/store/modules/project/mutation_types';
import localStorageUtils from '@/utils/utils_local_storage';
import jwtDecode from 'jwt-decode';
import userGetters from '@/store/modules/user/getter_types';
import ROLE from '@/utils/utils_role.js';
import mutationType from '@/store/app/mutation_types';
import MESSAGE from '@/utils/utils_message';
import utils_role from '@/utils/utils_role';
import { getPMProject, getWithSystemRole } from '@/api/api_user.js';
import projectMemberActions from '@/store/modules/project_member/action_types';
import { deleteMember, checkCanDelete } from '@/api/api_project_member.js';
import { uploadAvatar } from '@/api/api_cloudinary.js';
import projectActions from '@/store/modules/project/action_types';
import LoaderOverlay from '../../components/LoaderOverlay.vue';
import socket from '@/socket/socket';

export default {
  name: 'project-form',
  props: {
    mode: {
      type: Number,
    },
    projectId: {
      type: Number,
    },
    memberList: Array,
  },
  components: { LoaderOverlay },
  data() {
    return {
      initUserId: null,
      userId: null,
      error: {
        project_name: false,
        start_date: false,
        pm: false,
      },
      errorMessage: {
        project_name: '',
      },
      isError: false,
      currentUserId: null,
      selectUsers: [],
      role: ROLE,
      listMember: [],
      deleteMemberList: [],
      nameAvatar: '',
      checkGame: false,
      loaded: false,
    };
  },
  computed: {
    ...mapGetters({
      project: projectGetter.GET_PROJECT,
      users: userGetter.GET_LIST_USERS,
      user: userGetters.GET_WITH_SYSTEM_ROLE,
    }),
  },
  watch: {
    memberList() {
      this.listMember = this.memberList.filter(
        (item) => item.system_role_id !== 1
      );
    },
    userId(_, oldUserId) {
      const user = this.selectUsers.find((item) => item.user_id === oldUserId);
      this.$emit('setPmId', this.userId, user);
    },
  },
  methods: {
    ...mapActions({
      getProject: actionTypes.ACT_GET_PROJECT_BY_ID,
      getListUsers: userActions.ACT_GET_ALL,
      createProject: actionTypes.ACT_CREATE,
      updateProject: actionTypes.ACT_UPDATE_PROJECT_BY_ID,
      getUserWithSystemRole: userActions.ACT_FETCH_WITH_SYSTEM_ROLE,
      fetchAddMembers: projectMemberActions.ACT_FETCH_ADD_MEMBERS,
      getMember: actionTypes.ACT_FETCH_GET_ALL_MEMBERS,
      getProjectDetail: projectActions.ACT_GET_DETAIL_BY_ID,
      checkGamePlaying: projectActions.ACT_CHECK_PLAYING,
    }),
    ...mapMutations({
      setInitialProject: projectMutation.SET_INITIAL_PROJECT,
      setSnackBar: mutationType.SET_SNACKBAR,
    }),
    async handleChangeAvatar(e) {
      const check = e.target.files[0].type;
      const sizeImage = e.target.files[0].size / (1024 * 1024);
      if (sizeImage >= 3) {
        this.setSnackBar({
          type: 'error',
          visible: true,
          text: MESSAGE.IMAGE_TOO_LARGE,
        });
      } else if (
        check === 'image/jpg' ||
        check === 'image/png' ||
        check === 'image/jpeg' ||
        check === 'image/gif' ||
        check === 'image/svg'
      ) {
        this.loaded = true;
        const { data } = await uploadAvatar(e.target.files[0]);
        this.nameAvatar = e.target.files[0].name;
        this.project.project_avatar = data.url;
        this.$emit('changeAvatar', { project_avatar: data.url });
        this.loaded = false;
      } else {
        this.setSnackBar({
          type: 'error',
          visible: true,
          text: MESSAGE.IMAGE_TYPE_ERROR,
        });
      }
    },
    validate() {
      this.isError = false;
      this.error.project_name =
        !this.project.project_name ||
        this.project.project_name.length > 100 ||
        this.project.project_name.split('').every((item) => item === ' ');
      if (this.project.project_name.length > 100) {
        this.errorMessage.project_name =
          'Project name must be less than or equal 100 characters';
      }
      this.error.start_date = !this.project.start_date;
      if (this.project.end_date) {
        const start = new Date(this.project.start_date);
        const end = new Date(this.project.end_date);
        this.error.start_date = start > end;
      }
      if (this.$refs.startDate.value === '') this.error.start_date = true;
      if (this.mode === 0) {
        this.error.pm = this.userId === -1 || !this.userId;
      }
      for (let prop in this.error) {
        if (this.error[prop]) {
          this.isError |= this.error[prop];
        }
      }
    },
    handleProject() {
      this.project.pm = this.userId;
      this.project.start_date = this.$refs.startDate.value;
      this.project.end_date = this.$refs.endDate.value;
    },
    async handleSubmit() {
      const res = await getPMProject();
      this.validate();
      const data = {
        project_name: this.project.project_name,
        start_date: this.project.start_date,
        end_date: this.project.end_date !== '' ? this.project.end_date : '',
        user_id: this.userId,
        name_avatar: this.nameAvatar || this.name_avatar,
        project_avatar: this.project.project_avatar,
      };
      if (!this.isError) {
        if (this.mode === 0) {
          const newProject = await this.createProject(data);
          if (this.memberList.length > 0) {
            await this.updateMembers(newProject.project_id);
          }
          socket.createProject();

          this.$router.push({ name: 'project-list' });
        } else {
          if (!this.project.del_flg) {
            if (this.project.mess === "This project doesn't exist!") {
              this.$router.push('/project');
            }
            const updateData = {
              id: this.projectId,
              data,
              isUpdate: 1,
              userId: this.userId,
            };

            const isPM = res.data.projects.some(
              (item) => item.project_id == this.projectId
            );
            const response = await getWithSystemRole();
            const isAdmin = response.data.system_role.name === ROLE.ADMIN;

            if (!isPM && !isAdmin) {
              this.setSnackBar({
                type: 'warning',
                visible: true,
                text: MESSAGE.NOT_PM_IN_PROJECT,
              });
              this.$router.go(-1);
              return;
            }
            await this.updateProject(updateData);
            await socket.updateUserList();
            await socket.onCheckUpdateNameBacklogList(1);
            if (this.deleteMemberList.length) {
              if (this.initUserId !== this.userId) {
                this.deleteMemberList = this.deleteMemberList.filter(
                  (item) => item !== this.userId
                );
              }
              await deleteMember(this.deleteMemberList, this.projectId);
            }
          } else if (this.project.mess === "This project doesn't exist!") {
            this.$router.push('/project');
          } else {
            this.setSnackBar({
              type: 'warning',
              visible: true,
              text: MESSAGE.PM_DELETE_PROJECT,
            });
            await this.$router.push({ name: 'project-list' }).catch(() => {});
          }
        }
      }
    },
    openInvitePopup() {
      this.$emit('openInvitePopup');
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
      return this.normalizeString(item.name && item.email).includes(
        this.normalizeString(query)
      );
    },
    async updateMembers(projectId) {
      const data = await this.getProject({ id: projectId });
      const checkAddMember = data.users.some(
        (item) => item.user_id === this.memberList[0].user_id
      );

      const res = await getPMProject();
      const isPM = res.data.projects.some(
        (item) => item.project_id === projectId
      );
      const response = await getWithSystemRole();
      const isAdmin = response.data.system_role.name === ROLE.ADMIN;

      if (!isPM && !isAdmin) {
        this.setSnackBar({
          type: 'warning',
          visible: true,
          text: MESSAGE.NOT_PM_IN_PROJECT,
        });
        this.$router.go(-1);
        return;
      }

      if (!checkAddMember) {
        let memberInfos = this.memberList.map((user) => {
          if (user) {
            return {
              userId: user.user_id,
              roleId: utils_role.MEMBER,
              email: user.email,
            };
          }
        });
        await this.fetchAddMembers({
          memberInfos: memberInfos,
          projectId: projectId,
        });
        await this.getProject({ id: projectId });
      } else {
        this.setSnackBar({
          type: 'warning',
          visible: true,
          text: MESSAGE.MENBER_ALREADY_EXITSTS,
        });
      }
    },
    async handleDeleteMember(item) {
      const res = await getPMProject();
      try {
        const decodedToken = jwtDecode(
          localStorageUtils.getService().getToken()
        );
        await this.getUserWithSystemRole({ id: decodedToken.userId }).then(
          (res) => {
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
          }
        );
      } catch (error) {
        console.log('error in ProjectForm', error);
      }
      if (this.mode === 1) {
        try {
          const result = await checkCanDelete({
            projectId: this.projectId,
            userId: item.user_id,
            email: item.email,
          });
          if (result) {
            this.listMember = this.listMember.filter(
              (member) => member.user_id !== item.user_id
            );
            this.deleteMemberList = [...this.deleteMemberList, item.user_id];
          } else {
            const isPM = res.data.projects.some(
              (item) => item.project_id === this.projectId
            );
            const response = await getWithSystemRole();
            const isAdmin = response.data.system_role.name === ROLE.ADMIN;

            if (!isPM && !isAdmin) {
              this.setSnackBar({
                type: 'warning',
                visible: true,
                text: MESSAGE.NOT_PM_IN_PROJECT,
              });
              this.$router.go(-1);
              return;
            }
          }
        } catch (error) {
          if (error.response.statusText === "This project doesn't exist!") {
            this.setSnackBar({
              type: 'error',
              visible: true,
              text: error.response.statusText,
            });
            this.$router.push({ name: 'project-list' });
          }
        }
      } else if (this.mode === 0) {
        this.$emit('handleRemoveSelectedUser', item);
      }
    },
  },
  async created() {
    const decodedToken = jwtDecode(localStorageUtils.getService().getToken());
    this.currentUserId = decodedToken.userId;
    this.listMember = this.memberList.filter(
      (item) => item.system_role_id !== 1
    );
    await this.getUserWithSystemRole({ id: this.currentUserId });
    if (this.mode === 1) {
      await this.getProject({ id: this.projectId });
      this.userId = this.project?.pm?.user_id ? this.project.pm.user_id : -1;
      this.initUserId = this.project?.pm?.user_id
        ? this.project.pm.user_id
        : -1;
    } else {
      this.setInitialProject();
    }
    await this.getListUsers();
    this.selectUsers = this.users.filter((user) => user.system_role_id !== 1);
  },
};
</script>

<style scoped>
.v-list-item__title {
  font-size: 14px;
}

.v-autocomplete__content::-webkit-scrollbar {
  width: 10px;
}
.v-input__slot {
  margin: 0;
}
.v-input__slot::before,
.v-input__slot::after {
  border-style: none !important;
}

.v-select__selections #pm-select {
  min-width: unset !important;
}
.v-select__selections input {
  min-width: 0px !important;
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
._error {
  border: 1px solid #e94747 !important;
  box-shadow: 0px 0px 5px #e94747 !important;
}
.project-form {
  background-color: #f4f6fa;
}
.project-form form {
  display: inline-block;
  border-radius: 8px;
  max-width: 570px;
  max-height: 100%;
  padding-left: 0;
}

/* .project-form-group-member {
  margin-top: 25px;
} */

.project-form-block {
  display: grid;
  grid-template-columns: 250px 250px;
  column-gap: 70px;
  row-gap: 35px;
}

.project-form-group {
}

.project-form-label {
  display: block;
  font: normal normal normal 14px/17px Roboto;
  /* color: #000000; */
  margin-bottom: 12px;
}

.project-form-label span {
  color: #f7284a;
}

.project-form-control {
  width: 250px;
  height: 45px;
  padding: 0 15px;

  background: #ffffff 0% 0% no-repeat padding-box;
  color: #000000;
  font: normal normal normal 14px/20px Roboto;

  box-shadow: 0px 3px 6px #00000029;
  border-radius: 5px;
}

.project-form-control[type='date'] {
  padding-right: 12px;
}

.v-autocomplete.v-select.v-input--is-focused input {
  min-width: 1px !important;
}

.project-form-icon {
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(50%);

  color: #000000;
  font-size: 15px;

  cursor: pointer;
}

.project-form-control:focus {
  outline: none;
}

.project-form-group {
  position: relative;
}

.project-form-group-error {
  margin-top: -20px;
  font-size: 12px;
  color: red;
}

.project-form-member-list {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  padding-left: 0;
  list-style: none;
}

.project-form-member-item {
  height: 40px;
  width: 40px;
  background-color: #ffffff;
  border-radius: 50%;
  box-shadow: 0px 3px 6px #3597e26e;
  margin: 0 10px 10px 0;
  position: relative;
  cursor: pointer;
}

.project-form-delete-member {
  display: none;
  position: absolute;
  top: -4px;
  right: -2px;
  z-index: 2;
  line-height: 8px;
  border-radius: 50%;
  background: #8e8e8e 0% 0% no-repeat padding-box;
  box-shadow: 0px 3px 6px #00000029;
  border: 1px solid #ffffff;
  cursor: pointer;
  width: 15px;
  height: 15px;
}

.project-form-member-item:hover .project-form-delete-member {
  display: flex;
  align-items: center;
  justify-content: center;
}

.project-form-delete-member:hover {
  background: #f80d0d 0% 0% no-repeat padding-box;
  box-shadow: 0px 3px 6px #00000029;
  border: 1px solid #ffffff;
}
.project-form-member-item:hover {
  border-radius: 50%;
  background: #8e8e8e80 0% 0% no-repeat padding-box;
  opacity: 0.85;
}

.project-form-member-item img {
  height: 40px;
  width: 40px;
  border-radius: 50%;
}

.project-form-member-item .project-form-member-avatar {
  text-align: center;
  line-height: 40px;
  font-weight: bold;
}

.project-form-add-member-btn {
  height: 40px !important;
  width: 40px !important;
  min-width: unset !important;
  background-color: #ffffff;
  border-radius: 50%;
  box-shadow: 0px 3px 6px #3597e26e;
  font-weight: bold;
  margin: 0 10px 10px 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.project-form-add-member-btn i {
  font-size: 18px;
  color: #3597e2;
}

.project-form-upload {
  width: 100%;
  height: 45px;
  padding: 0 15px;

  background: #ffffff 0% 0% no-repeat padding-box;
  color: #000000;
  font: normal normal normal 14px/20px Roboto;

  box-shadow: 0px 3px 6px #00000029;
  border-radius: 5px;

  display: flex;
  justify-content: space-between;
  padding-top: 12px;
  font-size: 14px !important;
  cursor: pointer;
}
.project-form-upload-name {
  width: 150px;
  overflow: hidden;
  text-overflow: ellipsis;
  padding-bottom: 12px;
  white-space: nowrap;
}

select {
  -webkit-appearance: none;
  -moz-appearance: none;
  background: transparent;
  background-image: url("data:image/svg+xml;utf8,<svg fill='black' height='24' viewBox='0 0 24 24' width='24' xmlns='http://www.w3.org/2000/svg'><path d='M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z'/><path d='M0 0h24v24H0z' fill='none'/></svg>");
  background-repeat: no-repeat;
  background-position-x: 99%;
  background-position-y: 12px;
  border: 1px solid #dfdfdf;
  border-radius: 2px;
  margin-right: 2rem;
  padding: 1rem;
  padding-right: 2rem;
}

.button-block {
  margin-top: 40px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
}

.button-block .btn-create,
.button-block .btn-cancel {
  border-radius: 5px;
  margin: 0px 15px;
  color: #ffffff;
  box-shadow: 0px 0px 5px #3597e2;
  font: normal normal bold 14px/17px Roboto;
  padding: 0 !important;
}

.cus-btn-primary,
.cus-btn-cancel {
  width: 143px !important;
  height: 43px !important;
}

.button-block .btn-create a,
.button-block .btn-cancel a {
  color: #ffffff;
  text-decoration: none;
}

.button-block .btn-create:hover,
.button-block .btn-cancel:hover {
  cursor: pointer;
}

.button-block .cus-btn-cancel {
  margin-right: 35px !important;
}

.error-label {
  text-align: left;
  color: red;
  font-size: 14px;
  margin-bottom: 12px;
}

@media screen and (max-width: 768px) {
  .project-form-upload {
    width: 90%;
  }
  .project-form-block {
    grid-template-columns: auto;
    row-gap: 35px;
  }

  .project-form form {
    display: block;
    max-width: 100%;
  }

  .project-form-control {
    width: 100%;
  }
  .project-form-upload {
    width: 100%;
  }
  .project-form-delete-member {
    background: #f80d0d 0% 0% no-repeat padding-box;
    box-shadow: 0px 3px 6px #00000029;
    border: 1px solid #ffffff;
  }
}

@media screen and (width: 768px) {
  .project-form form {
    display: block;
  }

  .project-form-block {
    grid-template-columns: auto auto;
  }

  .project-form-control {
    width: 100%;
  }
  .project-form-upload {
    width: 100%;
  }
}

.icon-calendar {
  display: none;
}

@media not all and (min-resolution: 0.001dpcm) {
  @supports (-webkit-appearance: none) {
    /* .project-form {
      color: #0000ff;
      background-color: red;
    } */
    .project-form-group {
      position: relative;
      width: 100% !important;
    }
    .project-form-control {
      min-width: 100%;
      display: flex;
      -webkit-appearance: none;
    }
    .icon-calendar {
      display: block;
      position: absolute;
      top: 40px;
      right: 15px;
    }
  }
}
</style>
