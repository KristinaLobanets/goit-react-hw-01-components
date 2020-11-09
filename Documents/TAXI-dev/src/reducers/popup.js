import { popupTypes } from '../actions';

const INITIAL_STATE = {};

export default function reducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case popupTypes.CREATE_POPUP:
      return action.payload;
    default:
      return state;
  }
}
