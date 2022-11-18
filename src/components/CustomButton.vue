<template>
  <v-btn v-bind="$attrs" v-on="$listeners" class="cus-btn-primary">
    <v-icon left v-if="icon" class="icon" :size="iconSize">
      {{ icon }}
    </v-icon>
    <span class="text-none">{{ text }}</span>
  </v-btn>
</template>

<script>
export default {
  name: 'custom-button',
  props: {
    text: {
      type: String,
      default: '',
    },
    icon: {
      type: String,
      default: '',
    },
    iconSize: {
      type: Number,
      default: 16,
    },
  },
  methods: {},
};
</script>

<style scoped>
.button {
  border-radius: 5px;
  font: 500 16px Roboto !important;
  color: #ffffff !important;
  padding: 16px;
}

.icon {
  /*font-size: 20px !important;*/
  /* color: #ffffff !important; */
}

.theme--light.v-btn.v-btn--disabled .v-icon,
.theme--light.v-btn.v-btn--disabled .v-btn__loading {
  color: #ffffff !important;
}
</style>
