<template>
  <div style="text-align: center">
    <!-- <div class="avatar-block">
      <img src="@/assets/images/avatar.jpg" alt="" class="avatar-img" />
      <img
        src="@/assets/images/checked-icon.png"
        alt=""
        class="avatar-status"
      />
    </div>
    <p class="avatar-name">{{ nameUser }}</p> -->
  </div>
</template>

<script>
export default {
  name: 'AvatarGame',
  data() {
    return {};
  },
  methods: {},
  props: {
    avaUser: {
      type: String,
      default: '@/assets/images/avatar.jpg',
    },
    statusUser: {
      type: String,
      default: '@/assets/images/checked-icon.png',
    },
    nameUser: {
      type: String,
      default: 'Thao Vo',
    },
  },
};
</script>

<style scoped>
.avatar-block {
  margin-top: 50px;
  position: relative;
  display: inline;
}
.avatar-img {
  width: 150px;
  border: 2px solid #ffffff;
  border-radius: 50%;
  box-shadow: 0px 1px 4px rgb(0, 0, 2);
}
.avatar-status {
  width: 25px;
  position: absolute;
  bottom: 12px;
  right: 12px;
}
.avatar-name {
  font: 500 24px Roboto;
  color: #ffffff;
  margin-top: 18px;
}
</style>
