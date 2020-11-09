import React, { PureComponent } from 'react';
import { View, KeyboardAvoidingView as KAV, Platform, AppState } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import NetInfo from '@react-native-community/netinfo';

import {
  createPopup,
  socketAPI,
  setDefaultLang,
  getDefaultLang,
  connectionChange,
} from '../../actions';
import { Popup, NoInternet } from '..';
import { styleConstants, strings } from '../../helpers';

const KeyboardAvoidingView = props => {
  if (Platform.OS === 'ios') {
    return <KAV {...props} behavior="padding" />;
  }
  return <View {...props} />;
};

const langs = ['uk', 'ru', 'en', 'sk'];

class Main extends PureComponent {
  static propTypes = {
    children: PropTypes.element.isRequired,
    createPopup: PropTypes.func.isRequired,
    getDefaultLang: PropTypes.func,
    setDefaultLang: PropTypes.func,
    socketAPI: PropTypes.func,
    connectionChange: PropTypes.func,
    connection: PropTypes.bool,
  };

  constructor(props) {
    super(props);
    this.state = {
      appState: AppState.currentState,
      loader: false,
    };
    this.netInfo = null;
  }

  componentDidMount() {
    this.props.createPopup(this.popup);
    if (Platform.OS === 'ios') {
      NetInfo.configure({
        reachabilityUrl: 'https://clients3.google.com/generate_204',
        reachabilityTest: async response => response.status === 204,
        reachabilityLongTimeout: 60 * 1000, // 60s
        reachabilityShortTimeout: 5 * 1000, // 5s
        reachabilityRequestTimeout: 15 * 1000, // 15s
      });
    }
    this.netInfo = NetInfo.addEventListener(this.handleConnectivityChange);
    if (Platform.OS === 'ios') {
      AppState.addEventListener('change', this.handleAppStateChange);
    }
    let defLang;
    const systemLang = strings.getInterfaceLanguage().slice(0, 2);
    this.props.getDefaultLang().then(lang => {
      if (lang === 'nolang') {
        langs.map(item => {
          if (item === systemLang) {
            defLang = systemLang;
          }
          if (!defLang) {
            defLang = 'uk';
          }
        });
        this.props.setDefaultLang(defLang);
      } else {
        this.props.setDefaultLang(lang);
      }
    });
  }

  componentWillUnmount() {
    if (this.netInfo) this.netInfo();
    if (Platform.OS === 'ios') {
      AppState.removeEventListener('change', this.handleAppStateChange);
    }
  }

  handleConnectivityChange = ({ isInternetReachable, details }) => {
    if (this.props.connection === false && isInternetReachable === true) {
      if (Platform.Version < 27) {
        setTimeout(() => {
          this.props.socketAPI('PING', null);
          this.props.connectionChange(true);
        }, 3000);
      } else {
        this.props.socketAPI('PING', null);
        this.props.connectionChange(true);
      }
    }
    if (
      this.props.connection === false &&
      (details?.cellularGeneration === '3g' || details?.cellularGeneration === '4g') &&
      isInternetReachable === true
    ) {
      if (Platform.Version < 27) {
        setTimeout(() => {
          this.props.socketAPI('PING', null);
          this.props.connectionChange(true);
        }, 3000);
      } else {
        this.props.socketAPI('PING', null);
        this.props.connectionChange(true);
      }
    }
    if (isInternetReachable !== null) {
      this.props.connectionChange(isInternetReachable);
    }
    if (details?.cellularGeneration && details?.cellularGeneration === '2g') {
      this.props.connectionChange(false);
    }
    if (details?.strength && details?.strength < 10) {
      this.props.connectionChange(false);
    }
  };

  reconnect = () => {
    NetInfo.fetch().then(res => {
      if (res.isInternetReachable === true && this.props.connection === null) {
        this.props.connectionChange(true);
      }
      this.setState({ loader: true }, () =>
        setTimeout(() => {
          this.setState({ loader: false });
        }, 1500)
      );
    });
  };

  handleAppStateChange = nextAppState => {
    if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
      this.props.socketAPI('PING', null);
    }
    this.setState({ appState: nextAppState });
  };

  render() {
    return (
      <KeyboardAvoidingView style={styleConstants.flex}>
        <Popup ref={popup => (this.popup = popup)} />
        {this.props.children}
        {!this.props.connection && (
          <NoInternet onPress={this.reconnect} loader={this.state.loader} />
        )}
      </KeyboardAvoidingView>
    );
  }
}

export default connect(
  ({ user, auth }) => ({ user, token: auth.token, connection: auth.connection }),
  {
    createPopup,
    socketAPI,
    setDefaultLang,
    getDefaultLang,
    connectionChange,
  }
)(Main);
