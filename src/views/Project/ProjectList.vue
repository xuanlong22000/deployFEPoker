<template>
  <div class="header-main" v-if="allProjects">
    <div class="header-main-container">
      <div class="top-title-block">
        <top-title :title="'List Projects'"></top-title>
      </div>
      <div class="header-main-buttons">
        <div
          class="header-main-search"
          :style="[
            user.system_role.name === role.ADMIN
              ? { marginRight: '16px' }
              : null,
          ]"
        >
          <v-img
            class="img-search"
            src="@/assets/images/magnifying-glass-solid.svg"
          ></v-img>
          <v-text-field
            class="input-search"
            placeholder="Search project..."
            solo
            @input="debounceSearch"
            text-field-details-min-height="39px"
            hide-details
          ></v-text-field>
        </div>
        <custom-button
          class="btn-create mg-bt"
          text="Create Project"
          color="#3597e2"
          icon="fa fa-plus"
          @click="$router.push('/create-project')"
          v-if="user.system_role.name === role.ADMIN"
        ></custom-button>
      </div>
    </div>
    <div
      v-if="!loading && allProjects.projects && allProjects.projects.length > 0"
    >
      <div v-if="listProject.length > 0">
        <v-row>
          <v-col
            cols="12"
            xs="12"
            sm="12"
            md="4"
            lg="3"
            xl="3"
            style="padding-bottom: 40px"
            v-for="project in listProject"
            :key="project.project_id"
          >
            <div class="card-project-block">
              <div class="toolbar align-self-end">
                <v-btn
                  class="toolbar-icons"
                  icon
                  @click="editProject(project.project_id)"
                  v-if="
                    user.system_role.name === role.ADMIN ||
                    currentUserId === project.pmId
                  "
                >
                  <!-- <v-icon size="15px" dark color="#057ad3dc">
                    fa-solid fa-pen-to-square
                  </v-icon> -->
                  <img
                    src="../../assets/images/pen-to-square-solid.svg"
                    alt=""
                  />
                </v-btn>
                <v-btn
                  class="toolbar-icons"
                  icon
                  @click="deleteProject(project.project_id)"
                  v-if="
                    user.system_role.name === role.ADMIN ||
                    currentUserId === project.pmId
                  "
                >
                  <!-- <v-icon size="15px" dark color="#e41414">
                    fa-solid fa-trash-can
                  </v-icon> -->
                  <img src="../../assets/images/icon-delete.svg" alt="" />
                </v-btn>
              </div>
              <div
                class="card-project"
                @click="goToBacklog(project.project_id)"
              >
                <project-card :project="project" :key="project.project_id" />
              </div>
            </div>
          </v-col>
        </v-row>
      </div>
      <div v-else class="empty-data d-flex justify-center mt-10">
        <img
          class="icon-not-found"
          src="@/assets/images/icon-not-found.svg"
          alt=""
        />
        <div class="text-not-found">No data available</div>
      </div>
      <v-pagination
        class="mt-3 pagination"
        :value="+currentPage"
        :length="Math.ceil(allProjects.quantity / 12)"
        :total-visible="5"
        @input="handlePageChange"
        next-icon="mdi-menu-right"
        prev-icon="mdi-menu-left"
        v-if="allProjects.quantity / 12 > 1"
      ></v-pagination>
    </div>
    <div
      v-else-if="loading"
      class="d-flex justify-center mt-10"
      style="width: 100wm; height: 100vh"
    >
      <v-progress-circular
        :size="40"
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

      <!-- <div
        class="btn-create-block ml-1 mr-1"
        v-if="user.system_role.name === role.ADMIN"
      >
        <custom-button
          class="btn-create-project"
          text="Create Project"
          width="160px"
          height="50px"
          color="#3597e2"
          icon="fa fa-plus"
          @click="$router.push('/create-project')"
        ></custom-button>
      </div> -->
    </div>
    <v-dialog v-model="dialog" v-if="dialog" disabled width="unset" persistent>
      <confirm-dialog
        class="confirm-dialog"
        @processConfirmDialog="processConfirmDialog"
        :confirmDialogInfo="confirmDialogInfo"
      ></confirm-dialog>
    </v-dialog>
  </div>
</template>

<script>
import ConfirmDialog from '@/components/ConfirmDialog.vue';
import CustomButton from '@/components/CustomButton.vue';
import TopTitle from '@/components/TopTitle';
import appGetters from '@/store/app/getter_types';
import mutationType from '@/store/app/mutation_types';
import projectActions from '@/store/modules/project/action_types';
import projectGetters from '@/store/modules/project/getter_types';
import userActions from '@/store/modules/user/action_types';
import userGetters from '@/store/modules/user/getter_types';
import localStorageUtils from '@/utils/utils_local_storage';
import ROLE from '@/utils/utils_role.js';
import jwtDecode from 'jwt-decode';
import { mapActions, mapGetters, mapMutations } from 'vuex';
import ProjectCard from './ProjectCard';
import socket from '@/socket/socket';

