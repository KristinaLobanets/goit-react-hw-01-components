import React from 'react';
import { View, Image, Modal, Platform, Alert } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Cloudipsp, Order } from 'react-native-cloudipsp';

import { Header, Text, Button, TextInput } from '../../components';
import { strings, Images, styleConstants, colors } from '../../helpers';
import style from './style';

class Payment extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      // webView: 0,
      amount: '1',
      ccy: this.props.settings.merchantCurrency,
      description: strings.addCreditCardRequired,
    };
  }

  componentDidMount() {
    // Cloudipsp.supportsApplePay().then(result => {
    //   console.log('SupportsApplePay: ', result);
    // });
    // Cloudipsp.supportsGooglePay().then(result => {
    //   console.log('SupportsGooglePay: ', result);
    // });
  }

  cloudipsp = () => {
    return new Cloudipsp(Number(this.props.settings.merchantId), payConfirmator => {
      // this.setState({ webView: 1 });
      return payConfirmator(this.cloudipspWebView);
    });
  };

  getOrder = () => {
    const { amount, ccy, description } = this.state;
    return new Order(
      Number(amount),
      ccy,
      `rn_${Math.random()}`,
      description,
      `${this.props.user.clientId}@2299.fas.taxi`
    );
  };

  applePay = () => {
    const cloudipsp = this.cloudipsp();
    const order = this.getOrder();
    cloudipsp
      .applePay(order)
      .then(receipt => {
        // this.setState({ webView: undefined });
        Alert.alert(
          'Transaction Completed :)',
          `Result: ${receipt.status}\nPaymentId: ${receipt.paymentId}`
        );
        // console.log('Receipt: ', receipt);
      })
      .catch(error => {
        // console.log('Error: ', error);
        Alert.alert('Transaction Failure :(', `Result: ${error}`);
      });
  };

  googlePay = () => {
    const cloudipsp = this.cloudipsp();
    const order = this.getOrder();
    // console.log(cloudipsp, order);
    cloudipsp
      .googlePay(order)
      .then(receipt => {
        // this.setState({ webView: undefined });
        Alert.alert(
          'Transaction Completed :)',
          `Result: ${receipt.status}\nPaymentId: ${receipt.paymentId}`
        );
        // console.log('Receipt: ', receipt);
      })
      .catch(error => {
        // console.log('Error: ', error);
        Alert.alert('Transaction Failure :(', `Result: ${error}`);
      });
  };

  platformPay = () => {
    if (Platform.OS === 'ios') {
      this.applePay();
    } else {
      this.googlePay();
    }
    this.props.onChooseType(3);
  };

  render() {
    const {
      visible,
      onChooseType,
      cardNumber = '',
      onClose,
      bonuses,
      maxBonusCount,
      allowPartialBonus,
      tripCost,
      showInput,
      onChangeText,
      bonusCount,
      onBonusesChoose,
      onShowInput,
      error,
      showCard,
      corporateTypes,
      paymentTypes,
      isCorporate,
    } = this.props;
    const isIncorporate = type => {
      const types = isCorporate ? corporateTypes : paymentTypes;
      const result = types?.some(el => el === type);
      return result;
    };
    return (
      <Modal visible={visible} animationType="fade">
        <View style={styleConstants.rootContainer}>
          <Header onPressBack={onClose} />
          <View style={styleConstants.flex}>
            <View style={[styleConstants.flexCenter, showInput && style.paymentImageWithInput]}>
              <Image source={Images.Payments} style={style.paymentImage} />
            </View>
            {!showInput && (
              <View style={style.paymentButtonContainer}>
                <Text modalTitle style={style.paymentPrefferedText}>
                  {strings.paymentMethod}
                </Text>
                {isIncorporate(0) && (
                  <Button
                    title={strings.cash}
                    buttonStyle={style.paymentButton}
                    onPress={() => onChooseType(0)}
                    buttonTextStyle={{ color: colors.black }}
                  />
                )}
                {isIncorporate(1) && showCard && (
                  <Button
                    title={`${strings.payWithCreditCard} ${cardNumber}`}
                    buttonStyle={style.paymentButton}
                    onPress={() => onChooseType(1)}
                    buttonTextStyle={{ color: colors.black }}
                  />
                )}
                {isIncorporate(2) &&
                  ((!allowPartialBonus && bonuses >= tripCost) || allowPartialBonus) && (
                    <Button
                      title={`${strings.bonusPay} - ${bonuses}`}
                      buttonStyle={style.paymentButton}
                      onPress={onShowInput}
                      buttonTextStyle={{ color: colors.black }}
                    />
                  )}
                {isIncorporate(3) && (
                  <Button
                    title={strings.cashless}
                    buttonStyle={style.paymentButton}
                    onPress={() => onChooseType(3)}
                    buttonTextStyle={{ color: colors.black }}
                  />
                )}
                {(isIncorporate(4) || isIncorporate(5)) && false && (
                  <Button
                    buttonStyle={style.paymentButton}
                    onPress={this.platformPay}
                    image={Platform.OS === 'ios' ? Images.APay : Images.GPay}
                  />
                )}
              </View>
            )}
            {!!showInput && (
              <View style={style.paymentInputContainer}>
                <TextInput
                  onChangeText={onChangeText}
                  value={bonusCount}
                  textInputStyle={[
                    style.paymentInput,
                    Platform.OS === 'ios' ? style.badRatingInputIos : null,
                    !!error && style.paymentInputError,
                  ]}
                  keyboardType="phone-pad"
                  maxLength={4}
                  placeholder={strings.amountBonuses}
                />
                {error && (
                  <Text smallRegular style={style.paymentErrorText}>
                    {error === 2
                      ? `${strings.bonusLimit}${maxBonusCount}`
                      : error === 3
                      ? strings.bonusLow
                      : strings.bonusZero}
                  </Text>
                )}
                <View style={style.paymentInputButtonContainer}>
                  <Button
                    onPress={onShowInput}
                    title={strings.cancel}
                    buttonStyle={style.paymentCancelButton}
                  />
                  <Button
                    onPress={onBonusesChoose}
                    title={strings.confirm}
                    buttonStyle={style.paymentConfirmButton}
                    disabled={!!error}
                  />
                </View>
              </View>
            )}
          </View>
        </View>
      </Modal>
    );
  }
}

export default connect(({ data, user }) => ({ settings: data.settings, user }))(Payment);

Payment.propTypes = {
  onChooseType: PropTypes.func,
  cardNumber: PropTypes.string,
  onClose: PropTypes.func,
  visible: PropTypes.bool,
  bonuses: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  maxBonusCount: PropTypes.number,
  allowPartialBonus: PropTypes.bool,
  tripCost: PropTypes.number,
  showInput: PropTypes.bool,
  onChangeText: PropTypes.func,
  bonusCount: PropTypes.string,
  onBonusesChoose: PropTypes.func,
  onShowInput: PropTypes.func,
  error: PropTypes.oneOfType([PropTypes.number, PropTypes.bool]),
  showCard: PropTypes.bool,
  settings: PropTypes.object,
  user: PropTypes.object,
  corporateTypes: PropTypes.array,
  paymentTypes: PropTypes.array,
  isCorporate: PropTypes.number,
};
