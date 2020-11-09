import { socketTypes, userTypes, dataTypes } from '../actions';
import { getDataFromRoutes } from '../helpers';

const INITIAL_STATE = {
  cars: [],
  currentAddress: undefined,
  nearAddress: [],
  fares: [],
  drivers: [],
  searchResults: [],
  addressTemplates: [],
  driver: {},
  settings: {},
  answer: '',
  dialog: [],
  textMessage: '',
  additionalFares: {},
  messageFromDriver: [],
  popular: [],
  bonusCode: undefined,
  feedback: [],
  comfortable: [],
  routes: [],
  objects: [],
  nearest: [],
  totalDistance: 0,
  totalTime: 0,
  last: [],
};

export default function reducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case socketTypes.CARS:
      return { ...state, ...action.payload };
    case userTypes.SET_ADDRESS:
      return { ...state, currentAddress: action.payload };
    case socketTypes.ADDRESS_BY_LAT_LON:
      return { ...state, nearAddress: action.payload.addresses };
    case dataTypes.ADDRESS_NOMINATIM:
      return { ...state, nearAddress: [action.payload] };
    case socketTypes.GET_FARES:
      return { ...state, fares: action.payload.fares };
    case socketTypes.GET_DRIVERS_ON_MAP:
      return { ...state, drivers: action.payload.driversOnMap };
    case socketTypes.GET_DRIVER_INFO:
      return { ...state, driver: action.payload };
    case dataTypes.CLEAR_DRIVER_INFO:
      return { ...state, driver: {} };
    case socketTypes.SEARCH_ADDRESS_OBJECT:
      return { ...state, searchResults: action.payload.addresses };
    case socketTypes.ADDRESS_SEARCH:
      return { ...state, searchResults: action.payload.addresses };
    case dataTypes.CLEAR_SEARCH:
      return { ...state, searchResults: [] };
    case dataTypes.CLEAR_FEEDBACK:
      return { ...state, answer: action.payload };
    case socketTypes.GET_ADDRESS_TEMPLATES:
      return { ...state, addressTemplates: action.payload.templates };
    case socketTypes.GET_SETTINGS:
      return { ...state, settings: action.payload };
    case socketTypes.FEEDBACK:
      return { ...state, answer: action.payload };
    case socketTypes.GET_ORDER_MESSAGES:
      return { ...state, dialog: action.payload.messages };
    case socketTypes.GET_ADDITIONAL_FARES:
      return { ...state, additionalFares: action.payload };
    case socketTypes.CURRENT_MESSAGES:
      return { ...state, messageFromDriver: action.payload.messages };
    case socketTypes.CLEAR_CHAT:
      return { ...state, dialog: [] };
    case socketTypes.POPULAR_ADDRESSES:
      return { ...state, popular: action.payload.addresses };
    case socketTypes.BONUS_CODE:
      return { ...state, bonusCode: action.payload };
    case dataTypes.BONUS_CODE_CLEAR:
      return { ...state, bonusCode: undefined };
    case socketTypes.FEEDBACK_HISTORY:
      return { ...state, feedback: action.payload.feedbacks };
    case socketTypes.CHECK_NON_COMFORTABLE_PLACE:
      return { ...state, comfortable: action.payload.nonComfortablePlaces };
    case dataTypes.CLEAR_COMFORTABLE:
      return { ...state, comfortable: [] };
    case socketTypes.ROUTE:
      return {
        ...state,
        routes: getDataFromRoutes(action.payload.features)?.routes,
        totalDistance: getDataFromRoutes(action.payload.features)?.totalDistance,
        totalTime: getDataFromRoutes(action.payload.features)?.totalTime,
      };
    case dataTypes.CLEAR_ROUTES:
      return {
        ...state,
        routes: [],
        totalDistance: 0,
        totalTime: 0,
      };
    case socketTypes.OBJECTS_IN_BOUNDS:
      return { ...state, objects: action.payload.addresses };
    case socketTypes.NEAREST_ADDRESSES:
      return { ...state, nearest: action.payload };
    case socketTypes.LAST_ADDRESSES:
      return { ...state, last: action.payload.addresses };
    default:
      return state;
  }
}
