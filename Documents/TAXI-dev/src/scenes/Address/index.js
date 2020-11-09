import React, { PureComponent } from 'react';
import { View, TouchableOpacity, Keyboard } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import Autocomplete from 'react-native-autocomplete-input';

import {
  socketAPI,
  socketTypes,
  clearSearch,
  setFrom,
  setTo,
  checkBoundaries,
} from '../../actions';
import { SearchInput, TabView, Header, Text, ArrowRight } from '../../components';
import { styleConstants, strings, removeDuplicates } from '../../helpers';
import AddressList from './AddressList';
import style from './style';
import env from '../../env';

class Address extends PureComponent {
  static propTypes = {
    clearSearch: PropTypes.func.isRequired,
    destScene: PropTypes.bool,
    data: PropTypes.object,
    point: PropTypes.number,
    popup: PropTypes.object.isRequired,
    searchResults: PropTypes.array,
    setFrom: PropTypes.func.isRequired,
    setTo: PropTypes.func.isRequired,
    socketAPI: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired,
    settings: PropTypes.object,
    nearest: PropTypes.array,
    last: PropTypes.array,
    isCreateTemplate: PropTypes.bool,
  };

  static defaultProps = {
    destScene: false,
    searchResults: [],
  };

  constructor(props) {
    super(props);
    this.state = this.initialState;
    this.routesData = this.props.destScene
      ? [
          { key: 'first', title: strings.saved },
          { key: 'second', title: strings.previous },
          { key: 'third', title: strings.popular },
        ]
      : [
          { key: 'first', title: strings.nearest },
          { key: 'second', title: strings.saved },
          { key: 'third', title: strings.previous },
        ];
  }

  componentDidMount() {
    const { clientId, origin } = this.props.user;

    if (clientId && this.props.destScene) {
      this.props.socketAPI(socketTypes.GET_ADDRESS_TEMPLATES, { clientId }); // get saved
    }
    if (!this.props.destScene && clientId) {
      const { coordinates } = this.props.user;
      const data = {
        clientId,
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
      };
      this.props.socketAPI(socketTypes.NEAREST_ADDRESSES, data);
    }
    if (origin && Object.keys(origin).length && !this.props.destScene) {
      const addressString = `${origin.object || ''}${origin.object ? ', ' : ''}${origin.street ||
        ''}, ${origin?.house || ''}`;
      this.setState({
        currentAddress: `${this.props.settings.cityName}, ${addressString}`,
        address: origin,
      });
    } else {
      this.setState({
        currentAddress: `${this.props.settings.cityName}, `,
      });
    }
  }

  componentDidUpdate({ searchResults }) {
    if (JSON.stringify(this.props.searchResults) !== JSON.stringify(searchResults)) {
      this.setState({ loading: false, searchResults: this.props.searchResults });
    }
  }

  componentWillUnmount() {
    this.disableButton = false;
  }

  get initialState() {
    return {
      active: null,
      address: undefined,
      currentAddress: `${this.props.settings.cityName}, `,
      hideResults: true,
      loading: false,
      preloader: false,
      search: false,
      searchResults: [],
      popularSearch: '',
    };
  }

  // entering some text in search input
  handleInput = currentAddress => {
    if (currentAddress.length === 0) {
      return this.setState({ search: false, currentAddress, hideResults: true, loading: false });
    }
    this.setState({ search: true, currentAddress, hideResults: true, loading: true }, () =>
      this.searchAddress()
    );
  };

  // on autocomplete pick address
  handleSuggestion = (suggestion, address) => {
    if (address?.lat && address?.lon) {
      this.setState({
        currentAddress: `${suggestion} `,
        hideResults: true,
        address,
        search: false,
        loading: false,
      });
    } else {
      this.setState({
        currentAddress: `${suggestion} `,
      });
    }
  };

  handleHideAutocomplete = () => this.setState({ hideResults: true });

  handleClearInput = () => {
    this.props.clearSearch();
    this.search.clear();
    this.setState({
      ...this.initialState,
      currentAddress: '',
    });
  };

