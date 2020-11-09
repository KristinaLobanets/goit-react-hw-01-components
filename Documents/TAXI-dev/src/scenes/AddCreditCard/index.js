import React, { Component } from 'react';
import { View, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  Cloudipsp,
  CloudipspWebView,
  CardLayout,
  CardFieldNumber,
  CardFieldCvv,
  CardFieldExpMm,
  CardFieldExpYy,
  Order,
} from 'react-native-cloudipsp';
import { Actions } from 'react-native-router-flux';

import { socketAPI, socketTypes } from '../../actions';
import { Header, Text, Button } from '../../components';
import { styleConstants, strings } from '../../helpers';
import style from './style';

class AddCreditCard extends Component {
  static propTypes = {
    user: PropTypes.object,
    popup: PropTypes.object,
    scene: PropTypes.string,
    socketAPI: PropTypes.func.isRequired,
    settings: PropTypes.object,
    isCreateTemplate: PropTypes.bool,
  };

  constructor(props) {
    super(props);
    this.cloudipsp = new Cloudipsp(this.props.settings.merchantId, payConfirmator => {
      this.setState({ webView: 1 });
      return payConfirmator(this.cloudipspWebView);
    });
    this.state = {
      webView: 0,
      amount: '100',
      ccy: this.props.settings.merchantCurrency,
      description: strings.addCreditCardRequired,
      disabled: false,
    };
  }

