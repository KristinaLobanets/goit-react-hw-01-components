import React from 'react';
import { View, TouchableOpacity, Platform } from 'react-native';
import PropTypes from 'prop-types';

import { Text, Modal, TextInput } from '../../components';
import { strings, styleConstants } from '../../helpers';
import style from './style';

const FormWarningModal = ({
  onePoint,
  visible,
  onLeft,
  onRight,
  isInputs,
  onInputsConfirm,
  onChangeComment,
  onEntranceInput,
  commentValue,
  entranceValue,
}) => {
  const inner = (
    <View style={styleConstants.modalWrap}>
      <View style={style.modalContainer}>
        <View style={style.modalHeader}>
          <Text modalTitle>{strings.warning}</Text>
        </View>
        {onePoint && (
          <Text smallText style={[style.lineText, { marginTop: 16 }]}>
            {strings.secondAddressDidntSet}
          </Text>
        )}
      </View>
      <View style={styleConstants.modalButtonsContainer}>
        <TouchableOpacity style={styleConstants.modalLeftButton} onPress={onLeft}>
          <Text normalText>{strings.cancel}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styleConstants.modalRightButton} onPress={onRight}>
          <Text normalText style={styleConstants.colorTextEnv}>
            {strings.order}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const innerInput = (
    <View style={styleConstants.modalWrap}>
      <View style={style.modalContainer}>
        <View style={style.modalHeader}>
          <Text modalTitle>{strings.warning}</Text>
        </View>

        <Text smallText style={[style.lineText, { marginTop: 16 }]}>
          {strings.inputsPrompt}
        </Text>
      </View>
      <View style={{ marginBottom: 12 }}>
        <View style={{ marginHorizontal: 16, marginBottom: 12 }}>
          <TextInput
            autoFocus
            value={entranceValue}
            onChangeText={onEntranceInput}
            placeholder={strings.approach}
            keyboardType="phone-pad"
            textInputStyle={[
              style.commentInput,
              Platform.OS === 'ios' ? { paddingVertical: 16 } : null,
            ]}
          />
        </View>
        <View style={{ marginHorizontal: 16 }}>
          <TextInput
            value={commentValue}
            onChangeText={onChangeComment}
            multiline
            placeholder={strings.comment}
            maxLength={280}
            textInputStyle={[
              style.commentInput,
              Platform.OS === 'ios' ? { paddingVertical: 16 } : null,
            ]}
          />
        </View>
      </View>
      <View style={styleConstants.modalButtonsContainer}>
        <TouchableOpacity style={styleConstants.modalLeftButton} onPress={onLeft}>
          <Text normalText>{strings.cancel}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styleConstants.modalRightButton} onPress={onInputsConfirm}>
          <Text normalText style={styleConstants.colorTextEnv}>
            {strings.order}
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
        <View style={[styleConstants.modal, styleConstants.modalIosContainer]}>
          {isInputs ? innerInput : inner}
        </View>
      ) : isInputs ? (
        innerInput
      ) : (
        inner
      )}
    </Modal>
  );
};

export default FormWarningModal;

FormWarningModal.propTypes = {
  onePoint: PropTypes.bool,
  visible: PropTypes.bool,
  onLeft: PropTypes.func,
  onRight: PropTypes.func,
  isInputs: PropTypes.bool,
  onInputsConfirm: PropTypes.func,
  onChangeComment: PropTypes.func,
  onEntranceInput: PropTypes.func,
  commentValue: PropTypes.string,
  entranceValue: PropTypes.string,
};
