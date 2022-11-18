<template>
  <v-card width="360px" class="text-center">
    <img src="@/assets/images/trash-can-solid.svg" alt="" />
    <p class="title-text">{{ confirmDialogInfo.title }}</p>
    <p class="content-text">{{ confirmDialogInfo.question }}</p>
    <p class="content-text">{{ confirmDialogInfo.detail }}</p>
    <div class="btn-block">
      <v-btn class="cus-btn-cancel cus-btn-margin-right" @click="cancel">
        Cancel
      </v-btn>
      <v-btn class="cus-btn-delete" @click="ok">
        Delete
      </v-btn>
    </div>
  </v-card>
</template>

<script>
export default {
  name: 'ConfirmDialog',
  props: {
    confirmDialogInfo: {
      type: Object,
      default: function() {
        return {
          title: 'title',
          question: 'question',
          detail: 'detail',
        };
      },
    },
  },
  methods: {
    ok() {
      this.$emit('processConfirmDialog', 'Ok');
    },
    cancel() {
      this.$emit('processConfirmDialog', 'Cancel');
    },
  },

  mounted() {
    document.addEventListener('keydown', (e) => {
      if (e.key == 'Escape') {
        return this.$emit('processConfirmDialog', 'Cancel');
      }

      if (e.key == 'Enter') {
        return this.$emit('processConfirmDialog', 'Ok');
      }
    });
  },
};
</script>

<style scoped>
.text-center {
  padding: 30px;
}

.v-card {
  border-radius: 5px;
  width: 500px !important;
}

.title-text {
  font: 700 20px Roboto !important;
  margin: 15px 0px 5px;
  color: #000;
}

.content-text {
  margin-bottom: 0px;
  font: lighter 16px/20px Roboto;
  color: #8e8e8e;
}
.btn-block {
  margin-top: 22px;
  display: flex;
  justify-content: flex-end;
}

.btn-yes,
.btn-cancel {
  text-transform: none;
  letter-spacing: 0;
  height: 36px !important;
  border-radius: 5px;
  color: #ffffff !important;
  width: 46px !important;
}

.btn-yes {
  background-color: #3597e2 !important;
  margin-right: 8px;
}

.btn-cancel {
  background-color: #e41414 !important;
}

@media (max-width: 600px) {
  .v-card {
    width: 100% !important;
  }
}
</style>
