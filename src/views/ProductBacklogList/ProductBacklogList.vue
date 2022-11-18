<template>
  <div class="backlog-list-wrapper">
    <div class="header-main" v-if="projectDetail">
      <div class="header-main-container">
        <div class="top-title-block">
          <top-title :title="topTitle + ' Backlogs'"></top-title>
        </div>
        <div class="header-main-buttons">
          <div class="header-main-search" style="margin-right: 14px">
            <v-img
              class="img-search"
              src="@/assets/images/magnifying-glass-solid.svg"
            ></v-img>
            <v-text-field
              class="input-search"
              placeholder="Search backlog..."
              solo
              @input="handleSearchBacklog"
              hide-details
            ></v-text-field>
          </div>
          <button
            class="cus-btn-primary"
            text="Create Backlog"
            width="178px"
            height="50px"
            color="#3597e2"
            icon="fa fa-plus"
            @click="handleCreateDialogStatus(true)"
          >
            Create Backlog
          </button>
        </div>
      </div>
      <v-container fluid class="backlog-table">
        <v-row
          v-if="
            !loading && projectDetail && projectDetail.backlogList.length > 0
          "
          class="pl-1 pr-2 mb-2 ml-1 mr-1"
        >
          <v-col class="col-Id">
            <span class="header-title">ID</span>
          </v-col>
          <v-col cols="3" class="col-product-backlog">
            <span class="header-title">Product Backlog</span>
          </v-col>
          <v-col cols="2" class="col-date-created" text-center>
            <span class="header-title">Date Created</span>
          </v-col>
          <v-col cols="2" class="col-members">
            <span class="header-title">Members</span>
          </v-col>
          <v-col cols="1" class="col-avarage">
            <span class="header-title">Avarage</span>
          </v-col>
          <v-col></v-col>
        </v-row>
        <div
          v-if="
            !loading && projectDetail && projectDetail.backlogList.length > 0
          "
        >
          <v-list
            class="ml-1 mr-1"
            v-for="(backlog, index) in projectDetail.backlogList"
            :key="backlog.product_backlog_id"
          >
            <product-backlog-card
              :ID="(currentPage - 1) * pageSize + index"
              :backlog="backlog"
              @handle-page-change="handlePageChange"
              :checkRole="checkRole"
              @reload-backlog="
                () => {
                  refetchProjectList();
                }
              "
            ></product-backlog-card>
          </v-list>
        </div>
        <div
          v-else-if="loading"
          class="d-flex justify-center align-center"
          style="width: 100wm; height: 100vh"
        >
          <v-progress-circular
            :size="50"
            color="primary"
            indeterminate
          ></v-progress-circular>
        </div>
        <div v-else class="empty-data d-flex justify-center mt-10">
          <img
            class="icon-not-found"
            src="@/assets/images/icon-not-found.svg"
            alt=""
          />
          <div class="text-not-found">No data available</div>
        </div>
      </v-container>
      <div
        class="text-center"
        v-if="projectDetail && projectDetail.backlogQuantity > 10"
      >
        <v-pagination
          :style="[
            projectDetail.backlogList.length < 10
              ? {
                  bottom: '16px',
                  position: 'absolute',
                  left: '50%',
                  transform: 'translateX(-50%)',
                }
              : { marginBottom: '0px' },
          ]"
          v-model="currentPage"
          :length="Math.ceil(projectDetail.backlogQuantity / 10)"
          :total-visible="5"
          @input="handlePageChange"
          next-icon="mdi-menu-right"
          prev-icon="mdi-menu-left"
        ></v-pagination>
      </div>
    </div>
    <CreateBacklogDialog
      @handle-page-change="handlePageChange"
      @handle-create-backlog-dialog="handleCreateDialogStatus"
      :dialog="createBacklogDialog"
    />
    <UpdateBacklogDialog
      :selectedBacklog="selectedBacklog"
      :dialog="updateBacklogDialog"
      @handle-page-change="handlePageChange"
      @update-dialog="handleUpdateDialogStatus"
    />
  </div>
</template>

<script>
import TopTitle from '@/components/TopTitle.vue';
// import CustomButton from '@/components/CustomButton.vue';
import ProductBacklogCard from '@/views/ProductBacklogList/ProductBacklogCard.vue';
import projectActions from '@/store/modules/project/action_types';
import projectGetters from '@/store/modules/project/getter_types';
import localStorageUtils from '@/utils/utils_local_storage';
import jwt_decode from 'jwt-decode';
import socket from '@/socket/socket';
import { mapGetters, mapActions } from 'vuex';
import CreateBacklogDialog from '@/views/ProductBacklogList/CreateBacklogDialog.vue';
import UpdateBacklogDialog from './UpdateBacklogDialog.vue';
import ROLE from '@/utils/utils_role.js';
import userGetters from '@/store/modules/user/getter_types';
import userActions from '@/store/modules/user/action_types';
import notificationActions from '@/store/modules/notification/action_types';