  // go to homeScene, saving address in reducer, BIG YELLOW BUTTON
  handleAddress = () => {
    Keyboard.dismiss();
    const { destScene, user, point } = this.props;
    const { address } = this.state;
    this.setState({ hideResults: true });
    if (destScene) {
      if (user.destination && user.destination.length > 0 && point) {
        const isDuplicate = user.destination.some(
          el =>
            (address.templateId && el.templateId && el.templateId === address.templateId) ||
            (address.id && el.id && el.id === address.id)
        );
        let addressData;
        if (isDuplicate) {
          addressData = address.templateId
            ? { ...address, templateId: address.templateId + Math.floor(Math.random() * 2299) }
            : { ...address, id: address.id + Math.floor(Math.random() * 2299) };
        } else {
          addressData = address;
        }
        const data = [...this.props.user.destination, addressData];
        this.props.setTo(data);
      } else {
        this.props.setTo([this.state.address]);
      }
    } else {
      const region = {
        latitude: this.state.address.lat,
        longitude: this.state.address.lon,
      };
      if (!checkBoundaries(region, this.props.settings)) {
        this.props.setFrom(this.state.address);
      } else {
        return this.props.popup.showPopup({
          header: strings.warning,
          text: strings.outOfRun,
        });
      }
    }
    setTimeout(() => {
      if (this.props.isCreateTemplate) {
        Actions.pop();
        return setTimeout(() => Actions.refresh(), 500);
      }
      Actions.reset('mapDir');
    }, 500);
  };

  // on press active address in addresses LIST
  handleActive = item => {
    this.disableButton = true;
    this.setState(
      {
        address: item,
        currentAddress: item.object
          ? `${item.object}, ${item.street}, ${item.house}`
          : `${item.street}, ${item.house}`,
        active: item.id,
      },
      () => this.handleAddress()
    );
  };

  // DELETE SAVED ADDRESS
  handleDeleteTemplate = item =>
    this.props.socketAPI(socketTypes.DELETE_ADDRESS_TEMPLATE, {
      clientId: this.props.user.clientId,
      templateId: item.templateId,
    });

  // ON PRESS REMOVE CROSS FROM SAVED ADDRESSES
  showDeleteTemplatePopup = item =>
    this.props.popup.showPopup({
      buttons: true,
      header: strings.removeAddress,
      text: strings.addressWasRemoved,
      line: true,
      buttonRightName: strings.remove,
      onPressRight: () => {
        this.handleDeleteTemplate(item);
        this.props.socketAPI(socketTypes.GET_ADDRESS_TEMPLATES, {
          clientId: this.props.user.clientId,
        });
      },
    });

  // ON TEXT CHANGE IN INPUT
  searchAddress = () => {
    const { currentAddress } = this.state;
    const { lang, settings } = this.props.user;
    if (currentAddress.length >= 2) {
      this.setState({ hideResults: false });
      this.props.socketAPI(socketTypes.ADDRESS_SEARCH, {
        taxiToken: env.app_token,
        lang: lang || settings.defaultLang,
        search: currentAddress,
      });
    } else {
      this.props.clearSearch();
    }
  };

  searchPopular = () => {
    const { popularSearch } = this.state;
    this.props.socketAPI(socketTypes.POPULAR_ADDRESSES, {
      taxiToken: env.app_token,
      search: popularSearch,
    });
  };

  filterData = (data, param) => {
    if (data && data.length > 0) {
      const result = removeDuplicates(data, param);
      return removeDuplicates(result, 'id');
    }
  };

  findOnMap = () =>
    Actions.mapFinder({
      destScene: this.props.destScene,
      point: this.props.point,
    });

  loadTab = async ({ route }) => {
    const { clientId, coordinates } = this.props.user;
    if (!clientId) return;
    if (route.key === 'first') {
      const data = {
        clientId,
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
      };
      this.props.socketAPI(socketTypes.NEAREST_ADDRESSES, data);
    }
    if (route.key === 'second') {
      this.props.socketAPI(socketTypes.GET_ADDRESS_TEMPLATES, { clientId });
    }
    if (route.key === 'third') {
      this.props.socketAPI(socketTypes.LAST_ADDRESSES, { clientId });
    }
  };

  loadTabDest = async ({ route }) => {
    const { clientId } = this.props.user;
    if (!clientId) return;
    if (route.key === 'first') {
      this.props.socketAPI(socketTypes.GET_ADDRESS_TEMPLATES, { clientId });
    }
    if (route.key === 'second') {
      this.props.socketAPI(socketTypes.LAST_ADDRESSES, { clientId });
    }
    if (route.key === 'third') {
      this.props.socketAPI(socketTypes.POPULAR_ADDRESSES, { taxiToken: env.app_token });
    }
  };

  handleInputPopular = value => {
    this.setState({ popularSearch: value }, () => this.searchPopular());
  };

