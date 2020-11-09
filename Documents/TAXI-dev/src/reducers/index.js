import { combineReducers } from 'redux';
import auth from './auth';
import data from './data';
import user from './user';
import popup from './popup';
import errors from './errors';
import orders from './orders';
import tech from './tech';

const appRouter = combineReducers({ auth, data, user, popup, errors, orders, tech });
const reducer = (state, action) => {
  if (action.type === 'LOGOUT') {
    state = {
      popup: state.popup,
    };
  }
  return appRouter(state, action);
};
export default reducer;
