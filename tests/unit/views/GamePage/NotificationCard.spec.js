import MessageDialog from "@/components/MessageDialog.vue";
import NotificationCard from "@/views/GamePage/NotificationCard.vue";
import { createLocalVue, mount } from "@vue/test-utils";
import Vuetify from "vuetify";

describe("NotificationCard.vue", () => {
  const localVue = createLocalVue();
  let vuetify;
  beforeEach(() => {
    vuetify = new Vuetify();
  });
  describe("Props", () => {
    it("test props with true value", () => {
      let message = "Please wait a moment...";
      const wrapper = mount(NotificationCard, {
        localVue,
        vuetify,
        propsData: {
          message,
        },
      });
      expect(wrapper.find("p").text()).toBe(message);
    });
  });
});
