export const storeMock = Object.freeze({
  state: {},
  actions: {
    getGame: jest.fn().mockName('getGame'),
  },
});
