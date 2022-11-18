<template>
  <div class="wrapper">
    <!-- <div class="avatar-wrapper">
      <img class="avatar" :src="user.avatar" alt="" />
      <div class="avatar">{{ user.name.split('')[0].toUpperCase() }}</div>
      <div class="name">{{ user.name }}</div>
      <div v-if="currentUser.user_id === 0" class="height_admin"></div>
    </div> -->
    <div class="project-list">
      <div class="invite-block-wrap">
        <div @click="$emit('closeModal')" class="close-btn">
          <div>+</div>
        </div>
      </div>
      <div class="item-image">
        <img src="@/assets/images/trash-can-solid.svg" alt="" />
        <h4>Delete account</h4>
        <h5>
          <span>Are you sure your want to delete</span>
          <span>{{ this.user.name }}</span>
          <span>account ?</span>
        </h5>
      </div>

      <div class="item-input">
        <div class="item-label">Choose Project</div>
        <div class="item-select role">
          <select v-model="selectedProject">
            <option v-if="systemRole === 1" value="-1">All</option>
            <option
              v-for="project in projects"
              :key="project.project_id"
              :value="project"
              :selected="selectedProject === project"
            >
              {{ project.project_name }}
            </option>
          </select>
          <v-icon class="select-icon">fa-solid fa-chevron-down</v-icon>
        </div>
      </div>
      <div class="btn-delete">
        <button
          @click="processConfirmDialog('Cancel')"
          class="cus-btn-cancel cus-btn-margin-right"
        >
          Cancel
        </button>
        <button @click="processConfirmDialog('Ok')" class="cus-btn-delete">
          Delete
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { deleteUser } from '@/api/api_user.js';
import { deleteMember, checkCanDelete } from '@/api/api_project_member.js';
import { mapMutations, mapActions } from 'vuex';
import mutationType from '@/store/app/mutation_types';
import localStorageUtils from '@/utils/utils_local_storage';
import jwt_decode from 'jwt-decode';
import socket from '@/socket/socket';
import projectActions from '@/store/modules/project/action_types';
import actionTypes from '@/store/modules/project/action_types';
import MESSAGE from '@/utils/utils_message';
import userActions from '@/store/modules/user/action_types';

