import React, { PureComponent } from 'react';
import { View, Image, Linking, Platform } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { Actions } from 'react-native-router-flux';
import env from '../../env';

import Geolocation from '../../API/Geolocation';
import mapConfig from '../../config/mapStyle.json';

import { TaxiMarker, Pins, Preloader, Icon } from '../../components';
import {
  socketAPI,
  setUserPosition,
  socketTypes,
  setFrom,
  setTo,
  clearDriverInfo,
  clearOrders,
  addressNominatim,
  setUserInitialAddress,
  clearErrors,
  clearComfortable,
  checkBoundaries,
} from '../../actions';
import {
  constants,
  Images,
  strings,
  getAsyncStorage,
  setAsyncStorage,
  colors,
  Dimension,
  getDistanceFromLatLonInKm,
  getBoundByRegion,
} from '../../helpers';

import style from './style';
import OverlayText from './OverlayText';
import MapFooter from './MapFooter';
import MapHeader from './MapHeader';
import WelcomeModal from './WelcomeModal';
import ComfortSheet from './ComfortSheet';

class Home extends PureComponent {
  static propTypes = {
    setUserPosition: PropTypes.func.isRequired,
    socketAPI: PropTypes.func.isRequired,
    user: PropTypes.object,
    drivers: PropTypes.array,
    nearAddress: PropTypes.array,
    setFrom: PropTypes.func.isRequired,
    setTo: PropTypes.func.isRequired,
    history: PropTypes.array.isRequired,
    comfortable: PropTypes.array,
    currentOrders: PropTypes.array,
    settings: PropTypes.object,
    clearOrders: PropTypes.func.isRequired,
    token: PropTypes.string,
    showRating: PropTypes.bool,
    addressNominatim: PropTypes.func,
    popup: PropTypes.object,
    setUserInitialAddress: PropTypes.func,
    errors: PropTypes.object,
    clearErrors: PropTypes.func,
    clearComfortable: PropTypes.func,
    objects: PropTypes.array,
  };

  constructor(props) {
    super(props);
    this.count = 0;
    this.fetchPosition = false;
    this.driversTimer = null;
    this.state = {
      coordinates: {
        longitudeDelta: constants.LONGITUDE_DELTA,
        latitudeDelta: constants.LATITUDE_DELTA,
        latitude: 0,
        longitude: 0,
      },
      pointA: {
        longitudeDelta: constants.LONGITUDE_DELTA,
        latitudeDelta: constants.LATITUDE_DELTA,
        latitude: 0,
        longitude: 0,
      },
      comfortInfo: false,
      radiusCheck: false,
      moving: false,
      isTrip: false,
      scroll: true,
      outrun: false,
      noGps: false,
      welcome: false,
      objectOnMap: undefined,
    };
  }

  async componentDidMount() {
    await this.welcomeModal();
    if (this.props.user.isActive === false && this.state.welcome === false) {
      this.showBlocked();
    }
    Geolocation.checkPermission().then(async res => {
      if (res) {
        this.getInitialPosition();
        this.setState({ noGps: false });
      } else {
        if (Platform.OS === 'ios') {
          const permWasDeclined = await getAsyncStorage('permWasDeclined');
          if (!permWasDeclined) {
            await setAsyncStorage('permWasDeclined', 'true');
            this.getInitialPosition();
            this.setState({ noGps: true });
          } else {
            this.getLocationPermissionsIos();
          }
        }
        Geolocation.requestPermissions().then(resp => {
          if (resp) {
            this.getInitialPosition();
            this.setState({ noGps: false });
          } else {
            this.getInitialPosition();
            this.setState({ noGps: true });
          }
        });
      }
    });
    const { clientId, origin, phone, lang, settings } = this.props.user;
    this.props.clearOrders().then(() => {
      const isTrip = this.props.currentOrders === undefined;
      this.setState({ isTrip });
    });
    if (origin) {
      this.setState(state => ({
        coordinates: {
          ...state.coordinates,
          latitude: origin?.lat,
          longitude: origin?.lon,
        },
      }));
    }
    const { history } = this.props;
    if (clientId) {
      this.props.socketAPI(socketTypes.GET_HISTORY, {
        clientId,
        limit: 10,
        offset: history.length,
        lang: lang || settings.defaultLang,
      });
    }
    if (phone !== undefined) {
      const dataLogin = {
        taxiToken: env.app_token,
        phone,
        firebaseToken: this.props.token,
      };
      this.props.socketAPI('LOGON', dataLogin);
    }
    if (clientId) {
      this.props.socketAPI(socketTypes.GET_PROFILE, { clientId });
    }
    this.props.socketAPI(socketTypes.GET_FARES, {
      taxiToken: env.app_token,
      lang: lang || settings.defaultLang,
    });
    setTimeout(() => {
      if (clientId && this.props.settings.allowSeeCars) {
        this.getDriversTimer();
      }
    }, 100);
  }

