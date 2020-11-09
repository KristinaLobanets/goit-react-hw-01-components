import React, { PureComponent } from 'react';
import { View, FlatList, TouchableOpacity, Platform } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';

import { Text, TextInput, Icon } from '../../components';
import { strings, styleConstants, colors } from '../../helpers';
import AddressElement from './AddressElement';
import style from './style';

class AddressList extends PureComponent {
  static propTypes = {
    data: PropTypes.array,
    onPressConfirm: PropTypes.func,
    onPressDelete: PropTypes.func,
    user: PropTypes.object,
    isSearch: PropTypes.bool,
    onChangeTextPopular: PropTypes.func,
    popularSearch: PropTypes.string,
  };

  static defaultProps = {
    data: [],
    onPressConfirm: () => {},
    onPressDelete: () => {},
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  handleSignIn = () => Actions.signin({ backScene: 'address' });

  keyExtractor = item => (item.id ? item.id.toString() : item.templateId.toString());

  renderItem = ({ item }) => {
    return (
      <AddressElement
        item={item}
        click="click"
        onPressConfirm={this.props.onPressConfirm}
        onPressDelete={this.props.onPressDelete}
      />
    );
  };

  render() {
    const { data, isSearch, onChangeTextPopular, popularSearch } = this.props;
    return (
      <View style={styleConstants.flex}>
        {isSearch && (
          <View
            style={{
              backgroundColor: colors.lightGrey,
              paddingHorizontal: 20,
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <Icon name="search" color={colors.darkGrey} />
            <TextInput
              onChangeText={value => onChangeTextPopular(value)}
              value={popularSearch}
              ref={r => (this.popularSearch = r)}
              textInputStyle={{
                marginLeft: 24,
                paddingVertical: Platform.select({ ios: 16, android: undefined }),
              }}
              textInputWrap={{ flex: 1 }}
              placeholder={strings.search}
            />
          </View>
        )}
        {!this.props.user.clientId ? (
          <View style={style.stubContainer}>
            <Text subTitle>{strings.loginLink1}</Text>
            <TouchableOpacity onPress={this.handleSignIn}>
              <Text style={style.stubLink}>{strings.loginLink2}</Text>
            </TouchableOpacity>
          </View>
        ) : data && data.length > 0 ? (
          <FlatList
            data={data}
            renderItem={this.renderItem}
            keyExtractor={this.keyExtractor}
            bounces={false}
            extraData={this.props}
          />
        ) : (
          <View style={styleConstants.flexCenter}>
            <Text style={style.noAddressText}>{strings.noAddress}</Text>
          </View>
        )}
      </View>
    );
  }
}

export default connect(({ user }) => ({ user }))(AddressList);
