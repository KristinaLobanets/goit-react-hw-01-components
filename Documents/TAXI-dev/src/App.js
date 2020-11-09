/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import { createStore, applyMiddleware } from 'redux';
import { YellowBox } from 'react-native';
import { Provider } from 'react-redux';
import ReduxThunk from 'redux-thunk';
import Main from './components/Main';
import Router from './Router';
import Socket from './API/WS';
import PushNotifications from './API/PushNotifications';
import reducers from './reducers';

YellowBox.ignoreWarnings(['Remote debugger']);

PushNotifications.configPushNotifications();

export const store = createStore(reducers, {}, applyMiddleware(ReduxThunk));
Socket.open();

const App = () => {
  return (
    <Provider store={store}>
      <Main>
        <Router />
      </Main>
    </Provider>
  );
};

export default App;
