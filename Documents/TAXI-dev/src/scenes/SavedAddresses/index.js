import React, { Component } from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import { socketAPI, socketTypes, setFrom } from '../../actions';
import { Text, Header, Icon } from '../../components';
import { constants, styleConstants, strings } from '../../helpers';
import style from './style';

class SavedAddresses extends Component {
  static propTypes = {
    socketAPI: PropTypes.func.isRequired,
    user: PropTypes.object,
    addressTemplates: PropTypes.array,
    data: PropTypes.object,
    popup: PropTypes.object.isRequired,
    setFrom: PropTypes.func,
  };

  componentDidMount() {
    this.props.socketAPI(socketTypes.GET_ADDRESS_TEMPLATES, {
      clientId: this.props.user.clientId,
    });
  }

  handleAddAddress = () => {
    Actions.saveAddress({
      address: this.props.data.nearAddress[0] || {},
      currentAddress: this.props.data.nearAddress[0] ? this.props.data.nearAddress[0].name : '',
    });
  };

  handleDeleteTemplate = item =>
    this.props.socketAPI(socketTypes.DELETE_ADDRESS_TEMPLATE, {
      clientId: this.props.user.clientId,
      templateId: item.templateId,
    });

  showDeleteTemplatePopup = item => {
    this.props.popup.showPopup({
      buttons: true,
      header: strings.removeAddress,
      text: `${strings.addressWasRemoved} \n ${item.street} ${item.house}`,
      line: true,
      buttonRightName: strings.remove,
      onPressRight: () => {
        this.handleDeleteTemplate(item);
        this.props.socketAPI(socketTypes.GET_ADDRESS_TEMPLATES, {
          clientId: this.props.user.clientId,
        });
      },
    });
  };

  handleAddressPress = item => {
    if (item) {
      this.props.setFrom(item).then(() => Actions.reset('mapDir'));
    }
  };

  render() {
    return (
      <ScrollView contentContainerStyle={styleConstants.rootContainer}>
        <Header
          arrowRight
          headerStyle={style.houseHeader}
          onPress={this.handleAddAddress}
          icon="plus"
          mci
        />
        <Text header>{strings.savedAddresses}</Text>
        <View style={styleConstants.flex}>
          {this.props.addressTemplates.length ? (
            this.props.addressTemplates.map(address => {
              return (
                <TouchableOpacity
                  key={address.templateId}
                  style={style.houseDetail}
                  onPress={() => this.handleAddressPress(address)}
                >
                  <Icon name={constants.ICONS_TEMPLATE[address.iconId].name} />
                  <View style={style.houseAddresses}>
                    {address.name || address.object ? (
                      <Text normalText>{address.name || address.object}</Text>
                    ) : null}
                    <View>
                      <Text>{`${address.street} ${address.house}`}</Text>
                    </View>
                  </View>
                  <TouchableOpacity onPress={() => this.showDeleteTemplatePopup(address)}>
                    <Icon name="close" style={style.icon} size={24} mci />
                  </TouchableOpacity>
                </TouchableOpacity>
              );
            })
          ) : (
            <View style={styleConstants.flexCenter}>
              <Text>{strings.noSavedAddresses}</Text>
            </View>
          )}
        </View>
      </ScrollView>
    );
  }
}

export default connect(
  ({ data, user, popup }) => ({ data, addressTemplates: data.addressTemplates, user, popup }),
  { socketAPI, setFrom }
)(SavedAddresses);
