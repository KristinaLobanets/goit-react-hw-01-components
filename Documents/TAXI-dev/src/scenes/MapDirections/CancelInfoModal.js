import React from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';

import { Text } from '../../components';
import { strings } from '../../helpers';
import style from './style';

const CancelInfoModal = ({ reason }) => {
  return (
    <View style={style.modalContainer}>
      <View style={style.modalHeader}>
        <Text modalTitle>{strings.tripCanceled}</Text>
      </View>
      <View style={style.lineTextContainer}>
        <View style={style.line} />
        <Text smallText style={style.lineText}>
          {strings.tripCancelReason}
        </Text>
        <View style={style.line} />
      </View>
      <View style={style.reasonInfo}>
        <Text normalText style={style.reasonInfoText}>
          {reason}
        </Text>
      </View>
    </View>
  );
};

export default CancelInfoModal;

CancelInfoModal.propTypes = {
  reason: PropTypes.string.isRequired,
};
