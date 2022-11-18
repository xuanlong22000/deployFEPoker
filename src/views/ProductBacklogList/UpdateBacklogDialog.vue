<template>
  <v-row justify="center">
    <v-dialog
      content-class="popup-create-backlog"
      v-model="dialogStatus"
      persistent
      max-width="500"
    >
      <InvitePopupWrap @closePopup="handleUpdateDialogStatus(false)">
        <v-card class="model-content py-8 px-16">
          <div class="popup-create-backlog-image">
            <i class="fa-solid fa-cubes-stacked"></i>
            <p class="title" style="color: #000">Update backlog</p>
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
                  v-model="backlogName"
                  type="text"
                  :class="{ _error: errMsg }"
                  @blur="handleBlur"
                  @input="validateBacklogName"
                />
              </div>
            </form>
          </div>
          <div class="popup-group-btn">
            <button
              class="cus-btn-cancel margin-right-btn-20"
              @click="handleResetInput"
              style="width: 76px"
            >
              Reset
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
</template>

<script>
import { updateProductBacklog } from '@/api/api_product_backlog.js';
import { mapMutations } from 'vuex';
import appMutationTypes from '@/store/app/mutation_types.js';
import InvitePopupWrap from '@/components/InvitePopup.vue';
import { checkBacklogMessageAndExcute } from '@/utils/utils_route';
import socket from '@/socket/socket';

export default {
  props: ['dialog', 'selectedBacklog', 'checkRole'],
  inject: ['handleUpdateDialogStatus', 'project_id', 'reloadData'],
  components: {
    InvitePopupWrap,
  },
  data() {
    return {
      backlogName: '',
      errMsg: '',
      dialogStatus: false,
    };
  },
  methods: {
    ...mapMutations({
      setSnackbar: appMutationTypes.SET_SNACKBAR,
    }),
    isEmpty(str) {
      return str.replace(/^\s+|\s+$/g, '');
    },
    async handleSubmit() {
      try {
        this.validate();
        if (this.errMsg) return;
        const result = await updateProductBacklog(
          {
            backlogId: this.selectedBacklog.backlogId,
          },
          {
            productBacklogName: this.backlogName,
            project_id: this.project_id,
          }
        );
        if (!result) return;
        const messageText = `Update ${this.selectedBacklog.backlogName} to ${this.backlogName} successfully!`;
        this.handleUpdateDialogStatus(false);
        await this.reloadData();
        this.setSnackbar({
          type: 'success',
          visible: true,
          text: messageText,
        });
        this.backlogName = '';
        socket. onCheckUpdateNameGameManagement(1);
      } catch (error) {
        if (error.response.status === 400) {
          this.handleUpdateDialogStatus(false);
          this.setSnackbar({
            type: 'error',
            visible: true,
            text: error.response.statusText,
          });
          await checkBacklogMessageAndExcute(
            error.response.statusText,
            this.project_id
          );
          await this.reloadData();
          if (
            this.selectedBacklog.backlogQuantity % 10 === 1 &&
            this.selectedBacklog.pageIndex > 1
          ) {
            this.$emit(
              'handle-page-change',
              this.selectedBacklog.pageIndex - 1
            );
          }

          // setTimeout(() => {
          //   this.$router.go();
          // }, 500);
          return;
        }
        if (error.response.status === 401) {
          this.setSnackbar({
            type: 'error',
            visible: true,
            text: error.response.statusText,
          });
          this.handleCreateDialogStatus(false);
          this.backlogName = '';
          return;
        }
      }
    },
    validate() {
      if (this.backlogName.length === 0) {
        return (this.errMsg = 'Please enter backlog name');
      }
      if (!this.isEmpty(this.backlogName)) {
        return (this.errMsg = 'Please enter backlog name');
      }
      if (this.backlogName.length > 100) {
        return (this.errMsg =
          'Backlog name must be less than or equal 100 characters!');
      }
      this.errMsg = '';
    },
    handleBlur() {
      this.validate();
    },
    handleResetInput() {
      this.backlogName = '';
      this.errMsg = '';
    },
    validateBacklogName() {
      if (this.backlogName.length > 100) {
        this.errMsg = 'Backlog name must be less than or equal 100 characters!';
      } else {
        this.errMsg = '';
      }
    },
  },
  watch: {
    dialog() {
      this.dialogStatus = this.dialog;
      this.backlogName = this.selectedBacklog.backlogName || '';
      this.errMsg = '';
    },
  },
};
</script>
