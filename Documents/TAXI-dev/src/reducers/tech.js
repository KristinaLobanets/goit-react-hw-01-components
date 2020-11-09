import { techTypes } from '../actions';

const INITIAL_STATE = {
  indexRidesTab: 0,
  isCreateTemplate: false,
  isCorp: 0,
  orderCarousel: undefined,
  searchCar: undefined,
};

export default function reducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case techTypes.CHANGE_RIDES_TABS:
      return { ...state, indexRidesTab: action.payload };
    case techTypes.CREATE_TEMPLATE_PROCESS:
      return { ...state, isCreateTemplate: !state.isCreateTemplate };
    case techTypes.SWITCH_CORPORATE:
      return { ...state, isCorp: action.payload };
    case techTypes.SET_ORDER_ID:
      return { ...state, orderCarousel: action.payload };
    case techTypes.SELECT_SEARCH_CAR:
      return { ...state, searchCar: action.payload };
    default:
      return state;
  }
}
