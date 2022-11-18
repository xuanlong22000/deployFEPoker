import ConfirmDialog from '@/components/ConfirmDialog.vue';
import { createLocalVue, mount } from '@vue/test-utils';
import Vuetify from 'vuetify';
import Vue from 'vue';

describe('ConfirmDialog.vue', () => {
  const localVue = createLocalVue();
  let vuetify;
  beforeEach(() => {
    vuetify = new Vuetify();
  });
  describe('Props', () => {
    it('test confirmDialogInfo props with true value', () => {
      let confirmDialogInfo = {
        title: 'Delete record',
        question: 'Are you sure?',
        detail: "This process can't be undone",
      };
      const wrapper = mount(ConfirmDialog, {
        localVue,
        vuetify,
        propsData: {
          confirmDialogInfo: confirmDialogInfo,
        },
      });
      expect(wrapper.find('.title-text').text()).toBe(confirmDialogInfo.title);
    });
  });

  describe('Emitter', () => {
    it('emits an event when click cancel', async () => {
      const wrapper = mount(ConfirmDialog, {
        localVue,
        vuetify,
      });
      await wrapper.find('.btn-cancel').trigger('click');
      expect(wrapper.emitted('processConfirmDialog')).toBeTruthy();
      expect(wrapper.emitted('processConfirmDialog')[0][0]).toBe('Cancel');
    });
    it('emits an event when click Ok', async () => {
      const wrapper = mount(ConfirmDialog, {
        localVue,
        vuetify,
      });
      await wrapper.find('.btn-yes').trigger('click');
      expect(wrapper.emitted('processConfirmDialog')).toBeTruthy();
      expect(wrapper.emitted('processConfirmDialog')[0][0]).toBe('Ok');
    });
  });
});
