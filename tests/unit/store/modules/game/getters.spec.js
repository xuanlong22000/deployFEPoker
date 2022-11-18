import getters from '@/store/modules/game/getters.js';
import getterTypes from '@/store/modules/game/getter_types';

const state = {
  game: {
    gameName: 'Poker',
  },
};

describe('gameGetters', () => {
  it('return game with object', () => {
    const game = getters[getterTypes.GET_ACCESS_GAME](state);
    expect(game).toBe(state.game);
  });
  it('return game with object', () => {
    const game = getters[getterTypes.GET_ACCESS_GAME_GUEST](state);
    expect(game).toBe(state.game);
  });
  it('return game with object', () => {
    const snackbar = getters[getterTypes.GET_GAME_SNACKBAR](state);
    expect(snackbar).toBe(state.snackbar);
  });
});
