<template>
  <div>
    <div class="top-title-block">
      <top-title title="User Profile"></top-title>
    </div>
    <user-profile-heading
      @changeAvatar="onChangeAvatar"
      :userProfile="userProfile"
      class="user-profile-heading"
    />
    <user-profile-form
      :userProfile="userProfile"
      class="user-profile-form"
      @changePassword="onUpdateProfile"
    />
  </div>
</template>

<script>
import TopTitle from '@/components/TopTitle.vue';
import UserProfileHeading from '@/views/UserProfile/UserProfileHeading.vue';
import UserProfileForm from '@/views/UserProfile/UserProfileForm.vue';
import { getAuthUserProfile, updateAuthUserProfile } from '@/api/api_user.js';
import { mapGetters, mapMutations } from 'vuex';
import mutationType from '@/store/app/mutation_types';
import userMutation from '@/store/modules/user/mutation_types';
import userGetters from '@/store/modules/user/getter_types';

export default {
  name: 'UserProfile',
  components: { TopTitle, UserProfileHeading, UserProfileForm },
  data() {
    return {
      userProfile: {},
      updatedUserProfile: {
        avatar: null,
        oldPassword: '',
        newPassword: '',
      },
    };
  },
  computed: {
    ...mapGetters({
      profile: userGetters.GET_PROFILE,
    }),
  },
  methods: {
    ...mapMutations({
      setSnackBar: mutationType.SET_SNACKBAR,
      setProfile: userMutation.MUTATE_SET_PROFILE,
    }),
    onChangeAvatar(value) {
      this.updatedUserProfile.avatar = value.avatar;
    },
    async onUpdateProfile(value) {
      this.updatedUserProfile = { ...this.updatedUserProfile, ...value };
      try {
        const response = await updateAuthUserProfile(this.updatedUserProfile);
        if (response?.status === 400) {
          if (response.data.error === 'same_old_password') {
            this.setSnackBar({
              type: 'warning',
              visible: true,
              text: response.data.message,
            });
          } else {
            this.setSnackBar({
              type: 'error',
              visible: true,
              text: response.data.message,
            });
          }
        } else {
          this.setSnackBar({
            type: 'success',
            visible: true,
            text: 'Update profile successfully!',
          });
          const res = await getAuthUserProfile();
          this.setProfile(res.data);
          // window.location.reload('user-profile');
        }
      } catch (e) {
        this.setSnackBar({
          type: 'error',
          visible: true,
          text: e.response.data.message,
        });
      }
    },
  },
  async created() {
    const { data } = await getAuthUserProfile();
    this.userProfile = data;
    this.updatedUserProfile.avatar = data.avatar || null;
  },
};
</script>

<style scoped>
.user-profile-heading {
  margin-top: 32px;
}

.user-profile-form {
  margin-top: 32px;
}
</style>
