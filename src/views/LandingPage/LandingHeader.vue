<template>
  <header class="header">
    <a href="#" class="logo">
      <img src="@/assets/images/logo-poker.svg" alt="logo" />
    </a>
    <div class="btn-sign-mobile">
      <button
        class="btn rounded-lg"
        id="signin-btn"
        @click="
          handleDialogStatus(true);
          changeComponent('SigninForm');
        "
      >
        Sign In
      </button>
      <button
        class="btn btn--transparent rounded-lg"
        id="signup-btn"
        @click="
          handleDialogStatus(true);
          changeComponent('SignupForm');
        "
      >
        Sign Up
      </button>
    </div>
  </header>
</template>

<script>
export default {
  inject: ['handleDialogStatus', 'changeComponent'],
};
</script>

<style lang="css" scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.logo {
  width: 200px;
}

.btn {
  font-size: 18px;
  color: #3597e2;
  background-color: #fff;
  border: 2px solid #fff;
  transition: all 0.3s linear;
  padding: 16px 32px;
}

#signin-btn {
  margin-right: 9px;
}

.btn:active {
  transform: scale(0.97);
}

.btn--transparent {
  background-color: transparent;
  color: #fff;
}

@media only screen and (min-width: 280px) and (max-width: 1024px) {
  .header {
    margin: 0 9px;
  }
  .btn-sign-mobile {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .logo img {
    width: 150px;
  }

  .btn {
    padding: 0px;
  }

  #signin-btn {
    font-size: 14px;
    color: rgb(53 151 226);
    background-color: rgb(255 255 255);
    border: 2px solid rgb(255 255 255);
    transition: all 0.3s linear;
    width: 80px;
    height: 35px;
  }
  #signup-btn {
    font-size: 14px;
    color: rgb(53 151 226);
    border: 2px solid rgb(255 255 255);
    transition: all 0.3s linear;
    color: #ffffff;
    width: 80px;
    height: 35px;
  } 
  .v-application .justify-space-between {
    justify-content: normal !important;
  }
  @media only screen and (min-width: 768px) and (max-width: 1024px) {
    .logo img {
      width: 139%;
    }
    #signin-btn {
      font-size: 21px;
      color: rgb(53 151 226);
      background-color: rgb(255 255 255);
      border: 2px solid rgb(255 255 255);
      transition: all 0.3s linear;
      width: 168px;
      height: 50px;
    }
    #signup-btn {
      font-size: 21px;
      color: rgb(53 151 226);
      border: 2px solid rgb(255 255 255);
      transition: all 0.3s linear;
      color: #ffffff;
      width: 168px;
      height: 50px;
    }
  }
  @media only screen and (min-width: 1024px) and (max-width: 1024px) {
    .logo img {
      width: 186%;
    }
    #signin-btn {
      font-size: 28px;
      color: rgb(53 151 226);
      background-color: rgb(255 255 255);
      border: 2px solid rgb(255 255 255);
      transition: all 0.3s linear;
      width: 200px;
      height: 70px;
    }
    #signup-btn {
      font-size: 28px;
      color: rgb(53 151 226);
      border: 2px solid rgb(255 255 255);
      transition: all 0.3s linear;
      color: #ffffff;
      width: 200px;
      height: 70px;
    }
  }
}
</style>
