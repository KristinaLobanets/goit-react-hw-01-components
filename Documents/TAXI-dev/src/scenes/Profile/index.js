import React, { Component } from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  Linking,
  Platform,
  FlatList,
} from 'react-native';
import PropTypes from 'prop-types';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';

import { Header, Text, Icon } from '../../components';
import { styleConstants, Images, colors, strings } from '../../helpers';
import { socketAPI, socketTypes } from '../../actions';
import style from './style';

class Profile extends Component {
  static propTypes = {
    socketAPI: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired,
    settings: PropTypes.object,
    currentOrders: PropTypes.array,
  };

  constructor(props) {
    super(props);
    this.state = {};
    this.socials = [];
  }

  componentDidMount() {
    if (this.props.settings.socials) {
      this.socials = Object.entries(this.props.settings.socials).map(el => {
        return { id: el[0], url: el[1], name: el[0] };
      });
    }
    this.props.socketAPI(socketTypes.GET_PROFILE, { clientId: this.props.user.clientId });
  }

  handleEdit = () => {
    Actions.registerProfile({ isEdit: true });
  };

  handleLink = link => {
    Linking.canOpenURL(link.url).then(res => {
      if (res) {
        Linking.openURL(link.url);
      } else if (link.name === 'viber' && res === false) {
        Linking.openURL(
          Platform.OS === 'android'
            ? 'https://play.google.com/store/apps/details?id=com.viber.voip'
            : 'https://apps.apple.com/app/id382617920'
        );
      }
    });
  };

  render() {
    const { dateOfBirth, name, phone, email, base64Photo, clientNum } = this.props.user;
    const imageSrc =
      base64Photo && base64Photo !== 'null'
        ? { uri: `data:image/png;base64,${base64Photo}` }
        : Images.SmallAvatar;
    const isPlanned =
      this.props.currentOrders?.filter(el => el.statusId === 14 || el.statusId === 8).length > 0;
    return (
      <ScrollView contentContainerStyle={[styleConstants.rootContainer]}>
        <Header
          headerStyle={style.header}
          icon="settings"
          mci
          arrowRight
          bigTitle={strings.profile}
          onPress={Actions.settings}
        />
        <View style={style.userContainer}>
          <View style={style.avatarContainer}>
            <Image source={imageSrc} style={style.avatarImage} />
            <TouchableOpacity style={style.editButton} onPress={this.handleEdit}>
              <Icon name="edit" size={14} />
            </TouchableOpacity>
          </View>
          <View style={style.userInfoContainer}>
            <View style={style.userInfoRow}>
              {!!name && <Text style={style.userNameText}>{name}</Text>}
              {!!clientNum && <Text style={style.userNameText}>{`№${clientNum}`}</Text>}
            </View>
            <View style={style.userInfoRow}>
              <Text smallRegular>{phone || ''}</Text>
              {!!dateOfBirth && dateOfBirth !== '01-01-0001' && (
                <Text smallRegular>{dateOfBirth}</Text>
              )}
            </View>
            <View style={style.userInfoRow}>
              <Text smallRegular>{email || ''}</Text>
            </View>
          </View>
        </View>
        <ScrollView contentContainerStyle={style.menuContainer}>
          <TouchableOpacity onPress={Actions.creditCards} style={style.menuItem}>
            <View style={style.menuIconWrap}>
              <Icon name="wallet" />
            </View>
            <Text normalText style={style.menuTitle}>
              {strings.myFinances}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => Actions.rides()} style={style.menuItem}>
            <View style={style.menuIconWrap}>
              <Icon name="trips" />
            </View>
            <Text normalText style={style.menuTitle}>
              {strings.myTrips}
            </Text>
            {isPlanned && <View style={style.redDot} />}
          </TouchableOpacity>
          <TouchableOpacity onPress={() => Actions.savedAddresses()} style={style.menuItem}>
            <View style={style.menuIconWrap}>
              <Icon name="address" />
            </View>
            <Text normalText style={style.menuTitle}>
              {strings.savedAddresses}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => Actions.about()} style={[style.menuItem]}>
            <View style={style.menuIconWrap}>
              <Icon name="about" />
            </View>
            <Text normalText style={style.menuTitle}>
              {strings.information}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => Actions.feedback()} style={style.menuItem}>
            <View style={style.menuIconWrap}>
              <Icon name="faq" />
            </View>
            <Text normalText style={style.menuTitle}>
              {strings.feedback}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => Actions.shareApp()}
            style={[style.menuItem, style.menuItemLast]}
          >
            <View style={style.menuIconWrap}>
              <Icon name="share" />
            </View>
            <Text normalText style={style.menuTitle}>
              {strings.shareApp}
            </Text>
          </TouchableOpacity>
        </ScrollView>
        <View style={style.socialsContainer}>
          <FlatList
            data={this.socials}
            horizontal
            renderItem={({ item }) =>
              !!item.url && (
                <TouchableOpacity style={style.socialIcon} onPress={() => this.handleLink(item)}>
                  <Icon name={item.name} fa5 size={24} />
                </TouchableOpacity>
              )
            }
            extraData={this.props}
          />
        </View>
        {!!this.props.settings.taxiPhone && (
          <TouchableOpacity
            style={style.callButton}
            onPress={() =>
              Linking.openURL(
                `tel:${Platform.OS === 'ios' ? '//' : ''}${this.props.settings.taxiPhone}`
              )
            }
          >
            <Icon name="call" color={colors.lightGreen} size={14} />
            <Text normalText style={style.callButtonText}>
              {strings.orderByPhone}
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    );
  }
}

export default connect(
  ({ user, data, orders }) => ({
    user,
    settings: data.settings,
    currentOrders: orders.currentOrders,
  }),
  { socketAPI }
)(Profile);
