<template>
  <div v-if="users && users.rows">
    <v-container fluid class="user-table">
      <!-- Header list with sort old source  -->
      <!-- <v-row class="pl-2 pr-2 mb-2 ml-1 mr-1" v-if="listUser.rows.length > 0">
        <v-col cols="3">
          <div class="user-table__header-list text-align-left">
            <span @click="handleSortByName">Name</span>
            <i
              v-if="sortByName !== 'none'"
              :class="`fas fa-arrow-up ${sortByName === 'down' && 'active'}`"
            ></i>
          </div>
        </v-col>
        <v-col cols="2">
          <div class="user-table__header-list">
            <span @click="handleSortByCreated">Created</span>
            <i
              v-if="sortByCreated !== 'none'"
              :class="`fas fa-arrow-up ${sortByCreated === 'down' && 'active'}`"
            ></i>
          </div>
        </v-col>
        <v-col cols="2">
          <div class="user-table__header-list">
            <span @click="handleSortByRole">Role</span>
            <i
              v-if="sortByRole !== 'none'"
              :class="`fas fa-arrow-up ${sortByRole === 'down' && 'active'}`"
            ></i>
          </div>
        </v-col>
        <v-col cols="3">
          <div class="user-table__header-list">
            <span>Project</span>
          </div>
        </v-col>
        <v-col cols="2">
          <div class="user-table__header-list">
            <span>Actions</span>
          </div>
        </v-col>
      </v-row> -->
      <div v-if="listUser.rows.length > 0" class="user-table__body-list">
        <v-list
          v-for="user in listUser.rows"
          :key="user.user_id"
          class="user-table__list"
        >
          <v-col style="padding: 0" class="user-table__col">
            <user-item
              :user="user"
              :currentUserProject="currentUserProject"
              :keySearch="keySearch"
            ></user-item>
          </v-col>
        </v-list>
      </div>
      <div
        v-else
        class="empty-data justify-center mt-10 d-flex"
        id="empty-data"
      >
        <img
          class="icon-not-found"
          src="@/assets/images/icon-not-found.svg"
          alt=""
        />
        <div class="text-not-found">No data available</div>
      </div>
    </v-container>
    <v-pagination
      v-if="users.count / pageSize > 1"
      class="mt-3 pagination"
      :value="+currentPage"
      :length="Math.ceil(users.count / pageSize)"
      :total-visible="5"
      @input="handlePageChange"
      next-icon="mdi-menu-right"
      prev-icon="mdi-menu-left"
    ></v-pagination>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import userActions from '@/store/modules/user/action_types';
import userGetters from '@/store/modules/user/getter_types';
import UserItem from './UserItem.vue';
import socket from '@/socket/socket';

// import { getWithSystemRole, getPMProject } from '@/api/api_user';
// import ROLE from '@/utils/utils_role';