export default {
  props: {
    user: Object,
    userId: Number,
    keySearch: String,
  },
  data() {
    return {
      projects: [],
      selectedProject: {},
      currentUser: {},
      confirmDialogInfo: {
        title: 'Are you sure you want to delete',
        question: this.user.name,
        detial: '',
      },
      currentPage: this.$route.query.page || 1,
      pageSize: this.$route.query.size || 10,
      isUserList: false,
      systemRole: '',
    };
  },

  inject: ['refetchUserList', 'backToFirstPage'],

  async created() {
    const localStorage = localStorageUtils.getService();
    this.currentUser = jwt_decode(localStorage.getToken());
    this.selectDeteleProject();
    const checkRole = await this.getSystemRole(this.currentUser.user_id);
    this.systemRole = checkRole.system_role_id;
  },
  methods: {
    ...mapActions({
      checkGamePlaying: projectActions.ACT_CHECK_PLAYING,
      updateProject: actionTypes.ACT_UPDATE_PROJECT_BY_ID,
      getProject: actionTypes.ACT_GET_PROJECT_BY_ID,
      getSystemRole: userActions.ACT_FETCH_WITH_SYSTEM_ROLE,
    }),
    ...mapMutations({
      setSnackBar: mutationType.SET_SNACKBAR,
    }),
    unique(arr) {
      var newArr = [];
      for (var i = 0; i < arr.length; i++) {
        if (newArr.indexOf(arr[i]) === -1) {
          newArr.push(arr[i]);
        }
      }
      return newArr;
    },
    async handleDelete() {
      const data = {
        project_name: this.selectedProject?.project_name,
        start_date: this.selectedProject?.start_date,
        end_date: this.selectedProject?.end_date,
        user_id: null,
      };

      // Delete all projects === delete user: value is -1
      if (!this.selectedProject) {
        this.setSnackBar({
          type: 'error',
          visible: true,
          text: 'Please choose project that you want to remove this user from it',
        });
        return;
      }
      if (this.selectedProject === '-1') {
        const response = await deleteUser(this.user.user_id);
        if (response.status === 200) {
          this.setSnackBar({
            type: 'success',
            visible: true,
            text: response.data.message,
          });
          socket.emitDeleteUser(this.user.user_id);
          this.backToFirstPage();
        } else {
          this.setSnackBar({
            type: 'error',
            visible: true,
            text: response.data.message,
          });
        }
      } else {
        if (this.selectedProject.project_member.role_id == 1) {
          await this.updateProject({
            id: this.selectedProject?.project_id,
            data,
            isUpdateProjectNone: true,
            userId: this.user.user_id,
            isUpdate: 1,
          });
        }
        try {
          const response = await deleteMember(
            this.user.user_id,
            this.selectedProject.project_id
          );
          this.setSnackBar({
            type: 'success',
            visible: true,
            text: response.data.message,
          });
          socket.emitKickUserOutOfProject(
            this.selectedProject.project_id,
            this.user.email
          );
          this.backToFirstPage();
          this.selectDeteleProject();
        } catch (error) {
          this.setSnackBar({
            type: 'error',
            visible: true,
            text: `${error.response.data.message}!`,
          });
        }
      }
      this.refetchUserList();
      this.$emit('closeModal');
    },
    async selectDeteleProject() {
      this.projects = this.user.projects;
      this.selectedProject = this.projects[0];
    },
    async processConfirmDialog(confirm) {
      if (confirm === 'Cancel') {
        this.$emit('closeModal');
      }
      if (confirm === 'Ok') {
        try {
          if (!this.selectedProject?.project_id) {
            await this.handleDelete();
            this.$emit('closeModal');
            return;
          }
          const isplaying = await checkCanDelete({
            projectId: this.selectedProject?.project_id,
            userId: this.user.user_id,
            email: this.user.email,
          });
          if (isplaying) {
            const checkProjectDetele = await this.getProject({
              id: this.selectedProject?.project_id,
            });

            if (checkProjectDetele) {
              const dataUser = checkProjectDetele.users.filter(
                (item) => item.user_id === this.currentUser.user_id
              );

              const isPmDetele = dataUser[0]?.project_member.role_id;
              const isUserDeleted = checkProjectDetele.users.some(
                (item) => item.user_id === this.user.user_id
              );

              if (isPmDetele == 1 || this.systemRole == 1) {
                if (isUserDeleted) {
                  await this.handleDelete();
                  socket.deleteProject();
                } else {
                  this.setSnackBar({
                    type: 'warning',
                    visible: true,
                    text: MESSAGE.MENBER_DOES_NOT_EXITSTS,
                  });
                  this.$emit('closeModal');
                }
              } else {
                this.setSnackBar({
                  type: 'warning',
                  visible: true,
                  text: MESSAGE.NOT_PM_IN_PROJECT,
                });
                this.refetchUserList();
                this.$emit('closeModal');
              }
            } else {
              // this.setSnackBar({
              //   type: 'warning',
              //   visible: true,
              //   text: MESSAGE.MENBER_DOES_NOT_EXITSTS,
              // });
              this.selectDeteleProject();
              this.$emit('closeModal');
              this.refetchUserList();
            }
          } else {
            const checkProjectDetele = await this.getProject({
              id: this.selectedProject?.project_id,
            });
            const dataUser = checkProjectDetele.users.filter(
              (item) => item.user_id === this.currentUser.user_id
            );
            const isPmDetele = dataUser[0]?.project_member.role_id;
            if (isPmDetele != 1 && this.systemRole != 1) {
              this.setSnackBar({
                type: 'warning',
                visible: true,
                text: MESSAGE.NOT_PM_IN_PROJECT,
              });
            } else {
              this.setSnackBar({
                type: 'warning',
                visible: true,
                text: MESSAGE.NOT_DELETE_GAME_PLAYING,
              });
            }
          }
        } catch (error) {
          this.setSnackBar({
            type: 'warning',
            visible: true,
            text: error.response.statusText,
          });
        } finally {
          this.$emit('closeModal');
        }
      }
    },
  },
};
</script>

