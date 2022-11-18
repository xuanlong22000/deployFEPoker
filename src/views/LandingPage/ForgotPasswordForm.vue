<template>
  <v-card
    :class="
      !isfullscreen
        ? 'wrapper-forgot py-10 wrapper wrapper-mobile '
        : 'wrapper-forgot px-16 py-10 wrapper wrapper-mobile '
    "
  >
    <!-- <v-card-actions class="back-btn">
      <v-btn
        fab
        :color="!isfullscreen ? '#B1ADAD' : '#ffffff'"
        text
        @click="changeComponent('SigninForm')"
      >
        <v-icon>fas fa-arrow-left</v-icon>
      </v-btn>
    </v-card-actions> -->
    <h2
      v-if="!isfullscreen"
      class="title-form-sigin text-mail font-weight-bold text-center"
    >
      Reset Mail
    </h2>
    <form
      class="d-flex flex-column align-center mt-5"
      @submit.prevent="handleSubmit"
    >
      <a v-if="isfullscreen" href="#">
        <img class="logo" src="@/assets/images/logo.svg" alt="logo" />
      </a>
      <span class="red--text error-desktop error-valid" v-show="showError">
        <img
          class="white-color-icon"
          style="margin-right: 10px"
          src="@/assets/images/material-error-outline.svg"
          alt=""
        />

        {{ errorMessage || ' The current account does not exist' }}
      </span>
      <span
        class="red--text error-desktop error-valid"
        v-show="!showError"
      ></span>
      <div class="input-wrapper mb-2">
        <i class="">
          <img
            class="white-color-icon"
            src="@/assets/images/material-mail-outline.svg"
            alt=""
          />
        </i>
        <input
          type="email"
          placeholder="Email Address"
          v-model="email"
          autocomplete="true"
        />
      </div>
      <!-- <span
        class="text-center error-mobile"
        :class="{ 'green--text': isValid, 'red--text': !isValid }"
        v-show="showError"
      >
        {{ errorMessage }}
      </span> -->
      <!-- <v-progress-circular
        v-if="isLoading"
        indeterminate
        color="primary"
      ></v-progress-circular> -->
      <button class="signin-btn cus-btn-primary py-4 mt-2" type="submit">
        Send email
      </button>
    </form>

    <!-- <v-card-actions class="close-btn-mobile">
      <v-btn
        fab
        :color="!isfullscreen ? '#B1ADAD' : '#ffffff'"
        text
        @click="handleDialogStatus(false)"
      >
        <v-icon>fas fa-times</v-icon>
      </v-btn>
    </v-card-actions> -->
    <div
      logo
      class="close-btn"
      @click="handleDialogStatus(false)"
      :color="!isfullscreen ? '#B1ADAD' : '#ffffff'"
    >
      <div>+</div>
    </div>
  </v-card>
</template>

<script>
import { requestResetPassword } from '@/api/api_user.js';
import mutationType from '@/store/app/mutation_types';
import { mapMutations } from 'vuex';

export default {
  inject: ['handleDialogStatus', 'changeComponent'],
  props: {
    isfullscreen: Boolean,
  },
  data() {
    return {
      email: '',
      isValid: false,
      showError: false,
      isLoading: false,
      errorMessage: '',
    };
  },

  methods: {
    ...mapMutations({
      setSnackBar: mutationType.SET_SNACKBAR,
    }),
    async handleSubmit() {
      try {
        this.isLoading = true;
        const response = await requestResetPassword({ email: this.email });
        this.isLoading = false;
        this.isValid = true;
        this.setSnackBar({
          type: 'success',
          visible: true,
          text: response.data.message,
        });
        this.handleDialogStatus(false);
      } catch (error) {
        if (error.response.status === 400) {
          this.isLoading = false;
          this.errorMessage = error.response.data.message;
          this.isValid = false;
          this.showError = true;
          return;
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.close-btn {
  @media only screen and (max-width: 768px) {
    background: none;
    color: white;
    top: 5px;
    right: 5px;
  }
  div {
    @media only screen and (max-width: 768px) {
      font-size: 30px;
    }
  }
}
.wrapper-forgot {
  padding-left: 75px;
  padding-right: 73px;
  border-radius: 5px;
  /* width: 448px; */
}
.text-mail {
  font-size: 30px;
}
.input-wrapper {
  position: relative;
  width: 100%;
  box-shadow: 0px 0px 5px #3597e2;
  border-radius: 5px;
  height: 52px;
  margin-bottom: 4px;
}

.input-wrapper i {
  color: #9c30af;
  position: absolute;
  top: 50%;
  left: 20px;
  transform: translateY(-50%);
}
.error-valid {
  height: 17px;
  display: flex;
  align-items: center;
  margin: 5px 0 10px 0;
  width: 100%;
  font: italic normal normal 14px/17px Roboto;
}
._error {
  border: 1px solid #e94747 !important;
  box-shadow: 0px 0px 5px #e94747 !important;
}

.input-wrapper input {
  width: 100%;
  padding: 14px;
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
  height: 52px !important;
  margin-top: 12px !important;
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
  .wrapper-forgot {
    border-radius: 0px;
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
  .v-application .mt-5 {
    margin-top: 0 !important;
  }
  .close-btn-mobile {
    display: block;
  }
  .error-valid {
    width: 300px !important;
    color: white !important;
  }
  .white-color-icon {
    filter: invert(99%) sepia(1%) saturate(5%) hue-rotate(12deg)
      brightness(200%) contrast(101%);
  }
  .logo {
    width: 260px;
    height: 250px;
  }
  .input-wrapper {
    position: relative;
    width: 300px;
    box-shadow: 0px 0px;
    margin-bottom: 4px;
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
    color: #ffffff !important;
    position: absolute;
    top: 50%;
    left: 20px;
    transform: translateY(-50%);
  }
  .signin-btn {
    height: 52px !important;
    box-shadow: 0px 0px 0px transparent !important;

    top: 466px;
    left: 57px;
    width: 300px;
    height: 52px;
    background-color: transparent !important;
    border: 1px solid #ffffff;
    border-radius: 5px !important;
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
  .wrapper-forgot {
    border-radius: 0px;
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
    margin-bottom: 4px;
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
    color: #ffffff !important;
    position: absolute;
    top: 50%;
    left: 20px;
    transform: translateY(-50%);
  }
  .signin-btn {
    top: 466px;
    left: 57px;
    height: 52px !important;
    background-color: transparent;
    border: 1px solid #ffffff;
    border-radius: 5px;
    box-shadow: 0px 0px 0px transparent !important;
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
