import { popupTypes } from '.';

export const createPopup = popup => dispatch => {
  dispatch({
    type: popupTypes.CREATE_POPUP,
    payload: popup,
  });
};
