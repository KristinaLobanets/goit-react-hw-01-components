import React from 'react';
import { View, TouchableOpacity, Platform, KeyboardAvoidingView, ScrollView } from 'react-native';
import PropTypes from 'prop-types';

import { TextInput, Modal, Text } from '../../components';
import { strings, styleConstants } from '../../helpers';
import style from './style';

const Comment = ({ onChangeText, value, visible, onLeft, onRight }) => {
  const Element = Platform.OS === 'ios' ? KeyboardAvoidingView : View;
  return (
    <Modal visible={visible} backdropOpacity={0.602553}>
      <ScrollView bounces={false} contentContainerStyle={style.commentScroll}>
        <View style={[styleConstants.modalWrap]}>
          <View style={style.commentContainer}>
            <View style={style.commentHeader}>
              <Text modalTitle>{strings.commentDriver}</Text>
            </View>
            <Element style={[style.commentInputContainer]}>
              <TextInput
                multiline
                placeholder={strings.startWrite}
                maxLength={280}
                textInputStyle={[
                  style.commentInput,
                  Platform.OS === 'ios' ? style.badRatingInputIos : null,
                ]}
                onChangeText={onChangeText}
                value={value}
              />
            </Element>
            <View style={style.commentStub} />
          </View>
          <View style={styleConstants.modalButtonsContainer}>
            <TouchableOpacity style={styleConstants.modalLeftButton} onPress={onLeft}>
              <Text normalText>{strings.cancel}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styleConstants.modalRightButton} onPress={onRight}>
              <Text normalText style={styleConstants.colorTextEnv}>
                {strings.save}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </Modal>
  );
};

export default Comment;

Comment.propTypes = {
  onChangeText: PropTypes.func,
  value: PropTypes.string,
  visible: PropTypes.bool,
  onLeft: PropTypes.func.isRequired,
  onRight: PropTypes.func.isRequired,
};
