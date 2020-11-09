import React from 'react';
import { View, TouchableOpacity, Platform, Image } from 'react-native';
import PropTypes from 'prop-types';

import { Text, Modal } from '../../components';
import { styleConstants, strings, Images, colors } from '../../helpers';
import style from './style';

const FriendConfirmModal = ({ visible, onConfirm, onClose, friend = {} }) => {
  const item = { ...friend };
  const inner = (
    <View style={styleConstants.modalWrap}>
      <Text modalTitle style={style.templateHeader}>
        {strings.whoOrderFor}
      </Text>
      <View>
        <View
          style={{
            flexDirection: 'row',
            paddingHorizontal: 24,
            backgroundColor: colors.lightGrey,
            paddingVertical: 12,
          }}
        >
          <Image
            source={item.thumbnailPath ? { uri: item.thumbnailPath } : Images.SmallAvatar}
            style={style.friendImage}
          />
          <View style={styleConstants.flex}>
            <Text smallBlackText>
              {`${item.givenName}${item.middleName ? ` ${item.middleName}` : ''}${
                item.familyName ? ` ${item.familyName}` : ''
              }`}
            </Text>
            <Text>
              {item.phoneNumbers[0]
                ? item.phoneNumbers[0].number
                    .split('-')
                    .join('')
                    .split(' ')
                    .join('')
                : ''}
            </Text>
          </View>
        </View>
        <View style={{ marginHorizontal: 24, paddingVertical: 12 }}>
          <Text smallRegular>{strings.confirmOther}</Text>
        </View>
      </View>
      <View style={styleConstants.modalButtonsContainer}>
        <TouchableOpacity style={styleConstants.modalLeftButton} onPress={onClose}>
          <Text normalText>{strings.change}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styleConstants.modalRightButton} onPress={onConfirm}>
          <Text normalText style={styleConstants.colorTextEnv}>
            {strings.confirm}
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

export default FriendConfirmModal;

FriendConfirmModal.propTypes = {
  visible: PropTypes.bool,
  onConfirm: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  friend: PropTypes.object,
};