export default {
  components: {
    UserItem,
  },
  props: {
    keySearch: String,
  },
  provide() {
    return {
      refetchUserList: this.refetchUserList,
      backToFirstPage: this.backToFirstPage,
    };
  },

  data() {
    return {
      sortByName: 'none',
      sortByCreated: 'none',
      sortByRole: 'none',
      currentPage: this.$route.query.page || 1,
      pageSize: this.$route.query.size || 12,
      // findByProjects: [],e
      currentUser: {},
      currentUserProject: [],
      debounce: null,
      getBothRole: [],
    };
  },

  computed: {
    ...mapGetters({
      users: userGetters.GET_LIST_USERS,
    }),
    listUser() {
      if (!(this.users?.rows?.length > 0)) return { rows: [] };

      const filterKey = this.users.rows.filter(user => {
        const projectRole = [];
        user.projects.map(item =>
          projectRole.push(+item.project_member.role_id)
        );
        user.roleText = this.filterRole(projectRole);
        return user.user_id !== this.currentUser.user_id;
      });
      return { rows: filterKey };
    },
  },
  watch: {
    keySearch() {
      if (this.currentPage !== 1) {
        this.currentPage = 1;
        this.$router.push({
          name: 'user-management',
          query: {
            page: this.currentPage,
            size: this.pageSize,
          },
        });
      }
      this.refetchUserList();
    },
    // listUser(val) {
    //   if (val.rows?.length === 0) {
    //     this.$router.push('/project');
    //   }
    // },
  },

  methods: {
    ...mapActions({
      getUserList: userActions.ACT_GET_ALL,
      searchUserList: userActions.ACT_SEARCH,
    }),
    filterRole(arr) {
      let newArr = new Set([...arr]);
      if (newArr.size >= 2) return 'PM / Member';
      if (newArr.size === 0) return 'Member';
      if ([...newArr][0] === 1) return 'PM';
      return 'Member';
    },
    hideAllBtn() {
      this.sortByName = 'none';
      this.sortByCreated = 'none';
      this.sortByRole = 'none';
    },

    handleSortByName() {
      if (this.sortByName === 'none' || this.sortByName === 'down') {
        this.hideAllBtn();
        this.sortByName = 'up';

        this.users.rows = this.users.rows.sort((a, b) =>
          a.name.localeCompare(b.name)
        );
        return;
      }
      if (this.sortByName === 'up') {
        this.hideAllBtn();
        this.sortByName = 'down';
        this.users.rows = this.users.rows.sort((a, b) =>
          b.name.localeCompare(a.name)
        );
        return;
      }
    },

    handleSortByCreated() {
      if (this.sortByCreated === 'none' || this.sortByCreated === 'down') {
        this.hideAllBtn();
        this.sortByCreated = 'up';
        this.users.rows = this.users.rows.sort(
          (a, b) => Date.parse(a.create_date) - Date.parse(b.create_date)
        );
        return;
      }
      if (this.sortByCreated === 'up') {
        this.hideAllBtn();
        this.sortByCreated = 'down';
        this.users.rows = this.users.rows.sort(
          (a, b) => Date.parse(b.create_date) - Date.parse(a.create_date)
        );
        return;
      }
    },

    handleSortByRole() {
      if (this.sortByRole === 'none' || this.sortByRole === 'down') {
        this.hideAllBtn();
        this.sortByRole = 'up';
        this.users.rows.sort((a, b) => a.role.localeCompare(b.role));
        return;
      }
      if (this.sortByRole === 'up') {
        this.hideAllBtn();
        this.sortByRole = 'down';
        this.users.rows.sort((a, b) => b.role.localeCompare(a.role));
        return;
      }
    },

    async handlePageChange(value) {
      this.currentPage = value;
      await this.$router.push({
        name: 'user-management',
        query: {
          page: this.currentPage,
          size: this.pageSize,
        },
      });
      this.refetchUserList();
    },

    refetchUserList() {
      this.searchUserList({
        keyword: this.keySearch,
        currentPage: this.currentPage,
        pageSize: this.pageSize,
      });
    },
    async backToFirstPage() {
      await this.getUserList({
        keyword: this.keySearch,
        currentPage: this.currentPage,
        pageSize: this.pageSize,
      });

      if (this.currentPage && this.users.rows.length == 0) {
        if (this.users.count == 0) {
          this.handlePageChange(this.currentPage);
        } else {
          this.handlePageChange(this.currentPage - 1);
        }
      } else {
        this.handlePageChange(this.currentPage);
      }
    },
  },

  mounted() {
    socket.onUpdateUserList(() => {
      this.refetchUserList();
    });
  },

  async created() {
    // const { data } = await getPMProject();
    // const res = await getWithSystemRole();
    // this.isPM = data.projects.length !== 0;
    // this.isAdmin = res.data.system_role.name === ROLE.ADMIN;

    // if (!this.isAdmin && !this.isPM) {
    //   return this.$router.push({ name: 'project-list' });
    // }
    await this.getUserList({
      keyword: this.keySearch,
      currentPage: this.currentPage,
      pageSize: this.pageSize,
    });
    socket.ondeleteProject(() => {
      this.refetchUserList();
    });
  },
};
</script>

<style lang="scss" scoped>
.user-table__header-list span {
  color: #000000;
  font: normal normal bold 20px/26px Roboto;
  cursor: pointer;
  user-select: none;
}

.user-table__header-list span {
  margin-right: 8px;
}

.user-table__header-list {
  text-align: center;
}

.text-align-left {
  text-align: left;
}

.active {
  transform: rotate(180deg);
}

.user-table__header-list i {
  transition: transform 0.3s linear;
}

.user-table__col:first-child {
  margin: 0;
}

.user-table__col {
  margin: 21px;
}
.action {
  margin-left: auto;
  margin-right: 10px;
  // cursor: pointer;
}

.action .v-icon {
  cursor: pointer;
}

.action .v-icon {
  font-size: 14px;
  width: 30px;
  height: 30px;
  border-radius: 5px;
  background-color: #3366ff;
}

.action .v-icon:nth-child(2) {
  background: #f7284a;
  margin-left: 16px;
}

.v-list {
  background-color: #f4f6fa !important;
  padding: 0;
  width: calc(100% * (1 / 3) - 14px);
  margin-bottom: 20px;
  margin-left: 21px;
}

.v-list:nth-child(3n - 2) {
  margin-left: 0px;
}

.user-table__body-list {
  display: flex !important;
  flex-wrap: wrap !important;
  flex-direction: row !important;
  padding-bottom: 12px;
}

.user-table {
  overflow-x: auto;
  overflow-y: hidden;
  overflow: visible;
  padding: 0;
}

.user-table::-webkit-scrollbar-track {
  border-radius: 10px;
  background-color: #f5f5f5;
}

.user-table::-webkit-scrollbar {
  width: 2px;
  height: 4px;
  background-color: #f5f5f5;
}

.user-table::-webkit-scrollbar-thumb {
  border-radius: 10px;
  background-color: rgb(196, 193, 193);
}
.pagination {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  bottom: 16px;
}
@media screen and (max-width: 768px) {
  .v-list {
    margin-left: 0px !important;
    width: 100% !important;
  }
}
</style>
