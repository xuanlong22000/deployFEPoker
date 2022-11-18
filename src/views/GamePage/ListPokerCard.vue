<template>
  <div class="wrap-list-card">
    <!-- <div class="card_sub">
      <span>Choose your card</span>
      <img src="@/assets/images/icon-confirm.png" />
    </div> -->
    <transition name="slide-fade" mode="out-in">
      <div class="list-card">
        <div
          :key="item"
          @click="onClickCardItem(item)"
          :class="{ active: selectedItem === item, enable: !isDisable }"
          v-for="item in listNumber()"
          class="card-item"
        >
          {{ item }}
        </div>
        <!--        <v-tooltip top>-->
        <!--          <template v-slot:activator="{ on, attrs }">-->
        <div class="poker-card-input">
          <input
            :disabled="isDisable"
            :key="isDisable"
            :class="{ enable: !isDisable }"
            v-model="textValue"
            @focus="onFocusInput"
            @change="onChangeInput($event.target.value)"
            @keypress="validateInput"
            placeholder="?"
            class="card-input"
            type="number"
            min="1"
            max="999"
            @mouseover="isHoverInput = true"
            @mouseleave="isHoverInput = false"
          />
          <div class="tooltip-input" v-if="isHoverInput">
            <span>Enter number you estimate</span>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>
<script>
import { mapActions, mapMutations, mapGetters } from 'vuex';
import mutationType from '@/store/app/mutation_types';
import getterTypes from '@/store/modules/game/getter_types';
import actionTypes from '@/store/modules/game/action_types';

