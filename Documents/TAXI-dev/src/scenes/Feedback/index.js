import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { ScrollView, Platform, View, Image } from 'react-native';
import { connect } from 'react-redux';
import moment from 'moment';

import { TextInput, Header, Button, Text } from '../../components';
import { styleConstants, strings, Images, colors } from '../../helpers';
import { socketAPI, socketTypes } from '../../actions';
import style from './style';

class Feedback extends Component {
  static propTypes = {
    socketAPI: PropTypes.func.isRequired,
    user: PropTypes.object,
    feedback: PropTypes.array,
  };

  constructor(props) {
    super(props);

    this.state = {
      message: '',
    };
    this.dialogScroll = null;
  }

  componentDidMount() {
    this.getFeedback();
  }

  getFeedback = () => {
    this.props.socketAPI(socketTypes.FEEDBACK_HISTORY, { clientId: this.props.user.clientId });
  };

  handleChangeMessage = value => {
    this.setState({ message: value });
  };

  handleSubmitMessage = () => {
    const { clientId } = this.props.user;
    this.props.socketAPI(socketTypes.FEEDBACK, { clientId, text: this.state.message });
    this.getFeedback();
    this.setState({ message: '' });
  };

  renderDialog = () => {
    const dialog = this.props.feedback;
    const userpic = this.props.user.base64Photo;
    return (
      <ScrollView
        contentContainerStyle={[styleConstants.rootContainer, style.chatList]}
        ref={ref => (this.dialogScroll = ref)}
        onContentSizeChange={() => {
          this.dialogScroll.scrollToEnd();
        }}
      >
        {dialog.map(mess => {
          return (
            <View key={mess.id}>
              <View style={[style.chatMessageContainer, style.clientChatContainer]}>
                <View style={style.clientText}>
                  <Text normalText style={{ color: colors.black }}>
                    {mess.message}
                  </Text>
                  <Text smallRegular>
                    {moment(mess.dt, 'DD-MM-YYYY HH:mm').format('DD-MM-YYYY HH:mm')}
                  </Text>
                </View>
                {!!mess.message && (
                  <Image
                    source={
                      userpic ? { uri: `data:image/png;base64,${userpic}` } : Images.SmallAvatar
                    }
                    style={style.chatAvatar}
                  />
                )}
              </View>
              {!!mess.reply && (
                <View style={[style.chatMessageContainer, style.driverChatContainer]} key={mess.id}>
                  <Image source={Images.SmallAvatar} style={style.driverAvatar} />
                  <View style={style.driverText}>
                    <Text normalText style={styleConstants.colorTextEnv}>
                      {mess.reply}
                    </Text>
                    <Text smallRegular>
                      {moment(mess.dt, 'DD-MM-YYYY HH:mm').format('DD-MM-YYYY HH:mm')}
                    </Text>
                  </View>
                </View>
              )}
            </View>
          );
        })}
      </ScrollView>
    );
  };

  render() {
    const { message } = this.state;
    return (
      <View style={styleConstants.rootContainerSimple}>
        <Header bigTitle={strings.callback} />
        {this.props.feedback.length > 0 && (
          <View style={styleConstants.flex}>{this.renderDialog()}</View>
        )}
        <View>
          <Text style={style.text}>{strings.feedbackInfo}</Text>
          <TextInput
            placeholder={strings.message}
            value={message}
            textInputWrap={[style.textInput, Platform.OS === 'ios' ? style.iosInput : null]}
            onChangeText={value => this.handleChangeMessage(value)}
            multiline
            onFocus={() => {
              if (this.dialogScroll) {
                this.dialogScroll.scrollToEnd();
              }
            }}
          />
          <Button
            onPress={this.handleSubmitMessage}
            title={strings.send}
            disabled={!message}
            buttonStyle={style.button}
          />
        </View>
      </View>
    );
  }
}

export default connect(({ popup, user, data }) => ({ popup, user, feedback: data.feedback }), {
  socketAPI,
})(Feedback);
