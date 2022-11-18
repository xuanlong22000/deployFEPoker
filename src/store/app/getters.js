import getterTypes from "./getter_types";

const getters = {
  [getterTypes.GET_SNACKBAR]: state => state.snackbar,
  [getterTypes.GET_CREATE_RESULT]: state => state.createResult,
  [getterTypes.GET_DELETE_RESULT]: state => state.deleteResult,
  [getterTypes.GET_INVITATION_POPUP]: state => state.invitationPopup,
};

export default getters;