<template>
  <div class="endgame-screen" :class="{ isGuest: 'isGuest' }">
    <!-- <div>
      <top-title
        :class="{ hide: title === 'NoName' }"
        :title="title"
      ></top-title>
    </div> -->
    <transition v-if="title" name="bounce">
      <notification-card
        :message="message"
        :isError="error"
      ></notification-card>
    </transition>
    <!-- <custom-button
      @click="onClickConfirm()"
      class="btn-back"
      text="Back To Project"
    ></custom-button> -->
  </div>
</template>

<script>
// import CustomButton from '@/components/CustomButton.vue';
import NotificationCard from '@/views/GamePage/NotificationCard.vue';
// import TopTitle from '@/components/TopTitle.vue';

export default {
  components: {
    NotificationCard,
    // CustomButton,
    // TopTitle,
  },
  name: 'GameScreen',
  props: {
    messageEndGame: { type: String },
    titleEndGame: { type: String },
  },
  data() {
    return {
      message: 'No Message',
      title: 'NoName',
      error: false,
      isGuest: false,
    };
  },
  mounted() {
    // const token = this.$route.query.token;
    if (!this.messageEndGame) {
      if (this.$route.name === 'end-game-guest') {
        this.isGuest = true;
      }
      const { title, message, error } = this.$route.query;
      if (title) {
        this.title = title;
      }
      if (message) {
        this.message = message;
      }
      if (error) {
        this.error = error;
      }
    } else {
      this.isGuest = true;
      if (this.titleEndGame) {
        this.title = this.titleEndGame;
      }
      if (this.messageEndGame) {
        this.message = this.messageEndGame;
      }
    }
  },
};
</script>
<style scoped>
.endgame-screen {
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
}
.isGuest {
  padding: 64px 24px;
}
.bounce-enter-active {
  animation: bounce-in 0.3s;
}
.bounce-leave-active {
  animation: bounce-in 0.3s reverse;
}
.hide {
  opacity: 0;
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
</style>
