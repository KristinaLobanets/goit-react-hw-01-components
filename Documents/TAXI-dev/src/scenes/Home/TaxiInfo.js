import React from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';

import style from './style';
import { Icon, Text, ArrowRight, Ratings } from '../../components';
import { Images, constants, colors, strings } from '../../helpers';
import env from '../../env';

const TaxiInfo = ({ driver, onClose, onCall }) => {
  const { car, colorId, standardPrice } = driver;
  const carNumber = driver.car_number;
  const color = constants.COLORS.find(e => e.id === colorId)
    ? constants.COLORS.find(e => e.id === colorId).hex
    : '';
  return (
    <View style={style.taxiInfoContainer}>
      <View style={style.taxiInfoHeader}>
        <TouchableOpacity>
          <View style={style.taxiInfoIconWrap}>
            <Icon name="about" size={12} />
          </View>
        </TouchableOpacity>
        <Text style={style.taxiInfoHeaderText}>Таксі комфорт !!</Text>
        <TouchableOpacity onPress={onClose}>
          <Icon name="remove" size={22} />
        </TouchableOpacity>
      </View>
      <View style={style.taxiInfoRatingContainer}>
        <View style={style.taxiInfoLine} />
        <View style={style.taxiInfoRating}>
          <Ratings disabled maxStars={5} rating={4.56} starSize={18} />
        </View>
        <View style={style.taxiInfoLine} />
      </View>
      <View style={style.taxiInfoCarContainer}>
        <View>
          <Image source={Images.SmallAvatar} style={style.driverAvatar} />
        </View>
        <View>
          <Text>{`${strings.car}:`}</Text>
          <Text normalText>{car}</Text>
        </View>
        <View style={style.taxiInfoCarInfo}>
          <View>
            <Text>{`${strings.color}:`}</Text>
            <View
              style={[
                style.taxiInfoColor,
                {
                  backgroundColor: color || colors.green,
                },
              ]}
            />
          </View>
          <View>
            <Text>{`${strings.number}:`}</Text>
            <Text normalText>{carNumber}</Text>
          </View>
        </View>
      </View>
      <View style={style.taxiInfoOptions}>
        <Text>{strings.additionalServices}</Text>
        <Text normalText>{strings.additionalServicesList}</Text>
      </View>
      <View style={style.taxiInfoFooter}>
        <View>
          <Text>{strings.cost}</Text>
          <Text normalText>{`${strings.tripFrom} ${standardPrice} ${env.app_currency}`}</Text>
        </View>
        <View>
          <Text>{strings.filingCar}</Text>
          <Text normalText>{`~ 10 ${strings.timeMin} / 2.2 ${strings.km}`}</Text>
        </View>
        <View>
          <ArrowRight onPress={onCall} disabled />
        </View>
      </View>
    </View>
  );
};

export default TaxiInfo;

TaxiInfo.propTypes = {
  driver: PropTypes.object,
  onClose: PropTypes.func.isRequired,
  onCall: PropTypes.func.isRequired,
};
