import React from 'react';
import { Image } from 'react-native';
import PropTypes from 'prop-types';

import style from './style';
import { Images } from '../../helpers';

export const TaxiMarker = ({ free }) => {
  return <Image source={free ? Images.TaxiGreen : Images.TaxiRed} style={style.taxiMarker} />;
};

TaxiMarker.propTypes = {
  free: PropTypes.bool,
};