import MESSAGE from '@/utils/utils_message';
export default {
  name: 'ListPokerCard',
  data() {
    return {
      textValue: '',
      selectedItem: null,
      status: false,
      isUpCard: false,
      isHoverInput: false,
    };
  },
  watch: {
    isDisable: {
      handler() {
        if (this.isDisable) {
          this.status = false;
          this.selectedItem = 10000;
          this.isUpCard = false;
        }
      },
      immediate: true,
    },
    initSelectedItem() {
      this.selectedItem = this.initSelectedItem;
      if (!this.listNumber().includes(this.selectedItem)) {
        this.textValue = this.selectedItem;
      }
    },
  },
  computed: {
    ...mapGetters({
      isDisable: getterTypes.GET_STATUS_CARD,
    }),
  },
  methods: {
    ...mapMutations({
      setSnackBar: mutationType.SET_SNACKBAR,
    }),
    ...mapActions({
      disableCard: actionTypes.DISABLE_CARD,
    }),

    onClickCardItem(item) {
      if (this.isDisable) return;
      if (item === this.selectedItem) {
        this.selectedItem = null;
      } else {
        this.selectedItem = item;
      }
      this.getSelectedCard(item);
    },
    onChangeInput: function(number) {
      const checkPositiveNumber = str => {
        const n = Number(str);
        return n !== Infinity && n >= 0 && n <= 999;
      };
      if (!checkPositiveNumber(number)) {
        this.setSnackBar({
          type: 'error',
          visible: true,
          text: MESSAGE.SELECT_CARD_MUST_A_NUMBER,
        });
        // return;
      }
      this.getInputCard(Math.round(+number * 10) / 10);
      this.textValue = '';
      this.selectedItem = null;
    },
    onFocusInput: function() {
      this.selectedItem = null;
    },
    validateInput(event) {
      if (event) {
        var charCode = event.which ? event.which : event.keyCode;
        if (
          charCode > 31 &&
          (charCode < 48 || charCode > 57) &&
          charCode !== 46
        ) {
          event.preventDefault();
        } else {
          return true;
        }
      }
    },
    hoverInput() {
      this.isHoverInput = true;
    },
  },
  created() {
    this.selectedItem = this.initSelectedItem;
  },

  props: {
    listNumber: {
      type: Function,
      default: () => [0, 1, 3, 5, 8, 13, 21, 34, 55, 89],
    },
    initSelectedItem: {
      default: null,
    },
    getSelectedCard: {
      type: Function,
      default: null,
    },
    getInputCard: {
      type: Function,
      default: null,
    },
  },
};
</script>
<style scope>
/* Chrome, Safari, Edge, Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type='number'] {
  -moz-appearance: textfield;
}

.list-card {
  display: flex;
  margin-top: 21px;
  padding: 0 30px;
  justify-content: center;
  min-width: 616px;
  /* flex-wrap: wrap; */
  /* transition: all ease-in-out 2s; */
}
.poker-card-input {
  position: relative;
}
.tooltip-input {
  position: absolute;
  top: -20px;
  left: -60px;
  background-color: rgba(0, 0, 0, 0.99);
  opacity: 0.6;
  color: #ffffff;
  border-radius: 8px;
  width: 200px;
  padding: 4px;
  font: normal 300 15px Roboto;
  text-align: center;
  transform: translateY(-10px);
  transition: transform 0.3s;
}
.tooltip-input:after {
  position: absolute;
  display: block;
  color: rgba(0, 0, 0, 0.99);
  top: 26px;
  left: 78px;
  width: 0px;
  height: 0px;
  border-right: 9px solid transparent;
  border-bottom: 9px solid rgba(0, 0, 0, 0.99);
  border-left: 9px solid transparent;
  transform: rotate(180deg);
  content: '';
}
.card-item {
  font: normal normal bold 25px/17px Roboto;
  padding: 20px 18px;
  border: solid 2px #3993ff;
  border-radius: 10px;
  margin-right: 15px;
  width: 50px;
  min-height: 80px;
  display: flex;
  justify-content: center;
  background-color: #ffffff;
  margin-top: 8px;
  transition: transform 0.3s;
  color: #3993ff;
  font-weight: 500;
  align-items: center;
  border: solid 2px #aaaaaa;
  color: #aaaaaa;
}
.card-item.enable:hover {
  cursor: pointer;
  opacity: 0.7;
  box-shadow: 0px 0px 5px #3597e2;
  transform: translateY(-2px);
}
.card-item.enable.active {
  transform: translateY(-20px);
  background-color: #2196f3;
  color: #ffffff;
}
.card-input {
  font-size: 22px;
  border-radius: 10px;
  margin-right: 0;
  width: 55px;
  min-height: 80px;
  display: flex;
  justify-content: center;
  background-color: #ffffff;
  margin-top: 6px;
  outline: none;
  text-align: center;
  border: solid 2px #aaaaaa;
  color: #aaaaaa;
  margin-top: 8px;
}
/* .card_sub {
  font: normal normal normal 18px/17px Roboto;
  font-weight: 400;
  display: flex;
  justify-content: center;
  align-items: center;
}
.card_sub img {
  transform-box: fill-box;
  transform-origin: center;
  color: #3597e2;
  margin-left: 15px;
} */
.poker-card-input input::placeholder {
  font: normal normal bold 25px/17px Roboto;
  color: #aaaaaa;
}
.enable {
  border: solid 2px #2196f3;
  color: #2196f3;
  /* transform: translateY(-20px); */
  animation: fade-up 2s ease-out;
}
.enable::placeholder {
  color: #2196f3 !important;
}
@keyframes fade-up {
  50% {
    transform: translateY(0);
  }
  80% {
    transform: translateY(20%);
  }
}

@media only screen and (max-width: 740px) {
  .wrap-list-card {
    overflow-x: auto;
    overflow-y: hidden;
    padding-bottom: 20px;
  }
  .list-card {
    /* flex-wrap: wrap; */
    justify-content: center;
  }
  .card-item {
    font-size: 24px;
    padding: 16px 14px;
    margin-right: 8px;
    display: flex;
    margin-top: 8px;
  }
  .card-item.enable:hover {
    cursor: pointer;
    opacity: 0.7;
    box-shadow: 0px 0px 5px #3597e2;
  }
  .card-item.enable.active {
    transform: translateY(-2px);
  }
  .slide-fade-enter-active {
    transition: all 0.5s ease;
  }
  .slide-fade-leave-active {
    transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
  }
  .slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active for <2.1.8 */ {
    transform: translateX(50px);
    opacity: 0;
  }
}
</style>
