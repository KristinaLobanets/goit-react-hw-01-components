import React from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';

import { Text, Icon } from '../../components';
import { colors, strings, styleConstants } from '../../helpers';
import style from './style';
import env from '../../env';

const SearchTaxi = ({ order, additionalServices }) => {
  const {
    calculatedPrice,
    additionalPrice,
    street0,
    street1,
    street2,
    street3,
    street4,
    house0,
    house1,
    house2,
    house3,
    house4,
    object0,
    object1,
    object2,
    object3,
    object4,
    priceName,
  } = order;
  const address0 = object0 ? `${object0} (${street0}, ${house0})` : `${street0}, ${house0 || 1}`;
  let address1;
  let address2;
  let address3;
  let address4;
  if (street1) {
    address1 = object1 ? `${object1} (${street1}, ${house1})` : `${street1}, ${house1 || 1}`;
  }
  if (street2) {
    address2 = object2 ? `${object2} (${street2}, ${house2})` : `${street2}, ${house2 || 1}`;
  }
  if (street3) {
    address3 = object3 ? `${object3} (${street3}, ${house3})` : `${street3}, ${house3 || 1}`;
  }
  if (street4) {
    address4 = object4 ? `${object4} (${street4}, ${house4})` : `${street4}, ${house4 || 1}`;
  }
  return (
    <View style={style.bottomNavigationViewSearch}>
      <View style={style.directionsContainer}>
        <View
          style={[
            style.directionsHeaderContainer,
            {
              justifyContent: 'space-between',
              alignItems: 'center',
              flexDirection: 'row',
            },
          ]}
        >
          <Text style={style.directionsHeader}>{strings.searchForCar}</Text>
          <Text>{priceName}</Text>
        </View>
        <View>
          <View style={style.originContainer}>
            <View style={style.directionsIconContainer}>
              <View style={styleConstants.orangeDot} />
            </View>
            <Text normalText style={style.directionsText}>
              {street0 ? address0 : '--/--'}
            </Text>
          </View>
          {street1 ? (
            <View style={style.destinationContainer}>
              <View style={style.directionsIconContainer}>
                <Icon name="marker" size={12} />
              </View>
              <Text normalText style={style.directionsText}>
                {address1}
              </Text>
            </View>
          ) : null}
          {street2 ? (
            <View style={style.destinationContainer}>
              <View style={style.directionsIconContainer}>
                <Icon name="marker" size={12} />
              </View>
              <Text normalText style={style.directionsText}>
                {address2}
              </Text>
            </View>
          ) : null}
          {street3 ? (
            <View style={style.destinationContainer}>
              <View style={style.directionsIconContainer}>
                <Icon name="marker" size={12} />
              </View>
              <Text normalText style={style.directionsText}>
                {address3}
              </Text>
            </View>
          ) : null}
          {street4 ? (
            <View style={style.destinationContainer}>
              <View style={style.directionsIconContainer}>
                <Icon name="marker" size={12} />
              </View>
              <Text normalText style={style.directionsText}>
                {address4}
              </Text>
            </View>
          ) : null}
        </View>
      </View>
      <View style={style.searchOptionsContainer}>
        <View style={style.searchTextWrap}>
          <Text smallRegular>{strings.additionally}</Text>
          <Text normalText>{`${strings.serviceCount} ${additionalServices}`}</Text>
        </View>
        <View style={style.searchTextWrap}>
          <Text smallRegular>{strings.cost}</Text>
          <Text normalText>{`${Math.ceil(calculatedPrice) + additionalPrice || 0} ${
            env.app_currency
          }`}</Text>
        </View>
        <View style={style.searchTextWrap}>
          <Text smallRegular>{strings.payment}</Text>
          <View style={style.searchPaymentWrap}>
            <Icon
              name={
                order.paymentTypeId === 0
                  ? 'cash'
                  : order.paymentTypeId === 1
                  ? 'credit-card'
                  : 'rocket'
              }
              color={colors.green}
              style={style.paymentIcon}
              size={14}
            />
            <Text normalText>
              {order.paymentTypeId === 0
                ? strings.cash
                : order.paymentTypeId === 1
                ? strings.creditCard
                : order.paymentTypeId === 2
                ? strings.bonusPay
                : strings.cashless}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default SearchTaxi;

SearchTaxi.propTypes = {
  order: PropTypes.object,
  additionalServices: PropTypes.number,
};
