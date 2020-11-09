import { userTypes } from '.';
import { getAsyncStorage, strings, setAsyncStorage, faresLocale } from '../helpers';

export const setUserPosition = coordinates => dispatch => {
  dispatch({
    type: userTypes.SET_POSITION,
    payload: coordinates,
  });
};

export const setAddress = address => dispatch => {
  dispatch({
    type: userTypes.SET_ADDRESS,
    payload: address,
  });
};

export const setFrom = data => dispatch => {
  dispatch({
    type: userTypes.SET_FROM,
    payload: data,
  });
  return Promise.resolve(data);
};

export const setTo = data => dispatch => {
  dispatch({
    type: userTypes.SET_TO,
    payload: data,
  });
  return Promise.resolve(data);
};

export const setOrderOptions = data => dispatch => {
  dispatch({
    type: userTypes.SET_ORDER_OPTIONS,
    payload: data,
  });
  return Promise.resolve(data);
};

export const setDefaultCar = car => dispatch => {
  dispatch({
    type: userTypes.SET_DEFAULT_CAR,
    payload: car,
  });
};

export const setDefaultLang = lang => dispatch => {
  strings.setLanguage(lang);
  faresLocale.setLanguage(lang);
  setAsyncStorage('language', lang);
  dispatch({
    type: userTypes.SET_DEFAULT_LANG,
    payload: lang,
  });
};

export const getDefaultLang = () => dispatch => {
  return getAsyncStorage('language')
    .then(lang => {
      strings.setLanguage(lang);
      faresLocale.setLanguage(lang);
      dispatch({
        type: userTypes.GET_DEFAULT_LANG,
        payload: lang,
      });
      return Promise.resolve(lang);
    })
    .catch(() => Promise.resolve('nolang'));
};

export const deleteDefaultCard = () => dispatch => {
  dispatch({
    type: userTypes.DELETE_DEFAULT_CARD,
  });
  return Promise.resolve();
};

export const setUserInitialAddress = address => dispatch => {
  dispatch({
    type: userTypes.SET_USER_INITIAL_ADDRESS,
    payload: address,
  });
};
