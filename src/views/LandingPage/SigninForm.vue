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
      Sign In
    </h2>

    <form class="d-flex flex-column align-center" @submit.prevent="handleLogin">
      <a v-if="isfullscreen" href="#">
        <img class="logo" src="@/assets/images/logo.svg" alt="logo" />
      </a>
      <span class="red--text error-desktop error-valid" v-show="!isValid">
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
            src="@/assets/images/material-mail-outline.svg"
            alt=""
          />
        </i>
        <input type="text" placeholder="Email Address " v-model.trim="email" />
      </div>
      <div class="input-wrapper mb-3">
        <i style="top: 56%">
          <img
            class="white-color-icon"
            src="@/assets/images/material-lock-outline.svg"
            alt=""
          />
        </i>
        <input type="password" placeholder="Password" v-model.trim="password" />
      </div>

      <a
        v-show="!isfullscreen"
        class="align-self-end mt-1 forgot-password"
        @click="changeComponent('ForgotPasswordForm')"
      >
        Forgot password?
      </a>
      <button
        v-if="!isfullscreen"
        class="signin-btn rounded-lg py-4 mt-1"
        type="submit"
      >
        SIGN IN
      </button>
      <button v-else class="signin-btn rounded-lg py-4" type="submit">
        LOGIN
      </button>

      <div v-if="isfullscreen" class="btn-ipab">
        <h3
          class="forgotpassword"
          @click="changeComponent('ForgotPasswordForm')"
        >
          Forgot password?
        </h3>
        <h3 style="margin-top: 13px; margin-bottom: 20px">OR</h3>
        <!-- <br /> -->
        <button
          class="signin-btn rounded-lg py-4"
          @click="changeComponent('SignupForm')"
        >
          CREATE AN ACOUNT
        </button>
      </div>
    </form>
    <div v-show="!isfullscreen" class="mt-4 text-center suggest-action">
      Don't have an account?
      <button @click="changeComponent('SignupForm')">Sign Up</button>
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
import { signin } from '@/api/api_user.js';
import { mapGetters, mapActions, mapMutations } from 'vuex';
import userActions from '@/store/modules/user/action_types';
import socket from '@/socket/socket';
import getterTypes from '@/store/modules/game/getter_types';
import actionTypes from '@/store/modules/game/action_types';
import userMutations from '@/store/modules/user/mutation_types';

export default {
  inject: ['handleDialogStatus', 'changeComponent'],
  props: {
    isfullscreen: Boolean,
  },
  data() {
    return {
      email: '',
      password: '',
      isValid: true,
      error: '',
    };
  },
  computed: {
    ...mapGetters({
      history: getterTypes.GET_HISTORY,
    }),
  },
  methods: {
    ...mapActions({
      login: userActions.ACT_LOGIN,
      setHistory: actionTypes.SET_HISTORY,
    }),
    ...mapMutations({
      setIsLogin: userMutations.MUTATE_SET_IS_LOGIN,
    }),
    async handleLogin() {
      try {
        const response = await signin({
          email: this.email,
          password: this.password,
        });
        this.login(response.data);
        // emit token
        await socket.emitConnectServer({
          userId: response.data.userInfo.userId,
        });
        socket.emitCheckOnlineUser();
        this.handleDialogStatus(false);
        if (this.history) {
          this.$router.push(this.history);
          this.setHistory(null);
        } else {
          this.setIsLogin(true);
          await this.$router.push({ name: 'project-list' }).catch(error => {
            console.info(error.message);
          });
        }
      } catch (e) {
        if (e.response.status === 401) {
          this.error = e.response.data.message;
          this.isValid = false;
        }
      }
    },
    handleCloseForm() {
      this.handleDialogStatus(false);
      this.email = '';
      this.password = '';
      this.error = '';
      this.isValid = true;
    },
  },

  watch: {
    email: function(newVal) {
      if (newVal !== '') {
        this.isValid = true;
      }
    },
    password: function(newVal) {
      if (newVal !== '') {
        this.isValid = true;
      }
    },
  },
};
</script>
<style>
.title-form-sigin {
  line-height: 1;
}
</style>
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
.input-wrapper {
  position: relative;
  width: 100%;
  box-shadow: 0px 0px 5px #3597e2;
  border-radius: 8px;
  margin-bottom: 16px;
}
.error-valid {
  height: 24px;
  display: flex;
  align-items: center;
  margin: 5px 0 10px 0;
  width: 100%;
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
  font-weight: 500;
  padding: 16px 20px 15px 20px;
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
  font-weight: 500;
  font: normal normal normal 16px/17px Chivo;
}

