import React, { Component } from 'react';
import { View, ScrollView, Text as RNText } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';

import { socketAPI, getPromo, getSMSCode } from '../../actions';
import { colors, styleConstants, generatePIN, unmaskPhone, strings } from '../../helpers';
import { Logo, TextInput, Header, Footer, Icon, PoliciesModal, InputModal } from '../../components';
import style from './style';
import env from '../../env';

class SignIn extends Component {
  static propTypes = {
    socketAPI: PropTypes.func,
    promo: PropTypes.string,
    getPromo: PropTypes.func,
    isFromLink: PropTypes.bool,
    getSMSCode: PropTypes.func,
    settings: PropTypes.object,
  };

  static defaultProps = {
    socketAPI: () => {},
  };

  constructor(props) {
    super(props);
    this.state = {
      phone: '',
      badNumber: false,
      isLicenseVisible: false,
      isPolicyVisible: false,
      visibleInput: false,
      promo: this.props.promo,
      cca2: 'US',
    };
  }

  onPressFlag = () => {
    this.myCountryPicker.open();
  };

  selectCountry = country => {
    this.phone.selectCountry(country.iso2);
  };

  handleState = key => {
    this.setState(state => ({
      [key]: !state[key],
    }));
  };

  handleEnterNumber = () => {
    const { phone } = this.state;
    const code = generatePIN();
    const dataSMS = {
      taxiToken: env.app_token,
      phone: unmaskPhone(phone),
      inviteCode: this.props.promo ? this.props.promo.toUpperCase() : '',
      text: code,
    };
    this.props.getSMSCode(code);
    this.props.socketAPI('SEND_SMS', dataSMS);
    return Actions.phoneQuery({ phone });
  };

  handleChangeText = phone => {
    this.setState({ phone }, () => this.validatePhone());
  };

  changePromo = value => {
    this.props.getPromo(value);
  };

  validatePhone = () => {
    const codes = [
      '50', // Vodafone)
      '95', // Vodafone)
      '66', // Vodafone)
      '99', // Vodafone)
      '63', // lifecell)
      '73', // lifecell)
      '93', // lifecell)
      '68', // Kyivstar)
      '67', // Kyivstar)
      '96', // Kyivstar)
      '97', // Kyivstar)
      '98', // Kyivstar)
      '91', // 3mob)
      '92', // PEOPLEnet)
      '94', // Intertelecom)
    ];
    const phone = unmaskPhone(this.state.phone);
    if (phone.length === 13 && env.app_uk) {
      const operator = phone.slice(4, 6);
      const check = codes.some(e => e === operator);
      if (check) {
        return this.setState({ badNumber: false });
      }
      this.setState({ badNumber: true });
    } else this.setState({ badNumber: true });
  };

  renderFooterText = () => {
    return (
      <RNText style={[style.footerText, styleConstants.fontRegular]}>
        {strings.agree1}
        <RNText onPress={() => this.handleState('isLicenseVisible')} style={style.footerLink}>
          {strings.agree2}
        </RNText>
        {strings.agree3}
        <RNText style={style.footerLink} onPress={() => this.handleState('isPolicyVisible')}>
          {strings.agree4}
        </RNText>
      </RNText>
    );
  };

  render() {
    const { badNumber, phone } = this.state;
    return (
      <ScrollView
        contentContainerStyle={styleConstants.rootContainer}
        ref={ref => (this.scroll = ref)}
        onContentSizeChange={() => {
          this.scroll.scrollToEnd();
        }}
        keyboardShouldPersistTaps="always"
        showsVerticalScrollIndicator={false}
      >
        <Header />
        <Logo />

        <View style={style.inputContainer}>
          <TextInput
            ref={ref => (this.phoneField = ref)}
            placeholder={strings.enterPhoneNumber}
            textInputStyle={style.textInput}
            value={phone}
            onChangeText={this.handleChangeText}
            keyboardType="phone-pad"
            masked
            autoFocus
            type="custom"
            options={{ mask: `${this.props.settings.phonePrefix} (999) 999-99-99` }}
            onFocus={() => this.setState({ phone: '' })}
          />
          {!!phone && env.app_uk && (
            <View style={style.statusIcon}>
              <Icon
                mci
                color={badNumber ? colors.red : colors.green}
                name={badNumber ? 'alert-circle-outline' : 'check-circle-outline'}
              />
            </View>
          )}
        </View>
        <View style={style.promoContainer}>
          <RNText
            style={[style.promoText, style.promoTextUnderline]}
            onPress={this.props.isFromLink ? undefined : () => this.handleState('visibleInput')}
          >
            {!this.props.promo
              ? strings.promoInput
              : `${strings.promo}: ${this.props.promo ? this.props.promo.toUpperCase() : ''}`}
          </RNText>
          {!this.props.isFromLink && !!this.props.promo && (
            <RNText style={style.promoText}>{strings.checkCode}</RNText>
          )}
        </View>
        <View style={styleConstants.flex} />
        <Footer
          arrowRight
          onPress={this.handleEnterNumber}
          disabled={(env.app_uk && badNumber) || !phone}
          Component={this.renderFooterText()}
        />
        <PoliciesModal
          visible={this.state.isLicenseVisible}
          onPressBack={() => this.handleState('isLicenseVisible')}
          link="https://fas.taxi/eula/"
        />
        <PoliciesModal
          visible={this.state.isPolicyVisible}
          onPressBack={() => this.handleState('isPolicyVisible')}
          link="https://fas.taxi/privacy/"
        />
        <InputModal
          visible={this.state.visibleInput}
          onChangeText={this.changePromo}
          onSubmit={() => this.handleState('visibleInput')}
          placeholder={strings.enterCode}
          value={this.props.promo}
          maxLength={6}
        />
      </ScrollView>
    );
  }
}

export default connect(
  ({ auth, data }) => ({ promo: auth.promo, isFromLink: auth.isFromLink, settings: data.settings }),
  { socketAPI, getPromo, getSMSCode }
)(SignIn);
