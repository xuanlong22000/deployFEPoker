import { shallowMount, createLocalVue } from '@vue/test-utils';
import GameManagementModal from '@/views/GameManagement/GameManagementModal.vue';
import Vuex from 'vuex';
import gameModule from '../../../src/store/modules/game';
import actionTypes from '../../../src/store/modules/game/action_types';
import Vuetify from 'vuetify';

const localVue = createLocalVue();

localVue.use(Vuex);

afterEach(() => {
  jest.clearAllMocks();
});

describe('GameManagementModal.vue', () => {
  let actions;
  let store;
  const localVue = createLocalVue();
  localVue.use(Vuex);
  describe('Props', () => {
    let state, getters, actions, vuetify, store, mutations;
    let wrapperFactory = (localVue, vuetify, propsData, store) => {
      return shallowMount(GameManagementModal, {
        localVue,
        vuetify,
        propsData,
        store,
      });
    };
    beforeEach(() => {
      vuetify = new Vuetify();
      state = {
        gameModule: {
          players: [],
          users: [],
          enteredEmails: [],
          selectedEmailsState: [],
        },
      };
      actions = {
        [actionTypes.INVITE_PLAYERS]: jest.fn(),
      };
      store = new Vuex.Store({ state, getters, actions });
    });
    describe('members prop', () => {
      it('Should return default value when not pass members props', async () => {
        const defaultValue = [];
        const propsData = {};
        const wrapper = wrapperFactory(localVue, vuetify, propsData, store);
        expect(wrapper.props().members).toEqual(defaultValue);
      });

      it('Should return prop value when pass members props', async () => {
        const members = ['tan.nguyen@gmail.com', 'quan.nguyen@gmail.com'];
        const propsData = { members };
        const wrapper = wrapperFactory(localVue, vuetify, propsData, store);
        expect(wrapper.props().members).toEqual(members);
      });
    });

    describe('gameId prop', () => {
      it('Should return default value when not pass gameId props', async () => {
        const defaultValue = null;
        const propsData = {};
        const wrapper = wrapperFactory(localVue, vuetify, propsData, store);
        expect(wrapper.props().gameId).toEqual(defaultValue);
      });

      it('Should return prop data value when pass members props', async () => {
        const gameId = 1;
        const propsData = { gameId };
        const wrapper = wrapperFactory(localVue, vuetify, propsData, store);
        expect(wrapper.props().gameId).toEqual(gameId);
      });
    });

    describe('all props', () => {
      it('Should return default value when not pass props data', async () => {
        const propsData = {};
        const wrapper = wrapperFactory(localVue, vuetify, propsData, store);
        expect(wrapper.props().gameId).toEqual(null);
        expect(wrapper.props().members).toEqual([]);
      });

      it('Should return prop data value when pass members props', async () => {
        const gameId = 1;
        const members = ['tan.nguyen@gmail.com', 'quan.nguyen@gmail.com'];
        const propsData = { gameId, members };
        const wrapper = wrapperFactory(localVue, vuetify, propsData, store);
        expect(wrapper.props().gameId).toEqual(gameId);
        expect(wrapper.props().members).toEqual(members);
      });
    });

    describe('Methods', () => {
      let getters, actions, vuetify, store;
      let wrapperFactory = (localVue, vuetify, propsData, store, data) => {
        return shallowMount(GameManagementModal, {
          localVue,
          vuetify,
          propsData,
          store,
          data,
        });
      };
      beforeEach(() => {
        jest.clearAllMocks();
      });

      it('Should call removeEmail when click X button to kick player', async () => {
        const selectedEmails = [
          'quan.nguyen@gmail.com',
          'tan.nguyen@gmail.com',
        ];
        const removeEmail = () => {
          return true;
        };
      });
    });
  });

  beforeEach(() => {
    actions = {
      invitePlayers: jest.fn(),
    };

    store = new Vuex.Store({
      modules: {
        gameModule: {
          actions,
          getters: gameModule.getters,
        },
      },
    });
  });

  it('Render some elements when component is mounted', () => {
    const wrapper = shallowMount(GameManagementModal, {
      localVue,
      store,
      propsData: {
        members: [
          'nguyentan@gmail.com',
          'truongnguyen@gmail.com',
          'nhat.truong@gmail.com',
        ],
        gameId: 1,
      },
    });
    expect(wrapper.html()).toMatchSnapshot();

    const modalTitle = wrapper.get('.modal-title');
    expect(modalTitle.text()).toContain(
      'Please choose or enter e-mails that you want to invite'
    );
    const listMember = wrapper.get('#list-member');
    expect(wrapper.props('gameId')).toBe(1);
    expect(wrapper.props('members')).toContain('nhat.truong@gmail.com');
  });
});
