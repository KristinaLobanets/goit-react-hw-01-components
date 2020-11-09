import React from 'react';
import { Image } from 'react-native';
import PropTypes from 'prop-types';

import styles from './style';
import { Images } from '../../helpers';

export const Pins = ({ type = 'origin', style }) => {
  const Pin = type === 'origin' ? Images.OriginPin : Images.DestPin;
  return <Image source={Pin} style={[styles.image, style]} />;
};

Pins.propTypes = {
  type: PropTypes.string,
  style: PropTypes.object,
};
