import React from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import { createIconSetFromFontello } from 'react-native-vector-icons';
import MCI from 'react-native-vector-icons/MaterialCommunityIcons';
import FA from 'react-native-vector-icons/FontAwesome';
import FA5 from 'react-native-vector-icons/FontAwesome5';

import fontelloConfig from '../../config.json';
import { colors } from '../../helpers';

const IconCustom = createIconSetFromFontello(fontelloConfig);

const Icon = ({
  name = 'noname',
  size = 20,
  color = colors.black,
  style,
  mci = false,
  fa = false,
  fa5 = false,
}) => {
  return (
    <View>
      {mci ? (
        <MCI name={name} size={size} color={color} style={style} />
      ) : fa ? (
        <FA name={name} size={size} color={color} style={style} />
      ) : fa5 ? (
        <FA5 name={name} size={size} color={color} style={style} />
      ) : (
        <IconCustom name={name} size={size} color={color} style={style} />
      )}
    </View>
  );
};
export default Icon;

Icon.propTypes = {
  color: PropTypes.string,
  mci: PropTypes.bool,
  fa: PropTypes.bool,
  fa5: PropTypes.bool,
  name: PropTypes.string.isRequired,
  size: PropTypes.number,
  style: PropTypes.any,
};
