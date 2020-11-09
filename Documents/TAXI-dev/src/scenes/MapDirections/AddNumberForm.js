import React, { Component } from 'react';
import { View, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { styleConstants, unmaskPhone, colors, strings } from '../../helpers';
import { chooseContact } from '../../actions';
import { Header, TextInput, Text, Icon } from '../../components';
import style from './style';
import env from '../../env';

class AddNumberForm extends Component {
  static propTypes = {
    onBack: PropTypes.func,
    settings: PropTypes.object,
    chooseContact: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = {
      phone: '',
      badNumber: false,
    };
  }

  componentDidMount() {}

  handleChangeText = phone => {
    this.setState({ phone }, () => this.validatePhone());
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

  handleAddContact = () => {
    const number = unmaskPhone(this.state.phone);
    const numberData = {
      recordID: number,
      phoneNumbers: [{ number }],
      givenName: number,
    };
    this.props.chooseContact(numberData).then(() => {
      this.props.onBack();
    });
  };

  render() {
    const disabled = !this.state.phone || this.state.badNumber;
    return (
      <View style={style.addNumberContainer}>
        <View style={style.addNumberModal}>
          <Header onPressBack={this.props.onBack} />
          <View style={style.addNumberInputWrap}>
            <TextInput
              ref={ref => (this.input = ref)}
              value={this.state.phone}
              textInputStyle={style.addNumberInput}
              placeholder={strings.addNumber}
              onChangeText={this.handleChangeText}
              keyboardType="phone-pad"
              masked
              autoFocus
              type="custom"
              options={{ mask: `${this.props.settings.phonePrefix} (999) 999-99-99` }}
            />
            {!!this.state.phone && env.app_uk && (
              <View style={style.addNumberInputIcon}>
                <Icon
                  mci
                  color={this.state.badNumber ? colors.red : colors.green}
                  name={this.state.badNumber ? 'alert-circle-outline' : 'check-circle-outline'}
                />
              </View>
            )}
          </View>
          <TouchableOpacity
            style={[styleConstants.modalButton, disabled ? style.addNumberButtonDisabled : null]}
            disabled={disabled}
            onPress={this.handleAddContact}
          >
            <Text
              normalText
              style={[styleConstants.colorTextEnv, disabled ? style.addNumberTextDisabled : null]}
            >
              {strings.addNumber}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

export default connect(({ data }) => ({ settings: data.settings }), {
  chooseContact,
})(AddNumberForm);
