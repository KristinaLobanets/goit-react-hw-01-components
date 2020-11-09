import React from 'react';
import { View, TouchableOpacity, Platform, ScrollView, KeyboardAvoidingView } from 'react-native';
import PropTypes from 'prop-types';

import { Text, Modal, CustomCheckBox, TextInput } from '../../components';
import { styleConstants, strings } from '../../helpers';
import style from './style';

const BadRating = ({ visible, onSend, onCancel, onPick, active, comment, onCommentChange }) => {
  const reasons = [
    { id: 1, reason: strings.ratingBadCar },
    { id: 2, reason: strings.ratingLongRide },
    { id: 3, reason: strings.ratingLowSpeed },
    { id: 4, reason: strings.ratingTrafficRules },
    { id: 5, reason: strings.ratingManyTalks },
    { id: 6, reason: strings.ratingClientFeelBad },
    { id: 7, reason: strings.ratingRideOnOtherCar },
    { id: 8, reason: strings.ratingRefuseHelpWithLuggage },
    { id: 9, reason: strings.ratingAskedForGoodScore },
    { id: 10, reason: strings.ratingCallWithoutReason },
  ];
  const updReasons = reasons.map(r => {
    const isActive = active.some(el => el === r.id);
    r = { ...r, isActive };
    return r;
  });
  const Element = Platform.OS === 'ios' ? KeyboardAvoidingView : View;
  const inner = (
    <Element style={[styleConstants.modalWrap, style.badRatingModal]} behavior="padding">
      <View style={style.modalHeader}>
        <Text modalTitle>{strings.ratingWhyBadRating}</Text>
      </View>
      <View style={style.lineTextContainer}>
        <View style={style.line} />
        <Text smallText style={style.lineText}>
          Причини низької оцінки
        </Text>
        <View style={style.line} />
      </View>
      <ScrollView contentContainerStyle={style.badRatingList}>
        {updReasons.map(el => (
          <TouchableOpacity
            key={el.id}
            style={style.badRatingReasonItem}
            onPress={() => onPick(el.id, el.reason)}
          >
            <CustomCheckBox isChecked={el.isActive} onClick={() => onPick(el.id, el.reason)} />
            <View style={style.badRatingReasonTextWrap}>
              <Text normalText>{el.reason}</Text>
            </View>
          </TouchableOpacity>
        ))}
        <View style={style.badRatingInputContainer}>
          <Text normalText>Інше</Text>
          <TextInput
            value={comment}
            placeholder={strings.cancelReasonEnter}
            onChangeText={onCommentChange}
            textInputStyle={[
              style.badRatingInput,
              Platform.OS === 'ios' ? style.badRatingInputIos : null,
            ]}
          />
        </View>
      </ScrollView>
      <View style={styleConstants.modalButtonsContainer}>
        <TouchableOpacity style={styleConstants.modalLeftButton} onPress={onCancel}>
          <Text normalText>{strings.return}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styleConstants.modalRightButton} onPress={onSend}>
          <Text normalText style={styleConstants.colorTextEnv}>
            {strings.send}
          </Text>
        </TouchableOpacity>
      </View>
    </Element>
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

export default BadRating;

BadRating.propTypes = {
  onPick: PropTypes.func.isRequired,
  visible: PropTypes.bool.isRequired,
  onSend: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  active: PropTypes.any,
  comment: PropTypes.string,
  onCommentChange: PropTypes.func,
};
