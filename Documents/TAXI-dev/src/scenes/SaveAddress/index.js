import React, { Component } from 'react';
import { View, ScrollView, TouchableOpacity, ActivityIndicator, Platform } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import Autocomplete from 'react-native-autocomplete-input';

import { Header, TextInput, Text, Icon, Button } from '../../components';
import { socketAPI, socketTypes, clearSearch } from '../../actions';
import style from './style';
import { styleConstants, constants, colors, strings } from '../../helpers';
import env from '../../env';

class SaveAddress extends Component {
  static propTypes = {
    socketAPI: PropTypes.func.isRequired,
    address: PropTypes.object,
    object: PropTypes.string,
    entrance: PropTypes.string,
    comment: PropTypes.string,
    user: PropTypes.object.isRequired,
    popup: PropTypes.object.isRequired,
    searchResults: PropTypes.array,
    clearSearch: PropTypes.func.isRequired,
    settings: PropTypes.object,
  };

  static defaultProps = {
    address: '',
    object: '',
    entrance: '',
    comment: '',
  };

  constructor(props) {
    super(props);
    this.state = {
      active: null,
      entrance: '',
      comment: '',
      ...this.initialState,
    };
  }

  componentDidMount() {
    this.setState({
      address: `${this.props.settings.cityName}, `,
    });
  }

  componentDidUpdate({ searchResults }) {
    if (JSON.stringify(this.props.searchResults) !== JSON.stringify(searchResults)) {
      this.setState({ loading: false, searchResults: this.props.searchResults });
    }
  }

  get initialState() {
    return {
      address: `${this.props.settings.cityName}, `,
      active: null,
      hideResults: true,
      loading: false,
      searchResults: [],
      search: false,
      addressObject: undefined,
      object: '',
    };
  }

  // entering some text in search input
  handleInputAddress = currentAddress => {
    if (currentAddress.length === 0) {
      return this.setState({
        search: false,
        address: currentAddress,
        hideResults: true,
        loading: false,
      });
    }
    this.setState({ search: true, address: currentAddress, hideResults: true, loading: true }, () =>
      this.searchAddress()
    );
  };

  // on autocomplete pick address
  handleSuggestion = (suggestion, address, object) => {
    if (address?.lon && address?.lat) {
      this.setState({
        address: `${suggestion} `,
        hideResults: true,
        addressObject: address,
        search: false,
        loading: false,
        object,
      });
    } else {
      this.setState({
        address: `${suggestion} `,
      });
    }
  };

  handleClearInput = () => {
    this.props.clearSearch();
    this.search.clear();
    this.setState({
      ...this.initialState,
      address: '',
    });
  };

  searchAddress = () => {
    if (this.state.address.length >= 2) {
      this.setState({ hideResults: false });
      this.props.socketAPI(socketTypes.ADDRESS_SEARCH, {
        taxiToken: env.app_token,
        lang: this.props.user.lang || this.props.user.settings.defaultLang,
        search: this.state.address,
      });
    } else {
      this.props.clearSearch();
    }
  };

  filterData = data => {
    const removeDuplicates = (myArr, prop) => {
      return myArr.filter((obj, pos, arr) => {
        return arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos;
      });
    };
    if (data && data.length > 0) {
      const result = removeDuplicates(data, 'name');
      return result;
    }
  };

  handleActive = id => {
    this.setState(prevState => ({
      active: id === prevState.active ? null : id,
    }));
  };

  handleInput = (key, value) => {
    this.setState({ [key]: value });
  };

  handleBack = () => {
    const body = <Text style={style.savedText}>{strings.ifLeaveNoSave}</Text>;
    this.props.popup.showPopup({
      header: strings.leaveWithoutSave,
      line: true,
      buttons: true,
      body,
      onPressRight: () => Actions.pop(),
      buttonLeftName: strings.return,
      buttonRightName: strings.leave,
    });
  };

  handleSave = () => {
    const data = {
      clientId: this.props.user.clientId,
      iconId: this.state.active,
      name: this.state.object,
      object: this.state.addressObject.object,
      street: this.state.addressObject.street,
      house: this.state.addressObject.house,
      entrance: this.state.entrance,
      comments: this.state.comment,
      lat: this.state.addressObject?.lat,
      lon: this.state.addressObject?.lon,
    };
    this.props.socketAPI(socketTypes.ADD_ADDRESS_TEMPLATE, data);
    const body = <Text style={style.savedText}>{strings.youCanFindAddress}</Text>;
    this.props.popup.showPopup({
      header: strings.addressSaved,
      line: true,
      body,
      onPress: () => {
        this.props.socketAPI(socketTypes.GET_ADDRESS_TEMPLATES, {
          clientId: this.props.user.clientId,
        });
        Actions.pop();
      },
    });
  };

