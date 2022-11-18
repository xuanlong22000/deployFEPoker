const state = {
  gameManagement: {},
  players: [],
  users: [],
  members: [],
  summaryStoryPoints: [],
  summaryPlayers: [],
  alert: {
    message: '',
    snackbar: false,
  },
  selectedEmails: [],
  enteredEmails: [],
  isStartGame: false,
  isResetGame: false,
  isFinishGame: false,
  game: '',
  gameGuest: '',
  snackbar: {
    status: false,
    message: null,
  },
  isDisable: true,
  createdGame: null,
  history: null,
  totalPlayers: 0,
};

export default state;
