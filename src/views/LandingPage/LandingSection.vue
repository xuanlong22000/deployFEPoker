<template>
  <section
    class="
      introduce
      d-flex
      flex-lg-row flex-md-column flex-sm-column flex-xs-column
      align-center
      justify-space-between
      mt-16
      pt-13
    "
  >
    <div
      class="
        introduce-left
        d-lg-block d-md-flex d-sm-flex
        flex-column
        align-center
        justify-space-between
        mb-md-6 mb-sm-6
        mr-lg-8 mr-md-0
      "
    >
      <h1
        class="
          introduce-heading
          font-weight-bold
          text-lg-left text-md-center text-sm-center text-xs-center
        "
      >
        Estimation made effortless
      </h1>
      <p
        class="
          mt-8
          introduce-desc
          font-weight-light
          text-lg-left text-md-center text-sm-center text-xs-center
        "
      >
        Ezteam planning poker makes estimating easy and effortless. Save time,
        shorten your meetings.
      </p>
    </div>
    <div class="introduce-right mt-8">
      <img src="@/assets/images/img-banner.svg" alt="banner" />
    </div>
  </section>
</template>

<script>
export default {};
</script>

<style lang="css" scoped>
.introduce-heading {
  line-height: 1.2;
  width: 460px;
  font-size: 64px;
  color: #fff;
}

.introduce-desc {
  width: 544px;
  font-size: 25px;
  color: #fff;
}

.introduce-right img {
  width: 100%;
}

@media screen and (max-width: 600px) {
  .introduce {
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
  }

  .introduce-heading {
    top: 148px;
    left: 24px;
    width: 286px;
    height: 96px;
    text-align: left;
    font: normal normal bold 40px/48px Roboto;
    letter-spacing: 0px;
    color: #ffffff;
    opacity: 1;
  }

  .introduce-left {
    display: flex;
    align-items: center;
  }

  .landing-page-screen {
    padding: 20px;
  }

  #signin-btn {
    margin-right: 8px;
  }
}

@media (max-width: 1264px) {
  .introduce-desc {
    top: 272px;
    left: 24px;
    width: 345px;
    height: 98px;
    text-align: left;
    font: normal normal normal 18px/38px Roboto;
    letter-spacing: 0px;
    color: #ffffff;
  }

  .introduce-right {
    padding: 0 16px;
  }
}

@media (max-width: 620px) {
  .introduce-heading {
    font-size: 48px;
    width: 345px;
  }
  .introduce-desc {
    top: 272px;
    left: 24px;
    width: 345px;
    height: 98px;
    text-align: left;
    font: normal normal normal 18px/38px Roboto;
    letter-spacing: 0px;
    color: #ffffff;
  }
}

@media (max-width: 376px) {
  .introduce {
    margin-top: 0 !important;
  }

  .introduce-heading {
    font-size: 40px;
  }

  .introduce-desc {
    top: 272px;
    left: 24px;
    width: 345px;
    height: 98px;
    text-align: left;
    font: normal normal normal 18px/38px Roboto;
    letter-spacing: 0px;
    color: #ffffff;
  }
}

@media (max-height: 813px) and (max-width: 376px) {
  .introduce {
    padding-top: 144px !important;
  }
}

@media (max-width: 375px) {
}
</style>
