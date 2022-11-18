<template>
  <div>
    <div class="overlay">
      <div class="overlay__inner">
        <div class="overlay__content">
          <span class="spinner"></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'loading-overlay',
  setup() {
    return {};
  },
};
</script>

<style lang="scss" scoped>
.overlay {
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  position: fixed;
  background: rgba(255, 255, 255, 0.07);
  border-radius: 16px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(1.9px);
  -webkit-backdrop-filter: blur(1.9px);
  z-index: 99;

  &__inner {
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    position: absolute;
  }
  &__content {
    left: 50%;
    position: absolute;
    top: 50%;
    transform: translate(-50%, -50%);
  }
}

.spinner {
  animation: rotate 1s infinite linear;
  box-shadow: 0 0 5px #19191900 inset;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  border-radius: 50%;
  background-image: linear-gradient(25deg, #9C30AF 10%, transparent 60%),
    linear-gradient(50deg, #4983D8 10%, transparent 60%),
    linear-gradient(75deg, #00CDFC 55%, transparent 80%);
  width: 6rem;
  height: 6rem;

  &:after {
    border-radius: 50%;
    box-shadow: 0 0 5px #ffffff00;
    content: '';
    display: block;
    position: relative;
    margin: 10px auto;
    width: 5.2rem;
    height: 5.2rem;
    background: #f4f6fa;
  
  }
}

@keyframes rotate {
  100% {
    transform: rotate(360deg);
  }
}

@media screen and (max-width: 768px) {
  .overlay {
  &__inner {
    width: 85%;
  }
}
  .spinner {
  width: 3.5rem;
  height: 3.5rem;
  &:after {
    border-radius: 50%;
    box-shadow: 0 0 5px #ffffff00;
    content: '';
    display: block;
    position: relative;
    margin: 10px auto;
    width: 2.8rem;
    height: 2.8rem;
    background: #f4f6fa;
  }
}
}
</style>