  renderAutocompleteItem = ({ item }) => {
    const address = item.house ? `${item.street}, ${item.house}` : item.street;
    const fullAddress = item.name;
    const object = item.object ? item.object : '';
    return (
      <TouchableOpacity
        onPress={() => this.handleSuggestion(fullAddress, item, object)}
        style={style.autocompleteItem}
      >
        {!!item.object && <Text normalText>{item.object}</Text>}
        <Text>{address}</Text>
      </TouchableOpacity>
    );
  };

  render() {
    const {
      address,
      object,
      entrance,
      comment,
      active,
      search,
      searchResults,
      hideResults,
      loading,
      addressObject,
    } = this.state;
    const isChanged =
      address !== this.props.address ||
      object !== this.props.object ||
      entrance !== this.props.entrance ||
      comment !== this.props.comment;
    const Element = search ? View : ScrollView;
    return (
      <Element
        style={styleConstants.rootContainer}
        contentContainerStyle={styleConstants.rootContainer}
        showsVerticalScrollIndicator={false}
      >
        <Header
          bigTitle={strings.saveTheAddress}
          headerStyle={style.headerContainer}
          onPressBack={this.handleBack}
        />
        <View style={style.container}>
          <View style={style.formContainer}>
            <View style={style.addressContainer}>
              <TextInput
                textInputStyle={[
                  style.addressInput,
                  Platform.OS === 'ios' ? style.iosInputBase : null,
                ]}
                value={address}
                ref={ref => (this.search = ref)}
                onChangeText={this.handleInputAddress}
                placeholder={strings.address}
                autoFocus={search}
              />

              <View style={style.iconMyAddress}>
                <View style={styleConstants.orangeDot} />
              </View>

              {!loading ? (
                <TouchableOpacity
                  onPress={this.handleClearInput}
                  style={style.iconRemove}
                  hitSlop={{ right: 15, left: 15 }}
                >
                  <Icon name="remove" color={colors.darkGrey} />
                </TouchableOpacity>
              ) : (
                <View style={style.iconRemove}>
                  <ActivityIndicator
                    animating={loading}
                    color={colors.orange}
                    style={style.loader}
                  />
                </View>
              )}
            </View>
            <View style={styleConstants.flex}>
              {search ? (
                <Autocomplete
                  renderTextInput={() => null}
                  renderItem={this.renderAutocompleteItem}
                  inputContainerStyle={style.autocompleteInputContainer}
                  listStyle={style.autocomplete}
                  data={this.filterData(searchResults)}
                  defaultValue={address}
                  keyExtractor={item => item.id.toString()}
                  hideResults={hideResults}
                  flatListProps={{
                    contentContainerStyle: styleConstants.rootContainer,
                    keyboardDismissMode: 'on-drag',
                    keyboardShouldPersistTaps: 'handled',
                    showsVerticalScrollIndicator: false,
                  }}
                />
              ) : (
                <View style={styleConstants.flex}>
                  <View style={style.specContainer}>
                    <View style={style.objectContainer}>
                      <Text smallRegular>{strings.name}</Text>
                      <TextInput
                        textInputStyle={style.input}
                        maxLength={30}
                        value={object}
                        onChangeText={value => this.handleInput('object', value)}
                      />
                    </View>
                    <View style={style.entranceContainer}>
                      <Text smallRegular>{strings.approach}</Text>
                      <TextInput
                        textInputStyle={style.input}
                        maxLength={3}
                        keyboardType="phone-pad"
                        value={entrance}
                        onChangeText={value => this.handleInput('entrance', value)}
                      />
                    </View>
                  </View>
                  <View style={style.commentContainer}>
                    <Text smallRegular>{strings.commentDriver}</Text>
                    <TextInput
                      textInputStyle={[
                        style.commentInput,
                        Platform.OS === 'ios' ? style.iosInput : null,
                      ]}
                      multiline
                      value={comment}
                      onChangeText={value => this.handleInput('comment', value)}
                    />
                  </View>

                  <View style={style.iconsContainer}>
                    {constants.ICONS_TEMPLATE.map(icon => (
                      <TouchableOpacity
                        key={icon.id}
                        style={[
                          style.iconWrap,
                          { backgroundColor: active === icon.id ? colors.lightGrey : undefined },
                        ]}
                        onPress={() => this.handleActive(icon.id)}
                      >
                        <Icon
                          name={icon.name}
                          size={icon.size}
                          color={active === icon.id ? colors.black : colors.darkGrey}
                        />
                      </TouchableOpacity>
                    ))}
                  </View>
                  <View style={style.buttonContainer}>
                    <Button
                      buttonStyle={style.button}
                      title={strings.saveTheAddress}
                      onPress={this.handleSave}
                      disabled={!addressObject || !addressObject.name || !isChanged}
                    />
                  </View>
                </View>
              )}
            </View>
          </View>
        </View>
      </Element>
    );
  }
}

export default connect(
  ({ popup, user, data }) => ({
    popup,
    user,
    searchResults: data.searchResults,
    settings: data.settings,
  }),
  { socketAPI, clearSearch }
)(SaveAddress);
