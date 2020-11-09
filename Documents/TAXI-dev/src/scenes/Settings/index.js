import React, { Component } from 'react';
import { View, ScrollView, TouchableOpacity, Modal, SafeAreaView, Platform } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';

import {
  socketAPI,
  logout,
  setDefaultLang,
  getDefaultLang,
  socketTypes,
  clearEditProfile,
} from '../../actions';
import { Header, Icon, Text } from '../../components';
import { styleConstants, strings, langs, colors } from '../../helpers';
import style from './style';

import SettingsGroup from './SettingsGroup';
import SettingsItem from './SettingsItem';

class Settings extends Component {
  static propTypes = {
    logout: PropTypes.func.isRequired,
    settings: PropTypes.object,
    popup: PropTypes.object,
    user: PropTypes.object,
    setDefaultLang: PropTypes.func,
    disableCall: PropTypes.bool,
    showActions: PropTypes.bool,
    socketAPI: PropTypes.func.isRequired,
    showPriceNotification: PropTypes.bool,
    edit: PropTypes.string,
    clearEditProfile: PropTypes.func.isRequired,
    fares: PropTypes.array,
  };

  constructor(props) {
    super(props);
    let paymentName;
    this.methods = [
      {
        id: 0,
        nameV: strings.cash,
      },
      {
        id: 1,
        nameV: strings.payWithCreditCard,
      },
    ];
    if (Number.isInteger(+this.props.user.defaultPaymentType)) {
      paymentName = this.methods.filter(item => item.id === +this.props.user.defaultPaymentType)[0]
        .nameV;
    } else {
      paymentName = strings.cash;
    }
    this.state = {
      langShow: false,
      paymentShow: false,
      language: '',
      disableCall: this.props.user.disableCall,
      showActions: this.props.user.showActions,
      showPriceNotification: this.props.user.showPriceNotification,
      paymentMethod: paymentName,
      paymentMethodId: 0,
    };
  }

  componentDidMount() {
    const defLan = langs.filter(lan => this.props.user.settings.defaultLang === lan.shortName);
    if (this.props.edit) {
      this.props.clearEditProfile();
    }
    this.setState({
      language: defLan[0].name,
      disableCall: this.props.user.disableCall,
      showActions: this.props.user.showActions,
      showPriceNotification: this.props.user.showPriceNotification,
      paymentMethodId: this.props.settings.merchantProviderId
        ? this.props.user.defaultPaymentType
        : 0,
    });
  }

  componentDidUpdate({ edit }, { disableCall, showActions, showPriceNotification }) {
    if (edit !== this.props.edit && this.props.edit === 'Success') {
      this.props.socketAPI(socketTypes.GET_PROFILE, { clientId: this.props.user.clientId });
      this.props.clearEditProfile();
    }

    if (
      disableCall !== this.state.disableCall ||
      showActions !== this.state.showActions ||
      showPriceNotification !== this.state.showPriceNotification
    ) {
      this.editProfile();
    }
  }

  handleLogout = () => {
    this.props.popup.showPopup({
      buttons: true,
      header: strings.warning,
      text: `${strings.logout}?`,
      line: true,
      buttonRightName: `${strings.logout}`,
      buttonLeftName: `${strings.cancel}`,
      onPressRight: () => {
        this.props.logout();
        Actions.init();
      },
    });
  };

  handleLanguageChange = index => {
    this.props.setDefaultLang(langs[index].shortName);
    this.setState(
      prevState => ({
        langShow: !prevState.langShow,
        language: langs[index].name,
      }),
      () => {
        this.editProfile(langs[index].shortName);
      }
    );
  };

  handleSwitchChange = name => {
    this.setState(prevState => ({ [name]: !prevState[name] }));
  };

  handlePayMethodChange = value => {
    const stateValue = this.methods.filter(item => item.id === value)[0];
    this.setState(
      {
        paymentShow: false,
        paymentMethod: stateValue.nameV,
        paymentMethodId: stateValue.id,
      },
      () => this.editProfile()
    );
  };

  editProfile = language => {
    const {
      name,
      clientId,
      dateOfBirth,
      email,
      phone,
      base64Photo,
      settings,
      lang,
      defaultCreditCard,
      creditCards,
      priceId,
    } = this.props.user;
    const { disableCall, showActions, showPriceNotification, paymentMethodId } = this.state;
    const data = {
      name,
      clientId,
      dateOfBirth,
      email,
      phone,
      base64Photo: base64Photo ? `data:image/png;base64,${base64Photo}` : null,
      disableCall,
      showActions,
      showPriceNotification,
      defaultPaymentType: paymentMethodId,
      lang: language || lang || settings.defaultLang,
      defaultCreditCardId: defaultCreditCard
        ? defaultCreditCard.cardId
        : creditCards[0]
        ? creditCards[0].cardId
        : null,
      priceId,
    };
    this.props.socketAPI(socketTypes.EDIT_PROFILE, data);
  };