  componentDidUpdate({ nearAddress, user, currentOrders, errors }, { outrun }) {
    if (
      errors.loginNotExists !== this.props.errors.loginNotExists &&
      !!this.props.errors.loginNotExists &&
      this.props.user.phone
    ) {
      this.props.clearErrors();
      const dataRegister = {
        taxiToken: env.app_token,
        phone: this.props.user.phone,
        inviteCode: '',
      };
      this.props.socketAPI('REGISTER', dataRegister);
      const dataLogin = {
        taxiToken: env.app_token,
        phone: this.props.user.phone,
        firebaseToken: this.props.token,
      };
      this.props.socketAPI('LOGON', dataLogin);
    }

    if (JSON.stringify(nearAddress) !== JSON.stringify(this.props.nearAddress)) {
      if (
        this.props.nearAddress[0] !== nearAddress[0] &&
        this.props.nearAddress[0] === undefined &&
        !this.state.outrun
      ) {
        this.getGeodata(this.state.coordinates);
      }
      if (this.fetchPosition) {
        if (!checkBoundaries(undefined, this.props.settings, this.state.coordinates)) {
          this.props.setUserInitialAddress(this.props.nearAddress[0]);
        }
        this.fetchPosition = false;
      }
    }

    if (this.props.nearAddress[0] === undefined && this.state.outrun !== outrun) {
      this.getGeodata(this.state.coordinates);
    }

    if (this.props.nearAddress[0] === undefined && this.findFirstAddress && !this.state.outrun) {
      this.findFirstAddress = false;
      setTimeout(() => {
        if (!this.props.nearAddress[0]) {
          this.getGeodata(this.state.coordinates);
        }
      }, 2000);
    }

    if (this.props.user.phone !== user.phone) {
      const dataLogin = {
        taxiToken: env.app_token,
        phone: this.props.user.phone,
        firebaseToken: this.props.token,
      };
      this.props.socketAPI('LOGON', dataLogin);
    }

    if (currentOrders === undefined && this.props.currentOrders !== currentOrders) {
      if (this.props.currentOrders.length === 0) {
        this.setState({ isTrip: false });
      }
      if (this.props.currentOrders.length > 0 && this.props.currentOrders[0].statusId > 5) {
        if (this.props.showRating && this.props.currentOrders[0].statusId === 6) {
          Actions.mapDir();
        }
        this.setState({ isTrip: false });
      }
    }

    if (
      currentOrders &&
      this.props.currentOrders &&
      JSON.stringify(this.props.currentOrders) !== JSON.stringify(currentOrders)
    ) {
      if (this.props.currentOrders.length === 0) {
        this.setState({ isTrip: false });
      }
      if (this.props.currentOrders.length > 0 && this.props.currentOrders[0].statusId > 5) {
        this.setState({ isTrip: false });
      }
    }
  }

  componentWillUnmount() {
    if (this.driversTimer) {
      clearInterval(this.driversTimer);
    }
    if (this.props.comfortable?.length > 0) {
      this.props.clearComfortable();
    }
  }

  getDriversTimer = () => {
    this.driversTimer = setInterval(() => {
      const { clientId } = this.props.user;
      if (clientId && Actions.currentScene === 'home') {
        this.props.socketAPI(socketTypes.GET_DRIVERS_ON_MAP, { clientId });
      }
    }, 10000);
  };

  showBlocked = async () => {
    const blocked = await getAsyncStorage('blocked');
    if (blocked) return;
    this.props.popup.showPopup({
      error: true,
      text: strings.formatString(strings.blockedUser, this.props.settings.taxiPhone),
      header: strings.warning,
    });
    await setAsyncStorage('blocked', 'blocked');
  };

