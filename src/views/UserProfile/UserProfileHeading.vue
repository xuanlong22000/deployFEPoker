<template>
  <div class="profile-heading-block">
    <div class="profile-heading-avatar-block">
      <div>
        <img
          class="profile-heading-avatar"
          :src="!avatar ? userProfile.avatar : avatar"
          v-if="(userProfile.avatar || avatar) && loaded"
        />
        <loader-overlay v-else></loader-overlay>
      </div>

      <!-- <div v-else class="avatar-replace">
        {{ userProfile.name.split('')[0].toUpperCase() }}
      </div> -->

      <label class="profile-heading-avatar-edit" v-if="loaded">
        <i class="fa-solid fa-pen"></i>
        <input
          accept="image/*"
          type="file"
          v-on:change="handleChangeAvatar"
          hidden
        />
      </label>
    </div>
    <div class="profile-heading-info">
      <div class="profile-heading-info-name">{{ userProfile.name }}</div>
      <div class="profile-heading-info-email">{{ userProfile.email }}</div>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapGetters } from "vuex";
import { uploadAvatar } from "@/api/api_cloudinary.js";
import mutationType from "@/store/app/mutation_types";
import MESSAGE from "@/utils/utils_message";
import gettersType from "@/store/modules/user/getter_types";
import LoaderOverlay from "../../components/LoaderOverlay.vue";
export default {
  name: "user-profile-heading",
  components: { LoaderOverlay },
  data() {
    return {
      avatar: "",
      loaded: true,
    };
  },
  computed: {
    ...mapGetters({
      userProfile: gettersType.GET_PROFILE,
    }),
  },
  methods: {
    ...mapMutations({
      setSnackBar: mutationType.SET_SNACKBAR,
    }),
    async handleChangeAvatar(e) {
      try {
        const check = e.target.files[0].type;
        const sizeImage = e.target.files[0].size / (1024 * 1024);
        if (sizeImage >= 3) {
          this.setSnackBar({
            type: "error",
            visible: true,
            text: MESSAGE.IMAGE_TOO_LARGE,
          });
        } else if (
          check === "image/jpg" ||
          check === "image/png" ||
          check === "image/jpeg" ||
          check === "image/gif" ||
          check === "image/svg"
        ) {
          this.loaded = false;
          const newAvatar = URL.createObjectURL(e.target.files[0]);
          this.avatar = newAvatar;
          const { data } = await uploadAvatar(e.target.files[0]);
          this.$emit("changeAvatar", { avatar: data.url });
          this.loaded = true;
        } else {
          this.setSnackBar({
            type: "error",
            visible: true,
            text: MESSAGE.IMAGE_TYPE_ERROR,
          });
        }
      } catch (e) {
        this.setSnackBar({
          type: "error",
          visible: true,
          text: "Something went wrong",
        });
      }
    },
  },
};
</script>

<style>
.profile-heading-block {
  display: flex;
  align-items: center;
}

.profile-heading-avatar-block {
  position: relative;
}

.profile-heading-avatar {
  height: 100px;
  width: 100px;
  padding-top: 0.5px;

  border-radius: 50%;
  box-shadow: 0px 3px 6px #00000029;
  border: 2px solid #ffffff;

  object-fit: cover;
}

.avatar-replace {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100px;
  width: 100px;
  padding-top: 0.5px;

  border-radius: 50%;
  box-shadow: 0px 3px 6px #00000029;
  border: 2px solid #ffffff;

  font-size: 48px;
}

.profile-heading-avatar-edit {
  position: absolute;
  right: 4px;
  bottom: 12px;

  height: 25px;
  width: 25px;
  border-radius: 50%;
  background: #3366ff 0% 0% no-repeat padding-box;
  box-shadow: 0px 3px 6px #00000029;

  display: flex;
  align-items: center;
  justify-content: center;

  cursor: pointer;
}

.profile-heading-avatar-edit > i {
  color: #ffffff;
  font-size: 12px;
}

.profile-heading-info {
  margin-left: 25px;
}

.profile-heading-info-name {
  font: normal normal normal 17px/20px Roboto;
  color: #000000;
}

.profile-heading-info-email {
  margin-top: 10px;

  font: normal normal normal 14px/17px Roboto;
  color: #000000;
}
</style>