export default {
  name: 'ProductBacklogList',
  components: {
    TopTitle,
    // CustomButton,
    ProductBacklogCard,
    UpdateBacklogDialog,
    CreateBacklogDialog,
  },
  props: {
    projectId: { type: String },
    pageIndex: { type: Number, default: 1 },
  },
  data() {
    return {
      currentPage: 1,
      currentUser: null,
      createBacklogDialog: false,
      updateBacklogDialog: false,
      selectedBacklog: {},
      pageSize: 10,
      topTitle: null,
      dialog: false,
      loading: false,
      checkRole: null,
      keySearch: '',
    };
  },
  provide() {
    return {
      reloadData: this.reloadData,
      handleUpdateDialogStatus: this.handleUpdateDialogStatus,
      handleCreateDialogStatus: this.handleCreateDialogStatus,
      handleChangeSelectedBacklog: this.handleChangeSelectedBacklog,
      project_id: this.projectId,
      selectedBacklog: this.selectedBacklog,
    };
  },

  methods: {
    ...mapActions({
      getProjectDetail: projectActions.ACT_GET_DETAIL_BY_ID,
      getUserWithSystemRole: userActions.ACT_FETCH_WITH_SYSTEM_ROLE,
      getUnreadCount: notificationActions.GET_UNREAD_COUNT,
    }),
    async handlePageChange(value) {
      this.currentPage = value;
      await this.$router
        .push({
          name: 'backlog-list',
          query: {
            projectId: this.projectId,
            pageIndex: this.currentPage,
          },
        })
        .catch(() => {});
      this.loading = true;
      await this.getProjectDetail({
        id: this.projectId,
        pageIndex: this.currentPage,
        pageSize: this.pageSize,
        keyword: this.keySearch,
      });
      this.loading = false;
    },
    processButton(backlog) {
      let lastGame = backlog.lastGame;
      // Game doesn't create
      if (!lastGame) {
        if (
          backlog.currentUserRole === ROLE.MEMBER &&
          backlog.backlogOwnerId !== this.currentUser.userId
        ) {
          return { buttonType: 'Join Game', buttonStatus: false };
        }
        return { buttonType: 'Create Game', buttonStatus: true };
      }
      // Game creates but not start
      if (!lastGame.startGame) {
        return { buttonType: 'Join Game', buttonStatus: true };
      }
      // Game starts but not end
      if (!lastGame.endGame) {
        if (
          // backlog.currentUserRole === ROLE.MEMBER &&
          // backlog.backlogOwnerId !== this.currentUser.userId &&
          backlog.isCurrentUserInGame &&
          backlog.lastGame.ownerGameId !== this.currentUser.userId
        ) {
          return { buttonType: 'Join Game', buttonStatus: true };
        }
        // Show View Game with role Backlog Owner
        return { buttonType: 'View Game', buttonStatus: true };
      }
      // Game end
      if (lastGame.endGame) {
        return { buttonType: 'View Game', buttonStatus: true };
      }
    },

    async handleSearchBacklog(key) {
      clearTimeout(this.debounce);
      this.debounce = setTimeout(() => {
        this.keySearch = key.toLowerCase();
      }, 500);
    },

    handleUpdateDialogStatus(bool) {
      this.updateBacklogDialog = bool;
    },
    handleCreateDialogStatus(bool) {
      this.createBacklogDialog = bool;
    },
    handleChangeSelectedBacklog(selectedBacklog) {
      this.selectedBacklog = selectedBacklog;
    },
    async refetchProjectList() {
      if (this.keySearch.trim() == '') {
        this.projectDetail.backlogList = [];
        if (this.keySearch.length == 0) {
          await this.getProjectDetail({
            id: this.projectId,
            pageIndex: this.currentPage,
            pageSize: this.pageSize,
            keyword: this.keySearch,
          });
        }
      } else {
        await this.getProjectDetail({
          id: this.projectId,
          pageIndex: this.currentPage,
          pageSize: this.pageSize,
          keyword: this.keySearch,
        });
      }
    },
    async reloadData() {
      this.loading = true;
      this.getProjectDetail({
        id: this.projectId,
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        keyword: this.keySearch,
      });
      this.loading = false;
    },
  },
  computed: {
    ...mapGetters({
      projectDetail: projectGetters.GET_DETAIL_BY_ID,
      user: userGetters.GET_WITH_SYSTEM_ROLE,
    }),
  },
  watch: {
    projectDetail: function () {
      if (!this.projectDetail) {
        return;
      }
      if (this.projectDetail.backlogList.length) {
        this.projectDetail.backlogList.forEach((item) => {
          item.button = this.processButton(item);
          item.pageIndex = this.pageIndex;
          item.pageSize = this.pageSize;
          item.backlogQuantity = this.projectDetail.backlogQuantity;
        });
      }
      this.list = this.projectDetail.backlogList;
    },
    keySearch() {
      if (this.currentPage !== 1) {
        this.currentPage = 1;
        this.$router
          .push({
            name: 'backlog-list',
            query: {
              projectId: this.projectId,
              pageIndex: this.currentPage,
            },
          })
          .catch(() => {});
      }
      this.refetchProjectList();
    },
  },
  async created() {
    const localStorage = localStorageUtils.getService();
    this.currentUser = jwt_decode(localStorage.getToken());
    this.checkRole = jwt_decode(localStorage.getToken());
    this.currentPage = this.pageIndex;
    this.loading = true;
    await this.getUserWithSystemRole({ id: this.currentUser.userId });
    await this.getProjectDetail({
      id: this.projectId,
      pageIndex: this.pageIndex,
      pageSize: this.pageSize,
      keyword: this.keySearch,
    });
    this.loading = false;
    if (this.projectDetail) {
      document.title = this.projectDetail.project.name + ' Backlogs';
      this.topTitle = this.projectDetail.project.name;
      let payload = jwt_decode(localStorageUtils.getToken());
      let role =
        this.user.system_role.name === ROLE.ADMIN
          ? ROLE.ADMIN
          : payload.userId === this.projectDetail.project.pmId
          ? ROLE.PM
          : ROLE.MEMBER;
      socket.emitJoinBacklog({
        email: payload.email,
        projectId: this.projectDetail.project.id,
        role,
      });
    }
    const loadBacklogs = async (projectId) => {
      if (projectId === this.projectId) {
        this.$router
          .push({
            name: 'backlog-list',
            query: {
              projectId: this.projectId,
              pageIndex: this.currentPage,
            },
          })
          .catch(() => {});
        this.loading = true;
        await this.getProjectDetail({
          id: this.projectId,
          pageIndex: this.pageIndex,
          pageSize: this.pageSize,
          keyword: this.keySearch,
        });
        this.loading = false;
      }
    };
    socket.onLoadBacklogs(loadBacklogs);
    socket.onStartGameBacklog(loadBacklogs);
    socket.onFinishGameBacklog(loadBacklogs);
    socket.onResetGameBacklog(loadBacklogs);
    socket.onDeleteGameBacklog(loadBacklogs);
    socket.onInvitePlayer(loadBacklogs);
    socket.onOwnerDeleteGame(() => {
      this.reloadData();
    });
    socket.onDeleteBacklog(() => {
      this.reloadData();
    });
    socket.onCreateBacklog(() => {
      this.reloadData();
      this.getUnreadCount();
    });
    socket.checkUpdateNameBacklogList(async () => {
      try {
        await this.getProjectDetail({
          id: this.projectId,
          pageIndex: this.pageIndex,
          pageSize: this.pageSize,
          keyword: this.keySearch,
        });
        this.topTitle = this.projectDetail.project.name;
      } catch (error) {
        console.log('error socket update title backlog list', error);
      }
    });
    socket.ondeleteProject(() => {
      try {
        this.getProjectDetail({
          id: this.projectId,
          pageIndex: this.pageIndex,
          pageSize: this.pageSize,
          keyword: this.keySearch,
        });
      } catch (error) {
        console.log(error);
        this.$router.push({ name: 'project-list' });
      }
    });
  },
  beforeDestroy() {
    socket.emitOffBacklogScreen();
    socket.removeAllListeners();
  },
};
</script>

