<template>
  <v-card class="px-16 py-10 wrapper rounded-xl wrapper-mobile">
    <h2 class="text-h4 font-weight-bold text-center hide-text mb-4">
      Reset Password
    </h2>

    <form
      class="d-flex flex-column align-center mt-7"
      @submit.prevent="handleSubmit"
    >
      <a href="#">
        <img class="logo" src="@/assets/images/logo.svg" alt="logo" />
      </a>

      <div class="input-wrapper mb-8">
        <i class="fas fa-envelope"></i>
        <input
          type="password"
          placeholder="New Password"
          v-model.trim="password"
          @blur="handleOnBlur"
        />
      </div>

      <div class="input-wrapper mb-8">
        <i class="fas fa-lock"></i>
        <input
          type="password"
          placeholder="Confirm Password"
          v-model.trim="retypePassword"
          @blur="handleOnBlur"
        />
      </div>

      <span
        class="text-center mb-4 text-color"
        :class="{ 'green--text': isValid, 'red--text': !isValid }"
        v-show="showError"
      >
        {{ errorMessage }}
      </span>

      <button class="signin-btn rounded-lg py-4" type="submit">Update</button>
    </form>
  </v-card>
</template>

<script>
import { resetPassword } from '@/api/api_user.js';
import { mapMutations } from 'vuex';
import mutationType from '@/store/app/mutation_types';

export default {
  inject: ['resetToken', 'handleDialogStatus'],

  data() {
    return {
      password: '',
      retypePassword: '',
      isValid: true,
      showError: false,
      errorMessage: '',
    };
  },

  methods: {
    ...mapMutations({
      setSnackBar: mutationType.SET_SNACKBAR,
    }),
    async handleSubmit() {
      try {
        const response = await resetPassword({
          token: this.resetToken,
          newPassword: this.password,
          retypePassword: this.retypePassword,
        });
        this.handleDialogStatus(false);
        this.setSnackBar({
          type: 'success',
          visible: true,
          text: response.data.message,
        });
        setTimeout(() => {
          this.$router.push({ name: 'landing-page' });
        }, 1);
      } catch (error) {
        if (error.response?.status === 400) {
          this.isValid = false;
          this.showError = true;
          this.errorMessage = error.response.data.message;
        }
      }
    },
    handleOnBlur() {
      if (this.password !== '' && this.retypePassword !== '') {
        this.isValid = false;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.logo {
  width: 0px;
  height: 0px;
}
.rounded-xl {
  border-radius: 25px !important;
}
.input-wrapper {
  position: relative;
  width: 100%;
  box-shadow: 0px 0px 5px #3597e2;
  border-radius: 8px;
}

.input-wrapper i {
  color: #9c30af;
  position: absolute;
  top: 50%;
  left: 20px;
  transform: translateY(-50%);
}

.input-wrapper input {
  width: 100%;
  padding: 18px;
  padding-left: 48px;
  border-radius: inherit;
}

.input-wrapper input:focus {
  outline: none;
  border: none;
}

.input-wrapper input::placeholder {
  color: #cccccc;
  font-size: 16px;
}

.forgot-password {
  color: #b1adad;
}

.signin-btn {
  display: block;
  width: 100%;
  background-color: #3597e2;
  color: #fff;
  font-size: 16px;
}

.suggest-action {
  color: #b1adad;
}

.suggest-action button {
  color: #3597e2;
}

.wrapper {
  position: relative;
}

.close-btn {
  position: absolute;
  top: 0;
  right: 0;
}

.success {
  color: green;
}

.back-btn {
  position: absolute;
  left: 8px;
  top: 8px;
  font-size: 8px;
}

@media only screen and (min-width: 280px) and (max-width: 1024px) {
  .text-color{
    color: rgb(233 236 25) !important;
    font-size: 14px !important;
  }
  .rounded-xl {
    border-radius: 0px !important;
  }
  .hide-text {
    display: none;
  }
  .wrapper-mobile {
    top: 0px;
    left: 0px;
    width: 414px;
    height: 845px;
    /* UI Properties */
    background: transparent url('../../assets/images/banner-desktop.jpg') 0% 0%
      no-repeat padding-box;
    background-size: cover;
    background-position: center;
    opacity: 1;
    max-height: 150vh;
  }
  .v-application .mt-7 {
    margin-top: 0 !important;
  }

  .logo {
    width: 260px;
    height: 250px;
  }
  .input-wrapper {
    position: relative;
    width: 300px;
    box-shadow: 0px 0px;
  }
  .input-wrapper input {
    top: 324px;
    left: 57px;
    width: 300px;
    height: 52px;
    background: #ffffff4d 0% 0% no-repeat padding-box;
    opacity: 1;
    color: white;
  }
  .input-wrapper input::placeholder {
    text-align: left;
    font: normal normal normal 16px/17px Chivo;
    letter-spacing: 0px;
    color: #ffffff;
    opacity: 1;
  }
  .input-wrapper i {
    opacity: 1;
    color: #ffffff;
    position: absolute;
    top: 50%;
    left: 20px;
    transform: translateY(-50%);
  }
  .signin-btn {
    top: 466px;
    left: 57px;
    width: 300px;
    height: 52px;
    background-color: #3597e200;
    border: 1px solid #ffffff;
    border-radius: 5px;
    opacity: 1;
  }
  .signin-btn:hover {
    border: 1px solid #54b1f8;
    box-shadow: 0px 0px 2px #54b1f8;
  }
  .error-mobile {
    color: rgb(233, 236, 25) !important;
  }
}
@media only screen and (min-width: 768px) and (max-width: 1024px) {
  .rounded-xl {
    border-radius: 0px !important;
  }
  .hide-text {
    display: none;
  }
  .wrapper-mobile {
    top: 0px;
    left: 0px;
    width: 414px;
    height: 845px;
    /* UI Properties */
    background: transparent url('../../assets/images/banner-desktop.jpg') 0% 0%
      no-repeat padding-box;
    background-size: cover;
    background-position: center;
    opacity: 1;
    max-height: 150vh;
  }
  .v-application .mt-7 {
    margin-top: 0 !important;
  }

  .logo {
    width: 379px;
    height: 379px;
  }
  .input-wrapper {
    position: relative;
    width: 50%;
    box-shadow: 0px 0px;
  }
  .input-wrapper input {
    top: 324px;
    left: 57px;
    width: 100%;
    height: 52px;
    background: #ffffff4d 0% 0% no-repeat padding-box;
    opacity: 1;
    color: white;
    font: normal normal normal 17px/17px Chivo;
  }
  .input-wrapper input::placeholder {
    text-align: left;
    font: normal normal normal 16px/17px Chivo;
    letter-spacing: 0px;
    color: #ffffff;
    opacity: 1;
    font: normal normal normal 17px/17px Chivo;
  }
  .input-wrapper i {
    opacity: 1;
    color: #ffffff;
    position: absolute;
    top: 50%;
    left: 20px;
    transform: translateY(-50%);
  }
  .signin-btn {
    top: 466px;
    left: 57px;
    height: 52px;
    background-color: #3597e200;
    border: 1px solid #ffffff;
    border-radius: 5px;
    opacity: 1;
    width: 50%;
  }
  .signin-btn:hover {
    border: 1px solid #54b1f8;
    box-shadow: 0px 0px 2px #54b1f8;
  }
  .error-mobile {
    color: rgb(233, 236, 25) !important;
  }
}
</style>