<style scoped>
.delete-user {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 30px;
}
.item-label {
  margin-right: 19px;
  font: normal normal normal 14px/17px Roboto;
  letter-spacing: 0px;
  /* color: #000000; */
  opacity: 1;
}
.delete-user img {
  margin-bottom: 20px;
}
.delete-user p {
  margin: 0;
}
.delete-title {
  text-align: left;
  font: normal normal bold 20px/26px Roboto;
  letter-spacing: 0px;
  color: #000000;
  opacity: 1;
}
.delete-des {
  font-weight: 300;
  text-align: left;
  letter-spacing: 0px;
  color: #8e8e8e;
  opacity: 1;
}
.confirm-dialog {
  background: #00000000 !important;
  border: none !important;
  width: 100% !important;
  font-size: 14px;
  box-shadow: none !important;
}
.v-dialog {
  border-radius: 15px !important;
}
.wrapper {
  width: 100%;
  max-width: 580px;
  border-radius: 5px;
  box-sizing: border-box;
  position: relative;
  overflow: visible;
  padding: 30px 70px 25px 70px;
  background: #ffffff 0% 0% no-repeat padding-box;
  box-shadow: 0px 3px 6px #00000029;
  opacity: 1;
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
.information {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr;
  gap: 20px;
  margin-top: 25px;
}
.project-list {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.project-list img {
  height: 46px;
  opacity: 1;
}
.project-list h4 {
  text-align: center;
  top: 296px;
  font: normal normal bold 20px/26px Roboto;
  color: #000000;
  opacity: 1;
  margin-top: 5px;
}
.project-list h5 {
  text-align: center;
  font: normal normal normal 16px/21px Roboto;
  color: #8e8e8e;
  margin-top: 5px;
  font-weight: 200;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}
.project-list span {
  /* height: 21px; */
  text-align: left;
  font-size: 16px;
  font-weight: lighter;
  letter-spacing: 0px;
  color: #8e8e8e;
  display: block;
}
.project-list span:nth-child(2) {
  font-weight: bold;
  max-width: 200px;
  text-overflow: ellipsis;
  overflow: hidden;
  margin: 0 5px;
}
.project-list .confirm {
  width: 65px;
  height: 30px;
  background: #7854c0 0% 0% no-repeat padding-box;
  box-shadow: 0px 0px 5px #9c30afb5;
  border-radius: 5px;
  color: white;
  opacity: 1;
  margin-right: 15px;
  font: normal normal normal 14px/17px Roboto;
}
.height_admin {
  height: 39px;
}
.project-list .cancel {
  width: 65px;
  height: 30px;
  background: #eb907d 0% 0% no-repeat padding-box;
  box-shadow: 0px 0px 5px #d48271;
  border-radius: 5px;
  color: white;
  font: normal normal normal 14px/17px Roboto;
  opacity: 1;
}
.btn-delete {
  width: 100%;
  display: flex;
  justify-content: flex-end;
  margin-top: 35px;
}
/* .item,
.item-select {
  padding: 0 12px;
  box-shadow: 0px 3px 6px #00000029;
  border-radius: 5px;
  position: relative;
  font-size: 14px;
  line-height: 17px;
  color: #000000;
  align-self: center;
  border: 1px solid transparent;
  position: relative;
} */
.item-image {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
}
.item-select {
  display: flex;
  align-items: center;
  padding: 0;
  width: 100%;
  height: 40px;
  --iconSize: 16px;
  background: var(--unnamed-color-ffffff) 0% 0% no-repeat padding-box;
  background: #ffffff 0% 0% no-repeat padding-box;
  box-shadow: 0px 1px 6px #00000029;
  border-radius: 5px;
  opacity: 1;
}
.item-select i {
  height: 100%;
  margin-right: 12px;
}
.item-select option {
  word-wrap: break-word; /* IE*/
  white-space: -moz-pre-wrap; /* Firefox */
  white-space: pre-wrap; /* other browsers */
  width: 282px;
  display: inline-block;
}
.item-label {
  width: 100%;
  max-width: 100px;
  margin-right: 20px;
  font: normal normal normal 14px/17px Roboto;
  letter-spacing: 0px;
  /* color: #000000; */
}
/* .item::after,
.item-select::after {
  font-size: 12px;
  line-height: 14px;
  position: absolute;
  top: -6px;
  left: 6px;
  background: #ffffff;
  padding: 0 4px;
} */
/* .item::before,
.item-select::before {
  content: '*';
  position: absolute;
  top: -6px;
  left: 55px;
  background: #ffffff;
  padding: 0 4px;
} */
.item-input {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 15px;
}
.item-select::before {
  left: 35px;
  z-index: 2;
  background: transparent;
}
.email::after {
  content: 'Email';
}
.email::before {
  left: 40px;
}
/* .role::after {
  content: 'Choose Project';
} */
.role {
  position: relative;
}
.sele .created::after {
  content: 'Created';
}
.project::after {
  content: 'Project';
}
.project::before {
  left: 48px;
}
/* .item:hover::after,
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
} */
select {
  width: 100%;
  height: 100%;
  border-radius: 4px;
  padding: 0 40px 0 12px;
  outline: none;
  /* color: #000000; */
  font: normal normal normal 14px/17px Roboto;
  text-overflow: ellipsis;
}
.select-icon {
  /* margin: 12px; */
  position: absolute;
  right: 0;
  top: 0;
  font-size: var(--iconSize);
  pointer-events: none;
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
.cancel-btn {
  background: #eb907d;
  box-shadow: 0px 0px 5px #d48271;
}
@media screen and (max-width: 768px) {
  .project-list {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }
  .delete-des {
    text-align: center;
  }
  .item-select {
    max-width: none;
  }
  .item-label {
    margin-bottom: 10px;
  }
}

@media screen and (max-width: 768px) {
  .item-input {
    flex-direction: column;
    align-items: start;
  }
  .item-label {
    margin-bottom: 10px;
  }
}
@media screen and (max-width: 450px) {
  .wrapper {
    padding: 10px;
  }
  .information {
    grid-template-columns: 1fr;
    gap: 10px;
  }
  .project-list {
    margin-top: 15px;
    margin-bottom: 15px;
  }
}
.name {
  color: #3597e2;
  font-weight: bold;
  margin-top: 3px;
}
.btn-delete {
  width: 100%;
  display: flex;
  justify-content: flex-end;
  margin-top: 35px;
}
</style>
