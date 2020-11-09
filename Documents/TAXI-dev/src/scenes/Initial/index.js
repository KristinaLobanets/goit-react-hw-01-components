import React, { Component } from 'react';
import { View, Animated } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Actions } from 'react-native-router-flux';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import env from '../../env';

import { socketAPI, setUser, socketTypes, getDeviceToken, getPromo, fromLink } from '../../actions';
import { getAsyncStorage, styleConstants } from '../../helpers';
import { Logo } from '../../components';
import Socket from '../../API/WS';
import style from './style';

class Initial extends Component {
  static propTypes = {
    socketAPI: PropTypes.func,
    setUser: PropTypes.func,
    getDeviceToken: PropTypes.func,
    getPromo: PropTypes.func,
    fromLink: PropTypes.func,
  };

  static defaultProps = {
    socketAPI: () => {},
    setUser: () => {},
  };

  constructor(props) {
    super(props);
    this.state = {};
    this.animateLogo = new Animated.Value(0);
  }

  componentDidMount() {
    this.animateLogoFnc();
    this.handleDynamicLinks();
    setTimeout(() => {
      this.handleLogin();
    }, 2000);
  }

  handleDynamicLinks = () => {
    dynamicLinks()
      .getInitialLink()
      .then(link => {
        if (link && link.url) {
          const linkParse = link.url.split('=');
          const promo = linkParse[linkParse.length - 1];
          this.props.getPromo(promo);
          this.props.fromLink();
        }
      });
  };

  handleLogin = async () => {
    if (Socket.get().readyState !== 1) {
      return this.wait();
    }
    const user = await getAsyncStorage('logon');
    this.props.socketAPI(socketTypes.GET_SETTINGS, {
      taxiToken: env.app_token,
    });
    this.props.socketAPI(socketTypes.GET_ADDITIONAL_FARES, {
      taxiToken: env.app_token,
    });
    await this.props.getDeviceToken();
    if (user) {
      this.props.socketAPI(socketTypes.GET_PROFILE, { clientId: user });
      this.props.setUser(user).then(() => this.handleEnterScene(user));
    } else {
      this.handleEnterScene(user);
    }
  };

  handleEnterScene = user => {
    if (user) {
      return Actions.reset('home');
    }
    return Actions.reset('home');
  };

  wait = () =>
    setTimeout(() => {
      return this.handleLogin();
    }, 1000);

  animateLogoFnc = () => {
    Animated.spring(this.animateLogo, {
      toValue: 1,
      friction: 2,
    }).start();
  };

  render() {
    return (
      <View style={style.container}>
        <Animated.View style={[styleConstants.flex, { transform: [{ scale: this.animateLogo }] }]}>
          <Logo />
        </Animated.View>
      </View>
    );
  }
}

export default connect(
  ({ data, user, auth }) => ({
    cars: data.cars,
    user,
    token: auth,
  }),
  { socketAPI, setUser, getDeviceToken, getPromo, fromLink }
)(Initial);
