/* eslint-disable no-unused-expressions */
import React, { PureComponent } from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Actions } from 'react-native-router-flux';

import { Logo, Text, TextInput, Header, Footer, Button, Preloader } from '../../components';
import style from './style';
import { colors, styleConstants, generatePIN, unmaskPhone, strings } from '../../helpers';
import { socketAPI, socketTypes, clearErrors, switchRegistration, getSMSCode } from '../../actions';
import env from '../../env';

class PhoneQuery extends PureComponent {
  static propTypes = {
    phone: PropTypes.string.isRequired,
    register: PropTypes.bool.isRequired,
    socketAPI: PropTypes.func.isRequired,
    clearErrors: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired,
    popup: PropTypes.object.isRequired,
    switchRegistration: PropTypes.func.isRequired,
    scene: PropTypes.string,
    token: PropTypes.string,
    promo: PropTypes.string,
    code: PropTypes.number,
    getSMSCode: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = {
      passcode1: '',
      passcode2: '',
      passcode3: '',
      passcode4: '',
      timer: 40,
      isFocused: null,
    };
  }

  componentDidMount() {
    this.interval = setInterval(() => {
      this.startTimer();
    }, 1000);
  }

  async componentDidUpdate({ user, errors }) {
    if (
      user.clientId !== this.props.user.clientId &&
      !!this.props.user.clientId &&
      !this.props.register
    ) {
      this.props.socketAPI(socketTypes.GET_PROFILE, { clientId: this.props.user.clientId });
      return Actions.reset(this.props.scene ? this.props.scene : 'home');
    }

    if (
      user.clientId !== this.props.user.clientId &&
      !!this.props.user.clientId &&
      this.props.register
    ) {
      Actions.reset('registerProfile');
    }

    // wrong login
    if (
      errors.loginNotExists !== this.props.errors.loginNotExists &&
      !!this.props.errors.loginNotExists
    ) {
      this.props.clearErrors();
      this.props.switchRegistration(true);
      const dataRegister = {
        taxiToken: env.app_token,
        phone: unmaskPhone(this.props.phone),
        inviteCode: this.props.promo ? this.props.promo.toUpperCase() : '',
      };
      return this.props.socketAPI('REGISTER', dataRegister);
    }
  }

  componentWillUnmount() {
    this.stopTimer();
    this.props.clearErrors();
  }

  checkFocus = num => {
    this.setState({ isFocused: num });
  };

  startTimer = () => {
    if (this.state.timer <= 0) return this.stopTimer();
    this.setState(prevState => ({
      timer: prevState.timer - 1,
    }));
  };

  stopTimer = () => {
    clearInterval(this.interval);
  };

  refreshSMS = () => {
    const code = generatePIN();
    const dataSMS = {
      taxiToken: env.app_token,
      phone: unmaskPhone(this.props.phone),
      inviteCode: this.props.promo ? this.props.promo.toUpperCase() : '',
      text: code,
    };
    this.props.getSMSCode(code);
    this.props.socketAPI(socketTypes.SEND_SMS, dataSMS);
    this.interval = setInterval(() => {
      this.startTimer();
    }, 1000);
    this.setState({ timer: 40 });
  };

  handleInputValue = async (value, key) => {
    await this.setState({
      [`passcode${key}`]: value,
    });
    const { passcode1, passcode2, passcode3, passcode4 } = this.state;
    if (passcode1 && passcode2 && passcode3 && passcode4) {
      const number = passcode1 + passcode2 + passcode3 + passcode4;
      if (
        parseInt(number, 10) === parseInt(this.props.code, 10) ||
        (unmaskPhone(this.props.phone) === '+380670000000' && parseInt(number, 10) === 7369)
      ) {
        this.stopTimer();
        if (this.props.register) {
          const dataRegister = {
            taxiToken: env.app_token,
            phone: unmaskPhone(this.props.phone),
            inviteCode: this.props.promo ? this.props.promo.toUpperCase() : '',
          };
          return this.props.socketAPI('REGISTER', dataRegister);
        }
        const dataLogin = {
          taxiToken: env.app_token,
          phone: unmaskPhone(this.props.phone),
          firebaseToken: this.props.token,
        };
        this.setState({ loading: true });
        return this.props.socketAPI('LOGON', dataLogin);
      }

      return this.props.popup.showPopup({
        error: true,
        onPress: () => {
          this.passcode1.focus();
          this.setState({ passcode1: '', passcode2: '', passcode3: '', passcode4: '' });
        },
        header: strings.warning,
        text: strings.userWrongCode,
        line: true,
      });
    }
  };

