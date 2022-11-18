<template>
  <div class="profile-form-wrap">
    <div class="profile-form-block">
      <div class="profile-form-group">
        <label class="profile-form-label" for="firstName">Name</label>
        <input
          readonly
          :value="userProfile.name"
          id="firstName"
          placeholder="First Name"
          class="profile-form-control readonly"
        />
      </div>
      <div class="profile-form-group">
        <label class="profile-form-label" for="email">Email</label>
        <input
          readonly
          :value="userProfile.email"
          id="email"
          placeholder="Email"
          class="profile-form-control readonly"
        />
      </div>
      <div class="profile-form-group">
        <label class="profile-form-label" for="oldPassword">Old Password</label>
        <input
          name="oldPassword"
          v-bind:type="isShowOldPassword ? 'text' : 'password'"
          id="oldPassword"
          placeholder="********"
          class="profile-form-control"
          v-model="oldPassword"
          @input="validateOldPassword"
        />
        <i
          v-bind:class="
            !isShowOldPassword
              ? 'fa-solid fa-eye-slash profile-form-toggle-password'
              : 'fa-solid fa-eye profile-form-toggle-password'
          "
          @click="isShowOldPassword = !isShowOldPassword"
        ></i>
      </div>
      <div class="profile-form-group">
        <label class="profile-form-label" for="newPassword">New Password</label>
        <input
          name="newPassword"
          id="newPassword"
          placeholder="********"
          class="profile-form-control"
          v-model="newPassword"
          v-bind:type="isShowPassword ? 'text' : 'password'"
          @input="validateNewPassword"
        />
        <i
          v-bind:class="
            !isShowPassword
              ? 'fa-solid fa-eye-slash profile-form-toggle-password'
              : 'fa-solid fa-eye profile-form-toggle-password'
          "
          @click="isShowPassword = !isShowPassword"
        ></i>
      </div>
      <div class="profile-form-group-error">{{ error.oldPassword }}</div>
      <div class="profile-form-group-error">{{ error.newPassword }}</div>
    </div>
    <div class="profile-form-group-submit">
      <button type="submit" class="cus-btn-primary" @click="updateProfile">
        Save changes
      </button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import userGetter from '@/store/modules/user/getter_types';

export default {
  name: 'user-profile-form',
  data() {
    return {
      oldPassword: '',
      newPassword: '',
      error: {
        oldPassword: '',
        newPassword: '',
      },
      isShowPassword: false,
      isShowOldPassword: false,
      newPasswordPatern: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
      count: 0,
    };
  },
  computed: {
    ...mapGetters({
      userProfile: userGetter.GET_PROFILE,
    }),
  },
  methods: {
    validateOldPassword() {
      this.error.oldPassword = '';
      this.count++;
      if (this.count === 1 && this.oldPassword.length > 2) {
        setTimeout(() => {
          this.oldPassword = '';
        }, 100);
      }
    },
    validateNewPassword() {
      if (!this.newPasswordPatern.test(this.newPassword) && this.newPassword) {
        this.error.newPassword =
          'New password must be at least 8 characters, 1 number, 1 letter and 1 symbol';
      } else {
        this.error.newPassword = '';
      }
    },
    updateProfile() {
      this.error.oldPassword = '';
      this.error.newPassword = '';
      let isValidate = false;
      if (!this.oldPassword && !this.newPassword) {
        this.$emit('changePassword', {
          oldPassword: this.oldPassword,
          newPassword: this.newPassword,
        });
        this.error.oldPassword = '';
        this.error.newPassword = '';
        return;
      }
      if (!this.oldPassword) {
        this.error.oldPassword = 'Please enter old password';
      } else {
        this.error.oldPassword = '';
        isValidate = true;
      }
      if (!this.newPassword) {
        this.error.newPassword = 'Please enter new password';
        isValidate = false;
        return;
      }
      const patternPassword = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
      if (!patternPassword.test(this.newPassword)) {
        this.error.newPassword =
          'New password must be at least 8 characters, 1 number, 1 letter and 1 symbol';
        isValidate = false;
        return;
      }
      this.error.newPassword = '';
      if (!isValidate) return;
      this.$emit('changePassword', {
        oldPassword: this.oldPassword,
        newPassword: this.newPassword,
      });
      this.oldPassword = '';
      this.newPassword = '';
      this.error.oldPassword = '';
      this.error.newPassword = '';
    },
  },
};
</script>

<style scoped lang="scss">
.profile-form-wrap {
  display: inline-block;
}

.profile-form-block {
  display: grid;
  grid-template-columns: 250px 250px;
  column-gap: 70px;
  row-gap: 25px;
}

.profile-form-label {
  display: block;
  font: normal normal normal 14px/17px Roboto;
  color: #000000;
  margin-bottom: 12px;
}

.profile-form-control {
  width: 250px;
  height: 45px;
  padding-left: 15px;

  background: #ffffff 0% 0% no-repeat padding-box;
  color: #000000;
  font: normal normal normal 17px/20px Roboto;

  box-shadow: 0px 3px 6px #00000029;
  border-radius: 5px;
}

.profile-form-control:focus {
  border: unset;
  outline: none;
}

.profile-form-control.readonly {
  background: #f0f0f0;
}

.profile-form-group {
  position: relative;
}

.profile-form-toggle-password {
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(80%);

  color: #000000;
  font-size: 12px;

  cursor: pointer;
}

.profile-form-group-error {
  margin-top: -20px;
  font-size: 12px;
  color: red;
}

.profile-form-group-submit {
  margin-top: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  @media only screen and (max-width: 768px) {
    margin-top: 0;
  }
}

.profile-form-submit-btn {
  width: 143px;
  height: 41px;

  background: #3597e2 0% 0% no-repeat padding-box;
  color: #ffffff;

  box-shadow: 0px 0px 5px #3597e2;
  border-radius: 5px;
}

@media screen and (max-width: 768px) {
  .profile-form-block {
    grid-template-columns: auto;
  }

  .profile-form-wrap {
    display: block;
  }

  .profile-form-control {
    width: 100%;
  }
}

@media screen and (width: 768px) {
  .profile-form-wrap {
    display: block;
  }

  .profile-form-block {
    grid-template-columns: auto auto;
  }

  .profile-form-control {
    width: 100%;
  }
}
</style>
