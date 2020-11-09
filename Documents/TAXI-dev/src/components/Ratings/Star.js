import React from 'react';
import { ViewPropTypes, Image, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';

const propTypes = {
  buttonStyle: ViewPropTypes.style,
  disabled: PropTypes.bool.isRequired,
  onStarButtonPress: PropTypes.func,
  starImage: PropTypes.any,
  starSize: PropTypes.number.isRequired,
  starStyle: ViewPropTypes.style,
};

const defaultProps = {
  buttonStyle: {},
};

const StarButton = props => {
  const { buttonStyle, disabled, starImage, starSize, starStyle } = props;
  const imageStyle = {
    width: starSize,
    height: starSize,
    resizeMode: 'contain',
  };
  const iconStyles = [imageStyle, starStyle];
  return (
    <TouchableOpacity disabled={disabled} style={buttonStyle} onPress={props.onStarButtonPress}>
      <Image source={starImage} style={iconStyles} />
    </TouchableOpacity>
  );
};

export default StarButton;

StarButton.propTypes = propTypes;
StarButton.defaultProps = defaultProps;
