import { techTypes } from '.';

export const changeRidesTabs = index => dispatch => {
  dispatch({
    type: techTypes.CHANGE_RIDES_TABS,
    payload: index,
  });
  return Promise.resolve();
};

export const createTemplateProcess = () => dispatch => {
  dispatch({
    type: techTypes.CREATE_TEMPLATE_PROCESS,
  });
  return Promise.resolve();
};

export const switchCorporate = type => dispatch => {
  dispatch({
    type: techTypes.SWITCH_CORPORATE,
    payload: type,
  });
  return Promise.resolve();
};

export const setOrderId = id => dispatch => {
  dispatch({
    type: techTypes.SET_ORDER_ID,
    payload: id,
  });
  return Promise.resolve();
};

export const selectSearchCar = key => dispatch => {
  dispatch({
    type: techTypes.SELECT_SEARCH_CAR,
    payload: key,
  });
  return Promise.resolve();
};

export const checkBoundaries = (region, settings, coordsFallback) => {
  const { latitude, longitude } = region || coordsFallback;
  const { maxLat, maxLon, minLat, minLon } = settings;
  if (latitude > maxLat || latitude < minLat || longitude > maxLon || longitude < minLon) {
    return true;
  }
  return false;
};
