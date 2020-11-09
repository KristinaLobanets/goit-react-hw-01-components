import { errorTypes, socketTypes } from '../actions';

const INITIAL_STATE = {
  registerError: undefined,
  registerAlreadyExist: undefined,
  loginError: undefined,
  loginNotExists: undefined,
  cantSendFeedback: undefined,
  editProfile: undefined,
  bonusError: undefined,
  orderError: undefined,
};

export default function reducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case errorTypes.CLEAR_ERRORS:
      return INITIAL_STATE;
    case errorTypes.REGISTER_ERROR:
      return { ...state, registerError: action.payload };
    case errorTypes.REGISTER_ALREADY_EXIST:
      return { ...state, registerAlreadyExist: action.payload };
    case errorTypes.LOGIN_ERROR:
      return { ...state, loginError: action.payload };
    case errorTypes.LOGIN_NOT_EXIST:
      return { ...state, loginNotExists: action.payload };
    case errorTypes.FEEDBACK_ERROR:
      return { ...state, cantSendFeedback: action.payload };
    case socketTypes.EDIT_PROFILE:
      return { ...state, editProfile: action.payload };
    case errorTypes.BONUS_ERROR:
      return { ...state, bonusError: action.payload };
    case errorTypes.CREATE_ORDER_ERROR:
      return { ...state, orderError: action.payload };
    default:
      return state;
  }
}
