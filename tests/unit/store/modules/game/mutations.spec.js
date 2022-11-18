import mutations from '@/store/modules/game/mutations.js';
import mutationTypes from '@/store/modules/game/mutation_types.js';

const state = {
  projectDetail: {},
};

const game = {
  gameName: 'Planning-Pocker',
};
const snackbar = {
  status: 200,
  message: 'MESSAGE',
};
const isDisable = true;
describe('gameMutations', () => {
  it('set game with object', () => {
    mutations[mutationTypes.ACCESS_GAME](state, game);
    expect(state.game).toBe(game);
  });

  it('set game with object', () => {
    mutations[mutationTypes.ACCESS_GAME_GUEST](state, game);
    expect(state.game).toBe(game);
  });

  it('set game with object', () => {
    mutations[mutationTypes.GAME_SNACKBAR](state, snackbar);
    expect(state.snackbar).toBe(snackbar);
  });
  it('set game with object', () => {
    mutations[mutationTypes.ENABLE_CARD](state);
    expect(state.isDisable).toBe(false);
  });
  it('set game with object', () => {
    mutations[mutationTypes.DISABLE_CARD](state);
    expect(state.isDisable).toBe(true);
  });
});
