import React from 'react';
import { View, Image, Linking, TouchableOpacity, Platform } from 'react-native';
import PropTypes from 'prop-types';

import { Text, Icon, Ratings } from '../../components';
import { colors, Images, constants, strings } from '../../helpers';

import style from './style';
import env from '../../env';

const DriverInfo = ({ order, time, onChatOpenPress, handleRideShare }) => {
  const {
    driverPhoto,
    driverName,
    driverRating,
    driverPhone,
    car,
    carNumber,
    colorId,
    calculatedPrice,
    additionalPrice,
    street0,
    house0,
    object0,
  } = order;

  const address = object0 ? `${object0}, ${street0}, ${house0}` : `${street0}, ${house0 || 1}`;
  const color = constants.COLORS.find(e => e.id === colorId)
    ? constants.COLORS.find(e => e.id === colorId).hex
    : '';
  return (
    <View style={style.driverContainer}>
      <View style={style.driverInfo}>
        <View style={style.driverNameContainer}>
          <Image
            source={
              driverPhoto ? { uri: `data:image/png;base64,${driverPhoto}` } : Images.SmallAvatar
            }
            style={style.driverAvatar}
          />
          <View style={style.driverCarTextWrap}>
            <Text normalText>{driverName}</Text>
            <Ratings
              disabled
              maxStars={5}
              rating={driverRating}
              starSize={14}
              buttonStyle={style.driverInfoRatingStar}
            />
          </View>
        </View>
        <View style={style.driverChatButtons}>
          <TouchableOpacity onPress={onChatOpenPress}>
            <Icon name="chat" color={colors.blue} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              Linking.openURL(`tel:${Platform.OS === 'ios' ? '//' : ''}${driverPhone}`)
            }
            style={style.driverInfoCentralIcon}
          >
            <Icon name="call" color={colors.lightGreen} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleRideShare}>
            <Icon name="share" />
          </TouchableOpacity>
        </View>
      </View>
      <View style={style.driverCarInfo}>
        <View style={style.driverNameContainer}>
          <View style={style.driverCarTextWrap}>
            <Text smallRegular>{strings.car}</Text>
            <Text smallBlackText>{car}</Text>
          </View>
        </View>
        <View style={style.driverCarColor}>
          <Text smallRegular>{strings.color}</Text>
          <View style={[style.colorBlock, { backgroundColor: color }]} />
        </View>
        <View style={style.driverCarTextWrap}>
          <Text smallRegular>{`${strings.number}:`}</Text>
          <Text smallBlackText>{carNumber}</Text>
        </View>
      </View>
      <View style={style.driverMessage}>
        <Text normalText>{`${strings.waitNear} ${address}`}</Text>
      </View>
      <View style={style.driverOptionsContainer}>
        {time !== undefined && time >= 0 && (
          <View style={style.driverCarTextWrap}>
            <Text smallRegular>{strings.driverTime}</Text>
            <Text normalText>{`${Math.ceil(time || 0)} ${strings.timeMin}.`}</Text>
          </View>
        )}
        {!!calculatedPrice && (
          <View style={style.driverCarTextWrap}>
            <Text smallRegular>{strings.cost}</Text>
            <Text normalText>{`${Math.ceil(calculatedPrice) + additionalPrice || 0} ${
              env.app_currency
            }`}</Text>
          </View>
        )}
        <View style={style.driverCarTextWrap}>
          <Text smallRegular>{strings.payment}</Text>
          <View style={style.driverInfoPaymentWrap}>
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

export default DriverInfo;

DriverInfo.propTypes = {
  order: PropTypes.object,
  time: PropTypes.number,
  onChatOpenPress: PropTypes.func,
  handleRideShare: PropTypes.func,
};
