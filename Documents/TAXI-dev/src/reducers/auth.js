import { authTypes, socketTypes } from '../actions';

const INITIAL_STATE = {
  register: false,
  registerData: undefined,
  sms: undefined,
  scene: undefined,
  token: null,
  promo: '',
  isFromLink: false,
  code: undefined,
  connection: true,
};

export default function reducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case authTypes.SWITCH_REGISTRATION:
      return { ...state, register: action.payload };
    case socketTypes.REGISTER:
      return { ...state, registerData: action.payload };
    case socketTypes.SEND_SMS:
      return { ...state, sms: action.payload };
    case authTypes.LOGIN_REQUEST:
      return { ...state, scene: action.payload };
    case authTypes.GET_DEVICE_TOKEN:
      return { ...state, token: action.payload };
    case authTypes.GET_PROMO:
      return { ...state, promo: action.payload };
    case authTypes.FROM_LINK:
      return { ...state, isFromLink: true };
    case authTypes.GET_SMS_CODE:
      return { ...state, code: action.payload };
    case authTypes.CONNECTION_CHANGE:
      return { ...state, connection: action.payload };
    default:
      return state;
  }
}
