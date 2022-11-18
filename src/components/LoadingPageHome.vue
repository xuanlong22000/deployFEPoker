<template>
  <div>
    <div class="face">
      <div class="container">
        <img
          src="../../public/icon-logo.loading.svg"
          width="150px"
          height="150px"
        />
        <span class="loading"></span>
        <div class="caption">
          <h2>PLANNING POKER</h2>
          <ul>
            <li>Estimates</li>
            <li>Made</li>
            <li>Easy</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LoadingPageHome',
  data() {
    return {};
  },
  methods: {},
  props: {},
};
</script>

<style scoped>
body {
  margin: 0;
}
.container {
  margin: auto;
  position: relative;
}
.face {
  text-align: center;
}
.loading {
  width: 130px;
  display: block;
  height: 2px;
  margin: 28px auto;
  border-radius: 2px;
  background-color: #cfcfcf;
  position: relative;
  overflow: hidden;
  z-index: 1;
}
.loading:before {
  content: '';
  height: 3px;
  width: 68px;
  position: absolute;
  -webkit-transform: translate(-34px, 0);
  -ms-transform: translate(-34px, 0);
  transform: translate(-34px, 0);
  background-color: #0073b1;
  border-radius: 2px;
  -webkit-animation: initial-loading 1.5s infinite ease;
  animation: animation 1.4s infinite ease;
}
@-webkit-keyframes animation {
  0% {
    left: 0;
  }
  50% {
    left: 100%;
  }
  100% {
    left: 0;
  }
}
@keyframes animation {
  0% {
    left: 0;
  }
  50% {
    left: 100%;
  }
  100% {
    left: 0;
  }
}
.face .container > img {
  padding: 20px;
  background: #ffffff;
  /* -webkit-box-shadow: 0px 7px 20px 2px rgba(167, 167, 167, 0.6); */
  /* box-shadow: 0px 7px 20px 2px rgba(167, 167, 167, 0.6); */
  border-radius: 2px;
  animation: bounce 1.4s ease infinite;
  -webkit-animation: bounce 1.4s ease infinite;
  -moz-animation: bounce 1.4s ease infinite;
  -ms-animation: bounce 1.4s ease infinite;
  -o-animation: bounce 1.4s ease infinite;
}
@-webkit-keyframes bounce {
  0% {
    -webkit-transform: scale(1);
    transform: scale(1);
    -webkit-filter: blur(0);
    filter: blur(0);
  }
  50% {
    -webkit-transform: scale(0.9);
    transform: scale(0.9);
    -webkit-filter: blur(1.4);
    filter: blur(1.4);
    /* -webkit-box-shadow: 0px 0.3px 5px 0.5px rgb(167, 167, 167); */
    /* box-shadow: 0px 0.3px 5px 0.5px rgb(167, 167, 167); */
  }
  100% {
    -webkit-transform: scale(1);
    transform: scale(1);
  }
}
@keyframes bounce {
  0% {
    -webkit-transform: scale(1);
    transform: scale(1);
    -webkit-filter: blur(0);
    filter: blur(0);
  }
  50% {
    -webkit-transform: scale(0.9);
    transform: scale(0.9);
    -webkit-filter: blur(1.4);
    filter: blur(1.4);
    /* -webkit-box-shadow: 0px 0.3px 5px 0.5px rgb(167, 167, 167); */
    /* box-shadow: 0px 0.3px 5px 0.5px rgb(167, 167, 167); */
  }
  100% {
    -webkit-transform: scale(1);
    transform: scale(1);
  }
}
.caption {
  margin-top: 80px;
  text-align: center;
}
.caption h2 {
  font-family: Trebuchet MS;
  color: #8f8f8f;
  margin: 0 0 8px;
  font-weight: normal;
  text-transform: uppercase;
  letter-spacing: 3px;
}

.caption ul {
  margin: 0;
  padding: 0;
}

.caption li {
  list-style: none;
  display: inline-block;
  letter-spacing: 3px;
  font-size: 18px;
  color: #f3f3f3;
  margin-right: 5px;
  font-family: Arial Narrow, sans-serif;
  animation: on-run 2.6s ease infinite;
  -webkit-animation: on-run 2.6s ease infinite;
  -moz-animation: on-run 2.6s ease infinite;
  -ms-animation: on-run 2.6s ease infinite;
  -o-animation: on-run 2.6s ease infinite;
}
.caption li:nth-child(1) {
  -webkit-animation-delay: 0.2s;
  animation-delay: 0.2s;
}
.caption li:nth-child(2) {
  -webkit-animation-delay: 0.4s;
  animation-delay: 0.4s;
  margin-right: 10px;
}
.caption li:nth-child(3) {
  -webkit-animation-delay: 0.6s;
  animation-delay: 0.6s;
}
.caption li:nth-child(4) {
  -webkit-animation-delay: 0.8s;
  animation-delay: 0.8s;
}
.caption li:nth-child(5) {
  -webkit-animation-delay: 1s;
  animation-delay: 1s;
  margin-right: 10px;
}
.caption li:nth-child(6) {
  -webkit-animation-delay: 1.2s;
  animation-delay: 1.2s;
}
.caption li:nth-child(7) {
  -webkit-animation-delay: 1.4s;
  animation-delay: 1.4s;
}
.caption li:nth-child(8) {
  -webkit-animation-delay: 1.6s;
  animation-delay: 1.6s;
}
@-webkit-keyframes on-run {
  0% {
    color: #f3f3f3;
  }
  25% {
    color: #0073b1;
  }
  50% {
    color: #0073b1;
  }
  75% {
    color: #f3f3f3;
  }
  100% {
    color: #f3f3f3;
  }
}
@keyframes on-run {
  0% {
    color: #f3f3f3;
  }
  25% {
    color: #0073b1;
  }
  50% {
    color: #0073b1;
  }
  75% {
    color: #f3f3f3;
  }
  100% {
    color: #f3f3f3;
  }
}
.caption li:last-child {
  margin-right: 0;
}
</style>
