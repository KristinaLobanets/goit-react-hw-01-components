import React, { Component } from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import Modal from 'react-native-modal';

import { Text } from '..';
import { Images, styleConstants } from '../../helpers';
import style from './style';
import { strings } from '../../helpers/localization';

export class Popup extends Component {
  constructor(props) {
    super(props);
    this.state = this.initialState;
  }

  get initialState() {
    return {
      visible: false,
      body: {
        onPressRight: () => {},
        onPressLeft: this.handleBackDrop,
        onPress: this.handleBackDrop,
        buttonRightName: strings.ok,
        buttonLeftName: strings.cancel,
        buttonName: strings.confirm,
      },
    };
  }

  handleBackButton = () => {
    this.resetState();
  };

  handleBackDrop = () => {
    this.resetState();
  };

  resetState = () => {
    this.setState({ visible: false });
    setTimeout(() => {
      this.setState(this.initialState);
    }, 1000);
  };

  handleButtonPress = () => {
    this.state.body.onPress();
    this.resetState();
  };

  handleLeftButtonPress = () => {
    this.state.body.onPressLeft();
    this.resetState();
  };

  handleRightButtonPress = () => {
    this.state.body.onPressRight();
    this.resetState();
  };

  showPopup = body =>
    this.setState(prevState => ({ visible: true, body: { ...prevState.body, ...body } }));

  renderBellPopup = () => {
    const { bellText } = this.state.body;
    return (
      <View style={style.bellContainer}>
        <Image source={Images.Bell} style={style.image} />
        <Text smallBlackText style={style.errorText}>
          {bellText}
        </Text>
      </View>
    );
  };

  render() {
    const { visible } = this.state;
    const {
      error,
      bell,
      header, // @string
      text, // @string
      body, // @component!
      buttons, // two buttons
      line,
      buttonRightName,
      buttonLeftName,
      buttonName,
      CustomComponent, // @component!
    } = this.state.body;
    return (
      <Modal isVisible={visible} style={styleConstants.modal} backdropOpacity={0.602553}>
        <View style={styleConstants.modalWrap}>
          {CustomComponent || (
            <View style={style.bodyContainer}>
              <Text modalTitle style={style.header}>
                {header}
              </Text>
              {line ? <View style={style.line} /> : null}
              {bell ? this.renderBellPopup() : text ? <Text style={style.text}>{text}</Text> : body}
            </View>
          )}
          {buttons ? (
            <View style={styleConstants.modalButtonsContainer}>
              <TouchableOpacity
                style={styleConstants.modalLeftButton}
                onPress={this.handleLeftButtonPress}
              >
                <Text normalText>{buttonLeftName}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styleConstants.modalRightButton}
                onPress={this.handleRightButtonPress}
              >
                <Text normalText style={styleConstants.colorTextEnv}>
                  {buttonRightName}
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={[styleConstants.modalButton, error || bell ? style.error : null]}
              onPress={this.handleButtonPress}
            >
              <Text normalText style={styleConstants.colorTextEnv}>
                {buttonName}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </Modal>
    );
  }
}