  render() {
    const {
      disableCall,
      showActions,
      showPriceNotification,
      paymentMethodId,
      paymentMethod,
      paymentShow,
      language,
      langShow,
    } = this.state;
    const { fares, user, settings } = this.props;
    const active =
      user.priceId ||
      (fares.some(el => el.standardTypeId === 2)
        ? fares.find(el => el.standardTypeId === 2).id
        : fares[0]
        ? fares[0].id
        : '');
    const current = fares?.find(el => el.id === active);

    const name = Object.keys(current || {}).length > 0 ? current.priceName : '';

    return (
      <View style={styleConstants.rootContainerSimple}>
        <Header bigTitle={strings.settings} headerStyle={style.header} />
        <ScrollView contentContainerStyle={style.body}>
          <SettingsGroup>
            <SettingsItem
              title={strings.appLanguage}
              onPress={() => {
                this.setState(prevState => ({
                  langShow: !prevState.langShow,
                }));
              }}
              currentOption={language}
              isLast
              isExit={false}
            />
          </SettingsGroup>
          <SettingsGroup>
            {!!settings.merchantProviderId && (
              <SettingsItem
                id={0}
                title={strings.defPayment}
                onPress={() => {
                  this.setState(prevState => ({
                    paymentShow: !prevState.paymentShow,
                  }));
                }}
                currentOption={paymentMethod}
                isLast={!user.allowChangePriceId}
              />
            )}
            {user.allowChangePriceId && (
              <SettingsItem
                title={strings.defTariff}
                onPress={() => Actions.defaultTariff()}
                currentOption={name}
                isLast
              />
            )}
          </SettingsGroup>
          <SettingsGroup>
            <SettingsItem
              title={strings.dontCallMe}
              onValueChange={() => this.handleSwitchChange('disableCall')}
              value={disableCall}
              isSwitch
            />
            <SettingsItem
              title={strings.showActions}
              onValueChange={() => this.handleSwitchChange('showActions')}
              value={showActions}
              isSwitch
            />
            <SettingsItem
              title={strings.noticeAboutshowPriceNotification}
              onValueChange={() => this.handleSwitchChange('showPriceNotification')}
              value={showPriceNotification}
              isSwitch
              isLast
            />
          </SettingsGroup>
          <SettingsGroup>
            <SettingsItem
              title={strings.logout}
              onPress={() => this.handleLogout()}
              isLast
              isExit
            />
          </SettingsGroup>
        </ScrollView>

        {/* MODAL LANGUAGES */}
        <Modal visible={langShow} animationType="slide">
          {Platform.OS === 'ios' ? (
            <SafeAreaView>
              <TouchableOpacity
                style={style.modalHeaderIos}
                onPress={() => this.setState({ langShow: false })}
              >
                <Icon name="arrow-left" size={12} style={style.iosback} />
                <Text smallText>{strings.return}</Text>
              </TouchableOpacity>
            </SafeAreaView>
          ) : (
            <Header onPressBack={() => this.setState({ langShow: false })} />
          )}
          <View style={style.modalItemsList}>
            {langs.map((lang, index) => (
              <TouchableOpacity
                style={style.lang}
                onPress={() => this.handleLanguageChange(index)}
                key={lang.name}
              >
                <Text
                  style={[
                    style.langName,
                    {
                      color: language === lang.name ? colors.black : colors.grey,
                    },
                  ]}
                >
                  {lang.name}
                </Text>
                <Icon
                  mci
                  name={language === lang.name ? 'radiobox-marked' : 'radiobox-blank'}
                  color={language === lang.name ? colors.black : colors.grey}
                />
              </TouchableOpacity>
            ))}
          </View>
        </Modal>

        <Modal visible={paymentShow} animationType="slide">
          {Platform.OS === 'ios' ? (
            <SafeAreaView>
              <TouchableOpacity
                style={style.modalHeaderIos}
                onPress={() => this.setState({ paymentShow: false })}
              >
                <Icon name="arrow-left" size={12} style={style.iosback} />
                <Text smallText>{strings.return}</Text>
              </TouchableOpacity>
            </SafeAreaView>
          ) : (
            <Header onPressBack={() => this.setState({ paymentShow: false })} />
          )}
          <View style={style.modalItemsList}>
            {this.methods.map(method => (
              <TouchableOpacity
                key={method.id}
                style={style.lang}
                onPress={() => this.handlePayMethodChange(method.id)}
                disabled={method.id === 1 && !user.defaultCreditCard}
              >
                <Text
                  style={[
                    style.methodName,
                    {
                      color:
                        method.id === 1 && !user.defaultCreditCard ? colors.grey : colors.darkGrey,
                    },
                  ]}
                >
                  {method.nameV}
                </Text>
                <Icon
                  mci
                  name={paymentMethodId === method.id ? 'radiobox-marked' : 'radiobox-blank'}
                  color={
                    method.id === 1 && !user.defaultCreditCard
                      ? colors.grey
                      : paymentMethodId === method.id
                      ? colors.black
                      : colors.darkGrey
                  }
                />
              </TouchableOpacity>
            ))}
          </View>
        </Modal>
      </View>
    );
  }
}

export default connect(
  ({ user, popup, errors, data }) => ({
    user,
    popup,
    edit: errors.editProfile,
    settings: data.settings,
    fares: data.fares,
  }),
  {
    socketAPI,
    logout,
    setDefaultLang,
    getDefaultLang,
    clearEditProfile,
  }
)(Settings);
