import React from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import PropTypes from 'prop-types';

import { Icon, Text } from '..';
import style from './style';

const Button = ({
  icon,
  buttonTextStyle,
  onPress,
  buttonStyle,
  title,
  colorIcon,
  iconButtonStyle,
  disabled,
  mci,
  image,
  numberOfLines = 1,
}) => {
  return (
    <TouchableOpacity
      style={[
        style.button,
        buttonStyle,
        disabled ? style.disabled : null,
        image ? style.imageWrap : null,
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      {!!icon && (
        <View style={iconButtonStyle}>
          <Icon name={icon} color={colorIcon} mci={mci} />
        </View>
      )}
      {!image && (
        <Text style={[style.buttonText, buttonTextStyle]} numberOfLines={numberOfLines}>
          {title}
        </Text>
      )}
      {!!image && <Image source={image} style={style.image} resizeMode="contain" />}
    </TouchableOpacity>
  );
};

Button.propTypes = {
  buttonStyle: PropTypes.any,
  buttonTextStyle: PropTypes.any,
  colorIcon: PropTypes.string,
  disabled: PropTypes.bool,
  icon: PropTypes.string,
  iconButtonStyle: PropTypes.any,
  image: PropTypes.any,
  mci: PropTypes.bool,
  numberOfLines: PropTypes.number,
  onPress: PropTypes.func,
  title: PropTypes.string,
};

Button.defaultProps = {
  buttonStyle: {},
  buttonTextStyle: {},
  colorIcon: '',
  disabled: false,
  icon: '',
  iconButtonStyle: {},
  mci: false,
  numberOfLines: 1,
  onPress: () => {},
  title: '',
};

export default Button;
