import React from 'react';
import { View, TouchableOpacity, Platform } from 'react-native';
import PropTypes from 'prop-types';

import { Text, Modal } from '../../components';
import { styleConstants, strings } from '../../helpers';
import style from './style';

const CancelType = ({ visible, onCancelAuto, onCancelRide, onClose }) => {
  const inner = (
    <View style={styleConstants.modalWrap}>
      <Text modalTitle style={style.templateHeader}>
        {strings.cancel}
      </Text>
      <View style={[style.line, style.cancelTypeLine]} />
      <TouchableOpacity style={style.cancelTypeOption} onPress={onCancelAuto} disabled>
        <Text style={style.cancelTypeText}>{strings.car}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={style.cancelTypeOption} onPress={onCancelRide}>
        <Text style={style.cancelTypeText}>{strings.trip}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styleConstants.modalButton} onPress={onClose}>
        <Text normalText>{strings.close}</Text>
      </TouchableOpacity>
    </View>
  );
  return (
    <Modal
      visible={visible}
      style={styleConstants.modal}
      backdropOpacity={0.602553}
      plain={Platform.OS !== 'android'}
    >
      {Platform.OS !== 'android' ? (
        <View style={[styleConstants.modal, styleConstants.modalIosContainer]}>{inner}</View>
      ) : (
        inner
      )}
    </Modal>
  );
};

export default CancelType;

CancelType.propTypes = {
  visible: PropTypes.bool,
  onCancelAuto: PropTypes.func.isRequired,
  onCancelRide: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};
