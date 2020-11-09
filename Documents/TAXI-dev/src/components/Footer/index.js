import React from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';

import style from './style';

import { ArrowRight } from '..';

const Footer = ({ onPress, arrowRight, disabled, Component, buttonStyle }) => {
  return (
    <View style={style.footerWrap}>
      {Component || null}
      {!!arrowRight && (
        <ArrowRight onPress={onPress} disabled={disabled} buttonStyle={buttonStyle} />
      )}
    </View>
  );
};

export default Footer;

Footer.propTypes = {
  arrowRight: PropTypes.bool,
  buttonStyle: PropTypes.object,
  Component: PropTypes.element,
  disabled: PropTypes.bool,
  onPress: PropTypes.func,
};

Footer.defaultProps = {
  arrowRight: false,
  disabled: false,
  onPress: () => {},
};
