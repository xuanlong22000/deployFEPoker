<template>
  <div>
    <v-row justify="center">
      <v-dialog
        content-class="popup-create-backlog"
        v-model="dialogStatus"
        persistent
        max-width="500"
      >
        <InvitePopupWrap @closePopup="handleClose()">
          <v-card class="model-content py-8 px-16">
            <div class="popup-create-backlog-image">
              <i class="fa-solid fa-cubes-stacked"></i>
              <p class="popup-title" @click="showSnackbar = false">
                Create new backlog
              </p>
              <p class="popup-sub-title"></p>
            </div>
            <div class="popup-create-backlog-input">
              <form
                @submit.prevent="handleSubmit"
                action=""
                class="popup-form-group"
              >
                <p class="popup-create-backlog-label">Backlog Name</p>
                <div class="popup-select-wrapper">
                  <input
                    placeholder="Enter backlog name"
                    v-model="backlogName"
                    type="text"
                    :class="{ _error: errorMsg }"
                    @blur="handleBlur"
                  />
                </div>
              </form>
            </div>

            <div class="popup-group-btn">
              <button
                class="cus-btn-cancel margin-right-btn-20"
                @click="handleClose()"
              >
                Cancel
              </button>
              <button
                class="cus-btn-secondary"
                @click="handleSubmit"
                style="width: 72px"
              >
                Save
              </button>
            </div>
          </v-card>
        </InvitePopupWrap>
      </v-dialog>
    </v-row>
  </div>
</template>

<script>
import { createProductBacklog } from '@/api/api_product_backlog.js';
import { mapMutations, mapActions, mapGetters } from 'vuex';
import appMutationTypes from '@/store/app/mutation_types.js';
import InvitePopupWrap from '@/components/InvitePopup.vue';
import mutationType from '@/store/app/mutation_types';
import MESSAGE from '@/utils/utils_message';
import projectActions from '@/store/modules/project/action_types';
import projectGetters from '@/store/modules/project/getter_types';
import notificationActions from '@/store/modules/notification/action_types';
import socket from '@/socket/socket';

export default {
  props: ['dialog'],
  inject: ['handleCreateDialogStatus', 'project_id', 'reloadData'],
  components: {
    InvitePopupWrap,
  },
  data() {
    return {
      backlogName: '',
      errorMsg: '',
      dialogStatus: false,
    };
  },
  computed: {
    ...mapGetters({
      projectDetail: projectGetters.GET_DETAIL_BY_ID,
    }),
  },
  methods: {
    ...mapActions({
      fetchGetProjectById: projectActions.ACT_GET_PROJECT_BY_ID,
      getUnreadCount: notificationActions.GET_UNREAD_COUNT,
    }),
    ...mapMutations({
      setSnackbar: appMutationTypes.SET_SNACKBAR,
      setSnackBar: mutationType.SET_SNACKBAR,
    }),
    isEmpty(str) {
      return str.replace(/^\s+|\s+$/g, '');
    },
    async handleSubmit() {
      this.handleBlur();
      if (
        !this.backlogName ||
        this.backlogName.length > 100 ||
        !this.isEmpty(this.backlogName)
      )
        return;
      try {
        const result = await createProductBacklog({
          productBacklogName: this.backlogName,
          project_id: this.project_id,
        });
        socket.createBacklog(this.project_id);
        if (result) {
          this.setSnackbar({
            type: 'success',
            visible: true,
            text: `Create backlog ${this.backlogName} successfully!`,
          });
          this.reloadData();
          this.getUnreadCount();
          this.handleCreateDialogStatus(false);
          this.backlogName = '';
          const pageIndex = this.$route.query.pageIndex;
          this.$emit('handle-create-backlog-dialog', false);
          if (
            this.projectDetail.backlogQuantity % 10 === 0 &&
            this.$route.query.pageIndex > 1
          ) {
            this.$emit('handle-page-change', +pageIndex + 1);
            return;
          }
          this.$emit('handle-page-change', +pageIndex);
        }
      } catch (error) {
        if (error.response.status === 401 || error.response.status === 400) {
          this.setSnackBar({
            type: 'warning',
            visible: true,
            text:
              error.response.status === 401
                ? MESSAGE.PM_DELETE_PROJECT
                : error.response.statusText,
          });
          this.handleCreateDialogStatus(false);
          this.backlogName = '';
          await this.$router.push({ name: 'project-list' });
          return;
        }
      }
    },
    handleBlur() {
      if (this.backlogName.length === 0) {
        return (this.errorMsg = 'Please enter backlog name');
      }
      if (!this.isEmpty(this.backlogName)) {
        return (this.errorMsg = 'Please enter backlog name');
      }
      if (this.backlogName.length > 100) {
        return (this.errorMsg =
          'Project name must be less than or equal 100 characters!');
      }
      this.errorMsg = '';
    },
    handleResetInput() {
      this.backlogName = '';
      this.errorMsg = '';
    },
    handleClose() {
      this.handleCreateDialogStatus(false);
      this.handleResetInput();
    },
  },

  watch: {
    dialog() {
      this.dialogStatus = this.dialog;
      this.errorMsg = '';
    },
  },
};
</script>