<style>
.empty-data {
  color: #c9c8c8;
  font: normal 400 18px Roboto;
  flex-direction: column;
  align-items: center;
}
</style>

<style lang="scss" scoped>
.backlog-list-wrapper {
  .v-col span {
    line-height: 100%;
  }
  .v-list {
    background-color: #f4f6fa !important;
  }

  .backlog-table .row {
    margin-bottom: 7px !important;
    min-width: 840px;
  }
  .row {
    margin: 0 !important;
  }
  .backlog-table .col {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding: 0px !important;
    // margin-left: 20px;
    flex-grow: 0 !important;
    white-space: nowrap;
  }

  .col-Id {
    margin-right: 10px;
  }
  .col-Id span,
  .col-date-created,
  .col-members {
    padding: 0 16px !important;
    justify-content: center !important;
  }

  .col-avarage,
  .col-members {
    justify-content: center !important;
    margin-left: -6px;
  }
  .col-date-created {
    margin-left: -16px;
    margin-right: 9px;
  }

  .header-title {
    color: black;
    font: 700 18px Roboto;
  }

  .backlog-table {
    overflow-x: auto;
    overflow-y: hidden;
    padding: 0;
  }
  .backlog-table::-webkit-scrollbar-track {
    border-radius: 10px;
    background-color: #f5f5f5;
  }

  .backlog-table::-webkit-scrollbar {
    width: 2px;
    height: 4px;
    background-color: #f5f5f5;
  }

  .backlog-table::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background-color: rgb(196, 193, 193);
  }
  .pagination {
    //bottom: 16px;

    left: 50%;
    transform: translateX(-50%);
  }
}
@media only screen and (max-width: 768px) {
  .backlog-list-wrapper {
    .header-title {
      font-size: 14px;
    }
    .col-Id {
      margin-right: 17px;
    }
  }
}
</style>
