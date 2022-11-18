import TopTitle from '@/components/TopTitle';
import { mount } from '@vue/test-utils';
const wrapper = mount(TopTitle, {
  propsData: {
    title: 'text'
  }
});
describe('TopTitle', () => {
  describe('Testing component name', () => {
    it('Having true name', () => {
      expect(wrapper.vm.$options.name).toMatch('TopTitle');
    })
  });
  describe('Testing component props', () => {
    it('Having a title property with default value is text', () => {
      expect(wrapper.props().title).toBe('text');
    });
  });
  describe('Testing component render', () => {
    it('Having true render', () => {
      expect(wrapper.find('h4').text()).toBe('text');
    });
  });
  describe('Testing element existed', () => {
    it('Having one image', () => {
      const img = wrapper.findAll('img');
      expect(img.length).toBe(1);
    });
    it('Having one h4 element', () => {
      const h4Element = wrapper.findAll('h4');
      expect(h4Element.length).toBe(1);
    })
  });
});