  welcomeModal = async () => {
    if (!this.props.settings.currency) {
      return setTimeout(() => {
        this.welcomeModal();
      }, 500);
    }
    const welcome = await getAsyncStorage('welcome');
    if (this.props.settings.welcomeText && !welcome) {
      this.setState({
        welcome: true,
      });
    }
  };

  welcomeSave = async () => {
    await setAsyncStorage('welcome', 'welcome');
    this.setState({
      welcome: false,
    });
  };

  // coordinates manipulation

  getLocationPermissionsIos = () => {
    return this.props.popup.showPopup({
      header: strings.warning,
      line: true,
      text: strings.allowGeodata,
      onPress: () => Linking.openURL('app-settings:'),
    });
  };

  handlePositionButton = () => {
    if (this.state.objectOnMap) {
      this.setState({ objectOnMap: undefined });
    }
    Geolocation.checkPermission().then(res => {
      if (res) {
        this.getInitialPosition();
        this.setState({ noGps: false });
      } else {
        if (Platform.OS === 'ios') {
          this.getLocationPermissionsIos();
        }
        Geolocation.requestPermissions().then(resp => {
          if (resp) {
            this.getInitialPosition();
            this.setState({ noGps: false });
          } else {
            this.setState({ noGps: true });
          }
        });
      }
    });
  };

  getInitialPosition = async () => {
    this.fetchPosition = true;
    Geolocation.init();
    const coords = await Geolocation.getLatestLocation();
    const regionDefault = {
      latitude: this.props.settings.centerLat,
      longitude: this.props.settings.centerLon,
    };
    const region = coords && coords.latitude > 0 ? coords : regionDefault;
    if (!checkBoundaries(region, this.props.settings, this.state.coordinates)) {
      await this.props.setUserPosition(region);
    }
    this.setState(
      prevState => ({
        ...prevState,
        coordinates: { ...prevState.coordinates, ...region },
        regionReady: true,
        outrun: checkBoundaries(region, this.props.settings, prevState.coordinates),
        pointA: { ...region },
      }),
      () => this.getCoords()
    );
    if (this.map) {
      this.map.animateCamera({ center: { ...region } }, { duration: 1000 });
    }
  };

  getCoords = e => {
    let coordinates = {};
    if (e !== undefined) {
      coordinates = e.nativeEvent.coordinate;
    } else {
      coordinates = this.state.coordinates;
    }

    const data = {
      lat: coordinates.latitude,
      lon: coordinates.longitude,
      lang: this.props.user.lang || this.props.user.settings.defaultLang,
      taxiToken: env.app_token,
    };
    this.props.socketAPI(socketTypes.ADDRESS_BY_LAT_LON, data);
    const data2 = {
      lat0: coordinates.latitude,
      lon0: coordinates.longitude,
      lang: this.props.user.lang || this.props.user.settings.defaultLang,
      taxiToken: env.app_token,
    };
    this.props.socketAPI(socketTypes.CHECK_NON_COMFORTABLE_PLACE, data2);
    if (!this.props.nearAddress[0]) {
      this.findFirstAddress = true;
    }
  };

  handleRegionChange = region => {
    if (Platform.OS === 'ios') {
      this.setState({ objectOnMap: undefined });
    }
    if (this.delay || this.state.comfortInfo) return;
    this.delay = true;

    const rb = getBoundByRegion(region);
    if (checkBoundaries(region, this.props.settings, this.state.coordinates)) {
      this.setState({ outrun: true });
    } else {
      this.setState({ outrun: false });
    }
    const data = {
      taxiToken: env.app_token,
      lat1: rb?.minLat,
      lon1: rb?.minLng,
      lat2: rb?.maxLat,
      lon2: rb?.maxLng,
    };
    this.props.socketAPI(socketTypes.OBJECTS_IN_BOUNDS, data);
    this.setState(
      state => ({ coordinates: { ...state.coordinates, ...region }, pointA: { ...region } }),
      this.state.outrun ? null : () => this.getCoords()
    );
    setTimeout(() => {
      this.delay = false;
    }, 500);
  };

  handleRegionChangeStart = () => this.setState({ moving: true, objectOnMap: undefined });

  // navigation

  handleAddress = () => {
    const nearAddress = this.getObjectOnMap();
    if (!checkBoundaries(undefined, this.props.settings, this.state.coordinates)) {
      this.props.setFrom(nearAddress);
    }
    Actions.address({ currentAddress: !this.state.outrun ? nearAddress : undefined });
  };

