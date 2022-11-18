<template>
  <div class="invite-block-wrapper">
    <div @click="close" class="close-btn">
      <div>+</div>
    </div>
    <div class="scroll-wrap">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  name: 'invite-popup-wrap',
  methods: {
    close() {
      try {
        this.$slots.default[0]?.componentInstance?.closePopup();
      } catch (e) {
        this.$emit('closePopup');
      }
    },
  },
};
</script>

<style lang="scss">
// .v-dialog {
//   background: red;
//   margin: 0 15px;
// }
.v-dialog {
  margin: 0 15px;
}
.invite-block-wrapper {
  position: relative;
  .v-dialog {
    overflow: visible !important;
  }

  .member-info-input > div > div:last-child {
    margin: 0 !important;
  }

  .error-message {
    color: #f80d0d;
    font-size: 14px;
  }

  ._error {
    box-shadow: 0px 3px 6px #00000029;
    border: 1px solid #f80d0d;
    border-radius: 5px;
  }

  .scroll-wrap {
    max-height: 500px;
    overflow-x: hidden;
    overflow-y: auto;
    @media screen and (max-width: 600px) {
      .v-sheet.v-card {
        padding: 24px 10px !important;
      }
    }
  }

  .invite-block {
    position: relative;
    overflow: visible;
    padding-top: 15px;
  }

  .invite-block {
    background-color: #ffffff;
    box-shadow: 0px 3px 6px #00000029;
    border-radius: 5px;
    padding: 24px 40px;
    // width: 620px;

    .fa-solid {
      width: 40px;
      height: 40px;
      font-size: 40px;
      margin-bottom: 20px;
    }

    .invite-title {
      display: block;
      font: normal 400 20px Roboto;
      letter-spacing: 0px;
      color: #000000;
      margin-top: 16px;
    }

    .note {
      display: block;
      font-size: 16px;
      font-weight: lighter;
      letter-spacing: 0px;
      color: #8e8e8e;
      margin-top: 4px;
      margin-bottom: 24px;
    }

    .members-info-block {
      .member-info {
        display: flex;
        align-items: center;
        column-gap: 4px;
        margin-bottom: 8px;

        .member-info-input {
          .search-fill {
            display: flex;
            column-gap: 12px;
            width: 500px !important;
            letter-spacing: 0px !important;
            color: #424242d8 !important;

            .v-input__slot {
              padding-right: 2px !important;
            }

            .v-label {
              position: unset;
              margin-top: -2px;
              font: normal 400 15px Roboto;
            }

            .v-input__control input {
              color: #424242d8 !important;
              font: normal 400 15px Roboto !important;
            }

            .v-select__selections {
              span {
                color: #424242d8 !important;
                font: normal 400 15px Roboto !important;
              }
            }

            .v-input__append-outer {
              margin: 0 !important;
            }

            .v-input {
              column-gap: 8px !important;
            }

            .role {
              width: 150px !important;
              letter-spacing: 0px !important;

              .v-input__control input {
                color: #1691ef !important;
                text-align: center !important;
                font: normal 400 15px Roboto !important;
              }
            }
          }

          .v-text-field .v-input__control .v-input__slot {
            min-height: 36px !important;
          }
        }

        .btn-delete {
          color: #f80d0d;
        }
      }
    }

    .btn-block {
      margin-top: 16px;

      .add-member {
        font: normal 400 16px Roboto;
        letter-spacing: 0px;
        color: #8e8e8e;
        text-transform: none;
        height: 40px;
        border-radius: 5px;
      }

      .invite-member {
        background-color: #3597e2 !important;
        box-shadow: 0px 0px 5px #3597e2;
        border-radius: 5px;
        color: #ffffff;
        text-transform: none;
        letter-spacing: 0;
        width: 140px;
        height: 40px;
        padding-left: 20px;
      }

      .invite-member:disabled {
        background-color: #f0f0f0 !important;
      }
    }
  }

  .popup-icon-header {
    width: 40px;
    height: 32px;
    font-size: 32px;
    margin-bottom: 20px;
    align-self: center;
  }

  .model-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border-radius: 5px;
    padding: 30px 55px !important;
    background: #ffffff 0% 0% no-repeat padding-box;
    box-shadow: 0px 3px 6px #00000029;
    border: none;
    position: relative;
    width: auto;
  }

  .popup-form-group {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .popup-form-group p:nth-child(1) {
    display: flex;
    align-items: center;
    min-width: 90px;
    height: 40px;
    color: #424242d8;
    margin-right: 20px;
    font-weight: 300;
    margin-bottom: 0;
  }

  .popup-group-btn {
    width: 100%;
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
    margin-right: -50px;
    // margin-top: 35px;
  }

  .popup-reset-btn {
    width: 65px;
    height: 30px;
    background: #eb907d 0% 0% no-repeat padding-box;
    box-shadow: 0px 0px 5px #d48271;
    border-radius: 5px;
    color: white;
    font: normal normal normal 14px/17px Roboto;
    opacity: 1;
  }

  .popup-confirm-btn {
    width: 65px;
    height: 30px;
    background: #7854c0 0% 0% no-repeat padding-box;
    box-shadow: 0px 0px 5px #9c30afb5;
    border-radius: 5px;
    color: white;
    opacity: 1;
    margin-right: 15px;
    font: normal normal normal 14px/17px Roboto;
  }

  .popup-create-backlog-image {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: #2196f3;
    font-size: 41px;
    margin-bottom: -5px;
  }

  .popup-create-backlog-image .title {
    margin-top: 10px;
    margin-bottom: 20px;
  }

  .popup-create-backlog-input {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .popup-create-backlog-input p {
    margin-bottom: 0;
    margin-right: 20px;
  }

  .popup-create-backlog-label {
    font: normal normal normal 14px/17px Roboto;
    letter-spacing: 0px;
    // color: #000000;
  }

  .popup-select-wrapper {
    width: 100%;
  }

  .popup-select-wrapper input {
    width: 280px;
    height: 40px;
    background: #ffffff 0% 0% no-repeat padding-box;
    box-shadow: 0px 3px 6px #00000029;
    border-radius: 5px;
    color: #1691ef;
    padding: 10px 16px;
    font-size: 16px;
    margin-right: 10px;
    font-weight: 300;
    margin-bottom: 0;
  }

  .popup-select-wrapper input:focus-visible {
    outline: none;
  }

  .popup-select-wrapper input::placeholder {
    font-size: 14px;
  }

  .popup-title {
    font: normal normal bold 20px/26px Roboto;
    letter-spacing: 0px;
    color: #000000;
    margin-bottom: 4px !important;
    margin-top: 20px;
  }

  .popup-sub-title {
    font: normal normal normal 16px/21px Roboto;
    font-weight: 300;
    letter-spacing: 0px;
    color: #8e8e8e;
  }

  .popup-mt-3 {
    margin-bottom: 0px !important;
  }

  .popup-create-backlog {
    overflow-y: unset !important;
  }

  @media screen and (max-width: 768px) {
    .v-dialog {
      width: calc(100% - 48px) !important;
      margin: 24px 15px !important;
    }
    .popup-form-group {
      width: 100%;
    }
    .popup-form-group p:nth-child(1) {
      font-size: 12px;
      min-width: 78px;
    }
    .popup-select-wrapper input {
      width: 100%;
    }
  }
  @media screen and (max-width: 340px) {
    // input {
    //   width: 133px;
    // }
  }
  @media only screen and (max-width: 768px) {
    .popup-title,
    .popup-sub-title {
      text-align: center;
      margin-top: 10px;
      margin-bottom: 10px;
    }
    .popup-create-backlog-label {
      margin-right: 10px !important;
    }
    .popup-group-btn {
      margin: 15px 0 26px;
    }
    .popup-select-wrapper input {
      width: 100%;
    }
    .model-content {
      padding-right: 10px !important;
      padding-left: 10px !important;
      height: 222px;
    }

    .fa-cubes-stacked {
      font-size: 30px;
      margin-top: 20px;
    }
  }

  @media screen and (max-width: 700px) {
    .v-dialog {
      width: calc(100% - 48px) !important;
    }
    .invite-block {
      padding: 24px 10px;
      width: 100%;
    }
    .invite-block
      .members-info-block
      .member-info
      .member-info-input
      .search-fill {
      width: 100% !important;
    }
    .member-info-input {
      width: 100%;
    }
    .v-text-field.v-text-field--enclosed:not(.v-text-field--rounded)
      > .v-input__control
      > .v-input__slot {
      padding: 0 5px !important;
    }
    .v-input__append-outer {
      width: 100px;
    }
    .v-btn--icon.v-size--default .v-icon,
    .v-btn--fab.v-size--default .v-icon {
      height: 16px;
      font-size: 16px !important;
      width: 16px;
    }
    .v-btn--icon.v-size--default {
      width: 13px;
    }
    .invite-block .btn-block .add-member {
      padding: 0;
    }
    .v-application .px-12 {
      padding-right: 10px !important;
      padding-left: 10px !important;
    }
    .v-application .px-16 {
      padding-right: 10px !important;
      padding-left: 10px !important;
    }
    .card-container .wrap-select .search-fill {
      margin-right: 5px;
    }
  }

  @media screen and (max-width: 400px) {
    .v-dialog {
      width: calc(100% - 28px) !important;
      margin: 24px 14px !important;
    }
    .v-application .px-12 {
      padding-right: 10px !important;
      padding-left: 10px !important;
    }
    .v-application .px-16 {
      padding-right: 10px !important;
      padding-left: 10px !important;
    }
  }
}
</style>
