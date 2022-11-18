import mutationTypes from './mutation_types';

const mutations = {
  [mutationTypes.SET_CREATE_RESULT]: (state, createResult) => {
    state.createResult = createResult;
  },
  [mutationTypes.SET_DELETE_RESULT]: (state, deleteResult) => {
    state.deleteResult = deleteResult;
  },
  [mutationTypes.SET_INVITATION_POPUP]: (state, status) => {
    state.invitationPopup = status;
  },
  [mutationTypes.SET_SNACKBAR]: (state, snackbar) => {
    switch (snackbar.type) {
      case 'error':
        state.snackbar = {
          text: snackbar.text,
          visible: snackbar.visible,
          title: 'Error',
          color: 'error',
          icon: 'mdi-alert-circle',
          mode: 'multi-line',
          timeout: 5000,
        };
        break;
      case 'info':
        state.snackbar = {
          text: snackbar.text,
          visible: snackbar.visible,
          title: 'Information',
          color: 'info',
          icon: 'mdi-alert-circle',
          mode: 'multi-line',
          timeout: 5000,
        };
        break;
      case 'success':
        state.snackbar = {
          text: snackbar.text,
          visible: snackbar.visible,
          title: 'Success',
          color: 'success',
          icon: 'mdi-check-circle',
          mode: 'multi-line',
          timeout: 5000,
        };
        break;
      case 'warning':
        state.snackbar = {
          text: snackbar.text,
          visible: snackbar.visible,
          title: 'Warning',
          color: 'warning',
          icon: 'mdi-alert',
          mode: 'multi-line',
          timeout: 5000,
        };
        break;
    }
  },
};

export default mutations;