export default {
  name: 'project-list',
  components: {
    TopTitle,
    ProjectCard,
    ConfirmDialog,
    CustomButton,
  },
  data() {
    return {
      currentPage: 1,
      pageSize: 12,
      dialog: false,
      deletedProjectId: null,
      confirmDialogInfo: {
        title: '',
        question: '',
        detial: '',
      },
      loading: false,
      currentUserId: null,
      keySearch: '',
      role: ROLE,
    };
  },
  computed: {
    ...mapGetters({
      allProjects: projectGetters.GET_ALL_PROJECTS,
      deleteResult: appGetters.GET_DELETE_RESULT,
      user: userGetters.GET_WITH_SYSTEM_ROLE,
    }),
    listProject() {
      const arrProject = this.allProjects?.projects || [];
      return arrProject;
    },
  },
  methods: {
    ...mapActions({
      fetchGetAllProjects: projectActions.ACT_FETCH_GET_ALL_PROJECTS,
      fetchDeleteProject: projectActions.ACT_FETCH_DELETE_PROJECT,
      searchProject: projectActions.ACT_SEARCH_PROJECTS,
      getUserWithSystemRole: userActions.ACT_FETCH_WITH_SYSTEM_ROLE,
      getIdProject: projectActions.ACT_GET_PROJECT_BY_ID,
      getMember: projectActions.ACT_FETCH_GET_ALL_MEMBERS,
      fetchEditById: projectActions.ACT_FETCH_EDIT_BY_ID,
    }),
    ...mapMutations({
      setSnackBar: mutationType.SET_SNACKBAR,
    }),
    debounceSearch(key) {
      clearTimeout(this.debounce);
      this.debounce = setTimeout(() => {
        this.keySearch = key;
      }, 600);
    },
    async handlePageChange(value) {
      this.currentPage = value;
      await this.$router.push({
        name: 'project-list',
        query: {
          page: this.currentPage,
          size: this.pageSize,
        },
      });
      this.loading = true;
      await this.searchProject({
        keyword: this.keySearch,
        page: this.currentPage,
        size: this.pageSize,
      });
      this.loading = false;
    },
    async processConfirmDialog(confirm) {
      if (confirm === 'Cancel') {
        this.dialog = false;
      }
      if (confirm === 'Ok') {
        this.dialog = false;
        const checkGameIsPlay = await this.fetchDeleteProject({
          projectId: this.deletedProjectId,
        });
        socket.deleteProject(this.deletedProjectId);
        if (
          this.allProjects.quantity ===
            (this.currentPage - 1) * this.pageSize + 1 &&
          checkGameIsPlay
        ) {
          this.currentPage = this.currentPage - 1;
          await this.$router.push(`/project?page=${this.currentPage}&size=12`);
        }
        this.loading = true;
        await this.searchProject({
          keyword: this.keySearch,
          page: this.currentPage,
          size: this.pageSize,
        });
        await this.$root.$emit('checkProjectList');
        this.loading = false;
        await this.fetchGetAllProjects({
          page: this.currentPage,
          size: this.pageSize,
        });
      }
    },
    async goToBacklog(projectId) {
      await this.fetchGetAllProjects({
        page: this.currentPage,
        size: this.pageSize,
      });
      const checkProjectDetele = await this.getIdProject({
        id: projectId,
      });
      if (checkProjectDetele.project_id) {
        await this.$router.push(`/backlog?projectId=${projectId}&pageIndex=1`);
      }
    },
    async editProject(projectId) {
      const result = await this.fetchEditById(projectId);
      if (result) {
        this.$router.push(`/project-detail/${projectId}`);
      } else {
        this.refetchProjectList();
      }
    },
    async deleteProject(projectId) {
      const result = await this.fetchEditById(projectId);
      if (result) {
        this.confirmDialogInfo = {
          title: 'Confirm delete?',
          question: 'Do you really want to delete these record?',
          detail: 'This process cannot be undone.',
        };
        this.dialog = true;
        this.deletedProjectId = projectId;
      }
    },
    refetchProjectList() {
      this.searchProject({
        keyword: this.keySearch,
        currentPage: this.currentPage,
        pageSize: this.pageSize,
      });
    },
  },
  watch: {
    keySearch() {
      if (this.currentPage !== 1) {
        this.currentPage = 1;
        this.$router.push({
          name: 'project-list',
          query: {
            page: this.currentPage,
            size: this.pageSize,
          },
        });
      }

      this.refetchProjectList();
    },
  },

  async created() {
    const decodedToken = jwtDecode(localStorageUtils.getService().getToken());
    this.currentUserId = decodedToken.userId;
    this.loading = true;
    await this.getUserWithSystemRole({ id: this.currentUserId });
    await this.searchProject({
      keyword: this.keySearch,
      page: this.currentPage,
      size: this.pageSize,
    });
    this.currentPage = this.$route.query.page || 1;
    await this.fetchGetAllProjects({
      page: this.currentPage,
      size: this.pageSize,
    });
    this.loading = false;
    socket.ondeleteProject(async () => {
      await this.fetchGetAllProjects({
        page: this.currentPage,
        size: this.pageSize,
      });
    });
    socket.onCreateProject(async () => {
      await this.fetchGetAllProjects({
        page: this.currentPage,
        size: this.pageSize,
      });
    });
    socket.checkUpdateNameBacklogList(async () => {
      await this.fetchGetAllProjects({
        page: this.currentPage,
        size: this.pageSize,
      });
    });
  },
};
</script>
<style scoped lang="scss">
.header-main-container {
  margin-bottom: 61px;
  @media only screen and (max-width: 768px) {
    margin-bottom: auto;
  }
}
</style>
<style lang="scss">
.header-main {
  margin-bottom: 26px;
  .card-project-block {
    position: relative;
    .toolbar {
      position: absolute;
      z-index: 1;
      height: 36px;
      top: 42px;
      right: 15px;
      .toolbar-icons {
        width: 30px !important;
        height: 30px !important;
        background: #eff4f9 0% 0% no-repeat padding-box !important;
        border-radius: 5px !important;
        &.toolbar-icons:first-child {
          margin-right: 10px !important;
        }
      }
    }
  }

  .pagination {
    position: absolute;
    bottom: 16px;
    left: 50%;
    transform: translateX(-50%);
  }
}
</style>
