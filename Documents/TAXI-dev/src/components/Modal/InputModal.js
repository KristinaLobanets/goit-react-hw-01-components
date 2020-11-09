import React, { Component } from 'react';
import { View, Platform, KeyboardAvoidingView } from 'react-native';
import PropTypes from 'prop-types';
import Modal from 'react-native-modal';

import { TextInput } from '..';
import style from './style';

const Element = Platform.OS === 'ios' ? KeyboardAvoidingView : View;

export class InputModal extends Component {
  render() {
    const {
      keyboardType,
      maxLength,
      onChangeText,
      onSubmit,
      placeholder,
      value,
      visible,
    } = this.props;
    return (
      <Modal
        isVisible={visible}
        onBackdropPress={onSubmit}
        onBackButtonPress={onSubmit}
        backdropOpacity={0.602553}
        style={style.inputModal}
      >
        <Element style={style.inputModalContainer} behavior="position">
          <TextInput
            ref={ref => (this.input = ref)}
            onLayout={() => this.input.focus()}
            autofocus
            value={value}
            onChangeText={onChangeText}
            onSubmitEditing={onSubmit}
            keyboardType={keyboardType}
            placeholder={placeholder}
            maxLength={maxLength}
            textInputWrap={style.inputModalWrap}
          />
        </Element>
      </Modal>
    );
  }
}

InputModal.propTypes = {
  keyboardType: PropTypes.string,
  maxLength: PropTypes.number,
  onChangeText: PropTypes.func,
  onSubmit: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  visible: PropTypes.bool,
};
