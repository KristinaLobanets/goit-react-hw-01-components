import React from 'react';
import { Modal, SafeAreaView } from 'react-native';
import PropTypes from 'prop-types';
import WebView from 'react-native-webview';

import { Header } from '..';
import { styleConstants } from '../../helpers';
import style from './style';

export const PoliciesModal = ({ visible, onPressBack, link }) => {
  return (
    <Modal visible={visible} animationType="slide">
      <SafeAreaView style={styleConstants.flex}>
        <Header onPressBack={onPressBack} headerStyle={style.subHeader} />
        <WebView source={{ uri: link }} />
      </SafeAreaView>
    </Modal>
  );
};

export default PoliciesModal;

PoliciesModal.propTypes = {
  link: PropTypes.string,
  onPressBack: PropTypes.func,
  visible: PropTypes.bool,
};
