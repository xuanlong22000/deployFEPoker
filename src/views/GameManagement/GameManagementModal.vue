<template>
  <v-card class="px-12 py-8 py-auto card-container" height="100%">
    <div class="invite-header text-center">
      <v-icon size="26" color="black">fas fa-user-plus</v-icon>
      <span class="invite-title">Invite players</span>
      <span class="note">Enter e-mails that you want to invite</span>
    </div>
    <!-- <v-card-text class="d-flex align-center justify-center pb-0">
      <ul class="input-email-list">
        <li
          v-for="email in enteredEmails"
          :key="email"
          class="input-email-item d-flex justify-space-between align-center"
        >
          <v-label class="email" id="email">{{ email }}</v-label>
          <v-btn x-small icon color="ppred" @click="removeEmail">
            <v-icon :value="email" size="16">mdi-close</v-icon>
          </v-btn>
        </li>
      </ul>
    </v-card-text> -->
    <div
      class="wrap-select mt-3"
      v-for="(item, index) in selectedUsers"
      :key="index"
    >
      <div class="player-item d-flex">
        <v-combobox
          class="search-fill"
          :class="
            !validSelectedUsers[index] || numberIndex === index
              ? 'error-input-style'
              : ''
          "
          prepend-inner-icon="mdi-magnify"
          :items="listMembers"
          :rules="emailRules"
          dense
          :id="toString(index)"
          filled
          solo
          hide-details
          auto-select-first
          :filter="filterName"
          label="Search by email"
          v-model="selectedUsers[index]"
          @change="handleComboboxChange(index)"
          @input.native="handleChangeInput($event, index)"
          autofocus
          :disabled="
            (isProjectMember && numberIndex !== index) ||
              (isYourself && numberIndex !== index)
          "
        >
          <template v-slot:item="data">
            <template>
              <v-list-item-content>
                <v-list-item-title
                  v-html="getNameMember(data.item)"
                ></v-list-item-title>
                <v-list-item-subtitle v-html="data.item"></v-list-item-subtitle>
              </v-list-item-content>
            </template>
          </template>
        </v-combobox>
        <v-tooltip right>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              v-bind="attrs"
              v-on="on"
              class="btn-delete"
              @click="deleteMember(index)"
              icon
              :disabled="
                memberInfoNum === 1 ||
                  (isProjectMember && numberIndex !== index) ||
                  (isYourself && numberIndex !== index)
              "
            >
              <v-icon size="26">mdi-close-box-outline</v-icon>
            </v-btn>
          </template>
          <span>Delete</span>
        </v-tooltip>
      </div>
    </div>
    <span class="error-message" v-if="isYourself">Can't invite yourself !</span>
    <span class="error-message" v-if="isProjectMember">
      Can't invite member in project !
    </span>
    <span class="error-message" v-if="isDuplicateError">Duplicate e-mail</span>
    <span class="error-message" v-if="!isEmail"></span>
    <div class="btn-block d-flex justify-space-between">
      <v-btn
        class="add-member"
        text
        @click="handleAddMemberBtn"
        :disabled="isDuplicateError || isYourself || isProjectMember"
      >
        Add new member +
      </v-btn>
      <v-btn
        class="cus-btn-secondary"
        @click="inviteNewMember"
        :disabled="
          isDuplicateError ||
            selectedUsers[0] === null ||
            isDisabled ||
            isYourself ||
            isProjectMember
        "
      >
        <v-icon left dark size="16">fas fa-user-plus</v-icon>
        Invite
      </v-btn>
    </div>
  </v-card>
</template>

<script>
import { mapState, mapActions, mapMutations, mapGetters } from 'vuex';
import projectActionTypes from '@/store/modules/project/action_types';
import socket from '@/socket/socket';
import actionTypes from '@/store/modules/game/action_types';
import mutationTypes from '@/store/modules/game/mutation_types';
import getterTypes from '@/store/modules/user/getter_types';
import { getAllInvalidPlayer } from '@/api/api_player';
import projectActions from '@/store/modules/project/action_types';
import appMutations from '@/store/app/mutation_types.js';
import MESSAGE from '@/utils/utils_message';