  handleDestination = () => {
    const nearAddress = this.getObjectOnMap();
    if (!this.state.outrun) {
      this.props.setFrom(nearAddress);
    }
    if (this.props.comfortable.length > 0) {
      const distance = getDistanceFromLatLonInKm(
        nearAddress?.lat,
        nearAddress?.lon,
        this.props.user.initialAddress?.lat,
        this.props.user.initialAddress?.lon
      );
      this.setState({ comfortInfo: true, radiusCheck: distance < 0.3, addressScene: true }, () => {
        const coordsArray = this.props.comfortable.map(el => ({
          latitude: el?.lat,
          longitude: el?.lon,
        }));
        const coordsUser = {
          latitude: this.state.radiusCheck ? this.props.user.initialAddress?.lat : nearAddress?.lat,
          longitude: this.state.radiusCheck
            ? this.props.user.initialAddress?.lon
            : nearAddress?.lon,
        };
        if (this.map && coordsUser.latitude && coordsUser.longitude) {
          this.map.fitToCoordinates([coordsUser, ...coordsArray], {
            edgePadding: Platform.select({
              ios: { top: 90, right: 20, bottom: 60, left: 20 },
              android: {
                top: Dimension.ScreenHeight() < 640 ? 70 : 140,
                right: 20,
                bottom: Dimension.ScreenHeight() < 640 ? 30 : 60,
                left: 20,
              },
            }),
            animated: true,
          });
        }
      });
    } else {
      Actions.address({ destScene: true });
    }
  };

  handleLast = async () => {
    const { history } = this.props;
    const data = {
      lat: history[0].lat0,
      lon: history[0].lon0,
      street: history[0].street0,
      house: history[0].house0,
      object: history[0].object0,
      lang: this.props.user.lang || this.props.user.settings.defaultLang,
    };
    const nearAddress = this.getObjectOnMap();
    this.props
      .setFrom(nearAddress)
      .then(() => this.props.setTo([data]))
      .then(() => Actions.reset('mapDir'));
  };

  handleCall = () => {
    const nearAddress = this.getObjectOnMap();
    const { user, comfortable } = this.props;
    const { outrun, radiusCheck } = this.state;
    if (!outrun) {
      this.props.setFrom(nearAddress);
    }
    if (comfortable.length > 0) {
      const distance = getDistanceFromLatLonInKm(
        nearAddress?.lat,
        nearAddress?.lon,
        user.initialAddress?.lat,
        user.initialAddress?.lon
      );
      this.setState({ comfortInfo: true, radiusCheck: distance < 0.3 }, () => {
        const coordsArray = comfortable.map(el => ({
          latitude: el?.lat,
          longitude: el?.lon,
        }));
        const coordsUser = {
          latitude: radiusCheck ? user.initialAddress?.lat : nearAddress?.lat,
          longitude: radiusCheck ? user.initialAddress?.lon : nearAddress?.lon,
        };
        if (this.map && coordsUser.latitude && coordsUser.longitude) {
          this.map.fitToCoordinates([coordsUser, ...coordsArray], {
            edgePadding: Platform.select({
              ios: { top: 90, right: 20, bottom: 60, left: 20 },
              android: {
                top: Dimension.ScreenHeight() < 640 ? 70 : 140,
                right: 20,
                bottom: Dimension.ScreenHeight() < 640 ? 30 : 60,
                left: 20,
              },
            }),
            animated: true,
          });
        }
      });
    } else {
      Actions.reset('mapDir');
    }
  };

  handlePick = address => {
    const { outrun, addressScene } = this.state;
    if (!outrun) {
      this.props.setFrom(address);
    }
    if (addressScene) {
      this.setState({ comfortInfo: false, addressScene: false, radiusCheck: false }, () =>
        Actions.address({ destScene: true })
      );
    } else {
      this.setState({ comfortInfo: false, radiusCheck: false }, () => Actions.reset('mapDir'));
    }
  };

  handleActiveTrips = () => Actions.activeTrips();

  setName = el => {
    if (Platform.OS === 'ios' && this.map && el.lat && el.lon) {
      this.map.animateToRegion({
        latitude: el?.lat,
        longitude: el?.lon,
        latitudeDelta: constants.LATITUDE_DELTA,
      });
    }
    this.setState({ objectOnMap: el });
  };

