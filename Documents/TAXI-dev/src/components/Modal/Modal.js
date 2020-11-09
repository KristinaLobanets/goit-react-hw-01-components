import React from 'react';
import { Modal as PlainModal } from 'react-native';
import RNModal from 'react-native-modal';
import PropTypes from 'prop-types';

export const Modal = props =>
  props.plain ? (
    <PlainModal visible={props.visible} transparent hardwareAccelerated>
      {props.children}
    </PlainModal>
  ) : (
    <RNModal
      isVisible={props.visible}
      onBackButtonPress={props.onBackButtonPress}
      onBackdropPress={props.onBackdropPress}
      style={props.style}
      backdropOpacity={props.backdropOpacity}
      animationOutTiming={50}
      hardwareAccelerated
    >
      {props.children}
    </RNModal>
  );

Modal.propTypes = {
  backdropOpacity: PropTypes.number,
  children: PropTypes.element.isRequired,
  onBackButtonPress: PropTypes.func,
  onBackdropPress: PropTypes.func,
  plain: PropTypes.bool,
  style: PropTypes.object,
  visible: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]),
};

Modal.defaultProps = {
  backdropOpacity: 0.602553,
  onBackButtonPress: () => null,
  onBackdropPress: () => null,
  style: {},
  visible: false,
};