export default {
  components: {
    // CustomButton,
  },
  props: {
    members: {
      type: Array,
      default: () => [],
    },
    gameId: {
      type: Number,
      default: null,
    },
    onCloseDialog: {
      type: Function,
      default: () => {},
    },
    resetInvitationForm: {
      type: Boolean,
      default: false,
    },
    invitedList: {
      type: Number,
      default: 0,
    },
    dialogStatus: {
      type: Boolean,
    },
    isStartGame: {
      type: Boolean,
    },
    projectId: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      validSelectedUsers: [true],
      email: '',
      error: '',
      emailRegex: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      emailRules: [
        email =>
          this.emailRegex.test(email) || !email || 'E-mail must be valid',
      ],
      invitedEmails: [],
      selectedUsers: [null],
      listMembers: [],
      memberInfoNum: 1,
      initialListUsers: [],
      isDuplicateError: false,
      isEmail: true,
      isDisabled: false,
      isYourself: false,
      isProjectMember: false,
      numberIndex: null,
      nameMember: [],
    };
  },
  watch: {
    dialogStatus() {
      if (!this.dialogStatus) {
        this.isEmail = true;
      }
    },
    email(val) {
      this.emailRegex.test(val) ? (this.valid = true) : (this.valid = false);
    },
    resetInvitationForm(status) {
      if (status) this.closeAndResetPopop();
    },
    async invitedList() {
      const { data } = await getAllInvalidPlayer(this.gameId);
      this.listMembers = data.map(member => `${member.email}`);

      this.listMembers = this.listMembers.filter(
        e => !this.invitedEmailList.some(el => e === el)
      );

      const listEmailUser = await this.getIdProject({ id: this.projectId });
      this.listMembers = this.arraysEqual(this.listMembers, listEmailUser);
    },
    memberInfoNum() {
      this.checkInput();
      this.validateDuplicate();
    },
  },
  computed: {
    ...mapState({
      players: state => state.gameModule.gameManagement.players,
      users: state => state.gameModule.users,
      enteredEmails: state => state.gameModule.enteredEmails,
      selectedEmailsState: state => state.gameModule.selectedEmails,
    }),
    ...mapGetters({
      projectMembers: 'project/GET_MEMBER',
      user: getterTypes.GET_PROFILE,
    }),
    selectedEmails: {
      get() {
        return this.selectedEmailsState;
      },
      set(value) {
        this.setSelectedEmails(value);
      },
    },
    invitedEmailList() {
      const data = this.players.map(e => e.email);
      return data;
    },
  },
  methods: {
    ...mapMutations({
      setEnteredEmails: mutationTypes.SET_ENTERED_EMAILS,
      setSelectedEmails: mutationTypes.SET_SELECTED_EMAILS,
      setSnackbar: appMutations.SET_SNACKBAR,
    }),
    ...mapActions({
      invitePlayers: actionTypes.INVITE_PLAYERS,
      getProjectMembers: projectActionTypes.ACT_FETCH_GET_ALL_MEMBERS,
      getIdProject: projectActions.ACT_GET_PROJECT_BY_ID,
    }),
    async addNewMember() {
      this.validSelectedUsers.push(true);
      this.selectedUsers.push(null);
      this.listMembers = this.initialListUsers
        .filter(member => !this.selectedUsers.includes(member))
        .filter(e => !this.invitedEmailList.some(el => e === el));
      this.memberInfoNum++;
      // this.isDuplicateError = false;
      if (!this.selectedUsers[this.selectedUsers.length])
        this.isDisabled = true;
      this.isEmail = true;
    },
    async deleteMember(index) {
      this.isEmail = true;
      this.isDisabled = false;
      this.isYourself = false;
      this.isProjectMember = false;
      this.numberIndex = null;
      const checkSelectUser = this.selectedUsers.filter(
        email => email === this.selectedUsers[index]
      );

      if (checkSelectUser.length > 1) {
        this.isDuplicateError = false;
      }

      this.selectedUsers.splice(index, 1);
      this.validSelectedUsers.splice(index, 1);
      this.listMembers = this.initialListUsers.filter(
        member => !this.selectedUsers.includes(member)
      );
      if (
        this.memberInfoNum === 2 &&
        this.validateEmail(this.selectedUsers[0])
      ) {
        this.listMembers.push(this.selectedUsers[0]);
      }
      if (this.memberInfoNum > 1) {
        this.memberInfoNum--;
      }

      // const isCheckEmail = this.selectedUsers.some(email => {
      //   return !this.validateEmail(email);
      // });
      // if (isCheckEmail) {
      //   this.isDisabled = true;
      // } else {
      //   this.isDisabled = false;
      // }
    },
    validate() {
      this.$refs.form.validate();
    },
    validateDuplicate() {
      this.isDuplicateError = false;
      for (let i = 0; i < this.selectedUsers.length; i++) {
        const checkIdx = this.selectedUsers.indexOf(this.selectedUsers[i]);
        if (checkIdx !== -1 && checkIdx !== i) {
          this.isDuplicateError = true;
          break;
        }
      }
    },
    checkInput() {
      const isCheckEmail = this.selectedUsers.some(email => {
        return (
          this.validateEmail(email) == false || email === '' || email === null
        );
      });
      if (isCheckEmail) {
        this.isDisabled = true;
      } else {
        this.isDisabled = false;
      }
    },
    // onSubmit() {
    //   if (!this.email || !this.valid) this.error = 'E-mail is invalid';
    //   else {
    //     this.enteredEmails.push(this.email);
    //     this.setEnteredEmails([...this.enteredEmails]);
    //     this.email = '';
    //     this.valid = false;
    //     this.error = '';
    //   }
    // },
    removeEmail(e) {
      const kickedEmail = e.target.getAttribute('value');
      const index = this.enteredEmails.indexOf(kickedEmail);
      if (index > -1) {
        this.enteredEmails.splice(index, 1);
      }
    },
    async closeAndResetPopop() {
      this.isDuplicateError = false;
      this.validSelectedUsers = [true];
      this.selectedUsers = [null];
      const { data } = await getAllInvalidPlayer(this.gameId);
      this.listMembers = data.map(member => `${member.email}`);
      this.listMembers = this.listMembers.filter(
        e => !this.invitedEmailList.some(el => e === el)
      );
      const listEmailUser = await this.getIdProject({ id: this.projectId });
      this.listMembers = this.arraysEqual(this.listMembers, listEmailUser);
      this.memberInfoNum = 1;
      this.email = '';
      this.isYourself = false;
      this.isProjectMember = false;
      this.onCloseDialog();
    },
    closePopup() {
      this.closeAndResetPopop();
    },
    async inviteNewMember() {
      const checkProjectDetele = await this.getIdProject({
        id: this.projectId,
      });
      if (this.isStartGame) {
        this.setSnackbar({
          type: 'error',
          visible: true,
          text: MESSAGE.GAME_ALREADY_START,
        });
        this.closePopup();
        return;
      }
      if (!checkProjectDetele.del_flg) {
        const playerEmails = this.selectedUsers.map(user => {
          return { email: user };
        });
        await this.invitePlayers({
          game_id: this.gameId,
          players: playerEmails,
        });
        socket.ownerInvitePlayers(this.gameId, this.invitedEmails);
        this.closeAndResetPopop();
      } else {
        this.setSnackbar({
          type: 'warning',
          visible: true,
          text: MESSAGE.PM_DELETE_PROJECT,
        });
        await this.$router.push({ name: 'project-list' });
      }
    },
    validateEmail(email) {
      const reg = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      const isValid = reg.test(email) && email.length <= 51;
      this.isDisabled = !isValid;
      return isValid;
    },
    handleAddMemberBtn() {
      this.selectedUsers.forEach((email, index) => {
        this.validSelectedUsers[index] = this.validateEmail(email);
      });
      if (!this.validSelectedUsers.includes(false)) {
        this.addNewMember();
      }
    },
    handleComboboxChange(index) {
      this.isProjectMember = false;
      this.isYourself = false;
      this.numberIndex = null;
      this.validSelectedUsers[index] = this.validateEmail(
        this.selectedUsers[index]
      );
      this.checkInput();
      this.validateDuplicate();
    },
    async handleChangeInput(e, index) {
      this.selectedUsers[index] = e.srcElement.value;
      this.validSelectedUsers[index] = this.validateEmail(e.srcElement.value);
      this.validateDuplicate();
      if (e.srcElement.value === this.user.email) {
        this.isDisabled = true;
        this.isYourself = true;
        this.numberIndex = index;
        return;
      } else {
        this.isYourself = false;
      }
      const listEmailUser = await this.getIdProject({ id: this.projectId });
      const checkEmail = listEmailUser.users.some(
        item => item.email === e.srcElement.value
      );

      if (checkEmail) {
        this.isDisabled = true;
        this.isProjectMember = true;
        this.numberIndex = index;
        return;
      } else {
        this.isProjectMember = false;
      }

      if (
        this.validateEmail(this.selectedUsers[index]) &&
        this.selectedUsers[index]
      ) {
        this.isEmail = true;
      } else {
        this.isEmail = false;
      }
      this.checkInput();
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
      const value = this.normalizeString(item).includes(
        this.normalizeString(query)
      );
      return value;
    },
    handleBlur() {
      console.log('run');
    },
    arraysEqual(array1, array2) {
      return array1.filter(object1 => {
        return !array2.users.some(object2 => {
          return object1 === object2.email;
        });
      });
    },

    getNameMember(value) {
      let name = '';
      this.nameMember.map(item => {
        if (item.email === value) {
          name = item.name;
        }
      });
      return name;
    },
  },

  async created() {
    await this.getProjectMembers({ id: this.projectId });
    // this.isProjectMember = false
    try {
      const { data } = await getAllInvalidPlayer(this.gameId);
      this.nameMember = [...data];
      this.listMembers = data.map(member => `${member.email}`);
      this.listMembers = this.listMembers.filter(
        e => !this.invitedEmailList.some(el => e === el)
        // !this.projectMembers.some(el => e === el.email)
      );
      const listEmailUser = await this.getIdProject({ id: this.projectId });
      this.listMembers = await this.arraysEqual(
        this.listMembers,
        listEmailUser
      );
      this.initialListUsers = [...this.listMembers];
    } catch (e) {
      console.log('error', e);
    }
  },
};
</script>