  getGeodata = async region => {
    if (Actions.currentScene !== 'home') return;
    if (!this.geocoderDelay) {
      const { user } = this.props;
      this.geocoderDelay = true;
      const request = `https://eu1.locationiq.com/v1/reverse.php?key=373bd9a20b624b&format=json&lat=${
        region.latitude
      }&lon=${region.longitude}&zoom=18&addressdetails=1&accept-language=${user.lang ||
        user.settings.defaultLang}`;
      fetch(request).then(async res => {
        const data = await res.json();
        // eslint-disable-next-line camelcase
        const { road, village, city, town, house_number, county, state, address29 } = data.address;
        const currentAddress = {
          lat: parseFloat(data?.lat, 10),
          lon: parseFloat(data?.lon, 10),
          // eslint-disable-next-line camelcase
          name: data?.display_name,
          address: data?.address,
          street: `${city || town || village || road || county}${
            city || town || village ? `, ${road || county || state}` : ''
          }`,
          // eslint-disable-next-line camelcase
          house: house_number || '',
          object: address29,
        };
        this.props.addressNominatim(currentAddress);
      });
      setTimeout(() => {
        this.geocoderDelay = false;
      }, 1000);
    }
  };

  getObjectOnMap = () => {
    if (this.state.objectOnMap) {
      return this.state.objectOnMap;
    }
    if (this.props.nearAddress[0]) {
      return this.props.nearAddress[0];
    }
    return {};
  };

