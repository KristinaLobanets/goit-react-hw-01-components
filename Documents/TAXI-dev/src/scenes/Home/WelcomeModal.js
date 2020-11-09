import React from 'react';
import { Platform, ScrollView, TouchableOpacity, View, Dimensions } from 'react-native';
import PropTypes from 'prop-types';

import { Text, Modal } from '../../components';
import { strings, styleConstants } from '../../helpers';
import env from '../../env';

const { height } = Dimensions.get('window');
const WelcomeModal = ({ visible, onClose, text }) => {
  const inner = (
    <View style={[styleConstants.modalWrap, { marginVertical: height * 0.1, overflow: 'hidden' }]}>
      <Text
        modalTitle
        style={{
          paddingVertical: 12,
          backgroundColor: env.app_color,
          borderTopRightRadius: 10,
          borderTopLeftRadius: 10,
        }}
      >
        {strings.welcome}
      </Text>
      <ScrollView
        contentContainerStyle={[
          styleConstants.rootContainer,
          {
            paddingHorizontal: 16,
            paddingVertical: 12,
          },
        ]}
      >
        <Text smallBlackText style={{ alignSelf: 'center', paddingVertical: 16 }}>
          {text}
        </Text>
      </ScrollView>
      <TouchableOpacity style={styleConstants.modalButton} onPress={onClose}>
        <Text normalText style={styleConstants.colorTextEnv}>
          {strings.ok}
        </Text>
      </TouchableOpacity>
    </View>
  );
  return (
    <Modal
      visible={visible}
      backdropOpacity={0.602553}
      plain={Platform.OS !== 'android'}
      style={styleConstants.modal}
    >
      {Platform.OS !== 'android' ? (
        <View style={[styleConstants.modal, styleConstants.modalIosContainer]}>{inner}</View>
      ) : (
        inner
      )}
    </Modal>
  );
};
export default WelcomeModal;

WelcomeModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  text: PropTypes.string,
};
