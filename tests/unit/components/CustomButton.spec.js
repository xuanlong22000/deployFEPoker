import CustomButton from '@/components/CustomButton.vue';
import { createLocalVue, mount } from '@vue/test-utils';
import Vuetify from 'vuetify';
import Vue from 'vue';

describe('CustomButton.vue - Props', () => {
  const localVue = createLocalVue();
  let vuetify;
  beforeEach(() => {
    vuetify = new Vuetify();
  });
  it('test text props with true value', () => {
    const wrapper = mount(CustomButton, {
      localVue,
      vuetify,
      propsData: { text: 'Delete' },
    });
    expect(wrapper.find('.v-btn__content>span').text()).toBe('Delete');
  });
  it('test icon props with true value', () => {
    const wrapper = mount(CustomButton, {
      localVue,
      vuetify,
      propsData: { icon: 'fas fa-trash' },
    });
    expect(wrapper.find('.v-btn__content>i').classes()).toContain('fa-trash');
  });
});
