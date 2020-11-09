import React, { Component } from 'react';
import {
  View,
  TouchableOpacity,
  ScrollView,
  DatePickerAndroid,
  Image,
  Platform,
} from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';
import DateTimePicker from 'react-native-modal-datetime-picker';

import { Actions } from 'react-native-router-flux';
import { Text, Header, Icon, Button, InputModal } from '../../components';
import { socketAPI, socketTypes, switchRegistration } from '../../actions';
import style from './style';
import { styleConstants, colors, showImagePicker, Images, strings } from '../../helpers';
import env from '../../env';

class RegisterProfile extends Component {
  static propTypes = {
    socketAPI: PropTypes.func.isRequired,
    user: PropTypes.any,
    register: PropTypes.bool,
    scene: PropTypes.string,
    switchRegistration: PropTypes.func.isRequired,
    token: PropTypes.string,
  };

  static defaultProps = {
    user: {},
  };

  constructor(props) {
    super(props);
    this.state = {
      name: '',
      email: '',
      dateOfBirth: '',
      image: null,
      phone: '',
      date: new Date(1990, 0, 1),
      isEmailValid: true,
      visibleName: false,
      visibleEmail: false,
    };
  }

  async componentDidMount() {
    this.props
      .socketAPI(socketTypes.GET_PROFILE, { clientId: this.props.user.clientId })
      .then(() => {
        const { name, email, dateOfBirth, base64Photo } = this.props.user;
        this.setState({
          name: name || '',
          email: email || '',
          dateOfBirth: dateOfBirth && dateOfBirth !== '01-01-0001' ? dateOfBirth : '',
          image: base64Photo && base64Photo !== 'null' ? base64Photo : null,
          phone: this.props.user.phone,
        });
      });
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.email !== prevState.email) {
      this.handleCheckEmail();
    }
  }

  componentWillUnmount() {
    if (this.props.register) {
      this.props.switchRegistration(false);
      const dataLogin = {
        taxiToken: env.app_token,
        phone: this.props.user.phone,
        firebaseToken: this.props.token,
      };
      return this.props.socketAPI('LOGON', dataLogin);
    }
  }

  handleShowImagePicker = () => {
    showImagePicker()
      .then(res => {
        const result = res.split(',');
        this.setState({ image: result[1] });
      })
      .catch(error => {
        throw new Error(error);
      });
  };

  handleDatePickerAndroid = async () => {
    try {
      const { action, year, month, day } = await DatePickerAndroid.open({
        date: new Date(1990, 0, 1),
        minDate: new Date(1900, 0, 1),
        maxDate: new Date(),
        mode: 'spinner',
      });
      if (action !== DatePickerAndroid.dismissedAction) {
        const dateOfBirth = moment({ year, month, day }).format('DD-MM-YYYY');
        this.setState({ dateOfBirth });
      }
    } catch ({ code, message }) {
      throw new Error(message);
    }
  };

  handleEnter = () => {
    const { name, dateOfBirth, email, image, phone } = this.state;
    const {
      clientId,
      disableCall,
      lang,
      settings,
      showActions,
      showPriceNotification,
      defaultPaymentType,
      priceId,
    } = this.props.user;
    const data = {
      clientId,
      name,
      dateOfBirth: dateOfBirth || this.props.user.dateOfBirth,
      email,
      base64Photo: image ? `data:image/png;base64,${image}` : null,
      phone: phone || this.props.user.phone,
      disableCall,
      showActions,
      showPriceNotification,
      lang: lang || settings.defaultLang,
      defaultCreditCardId: this.props.user.defaultCreditCard
        ? this.props.user.defaultCreditCard.cardId
        : this.props.user.creditCards[0]
        ? this.props.user.creditCards[0].cardId
        : null,
      defaultPaymentType,
      priceId,
    };
    this.props
      .socketAPI(socketTypes.EDIT_PROFILE, data)
      .then(() =>
        this.props.socketAPI(socketTypes.GET_PROFILE, { clientId: this.props.user.clientId })
      );
    if (this.props.register) {
      return Actions.reset(this.props.scene ? this.props.scene : 'home');
    }
    return Actions.pop();
  };

  handlePass = () => {
    const {
      base64Photo,
      email,
      clientId,
      disableCall,
      lang,
      settings,
      name,
      dateOfBirth,
      phone,
      showActions,
      showPriceNotification,
      defaultPaymentType,
      priceId,
    } = this.props.user;
    const data = {
      clientId,
      name,
      dateOfBirth,
      email,
      base64Photo,
      phone,
      disableCall,
      showActions,
      showPriceNotification,
      defaultPaymentType,
      lang: lang || settings.defaultLang,
      priceId,
      defaultCreditCardId: this.props.user.defaultCreditCard
        ? this.props.user.defaultCreditCard.cardId
        : this.props.user.creditCards[0]
        ? this.props.user.creditCards[0].cardId
        : null,
    };
    this.props.socketAPI(socketTypes.EDIT_PROFILE, data);
    return Actions.reset(this.props.scene ? this.props.scene : 'home');
  };

  handleName = value => {
    this.setState({ name: value });
  };

  handleEmail = value => {
    this.setState({ email: value });
  };

  handleClear = () => this.setState({ dateOfBirth: '' });

  handleCheckEmail = () => {
    // eslint-disable-next-line no-useless-escape
    const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,})+$/;
    if (this.state.email && reg.test(this.state.email) === false) {
      this.setState({ isEmailValid: false });
    } else {
      this.setState({ isEmailValid: true });
    }
  };

  handleHideModal = () => {
    this.handleCheckEmail();
    this.setState({ visibleEmail: false, visibleName: false });
  };

  handleOpenModal = key => {
    this.setState({ [`visible${key}`]: true });
  };

  handleDeletePhoto = () => {
    this.setState({ image: null });
  };

  handleVisibleDatePicker = () => {
    this.setState(state => ({
      isDateTimePickerVisible: !state.isDateTimePickerVisible,
    }));
  };

  handleDatePicked = date => {
    const dateOfBirth = moment(date).format('DD-MM-YYYY');
    this.setState({ date, dateOfBirth, isDateTimePickerVisible: false });
  };

  render() {
    const image = this.state.image
      ? { uri: `data:image/png;base64,${this.state.image}` }
      : Images.Avatar;
    const { name, email, dateOfBirth, isEmailValid } = this.state;
    return (
      <ScrollView
        contentContainerStyle={styleConstants.rootContainer}
        bounces={false}
        showsVerticalScrollIndicator={false}
        ref={ref => (this.scroll = ref)}
        onContentSizeChange={() => {
          this.scroll.scrollToEnd();
        }}
      >
        {!this.props.register && <Header />}
        <View style={styleConstants.flexCenter}>
          <Text subTitle style={style.headerText} onPress={this.showImagePicker}>
            {strings.enterYourData}
          </Text>
          <View>
            <TouchableOpacity onPress={this.handleShowImagePicker}>
              <Image source={image} style={style.image} />
            </TouchableOpacity>
            {!!this.state.image && (
              <TouchableOpacity style={style.iconDelete} onPress={this.handleDeletePhoto}>
                <Icon name="remove" />
              </TouchableOpacity>
            )}
          </View>
        </View>
        <View style={style.formWrap}>
          <TouchableOpacity
            style={style.textInputWrap}
            onPress={() => this.handleOpenModal('Name')}
          >
            <Text
              style={[
                style.textInputStyle,
                {
                  color: name ? colors.black : colors.grey,
                },
                styleConstants.fontMedium,
              ]}
            >
              {name || strings.userName}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={style.textInputWrap}
            onPress={() => this.handleOpenModal('Email')}
          >
            <Text
              style={[
                style.textInputStyle,
                {
                  color: email ? colors.black : colors.grey,
                },
                email ? { borderColor: isEmailValid ? colors.green : colors.red } : null,
                styleConstants.fontMedium,
              ]}
            >
              {email || strings.userEmail}
            </Text>
          </TouchableOpacity>
          {(this.props.user.dateOfBirth === '01-01-0001' || !this.props.user.dateOfBirth) && (
            <View>
              <TouchableOpacity
                onPress={
                  Platform.OS === 'ios'
                    ? this.handleVisibleDatePicker
                    : this.handleDatePickerAndroid
                }
              >
                <Text
                  style={[
                    {
                      color: dateOfBirth ? colors.black : colors.grey,
                    },
                    style.datePickerTextIos,
                    styleConstants.fontMedium,
                  ]}
                >
                  {dateOfBirth || strings.userBirthday}
                </Text>
              </TouchableOpacity>
              {!!dateOfBirth && (
                <TouchableOpacity onPress={this.handleClear} style={style.clearButton}>
                  <Icon name="remove" color={colors.grey} />
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>
        <View style={style.buttons}>
          <Button
            title={strings.save}
            disabled={!this.state.isEmailValid && !!this.state.email}
            onPress={this.handleEnter}
            buttonStyle={styleConstants.flex}
          />
          {this.props.register && (
            <Button
              title={strings.pass}
              disabled={false}
              onPress={this.handlePass}
              buttonStyle={style.passButton}
            />
          )}
        </View>
        <InputModal
          visible={this.state.visibleEmail}
          onChangeText={this.handleEmail}
          value={this.state.email}
          onSubmit={this.handleHideModal}
          keyboardType="email-address"
          placeholder={strings.userEmail}
        />
        <InputModal
          visible={this.state.visibleName}
          onChangeText={this.handleName}
          value={this.state.name}
          onSubmit={this.handleHideModal}
          keyboardType="name-phone-pad"
          placeholder={strings.userName}
        />
        <DateTimePicker
          isVisible={this.state.isDateTimePickerVisible}
          onConfirm={this.handleDatePicked}
          onCancel={this.handleVisibleDatePicker}
          mode="date"
          maximumDate={new Date()}
          minimumDate={new Date(1900, 0, 1)}
          date={this.state.date}
        />
      </ScrollView>
    );
  }
}

export default connect(
  ({ user, auth }) => ({ user, register: auth.register, scene: auth.scene, token: auth.token }),
  {
    socketAPI,
    switchRegistration,
  }
)(RegisterProfile);
