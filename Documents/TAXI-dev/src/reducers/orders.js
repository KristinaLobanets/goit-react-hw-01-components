import { socketTypes, orderTypes } from '../actions';

const INITIAL_STATE = {
  currentOrder: undefined,
  currentOrders: undefined,
  history: [],
  historySearch: [],
  tripTemplates: [],
  prices: [],
  details: undefined,
  showRating: false,
  showRatingId: undefined,
  contact: {},
};

const filteredData = (id, data) => data.filter(el => el.id !== id);

export default function reducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case socketTypes.CREATE_ORDER:
      return { ...state, currentOrder: action.payload };
    case socketTypes.CURRENT_ORDERS:
      return { ...state, currentOrders: action.payload.currentOrders };
    case socketTypes.GET_ORDER_DETAILS:
      return { ...state, details: action.payload };
    case orderTypes.CLEAR_DETAILS:
      return { ...state, details: undefined };
    case socketTypes.GET_HISTORY:
      return { ...state, history: [...state.history, ...action.payload.orderHistories] };
    case orderTypes.GET_HISTORY_SEARCH:
      return { ...state, historySearch: action.payload.orderHistories };
    case orderTypes.RELOAD_HISTORY:
      return { ...state, history: [] };
    case orderTypes.DELETE_HISTORY_ITEM:
      return {
        ...state,
        history: filteredData(action.payload, state.history),
        historySearch: filteredData(action.payload, state.historySearch),
      };
    case socketTypes.GET_TRIP_TEMPLATES:
      return { ...state, tripTemplates: action.payload.templates };
    case socketTypes.GET_PRICE:
      return { ...state, prices: action.payload.prices };
    case socketTypes.ORDER_PRICE:
      return { ...state, prices: action.payload.prices };
    case orderTypes.CLEAR_ORDER:
      return { ...state, currentOrder: undefined };
    case orderTypes.CLEAR_ORDERS:
      return { ...state, currentOrders: undefined };
    case orderTypes.SHOW_RATING:
      return { ...state, showRating: !state.showRating, showRatingId: action.payload };
    case orderTypes.CHOOSE_CONTACT:
      return { ...state, contact: action.payload };
    default:
      return state;
  }
}