<style lang="scss">
.card-container {
  position: relative;
  .error-message {
    color: red;
    font-size: 14px;
  }
  .modal-container {
    background-color: #fff;
  }
  .close-modal-button {
    position: absolute;
    top: 6px;
    right: 12px;
  }
  .v-card__title {
    padding: 0;
    margin-right: 32px;
  }
  .v-input--selection-controls {
    margin: 0;
    padding: 0;
  }
  .v-text-field {
    padding: 0;
    max-width: 300px;
  }
  .v-application ul {
    padding-left: 0;
  }
  .email-input {
    width: 100%;
    height: 40px;
    padding: 5px 10px;
    margin: 6px 0;
    box-shadow: 0px 0px 5px #3597e2;
    border-radius: 5px;
    font: normal normal 500 16px Roboto;
    // color: #000000;
    outline: none;
  }
  .email-input.invalid {
    border: 2px solid red;
  }
  .email-input:hover {
    cursor: text;
  }
  .email-input:focus {
    box-shadow: 0px 0px 9px #228cdd;
  }
  .close-icon {
    font-size: 20px;
    background-color: #fff;
    background: #ffffff 0% 0% no-repeat padding-box;
    box-shadow: 0px 3px 6px #00000029;
    border-radius: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 50px;
    height: 50px;
    font-weight: 100;
    position: absolute;
    top: 8px;
    right: 8px;
  }
  .invite-title {
    display: block;
    font: normal 400 20px Roboto;
    letter-spacing: 0px;
    color: #000000;
    margin-top: 16px;
  }
  .note {
    display: block;
    font: normal 300 15px Roboto;
    letter-spacing: 0px;
    color: #8e8e8e;
    margin-top: 4px;
    margin-bottom: 24px;
  }
  .search-fill {
    display: flex;
    column-gap: 12px;
    width: 500px !important;
    letter-spacing: 0px !important;
    color: #424242 d8 !important;
  }
  .error-input-style .v-input__control .v-input__slot {
    color: red;
    border: 2px solid red !important;
  }
  .error-input-style .v-input__control .v-select__slot > input {
    color: red;
  }
  .search-fill .v-input__slot {
    padding-right: 2px !important;
  }
  .search-fill .v-label {
    position: unset;
    margin-top: -2px;
    font: normal 200 15px Roboto;
  }
  .search-fill .v-input__control input {
    color: #424242 d8 !important;
    font: normal 400 15px Roboto !important;
  }
  .search-fill .v-input__control > div {
    color: #424242 d8 !important;
    font: normal 400 15px Roboto !important;
    width: 350px;
  }
  .search-fill .v-select__selections span {
    color: #424242 d8 !important;
    font: normal 400 15px Roboto !important;
  }
  .search-fill > .v-input__append-outer {
    margin: 0 !important;
    margin-top: 0px !important;
  }
  .search-fill .v-input {
    column-gap: 8px !important;
  }
  .search-fill .role {
    width: 150px !important;
    letter-spacing: 0px !important;
    margin-top: 0px !important;
  }
  .search-fill .role .v-input__control input {
    color: #1691ef !important;
    text-align: center;
    font: normal 400 15px Roboto !important;
  }
  .wrap-select {
    // display: flex;
    // align-items: center;
    // justify-content: center;
    .player-item {
      justify-content: space-between;
    }
    .search-fill {
      margin-right: 20px;
    }
  }
  .btn-delete {
    color: #f80d0d !important;
  }
  .btn-block {
    margin-top: 16px;
    .add-member {
      padding: 0px;
      font: normal 200 16px Roboto;
      letter-spacing: 0px;
      color: #8e8e8e;
      text-transform: none;
      height: 40px;
      border-radius: 5px;
      &::before {
        background: none;
      }
      :hover {
        color: #3597e2;
        box-shadow: none;
        background: none;
      }
    }
    .invite-member {
      background-color: #3597e2 !important;
      box-shadow: 0px 0px 5px #3597e2;
      border-radius: 5px;
      color: #ffffff;
      text-transform: none;
      letter-spacing: 0;
      width: 90px;
      height: 40px;
      margin-right: 8px;
    }
  }
  @media screen and (max-width: 600px) {
    .email-title {
      display: none;
    }
    .search-fill .v-input__control > div {
      color: #424242d8 !important;
      font: normal 400 15px Roboto !important;
      width: 100%;
    }
  }
}
</style>
