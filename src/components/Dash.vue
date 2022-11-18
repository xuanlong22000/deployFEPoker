<template>
  <div class="timeline">
    <div class="timeline-event">
      <div class="timeline-event_dashed"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'dash-line',
  data() {
    return {};
  },
};
</script>

<style lang="scss" scoped>
.timeline {
  display: flex;
  flex-direction: column;
  &-event {
    position: relative;
    display: flex;
    border-radius: 8px;
    align-items: center;
    gap: 14px;
    overflow: visible;
    &_dashed {
      justify-content: center;
      align-items: center;
      position: absolute;
      border: none;
      width: 2px;
      height: 25px;
      transform: translate(25px, 15px);
      background-size: 3px 100%, 100% 3px;
      // style dashed
      background-image: linear-gradient(#8e8e8e 75%, rgba(178, 176, 176, 0) 0%);
      background-position: right;
      background-size: 1px 8px;
      background-repeat: repeat-y;
    }
  }
}
</style>