.forgot-password {
  display: flex;
  align-items: center;
  height: 15px;
  color: #2196f3;
  text-decoration: underline;
  margin-bottom: 16px;
  font: normal normal normal 15px/17px Alegreya Sans;
}

.signin-btn {
  display: block;
  width: 100%;
  height: 52px !important;
  background-color: #3597e2;
  color: #fff;
  font-size: 16px;
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

.error-mobile {
  display: none;
}

@media (max-width: 500px) {
  .wrapper {
    padding: 16px 32px !important;
  }
}

@media (max-width: 376px) {
  .wrapper h2 {
    font-size: 24px !important;
  }

  .suggest-action {
    margin-top: 8px !important;
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

  @media (max-width: 375px) {
    .logo {
      width: 260px !important;
      height: 190px !important;
    }
  }
  .logo {
    width: 260px;
    height: 250px;
  }
  .error-valid {
    height: 18px;
  }
  .white-color-icon {
    filter: invert(99%) sepia(1%) saturate(5%) hue-rotate(12deg)
      brightness(200%) contrast(101%);
  }

  .input-wrapper {
    margin-bottom: 10px;
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
    /* top: 400px; */
    /* left: 110px; */
    /* width: 66px; */
    height: 21px;
    text-align: left;
    font: normal normal normal 16px/17px Chivo;
    color: #ffffff;
  }
  .input-wrapper i {
    opacity: 1;
    color: #ffffff;
    position: absolute;
    top: 50%;
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
    margin-top: 16px;
    top: 466px;
    left: 57px;
    width: 300px;
    height: 52px;
    background-color: #3597e200;
    border: 1px solid #ffffff;
    border-radius: 5px;
    opacity: 1;
    font: normal normal bold 14px/17px Segoe UI;
  }
  .signin-btn:hover {
    border: 1px solid #54b1f8;
    box-shadow: 0px 0px 2px #54b1f8;
  }
  h3 {
    overflow: hidden;
    text-align: center;
    color: white;
    margin-top: 10px;
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
  .forgotpassword {
    margin-left: 30%;
    text-decoration: underline;
    display: inline-block;
    font: normal normal normal 15px/17px Alegreya Sans;
  }
  .v-application .align-center {
    margin-top: 0px;
  }
  .error-mobile {
    color: rgb(233, 236, 25) !important;
  }
  .v-application .mt-4 {
    margin-top: 0px !important;
  }

  .error-desktop {
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
    background: transparent url('../../assets/images/banner-desktop.jpg') 0% 0%
      no-repeat padding-box;
    background-size: cover;
    background-position: center;
    opacity: 1;
    max-height: 200vh;
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
    /* top: 400px;
    left: 110px; */
    /* width: 66px; */
    height: 21px;
    text-align: left;
    font: normal normal normal 17px/17px Chivo;
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
  .btn-ipab {
    width: 50%;
  }

  .btn-ipab .signin-btn {
    top: 466px;
    left: 57px;
    width: 100%;
    height: 52px;
    background-color: transparent;
    border: 1px solid #ffffff;
    border-radius: 5px;
    opacity: 1;
  }
  .error-valid {
    height: 18px;
  }
  .signin-btn {
    top: 466px;
    left: 57px;
    width: 50%;
    height: 52px;
    background-color: transparent;
    border: 1px solid #ffffff;
    border-radius: 5px;
    opacity: 1;
    font: normal normal bold 21px/17px Segoe UI;
  }

  .signin-btn:hover {
    border: 1px solid #54b1f8;
    box-shadow: 0px 0px 2px #54b1f8;
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
  .forgotpassword {
    margin-top: 10px;
    display: inline-block;
    font: normal normal normal 15px/17px Alegreya Sans;
  }
  .v-application .align-center {
    margin-top: 0px;
  }
  .error-mobile {
    color: rgb(233, 236, 25) !important;
  }
  .v-application .mt-4 {
    margin-top: 0px !important;
  }

  .error-desktop {
    width: 50%;
  }
}
</style>
