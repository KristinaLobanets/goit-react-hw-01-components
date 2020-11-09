import React from 'react';
import { Text } from 'react-native';
import PropTypes from 'prop-types';

import styles from './style';

const TextCustom = ({
  children,
  style,
  header,
  subTitle,
  smallText,
  smallRegular,
  normalText,
  numberOfLines,
  smallBlackText,
  modalTitle,
}) => {
  const getType = () => {
    if (header) {
      return styles.header;
    }
    if (subTitle) {
      return styles.subtitle;
    }
    if (smallText) {
      return styles.smallText;
    }
    if (smallRegular) {
      return styles.smallRegular;
    }
    if (smallBlackText) {
      return styles.smallBlackText;
    }
    if (normalText) {
      return styles.normalText;
    }
    if (modalTitle) {
      return styles.modalTitle;
    }
    return null;
  };
  return (
    <Text numberOfLines={numberOfLines} style={[styles.defaultFont, getType(), style]}>
      {children}
    </Text>
  );
};

TextCustom.propTypes = {
  children: PropTypes.any,
  header: PropTypes.bool,
  modalTitle: PropTypes.bool,
  normalText: PropTypes.bool,
  numberOfLines: PropTypes.number,
  smallBlackText: PropTypes.bool,
  smallRegular: PropTypes.bool,
  smallText: PropTypes.bool,
  style: PropTypes.any,
  subTitle: PropTypes.bool,
};

TextCustom.defaultProps = {
  children: '',
  header: false,
  modalTitle: false,
  normalText: false,
  numberOfLines: undefined,
  smallBlackText: false,
  smallRegular: false,
  smallText: false,
  style: {},
  subTitle: false,
};

export default TextCustom;
