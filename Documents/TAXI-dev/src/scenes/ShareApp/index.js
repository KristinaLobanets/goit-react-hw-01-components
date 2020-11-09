import React, { Component } from 'react';
import { ScrollView, Image, View, Share, Alert, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import env from '../../env';

import { Text, Header, ArrowRight, Icon } from '../../components';
import { Images, styleConstants, strings, colors } from '../../helpers';
import style from './style';

class ShareApp extends Component {
  static propTypes = {
    user: PropTypes.object,
    settings: PropTypes.object,
  };

  constructor(props) {
    super(props);
    this.state = {
      code: this.props.user.inviteCode,
      opened: false,
    };
  }

  createLink = async () => {
    const { firebaseLink, firebaseDomainUri } = this.props.settings;
    const slash = firebaseLink[firebaseLink.length - 1] === '/' ? '' : '/';
    const links = await dynamicLinks().buildShortLink(
      {
        link: encodeURI(`${firebaseLink}${slash}?promo=${this.state.code}`),
        domainUriPrefix: firebaseDomainUri,
        android: {
          packageName: env.package_name_android,
        },
        ios: {
          bundleId: env.package_name_ios,
          appStoreId: env.package_id,
        },
      },
      'UNGUESSABLE'
    );
    return links;
  };

  onShare = async () => {
    const { firebaseLink, firebaseDomainUri } = this.props.settings;
    let link = '';
    if (!!firebaseLink && !!firebaseDomainUri) {
      link = await this.createLink();
    } else {
      link = `
      AppStore: https://apps.apple.com/us/app/id${env.package_id},
      PlayMarket: https://play.google.com/store/apps/details?id=${env.package_name_android}
    `;
    }
    try {
      const shareData = strings.formatString(
        strings.shareText,
        env.app_name,
        this.state.code,
        link
      );
      const result = await Share.share({
        message: shareData,
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      Alert.alert('Error', error);
    }
  };

  getMessage = () => {
    const { referralReward, referrerReward } = this.props.settings;
    const { user } = this.props;
    if (referralReward === 0 && referrerReward === 0) {
      return strings.howItsWorkNoBonus;
    }
    if (referralReward === 0 && referrerReward > 0) {
      return strings.formatString(strings.howItsWorkText1, user.inviteCode, referrerReward);
    }
    if (referralReward > 0 && referrerReward === 0) {
      return strings.formatString(strings.howItsWorkText2, user.inviteCode, referralReward);
    }
    if (referralReward > 0 && referrerReward > 0) {
      return strings.formatString(
        strings.howItsWorkText,
        user.inviteCode,
        referrerReward,
        referralReward
      );
    }
  };

  handleOpened = () => {
    this.setState(state => ({
      opened: !state.opened,
    }));
  };

  render() {
    const { code, opened } = this.state;
    const { settings } = this.props;
    return (
      <ScrollView contentContainerStyle={styleConstants.rootContainer}>
        <Header bigTitle={strings.shareApp} />
        <View style={style.container}>
          <Text smallBlackText style={style.infoText}>
            {this.getMessage()}
          </Text>
          <Text smallBlackText style={style.infoText}>
            {settings.referrerRewardFixed > 0
              ? strings.formatString(strings.refReward, settings.referrerRewardFixed)
              : settings.referrerRewardPercent > 0
              ? strings.formatString(strings.refRewardPercent, settings.referrerRewardPercent)
              : null}
          </Text>
          <View style={style.giftWrap}>
            <Image source={Images.GiftBox} style={style.giftBox} />
          </View>
          <View style={style.promoContainer}>
            <View style={style.promoWrap}>
              <Text smallRegular>{strings.yourPromocode}</Text>
              <Text style={style.promoString}>{code}</Text>
            </View>
            <ArrowRight onPress={this.onShare} icon="share" buttonStyle={style.button} />
          </View>
          <View>
            <TouchableOpacity style={style.dropdownContainer} onPress={this.handleOpened}>
              <Text normalText>{strings.howItWork}</Text>
              <View>
                <Icon
                  name={opened ? 'chevron-up' : 'chevron-down'}
                  color={colors.darkGrey}
                  size={24}
                  mci
                />
              </View>
            </TouchableOpacity>
            {opened && (
              <View style={style.dropdownText}>
                <Text normalText>{settings.referralCodeDescription}</Text>
              </View>
            )}
          </View>
          <View style={styleConstants.flex} />
        </View>
      </ScrollView>
    );
  }
}

export default connect(({ user, data }) => ({ user, settings: data.settings }))(ShareApp);
