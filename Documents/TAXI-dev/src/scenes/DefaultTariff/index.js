import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import { Actions } from 'react-native-router-flux';

import Header from '../../components/Header';
import { Text, Icon } from '../../components';
import { styleConstants, colors } from '../../helpers';
import style from './style';
import { socketTypes, socketAPI, selectSearchCar } from '../../actions';

class DefaultTariff extends Component {
  static propTypes = {
    fares: PropTypes.array,
    user: PropTypes.object,
    socketAPI: PropTypes.func,
    selectSearchCar: PropTypes.func,
    search: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  };

  constructor(props) {
    super(props);
    this.state = {
      selectedCar: '',
    };
  }

  async componentDidMount() {
    const { fares, user, search } = this.props;
    if (search) {
      if (search === 'empty') return;
      const selectedCar = fares.find(el => el.id === search);
      return this.setState({ selectedCar: selectedCar ? selectedCar.id : '' });
    }
    this.setState({
      selectedCar: user.priceId
        ? user.priceId
        : fares.some(el => el.standardTypeId === 2)
        ? fares.find(el => el.standardTypeId === 2).id
        : fares[0].id,
    });
  }

  editProfile = fareType => {
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
      disableCall,
      showActions,
      showPriceNotification,
      defaultPaymentType,
    } = this.props.user;
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
      defaultPaymentType,
      lang: lang || settings.defaultLang,
      defaultCreditCardId: defaultCreditCard
        ? defaultCreditCard.cardId
        : creditCards[0]
        ? creditCards[0].cardId
        : null,
      priceId: fareType,
    };
    this.props.socketAPI(socketTypes.EDIT_PROFILE, data);
  };

  selectCar = async key => {
    this.editProfile(key);
    Actions.pop();
  };

  selectSearchCar = key => {
    this.props.selectSearchCar(key);
    Actions.pop();
  };

  render() {
    const { fares, search } = this.props;
    const { selectedCar } = this.state;
    return (
      <ScrollView contentContainerStyle={styleConstants.rootContainer}>
        <Header />
        <View style={style.container}>
          {fares.map(car => (
            <TouchableOpacity
              key={car.id}
              style={style.radioItem}
              onPress={search ? () => this.selectSearchCar(car.id) : () => this.selectCar(car.id)}
            >
              <Text
                style={{
                  color: car.id === selectedCar ? colors.black : colors.darkGrey,
                  fontSize: 16,
                }}
              >
                {car.priceName}
              </Text>
              <Icon
                name={car.id === selectedCar ? 'checked' : 'unchecked'}
                color={car.id === selectedCar ? colors.black : colors.darkGrey}
              />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    );
  }
}

export default connect(({ user, data }) => ({ fares: data.fares, user }), {
  socketAPI,
  selectSearchCar,
})(DefaultTariff);