  render() {
    const {
      coordinates,
      scroll,
      moving,
      outrun,
      regionReady,
      welcome,
      pointA,
      comfortInfo,
      noGps,
      objectOnMap,
    } = this.state;
    const { drivers, history, user, settings, currentOrders, comfortable, objects } = this.props;
    const nearAddress = this.getObjectOnMap();

    const addressText = history.length ? history[0].street0 : '';
    const activeTrips = currentOrders
      ? currentOrders.filter(el => el.statusId !== 6 && el.statusId !== 7).length
      : 0;
    return (
      <View style={style.container}>
        {regionReady && (
          <MapView
            ref={ref => (this.map = ref)}
            initialRegion={coordinates}
            style={[style.map, comfortInfo && { flex: 1, position: 'relative' }]}
            scrollEnabled={scroll}
            zoomEnabled={scroll}
            pitchEnabled={false}
            rotateEnabled={false}
            cacheEnabled={false}
            onRegionChangeComplete={this.handleRegionChange}
            onMoveShouldSetResponder={this.handleRegionChangeStart}
            customMapStyle={mapConfig}
            minDelta={0.002}
            minZoomLevel={12}
            onTouchEnd={() => this.setState({ moving: false })}
            provider="google"
          >
            {settings.allowSeeCars &&
              drivers.map(el => (
                <Marker
                  key={el.driverId}
                  coordinate={{
                    latitude: el?.lat,
                    longitude: el?.lon,
                  }}
                  tracksViewChanges={false}
                  rotation={el.bearing || 0}
                >
                  <TaxiMarker free={el.isFree} />
                </Marker>
              ))}
            {comfortable.length > 0 &&
            comfortInfo &&
            user.initialAddress.lat &&
            user.initialAddress.lon &&
            pointA.latitude &&
            pointA.longitude
              ? comfortable.map((el, index) => {
                  return (
                    <Polyline
                      key={el.object}
                      coordinates={[
                        this.state.radiusCheck
                          ? {
                              latitude: user.initialAddress?.lat,
                              longitude: user.initialAddress?.lon,
                            }
                          : pointA,
                        { latitude: el?.lat, longitude: el?.lon },
                      ]}
                      strokeColor={index < 11 ? constants.COLORS_POLY[index].hex : colors.red}
                      strokeWidth={2}
                      lineDashPattern={[10, 5]}
                    />
                  );
                })
              : null}
            {comfortable.length > 0 && comfortInfo
              ? comfortable?.map((el, index) => {
                  return (
                    <Marker
                      key={el.object}
                      coordinate={{ latitude: el?.lat, longitude: el?.lon }}
                      tracksViewChanges={false}
                    >
                      <Icon
                        mci
                        name="circle-slice-8"
                        color={index < 11 ? constants.COLORS_POLY[index].hex : colors.red}
                      />
                    </Marker>
                  );
                })
              : null}
            {comfortable.length > 0 &&
            comfortInfo &&
            user.initialAddress.lat &&
            user.initialAddress.lat ? (
              <Marker
                coordinate={{
                  latitude: user.initialAddress.lat,
                  longitude: user.initialAddress.lon,
                }}
                tracksViewChanges={false}
              >
                <Icon mci name="human-male" size={32} />
              </Marker>
            ) : null}

            {comfortable.length > 0 && comfortInfo && pointA.longitude && pointA.latitude ? (
              <Marker coordinate={pointA} tracksViewChanges={false}>
                <Pins />
              </Marker>
            ) : null}

            {!!objects?.length &&
              coordinates.latitudeDelta < 0.006 &&
              !comfortInfo &&
              objects?.map(el => {
                return (
                  <Marker
                    coordinate={{ latitude: el?.lat, longitude: el?.lon }}
                    key={el.id}
                    onPress={() => this.setName(el)}
                    tracksViewChanges={false}
                  >
                    <Icon name="dot-circle-o" fa size={26} color={colors.blue} />
                  </Marker>
                );
              })}
          </MapView>
        )}
        {/* workaround about custom marker not rendering on initial render */}
        <Image source={Images.TaxiBlue} style={style.markerStub} />
        <View style={[style.addressOverlay, { top: activeTrips || noGps ? '20%' : '14%' }]}>
          {!moving && !comfortInfo && (
            <OverlayText
              address={nearAddress}
              changeAddress={this.handleAddress}
              outrun={outrun}
              noGps={noGps}
              object={objectOnMap}
            />
          )}
        </View>
        {!comfortInfo && (
          <View style={style.overlay}>
            <Pins />
          </View>
        )}
        {!comfortInfo && (
          <MapHeader
            nameIcon="geolocation"
            onProfilePress={user.clientId ? Actions.profile : Actions.signin}
            onPress={this.handlePositionButton}
            imagePic={user.base64Photo}
            onActiveTrips={this.handleActiveTrips}
            activeTrips={
              currentOrders
                ? currentOrders.filter(
                    el =>
                      el.statusId !== 6 &&
                      el.statusId !== 7 &&
                      el.statusId !== 12 &&
                      el.statusId !== 10
                  ).length
                : 0
            }
          />
        )}
        {comfortInfo ? (
          <ComfortSheet
            places={comfortable}
            onClose={() =>
              this.setState(
                { comfortInfo: false, radiusCheck: false },
                () => (this.alreadyCheck = false)
              )
            }
            onPick={this.handlePick}
          />
        ) : (
          !moving &&
          (!user.clientId || !!currentOrders) &&
          regionReady && (
            <MapFooter
              titleText={strings.whereToGo}
              addressText={addressText}
              history={history.length > 0}
              onPressAddress={this.handleDestination}
              onPressNext={this.handleCall}
              onPressRides={() => Actions.rides()}
              onPressLast={this.handleLast}
              disabled={
                Object.keys(this.getObjectOnMap()).length < 1 || (user.clientId && outrun) || noGps
              }
              tripStatus={0}
              onCurrentRide={() => Actions.reset('mapDir')}
              outrun={outrun}
            />
          )
        )}
        {((!currentOrders && !!user.clientId) || !regionReady) && (
          <View style={{ marginBottom: 60 }}>
            <Preloader loading={(!currentOrders && !!user.clientId) || !regionReady} />
          </View>
        )}
        <WelcomeModal visible={welcome} onClose={this.welcomeSave} text={settings.welcomeText} />
      </View>
    );
  }
}

export default connect(
  ({ user, data, orders, auth, popup, errors }) => ({
    user,
    popup,
    errors,
    drivers: data.drivers,
    driver: data.driver,
    nearAddress: data.nearAddress,
    history: orders.history,
    currentOrders: orders.currentOrders,
    details: orders.details,
    settings: data.settings,
    token: auth.token,
    showRating: orders.showRating,
    comfortable: data.comfortable,
    objects: data.objects,
  }),
  {
    socketAPI,
    setUserPosition,
    setFrom,
    setTo,
    clearDriverInfo,
    clearOrders,
    addressNominatim,
    setUserInitialAddress,
    clearErrors,
    clearComfortable,
  }
)(Home);
