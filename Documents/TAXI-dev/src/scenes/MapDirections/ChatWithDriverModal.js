import React from 'react';
import {
  Platform,
  ScrollView,
  TouchableOpacity,
  View,
  TextInput,
  KeyboardAvoidingView,
  Image,
} from 'react-native';
import PropTypes from 'prop-types';
import moment from 'moment';

import { Text, Modal, Icon, ArrowRight } from '../../components';
import { strings, styleConstants, Images, colors } from '../../helpers';
import style from './style';

const ChatWithDriverModal = ({
  visible,
  onClose,
  onInputChatChange,
  sendMessage,
  dialog,
  isMessageDisabled,
  textMessage,
  order,
  userpic,
}) => {
  let scrollChat;
  const Element = Platform.OS === 'ios' ? KeyboardAvoidingView : View;
  const inner = (
    <Element style={[styleConstants.modalWrap, style.chatModal]} behavior="padding">
      <Text modalTitle style={style.chatHeaderText}>
        {strings.chat}
      </Text>
      <TouchableOpacity onPress={onClose} style={style.chatButton}>
        <Icon name="remove" size={26} />
      </TouchableOpacity>
      <ScrollView
        contentContainerStyle={[styleConstants.rootContainer, style.chatList]}
        ref={ref => (scrollChat = ref)}
        onContentSizeChange={() => {
          scrollChat.scrollToEnd();
        }}
      >
        {dialog.map((mess, i, a) => {
          return (
            <View
              style={[
                style.chatMessageContainer,
                mess.from === 'client' ? style.clientChatContainer : style.driverChatContainer,
              ]}
              key={mess.id}
            >
              {mess.from !== 'client' && (a[i] === a[0] || a[i].from !== a[i ? i - 1 : 1].from) && (
                <Image
                  source={
                    order.driverPhoto
                      ? { uri: `data:image/png;base64,${order.driverPhoto}` }
                      : Images.SmallAvatar
                  }
                  style={style.driverAvatar}
                />
              )}
              <View
                style={[
                  mess.from === 'client' ? style.clientText : style.driverText,
                  a[i] === a[0] || a[i].from !== a[i ? i - 1 : 1].from
                    ? {
                        borderTopLeftRadius: mess.from === 'client' ? 6 : 0,
                        borderBottomLeftRadius: 6,
                        borderBottomRightRadius: 6,
                        borderTopRightRadius: mess.from !== 'client' ? 6 : 0,
                      }
                    : {
                        borderRadius: 6,
                        marginRight: mess.from === 'client' ? 48 : 0,
                        marginLeft: mess.from !== 'client' ? 48 : 0,
                      },
                ]}
              >
                <Text
                  normalText
                  style={
                    mess.from !== 'client' ? { color: colors.black } : styleConstants.colorTextEnv
                  }
                >
                  {mess.text}
                </Text>
                <Text smallRegular>{moment(mess.dt, 'DD-MM-YYYY HH:mm').format('HH:mm')}</Text>
              </View>
              {mess.from === 'client' && (a[i] === a[0] || a[i].from !== a[i ? i - 1 : 1].from) && (
                <Image
                  source={
                    userpic ? { uri: `data:image/png;base64,${userpic}` } : Images.SmallAvatar
                  }
                  style={style.chatAvatar}
                />
              )}
            </View>
          );
        })}
      </ScrollView>
      <View style={style.inputStyle}>
        <TextInput
          placeholder={strings.startWrite}
          value={textMessage}
          onChangeText={onInputChatChange}
          style={style.badRatingReasonTextWrap}
          onFocus={() => {
            scrollChat.scrollToEnd();
          }}
        />
        <ArrowRight
          disabled={isMessageDisabled}
          size={14}
          onPress={sendMessage}
          buttonStyle={style.chatArrowButton}
        />
      </View>
    </Element>
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
export default ChatWithDriverModal;

ChatWithDriverModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  sendMessage: PropTypes.func.isRequired,
  onInputChatChange: PropTypes.func.isRequired,
  dialog: PropTypes.array,
  isMessageDisabled: PropTypes.bool,
  textMessage: PropTypes.string,
  order: PropTypes.object,
  userpic: PropTypes.string,
};
