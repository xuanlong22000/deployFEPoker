<template>
  <v-card
    :class="
      !isfullscreen
        ? 'px-16 py-10 wrapper wrapper-mobile '
        : 'px-16 py-10 wrapper wrapper-mobile '
    "
  >
    <h2
      v-if="!isfullscreen"
      class="title-form-sigin text-h4 font-weight-bold text-center"
    >
      Sign Up
    </h2>

    <form
      class="d-flex flex-column align-center"
      @submit.prevent="handleSignup"
    >
      <a v-if="isfullscreen" href="#">
        <img class="logo" src="@/assets/images/logo.svg" alt="logo" />
      </a>
      <span class="red--text error-mobile error-valid" v-show="!isValid">
        <img
          class="white-color-icon"
          style="margin-right: 10px"
          src="@/assets/images/material-error-outline.svg"
          alt=""
        />
        {{ error }}
      </span>
      <span
        class="error-valid"
        v-show="isValid"
        style="color: transparent"
      ></span>
      <div class="input-wrapper">
        <i>
          <img
            class="white-color-icon"
            src="@/assets/images/metro-user.svg"
            alt=""
          />
        </i>
        <input type="text" placeholder="Fullname" v-model="name" />
      </div>

      <div class="input-wrapper">
        <i>
          <img
            class="white-color-icon"
            src="@/assets/images/material-mail-outline.svg"
            alt=""
          />
        </i>
        <input type="text" placeholder="Mail" v-model="email" />
      </div>

      <div class="input-wrapper">
        <i style="top: 56%">
          <img
            class="white-color-icon"
            src="@/assets/images/material-lock-outline.svg"
            alt=""
          />
        </i>
        <input
          type="password"
          placeholder="Password"
          v-model="password"
          autocomplete="new-password"
        />
      </div>

      <div class="input-wrapper">
        <i style="top: 56%">
          <img
            class="white-color-icon"
            src="@/assets/images/material-lock-outline.svg"
            alt=""
          />
        </i>
        <input
          type="password"
          placeholder="Confirm Password"
          v-model="confirmPassword"
        />
      </div>

      <button class="signin-btn rounded-lg py-4" type="submit">SIGN UP</button>
      <div v-if="isfullscreen" class="btn-ipab">
        <h3>Already have an account ?</h3>
        <br />
        <button
          class="signin-btn rounded-lg py-4 mt-1"
          @click="changeComponent('SigninForm')"
        >
          SIGN IN
        </button>
      </div>
    </form>

    <div v-show="!isfullscreen" class="mt-4 text-center suggest-action">
      Already have an account?
      <button @click="changeComponent('SigninForm')">Sign In</button>
    </div>
    <div
      class="close-btn"
      :color="!isfullscreen ? '#B1ADAD' : '#ffffff'"
      @click="handleCloseForm"
    >
      <div>+</div>
    </div>
  </v-card>
</template>

