<template>
  <div>
    <div
      class="user-details-container"
      :style="[
        userDataDetails.length / 10 > 1
          ? { height: '100%', minHeight: '100%' }
          : { minHeight: '100%' },
      ]"
    >
      <!--  -->
      <div
        class="user-details-main pl-6 pr-6 pt-16 pb-16"
        v-if="userDataDetails"
      >
        <div class="user-details-header">
          <v-avatar class="avatar" width="80" height="80">
            <img :src="userInfo.avatar" alt="" />
          </v-avatar>
          <div class="user-details-name-mail-datetime">
            <div class="user-details-name">
              {{ userInfo.name }}
            </div>
            <div class="user-details-mail-datetime">
              <div>{{ userInfo.email }}</div>
              <span style="margin: 0 10px">-</span>
              <div>Member since {{ getTime(userInfo.create_date) }}</div>
            </div>
          </div>
        </div>
        <!--  -->
        <div v-if="isEmpty" class="user-details-table-wrapper">
          <v-container fluid class="user-details-table">
            <v-row>
              <v-col cols="1" class="col-id">
                <span class="header-title">ID</span>
              </v-col>
              <v-col cols="2" class="col-project">
                <span class="header-title">Project</span>
              </v-col>
              <v-col cols="3" class="col-access-granted">
                <span class="header-title">Access granted</span>
              </v-col>
              <v-col class="col-role">
                <span class="header-title">Role</span>
              </v-col>
            </v-row>
            <!-- Content Table -->
            <div
              class="content-table"
              v-for="(item, index) in userDataDetails.slice(start, end)"
              :key="index"
            >
              <v-row>
                <v-col cols="1" class="col-id">
                  <span class="content">
                    {{ index + 1 + (currentUserDetails - 1) * 10 }}
                  </span>
                </v-col>
                <v-col
                  cols="2"
                  class="col-project"
                  style="margin-left: -7px; margin-right: 50px"
                >
                  <span class="content">{{ item.project_name }}</span>
                </v-col>
                <v-col cols="2" class="col-access-granted">
                  <span class="content">
                    {{ getTime(item.project_member.create_date) }}
                  </span>
                </v-col>
                <v-col
                  cols="2"
                  class="col-role"
                  style="margin-left: 5px; text-align: center"
                >
                  <span class="content">
                    {{
                      item.project_member.role_id === 1
                        ? 'Project Manager'
                        : 'Member'
                    }}
                  </span>
                </v-col>
                <v-col cols="1">
                  <v-dialog
                    content-class="background-color: transparent !important; elevation-0"
                    v-model="showModel"
                    max-width="500"
                    persistent
                    overlay-color="#44444460"
                  >
                    <template v-slot:activator="{ on }">
                      <button
                        class="btn-view-activity cus-btn-secondary"
                        @click="
                          viewActivityLog(userInfo.user_id, item.project_id)
                        "
                        v-on="on"
                      >
                        View Activity
                      </button>
                    </template>
                    <activity-log-popup @closeModal="refreshDataCloseModal" />
                  </v-dialog>
                </v-col>
              </v-row>
            </div>
          </v-container>
        </div>
        <div v-else class="empty-data d-flex justify-center mt-10">
          <img
            class="icon-not-found"
            src="@/assets/images/icon-not-found.svg"
            alt=""
          />
          <div class="text-not-found">No data available</div>
        </div>
      </div>

      <div class="image-not-found" v-else>
        <img
          class="icon-not-found"
          src="@/assets/images/icon-not-found.svg"
          alt=""
        />
        <div class="text-not-found">No data available</div>
      </div>
    </div>

    <v-pagination
      class="mt-3 pagination"
      :value="+currentUserDetails"
      :total-visible="5"
      @input="handlePageChange"
      :length="Math.ceil(userDataDetails.projects.length / 10)"
      next-icon="mdi-menu-right"
      prev-icon="mdi-menu-left"
      v-if="userDataDetails && userDataDetails.length / 10 > 1"
    ></v-pagination>
  </div>
</template>

<script>
import moment from 'moment';
import { mapGetters, mapActions, mapMutations } from 'vuex';
import mutationType from '@/store/app/mutation_types';
import MESSAGE from '@/utils/utils_message';
import userActions from '@/store/modules/user/action_types';
import userGetters from '@/store/modules/user/getter_types';
import actionTypes from '@/store/modules/activity_log/action_types';
import actionTypesProject from '@/store/modules/project/action_types';
import actionTypesProjectMember from '@/store/modules/project_member/action_types';
import getterTypes from '@/store/modules/activity_log/getter_types';
import ActivityLogPopup from '../../components/ActivityLogPopup.vue';
import { getPMProject } from '@/api/api_user';
import jwtDecode from 'jwt-decode';
import localStorageUtils from '@/utils/utils_local_storage';
import socket from '@/socket/socket';