  editProfile = () => {
    const {
      name,
      clientId,
      dateOfBirth,
      email,
      phone,
      creditCards,
      defaultPaymentType,
      disableCall,
      showActions,
      showPriceNotification,
      lang,
      settings,
      base64Photo,
      priceId,
    } = this.props.user;
    const data = {
      name,
      clientId,
      dateOfBirth,
      email,
      phone,
      defaultCreditCardId: creditCards[0] ? creditCards[0].cardId : null,
      defaultPaymentType: this.props.scene === 'mapDir' ? 1 : defaultPaymentType,
      disableCall,
      showActions,
      showPriceNotification,
      lang: lang || settings.defaultLang,
      base64Photo: base64Photo ? `data:image/png;base64,${base64Photo}` : null,
      priceId,
    };
    this.props.socketAPI(socketTypes.EDIT_PROFILE, data);
    this.props.socketAPI(socketTypes.GET_PROFILE, { clientId });
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

  pay = () => {
    const order = this.getOrder();
    order.setRequiredRecToken(true);
    const card = this.cardForm.getCard();
    if (!card.isValidCardNumber()) {
      this.props.popup.showPopup({
        text: strings.invalidCard,
        header: strings.warning,
      });
    } else if (!card.isValidExpireMonth()) {
      this.props.popup.showPopup({
        text: strings.invalidMonth,
        header: strings.warning,
      });
    } else if (!card.isValidExpireYear()) {
      this.props.popup.showPopup({
        text: strings.invalidYear,
        header: strings.warning,
      });
    } else if (!card.isValidExpireDate()) {
      this.props.popup.showPopup({
        text: strings.invalidDate,
        header: strings.warning,
      });
    } else if (!card.isValidCvv()) {
      this.props.popup.showPopup({
        text: strings.invalidCvv,
        header: strings.warning,
      });
    } else {
      this.setState({ disabled: true });
      this.cloudipsp
        .pay(card, order)
        .then(receipt => {
          this.setState({ webView: undefined });
          if (receipt.status === 'declined') {
            return this.props.popup.showPopup({
              error: true,
              header: strings.warning,
              text: strings.cardDecline,
            });
          }
          this.props.popup.showPopup({
            text: `${strings.result}: ${receipt.status}\nPaymentId: ${receipt.paymentId}`,
            header: strings.transactionCompleted,
          });
          this.props.socketAPI('ADD_CREDIT_CARD', {
            clientId: this.props.user.clientId,
            maskedCard: receipt.maskedCard,
            cardType: receipt.cardType,
            cardToken: receipt.recToken,
            merchantOrderId: order.orderId,
            amount: receipt.amount,
            currency: receipt.currency,
          });
          this.props.socketAPI(socketTypes.GET_PROFILE, { clientId: this.props.user.clientId });
          setTimeout(() => {
            if (!this.props.user.defaultCreditCard) {
              this.editProfile();
            }
            if (this.props.scene === 'mapDir') {
              if (this.props.isCreateTemplate) {
                return Actions.popTo('mapDir', { scene: 'addCreditCard' });
              }
              return Actions.reset('mapDir', { scene: 'addCreditCard' });
            }
            return Actions.pop();
          }, 1000);
        })
        .catch(error => {
          this.props.popup.showPopup({
            text: error.message,
            header: strings.error,
            error: true,
          });
          Actions.refresh();
        });
    }
  };

  render() {
    const { scene } = this.props;
    const { webView } = this.state;
    return (
      <ScrollView
        contentContainerStyle={styleConstants.rootContainer}
        bounces={false}
        showsVerticalScrollIndicator={false}
      >
        <Header
          onPressBack={
            scene === 'mapDir'
              ? () => Actions.reset('mapDir', { scene: 'addCreditCard' })
              : undefined
          }
        />
        <Text header style={style.header}>
          {strings.addCreditCard}
        </Text>
        {webView === 0 ? (
          <View style={style.container}>
            <View style={styleConstants.flex}>
              <View style={style.cardInputContainer}>
                <CardLayout
                  ref={ref => (this.cardForm = ref)}
                  inputNumber={() => this.inputNumber}
                  inputExpMm={() => this.inputMm}
                  inputExpYy={() => this.inputYy}
                  inputCvv={() => this.inputCvv}
                >
                  <View>
                    <Text smallText style={style.textLabel}>
                      {strings.number}
                    </Text>
                    <CardFieldNumber
                      ref={ref => (this.inputNumber = ref)}
                      style={style.simpleTextInput}
                      onSubmitEditing={() => {
                        this.inputMm.focus();
                      }}
                    />
                  </View>
                  <View style={style.inputsRow}>
                    <View style={style.expireWrap}>
                      <Text style={style.textLabel} smallText>
                        Expiry:
                      </Text>
                      <View style={style.inputsDateRow}>
                        <CardFieldExpMm
                          ref={ref => (this.inputMm = ref)}
                          style={[
                            styleConstants.flex,
                            style.simpleTextInput,
                            style.inputBordersRight,
                          ]}
                          placeholder="MM"
                          onSubmitEditing={() => {
                            this.inputYy.focus();
                          }}
                        />
                        <CardFieldExpYy
                          ref={ref => (this.inputYy = ref)}
                          style={[
                            styleConstants.flex,
                            style.simpleTextInput,
                            style.inputBordersLeft,
                          ]}
                          onSubmitEditing={() => {
                            this.inputCvv.focus();
                          }}
                          placeholder="YY"
                        />
                      </View>
                    </View>
                    <View style={style.cvvWrap}>
                      <Text smallText style={style.textLabel}>
                        CVV:
                      </Text>
                      <CardFieldCvv
                        ref={ref => (this.inputCvv = ref)}
                        style={style.simpleTextInput}
                      />
                    </View>
                  </View>
                </CardLayout>
              </View>
            </View>
            <View style={style.buttonContainer}>
              <Button
                title={strings.saveCreditCard}
                buttonStyle={style.button}
                onPress={this.pay}
                disabled={this.state.disabled}
              />
            </View>
          </View>
        ) : (
          <View style={styleConstants.flex}>
            <CloudipspWebView
              ref={ref => (this.cloudipspWebView = ref)}
              decelerationRate="normal"
              onError={error => {
                this.props.popup.showPopup({
                  text: `webViewError:${JSON.stringify(error)}`,
                  header: strings.error,
                  error: true,
                });
              }}
              style={styleConstants.flex}
            />
          </View>
        )}
      </ScrollView>
    );
  }
}

export default connect(
  ({ user, popup, data, tech }) => ({
    user,
    popup,
    settings: data.settings,
    isCreateTemplate: tech.isCreateTemplate,
  }),
  {
    socketAPI,
  }
)(AddCreditCard);
