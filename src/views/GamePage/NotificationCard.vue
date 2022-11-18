<template>
  <div class="pick-card">
    <transition name="bounce" mode="out-in">
      <p
        :class="[
          { disable: message === 'Waiting for players....' },
          { error: isError },
          {
            finishGameTable:
              message === 'Thank you for playing this game...' ||
              message === 'Game are already finished' ||
              message === 'Sorry! You were kicked from this game.' ||
              message === 'You are already join game in somewhere!' ||
              message === 'Oops, You were kicked from this game!' ||
              message === 'This backlog was removed' ||
              message === 'Game already started' ||
              message === 'This project was removed' ||
              message === 'This game doesn\'t exist' ||
              message === 'This backlog doesn\'t exist!' ||
              message === 'This project isn\'t existed!' ||
              message === 'No Message',
          },
        ]"
        :key="message"
      >
        <span>{{ message }}</span>
      </p>
    </transition>
  </div>
</template>
<script>
export default {
  data() {
    return {
      name: 'NotificationCard',
      isGuest: false,
    };
  },
  props: {
    countPlayer: { type: Number },
    message: {
      type: String,
    },
    isError: {
      type: Boolean,
      default: false,
    },
  },
  mounted() {
    if (this.$route.name === 'end-game-guest') {
      this.isGuest = true;
    }
  },
};
</script>
<style>
.pick-card {
  width: 100%;
  display: flex;
  margin: 4px 0 4px 0;
  justify-content: center;
}
.pick-card p {
  width: 100%;
  background-color: #d7e9ff;
  min-width: 330px;
  min-height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 30px;
  font-size: 20px;
  font-weight: 100;
  margin-bottom: 0;
  padding: 0 15px;
}

.finishGameTable {
  width: 490px !important;
}

.changeWidthTable {
  background-color: #d7e9ff;
  min-width: 440px !important;
  min-height: 150px !important;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 30px;
  font-size: 20px;
  font-weight: 100;
  margin-bottom: 0;
}

.pick-card p.disable {
  background-color: #aaaaaa;
  color: black;
}
.pick-card p.error {
  background-color: #d9534f;
  color: #ffffff !important;
}
.pick-card span {
  font: normal normal normal 20px/17px Roboto;
  color: #424242;
  text-align: center;
}
.bounce-enter-active {
  animation: bounce-in 0.5s;
}
.bounce-leave-active {
  animation: bounce-in 0.5s reverse;
}
@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.3);
  }
  100% {
    transform: scale(1);
  }
}
@media only screen and (max-width: 540px) {
  .pick-card p {
    min-width: 320px;
  }
}
</style>