export default {
  components: {
    ActivityLogPopup,
  },
  data() {
    return {
      userInfo: [],
      userDataDetails: [],
      isAdmin: false,
      showModel: false,
      currentUserDetails: 1,
      pageSize: 10,
      currentUserId: '',
      useListData: [],
    };
  },
  computed: {
    ...mapGetters({
      users: userGetters.GET_LIST_USERS,
      activityLogList: getterTypes.GET_ACTIVITY_LOG_LIST,
      getCurrentUser: userGetters.GET_CURRENT_USER,
      getUserProfile: userGetters.GET_PROFILE,
      getRole: userGetters.GET_WITH_SYSTEM_ROLE,
    }),
    isEmpty() {
      return this.userDataDetails?.length > 0;
    },
    start() {
      return (this.currentUserDetails - 1) * this.pageSize;
    },
    end() {
      return this.pageSize * this.currentUserDetails;
    },
  },
  methods: {
    ...mapActions({
      getUserList: userActions.ACT_GET_ALL,
      fetchActivityLog: actionTypes.GET_ACTIVITY_LOG_LIST,
      getProject: actionTypesProject.ACT_GET_PROJECT_BY_ID,
      fetchIsMember: actionTypesProjectMember.ACT_FETCH_IS_MEMBER,
      fetchIsPM: actionTypesProjectMember.ACT_FETCH_IS_PROJECT_MANAGEMENT,
    }),
    ...mapMutations({
      setSnackBar: mutationType.SET_SNACKBAR,
    }),
    getTime(value) {
      return moment(value).format('DD/MM/YYYY');
    },
    async refreshDataCloseModal(check) {
      if (check === false) {
        this.showModel = false;
      }
    },
    async viewActivityLog(userId, projectId) {
      const pmId = JSON.parse(this.getCurrentUser).userId;
      // Check project exist
      const isSuccess = await this.getProject({ id: projectId });
      if (isSuccess.mess) {
        this.showModel = false;
        setTimeout(() => {
          window.location.reload();
        }, 800);
        return;
      } else if (!isSuccess) {
        this.$router.push({
          name: 'user-management',
          query: {
            currentPage: 1,
            pageSize: 10,
          },
        });
      }

      if ((await this.fetchIsPM({ projectId, pmId })) == false) {
        this.showModel = false;
        setTimeout(() => {
          window.location.reload();
        }, 800);
      } else if ((await this.fetchIsMember({ projectId, userId })) == false) {
        this.showModel = false;
        setTimeout(() => {
          window.location.reload();
        }, 800);
      } else {
        await this.fetchActivityLog({ userId: userId, projectId: projectId });
      }

      //check members had been deleted
      const userList = await this.getUserList();
      const users = userList.filter(
        (item) => item.user_id == this.$route.query.id
      );
      if (users.length == 0) {
        this.setSnackBar({
          type: 'warning',
          visible: true,
          text: MESSAGE.MENBER_DOES_NOT_EXITSTS,
        });
        this.$router.push({
          name: 'user-management',
          query: {
            currentPage: 1,
            pageSize: 10,
          },
        });
        return;
      }
    },
    async handlePageChange(value) {
      this.currentUserDetails = value;
      this.$router.push({
        name: 'user-details',
        params: { id: this.$route.query.id },
        query: {
          id: this.$route.query.id,
          currentPage: this.currentUserDetails,
          pageSize: this.pageSize,
        },
      });
    },
    async refreshDataDetails() {
      this.useListData = await this.getUserList();
      const newData = this.useListData.filter((item) => {
        return item.user_id == this.$route.query.id;
      });
      this.userDataDetails = newData[0].projects;
    },
  },
  watch: {
    userDataDetails(val) {
      if (!val) {
        this.setSnackBar({
          type: 'warning',
          visible: true,
          text: MESSAGE.NOT_PM_IN_PROJECT,
        });
        this.$router.push({
          name: 'project-list',
          query: {
            currentPage: 1,
            pageSize: 10,
          },
        });
      }
    },
  },
  async created() {
    const decodedToken = jwtDecode(localStorageUtils.getService().getToken());
    this.currentUserId = decodedToken.userId;
    if (this.currentUserId == this.$route.query.id) {
      this.$router.push({
        name: 'project-list',
      });
      return;
    }
    const dataUser = [];
    const role = await this.getUserProfile;
    this.currentUserDetails = this.$route.query.currentPage || 1;
    this.useListData = await this.getUserList();
    const projectList = await getPMProject();
    const users = this.useListData.filter(
      (item) => item.user_id == this.$route.query.id
    );
    let dataFilter = [...users[0].projects];
    if (users.length == 0) {
      this.setSnackBar({
        type: 'warning',
        visible: true,
        text: MESSAGE.MENBER_DOES_NOT_EXITSTS,
      });
      this.$router.push({
        name: 'user-management',
        query: {
          currentPage: 1,
          pageSize: 10,
        },
      });
      return;
    }
    users[0].projects = users[0].projects.filter((project) => {
      const members = project.project_members;
      const authUserInProject = members.find((member) => {
        member.user_id === JSON.parse(this.getCurrentUser).userId;
        return member.role_id === 1;
      });
      if (!authUserInProject) return true;
      return authUserInProject;
    });
    if (role.name === 'admin' || role.name === 'Quản trị viên') {
      this.userDataDetails = dataFilter;
      this.userInfo = users[0];
    } else {
      if (!users[0].projects[0]) {
        this.setSnackBar({
          type: 'warning',
          visible: true,
          text: MESSAGE.MENBER_DOES_NOT_EXITSTS,
        });
        this.$router.push({
          name: 'user-management',
          query: {
            currentPage: 1,
            pageSize: 10,
          },
        });
      } else {
        users[0].projects.map((item) => {
          for (let i = 0; i < projectList.data.projects.length; i++) {
            if (item.project_id == projectList.data.projects[i].project_id) {
              dataUser.push(item);
            }
          }
        });
        this.userDataDetails = dataUser;
        this.userInfo = users[0];
      }
    }
    socket.ondeleteProject(async () => {
      await this.refreshDataDetails();
    });
    socket.onCreateProject(async () => {
      await this.refreshDataDetails();
    });
    socket.onUpdateUserList(async () => {
      try {
        await this.refreshDataDetails();
        this.$router
          .push(
            `/user-details/${this.$route.query.id}?id=${this.$route.query.id}&currentPage=1&pageSize=12`
          )
          .catch(async () => {
            await this.refreshDataDetails();
          });
      } catch (error) {
        console.log(error);
      }
    });
  },
};
</script>

