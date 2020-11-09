import Socket from '../API/WS';
import { authTypes, userTypes, errorTypes } from '.';
import { removeAsyncStorage } from '../helpers';
import PushNotifications from '../API/PushNotifications';

export const switchRegistration = bool => dispatch => {
  dispatch({
    type: authTypes.SWITCH_REGISTRATION,
    payload: bool,
  });
};

export const logout = () => dispatch => {
  Socket.get().close();
  removeAsyncStorage('logon');
  removeAsyncStorage('blocked');
  dispatch({ type: authTypes.LOGOUT });
};

export const setUser = user => dispatch => {
  dispatch({
    type: userTypes.SET_USER,
    payload: user,
  });
  return Promise.resolve();
};

export const setPhone = phone => dispatch => {
  dispatch({
    type: userTypes.SET_PHONE,
    payload: phone,
  });
};

export const clearErrors = () => dispatch => {
  dispatch({
    type: errorTypes.CLEAR_ERRORS,
  });
};

export const loginRequest = scene => dispatch => {
  dispatch({
    type: authTypes.LOGIN_REQUEST,
    payload: scene,
  });
  return Promise.resolve();
};

export const getDeviceToken = () => dispatch => {
  const token = PushNotifications.getDeviceToken();
  dispatch({
    type: authTypes.GET_DEVICE_TOKEN,
    payload: token || null,
  });
  return Promise.resolve();
};

export const getPromo = promo => dispatch => {
  dispatch({
    type: authTypes.GET_PROMO,
    payload: promo,
  });
  return Promise.resolve();
};

export const fromLink = () => dispatch => {
  dispatch({
    type: authTypes.FROM_LINK,
  });
  return Promise.resolve();
};

export const getSMSCode = code => dispatch => {
  dispatch({
    type: authTypes.GET_SMS_CODE,
    payload: code,
  });
  return Promise.resolve();
};

export const connectionChange = connection => dispatch =>
  dispatch({
    type: authTypes.CONNECTION_CHANGE,
    payload: connection,
  });