  renderRoutesCurrent = () => {
    const FirstRoute = () => (
      <AddressList
        data={this.filterData(this.props.nearest, 'name')}
        onPressConfirm={this.handleActive}
        active={this.state.active}
      />
    );
    const SecondRoute = () => (
      <AddressList
        data={this.props.data.addressTemplates}
        onPressConfirm={this.handleActive}
        onPressDelete={this.showDeleteTemplatePopup}
      />
    );
    const ThirdRoute = () => (
      <AddressList
        data={this.filterData(this.props.last, 'name')}
        onPressConfirm={this.handleActive}
      />
    );

    return [FirstRoute, SecondRoute, ThirdRoute];
  };

  renderRoutesDestination = () => {
    const FirstRoute = () => (
      <AddressList
        data={this.props.data.addressTemplates}
        onPressConfirm={this.handleActive}
        onPressDelete={this.showDeleteTemplatePopup}
      />
    );
    const SecondRoute = () => (
      <AddressList
        data={this.filterData(this.props.last, 'name')}
        onPressConfirm={this.handleActive}
      />
    );
    const ThirdRoute = () => (
      <AddressList
        data={this.filterData(this.props.data.popular, 'name')}
        onPressConfirm={this.handleActive}
        isSearch
        onChangeTextPopular={this.handleInputPopular}
        popularSearch={this.state.popularSearch}
      />
    );

    return [FirstRoute, SecondRoute, ThirdRoute];
  };

  renderAutocompleteItem = ({ item, i }) => {
    const address = item.house ? `${item.street}, ${item.house}` : item.street;
    const fullAddress = item.name;
    return (
      <TouchableOpacity
        onPress={() => this.handleSuggestion(fullAddress, item, i)}
        style={style.autocompleteItem}
      >
        {!!item.object && <Text normalText>{item.object}</Text>}
        <Text>{address}</Text>
      </TouchableOpacity>
    );
  };

  render() {
    const { address, currentAddress, hideResults, loading, search, searchResults } = this.state;
    const { destScene, user } = this.props;
    const addressOriginal = user.origin || user.initialAddress;
    return (
      <View style={styleConstants.rootContainer}>
        <Header />
        {destScene ? (
          <View style={style.destSceneTopLabel}>
            <View style={styleConstants.orangeDot} />
            <Text normalText style={style.destSceneTopLabelText}>
              {addressOriginal
                ? addressOriginal.name
                  ? addressOriginal.name
                  : `${addressOriginal.object || ''}${addressOriginal.object ? ', ' : ''}${
                      addressOriginal.street
                    }${addressOriginal.house ? ', ' : ''}${addressOriginal.house || ''}`
                : null}
            </Text>
          </View>
        ) : null}
        <SearchInput
          placeholder={destScene ? strings.addressOfArrival : strings.startAddress}
          iconMyAddress={destScene ? 'marker' : 'my-address'}
          value={currentAddress}
          onChangeText={this.handleInput}
          ref={ref => (this.search = ref)}
          onPressRemove={this.handleClearInput}
          onHide={this.handleHideAutocomplete}
          hideResults={hideResults}
          loading={loading}
          iconRemove={loading ? '' : 'remove'}
          onMapPress={this.findOnMap}
          mapDisabled={!user.initialAddress}
        />
        <View style={styleConstants.flex}>
          {search ? (
            <Autocomplete
              renderTextInput={() => null}
              renderItem={this.renderAutocompleteItem}
              inputContainerStyle={style.autocompleteInputContainer}
              listStyle={style.autocomplete}
              data={this.filterData(searchResults, 'name')}
              defaultValue={currentAddress}
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
            <TabView
              routes={destScene ? this.renderRoutesDestination() : this.renderRoutesCurrent()}
              routesData={this.routesData}
              onLoadTab={destScene ? this.loadTabDest : this.loadTab}
            />
          )}
        </View>
        <View style={style.buttonContainer}>
          <ArrowRight
            buttonStyle={style.button}
            disabled={!address || !address.name || this.disableButton}
            onPress={this.handleAddress}
          />
        </View>
      </View>
    );
  }
}

export default connect(
  ({ user, data, popup, tech }) => ({
    user,
    data,
    popup,
    address: data.currentAddress,
    searchResults: data.searchResults,
    settings: data.settings,
    nearest: data.nearest,
    last: data.last,
    isCreateTemplate: tech.isCreateTemplate,
  }),
  { socketAPI, clearSearch, setFrom, setTo }
)(Address);
