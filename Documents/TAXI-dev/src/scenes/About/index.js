import React, { Component } from 'react';
import { ScrollView, View } from 'react-native';

import { Header, Button, Logo, Text, PoliciesModal } from '../../components';
import { strings, styleConstants, Version, colors } from '../../helpers';
import style from './style';

class About extends Component {
  state = {
    isLicenseVisible: false,
    isPolicyVisible: false,
  };

  handleState = key => {
    this.setState(state => ({
      [key]: !state[key],
    }));
  };

  render() {
    return (
      <ScrollView contentContainerStyle={styleConstants.rootContainer}>
        <Header bigTitle={strings.about} />
        <View style={styleConstants.flex}>
          <Logo />
          <Text subTitle style={style.versionText}>{`${strings.version} ${Version}`}</Text>
        </View>
        <View style={style.buttonsContainer}>
          <Button
            onPress={() => this.handleState('isLicenseVisible')}
            title={strings.license}
            buttonStyle={style.buttons}
            buttonTextStyle={{ color: colors.black }}
          />
          <Button
            onPress={() => this.handleState('isPolicyVisible')}
            title={strings.privacyPolicy}
            buttonStyle={style.buttons}
            numberOfLines={2}
            buttonTextStyle={{ color: colors.black }}
          />
        </View>
        <PoliciesModal
          visible={this.state.isLicenseVisible}
          onPressBack={() => this.handleState('isLicenseVisible')}
          link="https://fas.taxi/eula/"
        />
        <PoliciesModal
          visible={this.state.isPolicyVisible}
          onPressBack={() => this.handleState('isPolicyVisible')}
          link="https://fas.taxi/privacy/"
        />
      </ScrollView>
    );
  }
}

export default About;