<script>
import { mapActions, mapMutations } from 'vuex';
import userActions from '@/store/modules/user/action_types';
import mutationType from '@/store/app/mutation_types';
export default {
  inject: ['handleDialogStatus', 'changeComponent'],
  props: {
    isfullscreen: Boolean,
  },
  data() {
    return {
      email: '',
      name: '',
      password: '',
      confirmPassword: '',
      isValid: true,
      error: '',
    };
  },
  methods: {
    ...mapActions({
      signup: userActions.ACT_SIGNUP,
    }),
    ...mapMutations({
      setSnackBar: mutationType.SET_SNACKBAR,
    }),
    async handleSignup() {
      //validate
      try {
        const newUser = {
          email: this.email,
          name: this.name,
          password: this.password,
          confirmPassword: this.confirmPassword,
        };
        await this.signup(newUser);
        this.isValid = true;
        this.changeComponent('CheckEmailPopup', this.email);
      } catch (e) {
        if (e.response?.status === 400) {
          this.error = e.response.data.message;
          this.isValid = false;
        }
      }
    },
    handleCloseForm() {
      this.email = '';
      this.name = '';
      this.password = '';
      this.confirmPassword = '';
      this.error = '';
      this.handleDialogStatus(false);
      this.isValid = true;
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
.v-dialog {
  @media (max-width: 768px) {
    display: contents;
  }
}
.input-wrapper {
  position: relative;
  width: 100%;
  box-shadow: 0px 0px 5px #3597e2;
  border-radius: 8px;
  margin-bottom: 15px;
}

.error-valid {
  display: flex;
  align-items: center;
  margin: 5px 0 10px 0;
  width: 100%;
  height: 24px;
  font: italic normal normal 14px/17px Roboto;
}
.input-wrapper i {
  color: #9c30af;
  position: absolute;
  top: 52%;
  left: 20px;
  transform: translateY(-50%);
}

.input-wrapper input {
  width: 100%;
  padding: 16px 20px 15px 45px;

  border-radius: inherit;
}

.input-wrapper input:focus {
  outline: none;
  border: none;
}

.input-wrapper input::placeholder {
  color: #cccccc;
  font-size: 16px;
  font: normal normal normal 16px/17px Chivo;
}

.forgot-password {
  color: #b1adad;
  font: normal normal normal 15px/17px Alegreya Sans;
}

.signin-btn {
  display: block;
  width: 100%;
  background-color: #3597e2;
  color: #fff;
  font-size: 16px;
  margin-top: 5px;
}

.suggest-action {
  color: #b1adad;
  font: normal normal normal 16px/17px Alegreya Sans;
}

.suggest-action button {
  color: #3597e2;
}

.wrapper {
  position: relative;
}

@media (max-width: 500px) {
  .wrapper {
    padding: 16px 32px !important;
  }
}

@media (max-width: 375px) {
  .wrapper h2 {
    font-size: 24px !important;
  }

  .suggest-action {
    margin-top: 8px !important;
  }

  .input-wrapper {
    margin-bottom: 16px !important;
  }
}

@media only screen and (min-width: 280px) and (max-width: 1024px) {
  .wrapper-mobile {
    top: 0px;
    left: 0px;
    width: 414px;
    height: 845px;
    background: transparent url('../../assets/images/banner-desktop.jpg') 0% 0%
      no-repeat padding-box;
    background-size: cover;
    background-position: center;
    opacity: 1;
    max-height: 200vh;
  }
  .v-application .mt-7 {
    margin-top: 0 !important;
  }
  @media (max-width: 375px) {
    .logo {
      width: 260px !important;
      height: 150px !important;
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
      height: 42px !important;
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
      top: 52%;
      left: 20px;
      transform: translateY(-50%);
    }
  }
  .error-valid {
    height: 18px;
  }
  .white-color-icon {
    filter: invert(99%) sepia(1%) saturate(5%) hue-rotate(12deg)
      brightness(200%) contrast(101%);
  }
  .logo {
    width: 260px;
    height: 200px;
  }
  .input-wrapper {
    position: relative;
    width: 300px;
    box-shadow: 0px 0px;
    margin-bottom: 10px;
  }
  .input-wrapper:last-child {
    margin-bottom: 26px;
  }
  .input-wrapper input {
    top: 324px;
    left: 57px;
    width: 300px;
    height: 52px;
    background: #ffffff4d 0% 0% no-repeat padding-box;
    opacity: 1;
    color: white;
    font: normal normal normal 16px/17px Chivo;
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
    top: 52%;
    left: 20px;
    transform: translateY(-50%);
  }
  input:-webkit-autofill,
  input:-webkit-autofill:hover,
  input:-webkit-autofill:focus,
  textarea:-webkit-autofill,
  textarea:-webkit-autofill:hover,
  textarea:-webkit-autofill:focus,
  select:-webkit-autofill,
  select:-webkit-autofill:hover,
  select:-webkit-autofill:focus {
    -webkit-text-fill-color: white;
    box-shadow: inset 0 0 0 100px #ffffff4d 0% 0% no-repeat padding-box;
    transition: background-color 5000s ease-in-out 0s;
  }
  .signin-btn {
    top: 466px;
    left: 57px;
    width: 300px;
    height: 52px;
    background-color: transparent;
    border: 1px solid #ffffff;
    border-radius: 5px;
    opacity: 1;
    margin-top: 18px;
  }
  .signin-btn:hover {
    border: 1px solid #54b1f8;
    box-shadow: 0px 0px 2px #54b1f8;
  }
  .v-application .mt-7 {
    margin-top: 0px !important;
  }
  .v-application .mt-4 {
    margin-top: 29px !important;
  }
  h3 {
    overflow: hidden;
    text-align: center;
    color: white;
    margin-top: 30px;
    font: normal normal normal 16px/17px Chivo;
  }
  h3:before,
  h3:after {
    background-color: rgb(255, 255, 255);
    content: '';
    display: inline-block;
    height: 1px;
    position: relative;
    vertical-align: middle;
    width: 50%;
  }

  h3:before {
    right: 0.5em;
    margin-left: -50%;
  }

  h3:after {
    left: 0.5em;
    margin-right: -50%;
  }
  .error-mobile {
    color: #ffffff !important;
    width: 300px;
    font: italic normal normal 14px/17px Roboto;

    .white-color-icon {
      filter: invert(99%) sepia(1%) saturate(5%) hue-rotate(12deg)
        brightness(200%) contrast(101%);
    }
  }
}
@media only screen and (min-width: 768px) and (max-width: 1024px) {
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
    max-height: 200vh;
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
    top: 52%;
    left: 20px;
    transform: translateY(-50%);
  }
  .signin-btn {
    top: 466px;
    left: 57px;
    width: 50%;
    height: 52px;
    background-color: #3597e200;
    border: 1px solid #ffffff;
    border-radius: 5px;
    opacity: 1;
    font: normal normal bold 21px/17px Segoe UI;
    /* margin-top: 18px; */
  }
  .btn-ipab {
    width: 50%;
  }
  .btn-ipab h3 {
    font: normal normal normal 16px/17px Alegreya Sans;
  }
  .btn-ipab .signin-btn {
    top: 466px;
    left: 57px;
    width: 100%;
    height: 52px;
    background-color: #3597e200;
    border: 1px solid #ffffff;
    border-radius: 5px;
    opacity: 1;
    font: normal normal bold 21px/17px Segoe UI;
    /* margin-top: 18px; */
  }
  .signin-btn:hover {
    border: 1px solid #54b1f8;
    box-shadow: 0px 0px 2px #54b1f8;
  }
  .v-application .mt-7 {
    margin-top: 0px !important;
  }
  .v-application .mt-4 {
    margin-top: 29px !important;
  }
  h3 {
    overflow: hidden;
    text-align: center;
    color: white;
    margin-top: 30px;
    font: normal normal normal 16px/17px Chivo;
  }
  h3:before,
  h3:after {
    background-color: rgb(255, 255, 255);
    content: '';
    display: inline-block;
    height: 1px;
    position: relative;
    vertical-align: middle;
    width: 50%;
  }

  h3:before {
    right: 0.5em;
    margin-left: -50%;
  }

  h3:after {
    left: 0.5em;
    margin-right: -50%;
  }
  .error-mobile {
    width: 50%;
    color: #ffffff !important;
  }

  .white-color-icon {
    filter: invert(99%) sepia(1%) saturate(5%) hue-rotate(12deg)
      brightness(200%) contrast(101%);
  }
}
</style>
