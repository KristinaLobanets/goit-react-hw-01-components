import { userTypes, socketTypes } from '../actions';

const INITIAL_STATE = {
  clientId: null,
  phone: undefined,
  coordinates: {},
  initialAddress: undefined,
  origin: undefined,
  destination: undefined,
  disableCall: false,
  showActions: true,
  showPriceNotification: true,
  orderOptions: {
    comments: '',
    entrance: '',
    additionalPrice: 0,
  },
  settings: {
    defaultCarType: undefined,
    defaultLang: 'uk',
  },
  creditCards: [],
  defaultCreditCard: undefined,
  base64Photo: null,
};

export default function reducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case userTypes.SET_USER:
      return { ...state, clientId: action.payload };
    case userTypes.SET_PHONE:
      return { ...state, phone: action.payload };
    case socketTypes.GET_PROFILE:
      return {
        ...state,
        ...action.payload,
        base64Photo:
          action.payload && action.payload.base64Photo ? action.payload.base64Photo : null,
      };
    case userTypes.SET_POSITION:
      return { ...state, coordinates: action.payload };
    case userTypes.SET_FROM:
      return {
        ...state,
        origin: action.payload,
        orderOptions: { ...state.orderOptions, comments: '', entrance: '' },
      };
    case userTypes.SET_TO:
      return { ...state, destination: action.payload };
    case userTypes.SET_DEFAULT_CAR:
      return { ...state, settings: { ...state.settings, defaultCarType: action.payload } };
    case userTypes.SET_DEFAULT_LANG:
      return { ...state, settings: { ...state.settings, defaultLang: action.payload } };
    case userTypes.GET_DEFAULT_LANG:
      return { ...state, settings: { ...state.settings, defaultLang: action.payload } };
    case userTypes.SET_ORDER_OPTIONS:
      // eslint-disable-next-line no-case-declarations
      const cleanOptions = { ...INITIAL_STATE.orderOptions, ...action.payload };
      return { ...state, orderOptions: cleanOptions };
    case userTypes.DELETE_DEFAULT_CARD:
      return { ...state, defaultCreditCard: undefined };
    case userTypes.SET_USER_INITIAL_ADDRESS:
      return { ...state, initialAddress: action.payload };
    default:
      return state;
  }
}
