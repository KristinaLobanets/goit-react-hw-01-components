import React from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';

import style from './style';

const SettingsGroup = ({ children }) => {
  return <View style={style.group}>{children}</View>;
};

export default SettingsGroup;

SettingsGroup.propTypes = {
  children: PropTypes.any,
};
