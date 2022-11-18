<template>
  <div class="header-main">
    <div class="header-main-container">
      <div class="top-title-block">
        <top-title :title="'User Management'"></top-title>
      </div>
      <div class="header-main-buttons">
        <div class="header-main-search"
          :style="{marginRight: '16px'}">
          <v-img
            class="img-search"
            src="@/assets/images/magnifying-glass-solid.svg"
          ></v-img>
          <v-text-field
            class="input-search"
            placeholder="Search user name..."
            solo
            @input="debounceSearch"
          ></v-text-field>
        </div>
        <custom-button
          v-if="showInviteMember"
          class="btn-create"
          text="Invite member"
          height="50px"
          color="#3597e2"
          icon="fa-solid fa-user-plus"
          @click="isOpen = true"
        ></custom-button>
      </div>
    </div>

    <user-list v-bind:keySearch="keySearch" />

    <v-dialog
      v-model="isOpen"
      max-width="622px"
      transition="dialog-top-transition"
      persistent
    >
      <InvitePopupWrap>
        <invite-popup :key="Math.random()" @closePopup="isOpen = false" />
      </InvitePopupWrap>
    </v-dialog>
  </div>
</template>
<script>
import TopTitle from "@/components/TopTitle";
import CustomButton from "@/components/CustomButton.vue";
import UserList from "./UserList.vue";
import InvitePopup from "../UserManagement/InvitePopup.vue";
import InvitePopupWrap from "@/components/InvitePopup.vue";
import { getWithSystemRole, getPMProject } from "@/api/api_user.js";
import ROLE from "@/utils/utils_role";

export default {
  data() {
    return {
      isOpen: false,
      showInviteMember: true,
      keySearch: "",
      debounce: null,
    };
  },

  components: {
    CustomButton,
    TopTitle,
    UserList,
    InvitePopup,
    InvitePopupWrap,
  },

  methods: {
    debounceSearch(key) {
      clearTimeout(this.debounce);
      this.debounce = setTimeout(() => {
        this.keySearch = key;
      }, 600);
    },
  },

  async created() {
    const res = await getWithSystemRole();
    this.isAdmin = res.data.system_role.name === ROLE.ADMIN;
    const { data } = await getPMProject();
    let isPM = data.projects.length !== 0;

    if (!this.isAdmin && !isPM) {
      this.showInviteMember = false;
    }
  },
};
</script>
