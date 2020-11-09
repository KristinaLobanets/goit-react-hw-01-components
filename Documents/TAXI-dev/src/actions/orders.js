import { orderTypes, socketTypes } from '.';

export const clearOrder = () => dispatch => {
  return dispatch({
    type: orderTypes.CLEAR_ORDER,
  });
};

export const clearOrderDetails = () => dispatch => {
  return dispatch({
    type: socketTypes.GET_ORDER_DETAILS,
    payload: undefined,
  });
};

export const clearOrders = () => dispatch => {
  dispatch({
    type: orderTypes.CLEAR_ORDERS,
  });
  return Promise.resolve();
};

export const deleteHistoryItem = orderId => dispatch => {
  dispatch({
    type: orderTypes.DELETE_HISTORY_ITEM,
    payload: orderId,
  });
  return Promise.resolve();
};

export const showRatingGlobal = () => dispatch => {
  dispatch({
    type: orderTypes.SHOW_RATING,
    payload: undefined,
  });
};

export const reloadHistory = () => dispatch => {
  dispatch({ type: orderTypes.RELOAD_HISTORY });
  return Promise.resolve();
};

export const chooseContact = contact => dispatch => {
  dispatch({
    type: orderTypes.CHOOSE_CONTACT,
    payload: contact,
  });
  return Promise.resolve();
};