<style scoped lang="scss">
.avatar {
  box-shadow: 0px 3px 6px #00000029;
  border: 2px solid #ffffff;
}
.user-details-container {
  width: 100%;
  height: auto !important;
  background: #f4f6fa !important;
  // padding-bottom: 60px;
  /*
  border-radius: 20px; */
  /* margin-top: 50px;
  margin-left: 60px;
  margin-right: 60px; */
}
.user-details-main {
  width: 100%;
  height: max-content;
  min-height: 90vh;
  margin-bottom: 50px;
  background: #ffffff !important;
  box-shadow: 0px 3px 6px #00000029;
  border-radius: 20px;
  padding-bottom: 0px !important;
  @media only screen and (max-width: 768px) {
    margin-bottom: 60px;
  }
}
.user-details-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-top: -24px;
}
.user-details-name-mail-datetime {
  margin-top: 10px;
}
.user-details-name {
  font-size: 20px;
  line-height: 24px;
  margin-bottom: 6px;
  @media only screen and (max-width: 768px) {
    max-width: 270px;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
.user-details-mail-datetime {
  font-size: 14px;
  line-height: 17px;
  display: flex;
  justify-content: center;
  @media only screen and (max-width: 768px) {
    flex-direction: column;
    span {
      display: none;
    }
  }
}

.user-details-table {
  margin-top: 27px;
}
.header-title {
  font-size: 18px;
}
.col {
  flex-grow: 0;
}
.col-id {
  margin-left: 19px;
  margin-right: 21px;
}
.col-project {
  margin-right: 25px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
.col-access-granted {
  margin-right: -17px;
}
.content-table {
  width: 101%;
  height: 75px;
  background: #ffffff;
  box-shadow: 0px 2px 6px #b6d7f1;
  display: flex;
  align-items: center;
  margin-top: 14px;
  margin-bottom: 22px;
  margin-left: -6px;
  padding-left: 11px;
  position: relative;
}
.content {
  font-size: 14px;
}
.btn-view-activity {
  position: absolute;
  top: 17px;
  right: 25px;
}
.image-not-found {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 61px;
  padding-bottom: 70px;
}
.pagination {
  position: absolute;
  bottom: 50px;
  left: 50%;
  transform: translateX(-50%);
}
@media only screen and (max-width: 768px) {
  .user-details-container {
    // padding: 30px 15px 30px 15px !important;
    max-width: 1180px !important;
    // padding: 0 15px;
  }
  .user-details-table {
    min-width: 1180px;
  }
  .user-details-table-wrapper {
    overflow-x: auto;
    overflow-y: hidden;
  }
  .pagination {
    bottom: 30px;
  }
}
</style>
