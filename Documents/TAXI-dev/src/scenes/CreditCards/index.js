import React, { PureComponent } from 'react';
import { View, ScrollView, TouchableOpacity, Alert, Linking } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';

import { Header, Text, Preloader, Button, TextInput } from '../../components';
import { styleConstants, strings } from '../../helpers';
import {
  socketAPI,
  socketTypes,
  deleteDefaultCard,
  clearErrors,
  clearBonuses,
} from '../../actions';

import Card from './Card';
import style from './style';
import env from '../../env';

class CreditCards extends PureComponent {
  static propTypes = {
    socketAPI: PropTypes.func.isRequired,
    user: PropTypes.object,
    deleteDefaultCard: PropTypes.func.isRequired,
    settings: PropTypes.object,
    errors: PropTypes.object,
    popup: PropTypes.object,
    clearErrors: PropTypes.func,
    clearBonuses: PropTypes.func,
    bonusCode: PropTypes.object,
  };

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      promo: '',
      tab: 1,
    };
    this.routesData = [
      { key: 'first', title: strings.myCards },
      { key: 'second', title: strings.bonusesTab },
    ];
  }

  componentDidMount() {
    this.props.socketAPI(socketTypes.GET_PROFILE, {
      clientId: this.props.user.clientId,
    });
  }

  componentDidUpdate({ user, errors, bonusCode }) {
    if (
      JSON.stringify(user.defaultCreditCard) !== JSON.stringify(this.props.user.defaultCreditCard)
    ) {
      this.setState({ loading: false });
    }

    if (errors.bonusError !== this.props.errors.bonusError && errors.bonusError === undefined) {
      this.props.popup.showPopup({
        text: strings.promoFail,
        onPress: () => {
          this.props.clearErrors();
          this.setState({
            promo: '',
          });
        },
        header: strings.warning,
      });
    }
    if (bonusCode !== this.props.bonusCode && bonusCode === undefined) {
      this.props.popup.showPopup({
        header: strings.welcome,
        text: strings.formatString(strings.promoSuccess, this.props.bonusCode.amount),
        onPress: () => {
          this.props.clearBonuses();
          this.props.socketAPI(socketTypes.GET_PROFILE, {
            clientId: this.props.user.clientId,
          });
          this.setState({
            promo: '',
          });
        },
      });
    }
  }

  changeTab = tab => {
    if (this.state.tab === tab) return;
    return this.setState({ tab });
  };

  deleteCard = id => {
    const { defaultCreditCard, creditCards, clientId } = this.props.user;
    let isDefault;
    if (defaultCreditCard && defaultCreditCard.cardId === id) {
      isDefault = true;
    }
    const filtered = creditCards.filter(card => card.cardId !== id);
    this.props.socketAPI('DELETE_CREDIT_CARD', {
      cardId: id,
      clientId,
    });
    if (isDefault && filtered.length > 0) {
      return this.editProfile(filtered[0].cardId);
    }
    if (!filtered.length && this.props.user.defaultPaymentType === 1) {
      this.editProfile(null, true);
    }
    this.props.deleteDefaultCard();
    return this.props.socketAPI(socketTypes.GET_PROFILE, { clientId });
  };

  handleDeleteButton = id => {
    Alert.alert(strings.warning, strings.deleteCardConfirm, [
      {
        onPress: () => {},
        text: strings.cancel,
      },
      { onPress: () => this.deleteCard(id), text: 'OK' },
    ]);
  };

  addPromoCode = () => {
    if (this.state.promo) {
      this.props.socketAPI(socketTypes.BONUS_CODE, {
        clientId: this.props.user.clientId,
        code: this.state.promo,
      });
    }
  };

  addCard = () => {
    if (this.props.settings.merchantProviderId === 1) {
      return Actions.addCreditCard();
    }
    if (this.props.settings.merchantProviderId === 2) {
      Linking.openURL(
        `https://${env.app_host}/web/client-payments/asset?clientId=${this.props.user.clientId}`
      );
      Actions.pop();
    }
  };

  editProfile = (id, type) => {
    const {
      disableCall,
      showActions,
      showPriceNotification,
      clientId,
      name,
      dateOfBirth,
      email,
      phone,
      defaultPaymentType,
      settings,
      lang,
      base64Photo,
      priceId,
    } = this.props.user;
    const data = {
      defaultCreditCardId: id,
      name,
      clientId,
      dateOfBirth,
      email,
      phone,
      defaultPaymentType: type ? 0 : defaultPaymentType,
      disableCall,
      showActions,
      showPriceNotification,
      lang: lang || settings.defaultLang,
      base64Photo: base64Photo ? `data:image/png;base64,${base64Photo}` : null,
      priceId,
    };
    this.props.socketAPI(socketTypes.EDIT_PROFILE, data);
    if (!type) {
      this.props.socketAPI(socketTypes.GET_PROFILE, { clientId });
    }
  };

  handleDefaultCard = id => {
    if (this.props.user.defaultCreditCard && this.props.user.defaultCreditCard.cardId === id)
      return;
    this.setState({ loading: true });
    this.editProfile(id);
  };

  renderCardRoute = () => {
    const { defaultCreditCard, creditCards } = this.props.user;
    return (
      <View style={style.promoTab}>
        {this.props.settings.merchantProviderId && (
          <View style={style.cardsContainer}>
            {creditCards.length ? (
              creditCards.map(card => (
                <Card
                  key={card.cardId}
                  card={card}
                  onCardPress={this.handleDefaultCard}
                  onDeleteCard={this.handleDeleteButton}
                  defaultCard={defaultCreditCard ? defaultCreditCard.cardId : undefined}
                />
              ))
            ) : (
              <View style={style.stub}>
                <Text subTitle style={style.stubText}>
                  {strings.noCreditCard}
                </Text>
              </View>
            )}
          </View>
        )}
        {this.props.settings.merchantProviderId && (
          <View style={style.buttonContainer}>
            <TouchableOpacity style={style.button} onPress={this.addCard}>
              <Text>{strings.addCreditCard}</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  renderBonusRoute = () => (
    <View style={style.promoTab}>
      <View style={style.bonusesContainer}>
        <View style={style.bonusesWrap}>
          <Text smallRegular>{strings.onAccount}</Text>
          <Text style={style.bonusesString}>{`${this.props.user.balance?.toFixed(2)} ${
            strings.bonuses
          }`}</Text>
        </View>
      </View>
      <View style={styleConstants.flex}>
        <Text modalTitle style={style.promoText}>
          {strings.aboutPromo}
        </Text>
        <View style={style.promoLineContainer}>
          <View style={style.promoLine} />
          <Text>{strings.enterPromo}</Text>
          <View style={style.promoLine} />
        </View>
        <TextInput
          value={this.state.promo}
          onChangeText={value => this.setState({ promo: value })}
          placeholder="PROMO"
          maxLength={10}
          textInputStyle={style.promoInput}
          textInputWrap={style.promoInputWrap}
        />
      </View>
      <Button
        title={strings.usePromo}
        buttonStyle={style.promoButton}
        disabled={!this.state.promo || this.state.promo.length < 4}
        onPress={this.addPromoCode}
      />
    </View>
  );

  render() {
    const { loading } = this.state;
    return (
      <ScrollView
        contentContainerStyle={styleConstants.rootContainer}
        bounces={false}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() => this.scroll.scrollToEnd()}
        ref={ref => (this.scroll = ref)}
        keyboardShouldPersistTaps="always"
      >
        <Header bigTitle={strings.myFinances} />
        {this.props.settings.merchantProviderId ? (
          <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity
              style={{
                flex: 1,
                borderBottomWidth: this.state.tab === 1 ? 2 : 0,
                alignItems: 'center',
                paddingVertical: 16,
              }}
              onPress={() => this.changeTab(1)}
            >
              <Text normalText>{strings.myCards}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                flex: 1,
                borderBottomWidth: this.state.tab === 2 ? 2 : 0,
                alignItems: 'center',
                paddingVertical: 16,
              }}
              onPress={() => this.changeTab(2)}
            >
              <Text normalText>{strings.bonusesTab}</Text>
            </TouchableOpacity>
          </View>
        ) : null}
        {this.props.settings.merchantProviderId ? (
          <View style={styleConstants.flex}>
            {this.state.tab === 1 ? this.renderCardRoute() : this.renderBonusRoute()}
          </View>
        ) : (
          this.renderBonusRoute()
        )}
        <Preloader fullScreen loading={loading} />
      </ScrollView>
    );
  }
}

export default connect(
  ({ user, popup, data, errors }) => ({
    user,
    popup,
    settings: data.settings,
    errors,
    bonusCode: data.bonusCode,
  }),
  {
    socketAPI,
    deleteDefaultCard,
    clearErrors,
    clearBonuses,
  }
)(CreditCards);
