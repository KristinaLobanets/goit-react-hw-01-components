import React from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';

import { Text, Button } from '../../components';
import { strings } from '../../helpers';
import style from './style';

const NoTaxi = ({ onPressOtherCar, onWait, onPressOthers }) => {
  return (
    <View style={style.noTaxiContainer}>
      <Text modalTitle>{strings.noFreeCar}</Text>
      <View style={style.lineTextContainer}>
        <View style={style.line} />
        <Text smallText style={style.lineText}>
          {strings.weCanOffer}
        </Text>
        <View style={style.line} />
      </View>
      <View>
        <Button title={strings.await} buttonStyle={style.noTaxiButton} onPress={onWait} />
        <Button
          title={strings.offerSurcharge}
          onPress={onPressOtherCar}
          buttonStyle={style.noTaxiButton}
        />
        <Button
          title={`${strings.checkOtherCarType}`}
          buttonStyle={style.noTaxiButton}
          onPress={onPressOthers}
        />
        {/* <Button
          title={strings.callOtherCar}
          buttonStyle={style.noTaxiButton}
          onPress={onPressOtherClass}
          disabled
        /> */}
      </View>
    </View>
  );
};

export default NoTaxi;

NoTaxi.propTypes = {
  onPressOtherCar: PropTypes.func.isRequired,
  onPressOthers: PropTypes.func,
  onWait: PropTypes.func,
};
