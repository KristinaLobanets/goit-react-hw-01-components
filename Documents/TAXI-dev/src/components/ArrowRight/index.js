import React from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';

import { Button } from '..';
import { colors } from '../../helpers';
import style from './style';

const ArrowRight = ({ onPress, disabled, icon, mci, buttonStyle }) => {
  return (
    <View style={style.arrowRight}>
      <Button
        onPress={onPress}
        disabled={disabled}
        buttonStyle={[style.arrowRightButton, buttonStyle]}
        colorIcon={colors.textEnv}
        icon={icon}
        mci={mci}
      />
    </View>
  );
};

export default ArrowRight;

ArrowRight.propTypes = {
  buttonStyle: PropTypes.object,
  disabled: PropTypes.bool,
  icon: PropTypes.string,
  mci: PropTypes.bool,
  onPress: PropTypes.func.isRequired,
};

ArrowRight.defaultProps = {
  disabled: false,
  icon: 'arrow-right',
  mci: false,
};