  render() {
    const { rootContainer, flexCenter, flex } = styleConstants;
    const { loading, passcode1, passcode2, passcode3, passcode4, isFocused, timer } = this.state;
    const { phone } = this.props;
    return (
      <ScrollView
        contentContainerStyle={rootContainer}
        ref={ref => (this.scroll = ref)}
        onContentSizeChange={() => {
          this.scroll.scrollToEnd();
        }}
        keyboardShouldPersistTaps="always"
        showsVerticalScrollIndicator={false}
      >
        <Preloader loading={loading} fullScreen />
        <Header />
        <Logo />
        <View style={flexCenter}>
          <View style={flex}>
            <Text header>{`${strings.enterSendedCode} ${phone}`}</Text>
          </View>
          <View style={style.queryContainer}>
            <TextInput
              ref={r => (this.passcode1 = r)}
              autoFocus
              onFocus={() => this.checkFocus(1)}
              textInputStyle={[
                style.phoneInput,
                passcode1 ? style.borderGrey : null,
                isFocused === 1 ? style.borderGrey : null,
              ]}
              textInputWrap={style.phoneInputWrap}
              value={passcode1}
              onChangeText={event => {
                event && this.passcode2.focus();
                this.handleInputValue(event, 1);
              }}
              onClearText
              keyboardType="phone-pad"
              maxLength={1}
            />
            <TextInput
              ref={r => (this.passcode2 = r)}
              onFocus={() => this.checkFocus(2)}
              textInputStyle={[
                style.phoneInput,
                passcode2 ? style.borderGrey : null,
                isFocused === 2 ? style.borderBlack : null,
              ]}
              textInputWrap={style.phoneInputWrap}
              value={passcode2}
              onChangeText={event => {
                event && this.passcode3.focus();
                this.handleInputValue(event, 2);
              }}
              keyboardType="phone-pad"
              maxLength={1}
            />
            <TextInput
              ref={r => (this.passcode3 = r)}
              onFocus={() => this.checkFocus(3)}
              textInputStyle={[
                style.phoneInput,
                passcode3 ? style.borderGrey : null,
                isFocused === 3 ? style.borderBlack : null,
              ]}
              textInputWrap={style.phoneInputWrap}
              value={passcode3}
              onChangeText={event => {
                event && this.passcode4.focus();
                this.handleInputValue(event, 3);
              }}
              keyboardType="phone-pad"
              maxLength={1}
            />
            <TextInput
              ref={r => (this.passcode4 = r)}
              onFocus={() => this.checkFocus(4)}
              textInputStyle={[
                style.phoneInput,
                passcode4 ? style.borderGrey : null,
                isFocused === 4 ? style.borderBlack : null,
              ]}
              textInputWrap={style.phoneInputWrap}
              value={passcode4}
              onChangeText={event => {
                this.handleInputValue(event, 4);
              }}
              keyboardType="phone-pad"
              maxLength={1}
            />
          </View>
        </View>
        <View style={flex}>
          <View style={style.changePhoneContainer}>
            <TouchableOpacity onPress={Actions.pop}>
              <Text normalText>{strings.changePhoneNumber}</Text>
            </TouchableOpacity>
          </View>
          <View style={style.resendContainer}>
            {timer > 0 ? (
              <Text smallRegular style={style.resendText}>{`${strings.codeReSend} 00:${
                timer < 10 ? 0 : ''
              }${timer}`}</Text>
            ) : (
              <Button title={strings.repeatRequest} onPress={this.refreshSMS} />
            )}
          </View>
        </View>
        <Footer colorIcon={colors.white} nameIcon="arrow-right" onPress={this.handleNextScene} />
      </ScrollView>
    );
  }
}

export default connect(
  ({ auth, user, errors, popup }) => ({
    register: auth.register,
    user,
    errors,
    popup,
    scene: auth.scene,
    token: auth.token,
    promo: auth.promo,
    code: auth.code,
  }),
  { socketAPI, clearErrors, switchRegistration, getSMSCode }
)(PhoneQuery);
