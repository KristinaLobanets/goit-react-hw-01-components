import React from 'react';
import { View, TouchableOpacity, Platform } from 'react-native';
import PropTypes from 'prop-types';

import { Text, Icon, Modal } from '../../components';
import { colors, strings, styleConstants } from '../../helpers';
import style from './style';

const CancelModal = ({ active, onPressRadio, visible, onLeft, onRight, planned }) => {
  const reasons = [
    { id: 1, reason: strings.cancelReasonDriverAsked },
    { id: 6, reason: strings.cancelReasonChangePlans },
    { id: 2, reason: strings.cancelReasonOrderByMistake },
    { id: 3, reason: strings.cancelReasonWaitToLong },
    { id: 4, reason: strings.cancelReasonUseAnotherTaxi },
    { id: 5, reason: strings.cancelReasonDriverWrongWay },
  ];
  const inner = (
    <View style={styleConstants.modalWrap}>
      <View style={style.modalContainer}>
        <View style={style.modalHeader}>
          <Text modalTitle>{strings.cancelConfirm}</Text>
        </View>
        {!planned && (
          <View style={style.lineTextContainer}>
            <View style={style.line} />
            <Text smallText style={style.lineText}>
              {strings.tripCancelReason}
            </Text>
            <View style={style.line} />
          </View>
        )}
        <View style={style.modalBody}>
          {!planned &&
            reasons.map(el => (
              <TouchableOpacity
                key={el.id}
                style={style.reason}
                onPress={() => onPressRadio(el.id, el.reason)}
              >
                <Icon
                  name={active === el.id ? 'checked' : 'unchecked'}
                  style={style.reasonRadio}
                  color={active === el.id ? undefined : colors.grey}
                />
                <View style={style.reasonTextContainer}>
                  <Text normalText>{el.reason}</Text>
                </View>
              </TouchableOpacity>
            ))}
        </View>
      </View>
      <View style={styleConstants.modalButtonsContainer}>
        <TouchableOpacity style={styleConstants.modalLeftButton} onPress={onLeft}>
          <Text normalText>{strings.return}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styleConstants.modalRightButton} onPress={onRight}>
          <Text normalText style={styleConstants.colorTextEnv}>
            {strings.cancel}
          </Text>
        </TouchableOpacity>
      </View>
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

export default CancelModal;

CancelModal.propTypes = {
  active: PropTypes.number.isRequired,
  onPressRadio: PropTypes.func.isRequired,
  visible: PropTypes.bool.isRequired,
  onLeft: PropTypes.func.isRequired,
  onRight: PropTypes.func.isRequired,
  planned: PropTypes.bool,
};
