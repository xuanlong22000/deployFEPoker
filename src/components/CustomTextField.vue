<template>
  <v-row>
    <v-col>
      <input type="text" :placeholder="placeholder" />
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'CustomTextField',
  props: {
    placeholder: {
      type: Text,
      default: '',
    },
  },
};
</script>

<style scoped>
input {
  width: 100%;
  height: 40px;
  padding: 5px 10px;
  margin: 6px 0;
  box-shadow: 0px 0px 5px #3597e2;
  border-radius: 5px;
  font: normal normal 500 16px Roboto;
  /* color: #000000; */
  outline: none;
}
input:hover {
  cursor: text;
}
input:focus {
  box-shadow: 0px 0px 9px #228cdd;
}
</style>
