<template>
  <div class="top-title">
    <img src="@/assets/images/icon-logo.svg" alt="" />
    <h4>{{ title }}</h4>
  </div>
</template>

<script>
export default {
  name: 'TopTitle',
  props: {
    title: {
      type: String,
      default: 'Text',
    },
  },
};
</script>

<style scoped>
.top-title {
  display: flex;
  align-items: center;
}
img {
  height: 52px;
  width: 42px;
}
h4 {
  font: 500 30px Roboto;
  color: #000000;
  margin-left: 12px;
  word-break: break-word;
}
@media only screen and (min-width: 280px) and (max-width: 1024px) {
  .top-title {
    display: flex;
    align-items: center;
  }
  img {
    height: 42px;
    width: 32px;
  }
  h4 {
    font: 500 21px Roboto;
    color: black;
    margin-left: 12px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    width: 100%;
  }
}
@media (max-width: 880px) {
  .top-title {
    margin-bottom: 24px;
  }
}
</style>
