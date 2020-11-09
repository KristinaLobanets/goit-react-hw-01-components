import React, { PureComponent } from 'react';
import { View, ScrollView, Platform } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { Actions } from 'react-native-router-flux';

import Geolocation from '../../API/Geolocation';
import mapConfig from '../../config/mapStyle.json';

import { Pins, Header, Text, Button, Icon } from '../../components';
import {
  socketAPI,
  socketTypes,
  setFrom,
  setTo,
  addressNominatim,
  clearComfortable,
} from '../../actions';
import {
  constants,
  styleConstants,
  colors,
  strings,
  Dimension,
  getDistanceFromLatLonInKm,
} from '../../helpers';
import style from './style';
import env from '../../env';
import ComfortSheet from '../Home/ComfortSheet';

class MapFinder extends PureComponent {
  static propTypes = {
    socketAPI: PropTypes.func.isRequired,
    setFrom: PropTypes.func.isRequired,
    setTo: PropTypes.func.isRequired,
    data: PropTypes.any.isRequired,
    destScene: PropTypes.bool,
    user: PropTypes.object.isRequired,
    addressNominatim: PropTypes.func,
    nearAddress: PropTypes.array,
    point: PropTypes.number,
    clearComfortable: PropTypes.func,
    comfortable: PropTypes.array,
    isCreateTemplate: PropTypes.bool,
  };

  static defaultProps = {
    destScene: false,
  };

  constructor(props) {
    super(props);
    this.state = {
      coordinates: {
        longitudeDelta: constants.LONGITUDE_DELTA,
        latitudeDelta: constants.LATITUDE_DELTA,
        latitude: Platform.select({
          ios: this.props.user.coordinates.latitude,
          android: 0,
        }),
        longitude: Platform.select({
          ios: this.props.user.coordinates.longitude,
          android: 0,
        }),
      },
      outrun: false,
      regionReady: false,
      comfortInfo: false,
      radiusCheck: false,
    };
  }

  componentDidMount() {
    this.getInitialPosition();
  }

  componentDidUpdate(prevProps, prevState) {
    if (JSON.stringify(prevProps.nearAddress) !== JSON.stringify(this.props.nearAddress)) {
      if (
        this.props.nearAddress[0] !== prevProps.nearAddress[0] &&
        this.props.nearAddress[0] === undefined &&
        !this.state.outrun
      ) {
        return this.getGeodata(this.state.coordinates);
      }
    }

    if (this.props.nearAddress[0] === undefined && this.state.outrun !== prevState.outrun) {
      return this.getGeodata(this.state.coordinates);
    }

    if (this.props.nearAddress[0] === undefined && this.findFirstAddress && !this.state.outrun) {
      this.findFirstAddress = false;
      setTimeout(() => {
        if (!this.props.nearAddress[0]) {
          this.getGeodata(this.state.coordinates);
        }
      }, 2000);
    }
  }

  componentWillUnmount() {
    if (this.props.comfortable?.length > 0) {
      this.props.clearComfortable();
    }
  }

  checkBoundaries = () => {
    if (this.props.destScene) return false;
    const { latitude, longitude } = this.state.coordinates;
    const { maxLat, maxLon, minLat, minLon } = this.props.data.settings;
    if (latitude > maxLat || latitude < minLat || longitude > maxLon || longitude < minLon) {
      return true;
    }
    return false;
  };

  getInitialPosition = async () => {
    Geolocation.init();
    const coords = await Geolocation.getLatestLocation();
    const regionDefault = {
      latitude: this.props.data.settings.centerLat,
      longitude: this.props.data.settings.centerLon,
    };
    const region = coords?.latitude > 0 ? coords : regionDefault;
    this.setState(
      prevState => ({
        ...prevState,
        coordinates: { ...prevState.coordinates, ...region },
        regionReady: true,
        outrun: this.checkBoundaries(region),
      }),
      () => this.getCoords()
    );
    this.map.animateCamera({ center: { ...region } }, { duration: 1000 });
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
    if (!this.props.destScene) {
      const data2 = {
        lat0: coordinates.latitude,
        lon0: coordinates.longitude,
        lang: this.props.user.lang || this.props.user.settings.defaultLang,
        taxiToken: env.app_token,
      };
      this.props.socketAPI(socketTypes.CHECK_NON_COMFORTABLE_PLACE, data2);
    }
    if (!this.props.nearAddress[0]) {
      this.findFirstAddress = true;
    }
  };

  handleAddressDestination = () => {
    const { user, point } = this.props;
    const nearAddress = this.props.nearAddress[0] ? this.props.nearAddress[0] : {};
    if (user.destination?.length > 0 && point) {
      const isDuplicate = user.destination.some(
        el => nearAddress.id && el.id && el.id === nearAddress.id
      );
      let addressData;
      if (isDuplicate) {
        addressData = { ...nearAddress, id: nearAddress.id + Math.floor(Math.random() * 2299) };
      } else {
        addressData = nearAddress;
      }
      const data = [...this.props.user.destination, addressData];
      this.props.setTo(data);
    } else {
      this.props.setTo([nearAddress]);
    }
    if (this.props.isCreateTemplate) {
      Actions.popTo('mapDir');
      return setTimeout(() => Actions.refresh(), 500);
    }
    Actions.reset('mapDir');
  };

  handleAddressCurrent = () => {
    const nearAddress = this.props.nearAddress[0] ? this.props.nearAddress[0] : {};
    this.props.setFrom(nearAddress);
    if (this.props.comfortable.length === 0) {
      if (this.props.isCreateTemplate) {
        Actions.popTo('mapDir');
        return setTimeout(() => Actions.refresh(), 500);
      }
      Actions.reset('mapDir');
    } else {
      const distance = getDistanceFromLatLonInKm(
        this.props.nearAddress?.[0]?.lat,
        this.props.nearAddress?.[0]?.lon,
        this.props.user.initialAddress?.lat,
        this.props.user.initialAddress?.lon
      );
      this.setState({ comfortInfo: true, radiusCheck: distance < 0.3 }, () => {
        const coordsArray = this.props.comfortable.map(el => ({
          latitude: el?.lat,
          longitude: el?.lon,
        }));
        this.map.fitToCoordinates(
          [
            {
              latitude: this.state.radiusCheck
                ? this.props.user.initialAddress?.lat
                : this.props.nearAddress[0]?.lat,
              longitude: this.state.radiusCheck
                ? this.props.user.initialAddress?.lon
                : this.props.nearAddress[0]?.lon,
            },
            ...coordsArray,
          ],
          {
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
          }
        );
      });
    }
  };

  handlePick = address => {
    if (!this.state.outrun) {
      this.props.setFrom(address);
    }
    this.setState({ comfortInfo: false, radiusCheck: false }, () => {
      if (this.props.isCreateTemplate) {
        Actions.popTo('mapDir');
        return setTimeout(() => Actions.refresh(), 500);
      }
      Actions.reset('mapDir');
    });
  };

  handleRegionChange = region => {
    if (this.delay || this.state.comfortInfo) return;
    this.delay = true;
    if (this.checkBoundaries(region)) {
      this.setState({ outrun: true });
    } else {
      this.setState({ outrun: false });
    }
    this.setState(
      state => ({ coordinates: { ...state.coordinates, ...region } }),
      this.state.outrun ? null : () => this.getCoords()
    );
    setTimeout(() => {
      this.delay = false;
    }, 500);
  };

  getGeodata = async region => {
    if (Actions.currentScene !== 'mapFinder') return;
    if (!this.geocoderDelay) {
      this.geocoderDelay = true;
      const request = `https://eu1.locationiq.com/v1/reverse.php?key=373bd9a20b624b&format=json&lat=${
        region.latitude
      }&lon=${region.longitude}&zoom=18&addressdetails=1&accept-language=${this.props.user.lang ||
        this.props.user.settings.defaultLang}`;
      fetch(request).then(async res => {
        const data = await res.json();
        // eslint-disable-next-line camelcase
        const { road, village, city, town, house_number, county, state, address29 } = data.address;
        const currentAddress = {
          lat: parseFloat(data?.lat, 10),
          lon: parseFloat(data?.lon, 10),
          name: data.display_name,
          address: data.address,
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

  render() {
    const { outrun, coordinates, regionReady } = this.state;
    const nearAddress = this.props.nearAddress[0] ? this.props.nearAddress[0] : {};
    const { destScene } = this.props;
    const address = nearAddress
      ? `${nearAddress.street || ''}${nearAddress.house ? ', ' : ''}${nearAddress.house || ''}`
      : '';

    return (
      <View style={style.rootContainer}>
        {!this.state.comfortInfo && (
          <View style={style.headerContainer}>
            <Header
              bigTitle={destScene ? strings.whereToGo : strings.areYouHere}
              arrowRight
              onPress={destScene ? this.handleAddressDestination : this.handleAddressCurrent}
              headerStyle={style.header}
              disabled={(!address && outrun) || !this.state.regionReady}
            />
            <ScrollView
              contentContainerStyle={style.addressContainer}
              horizontal
              showsHorizontalScrollIndicator={false}
            >
              {!destScene ? (
                <View style={[styleConstants.orangeDot, style.dot]} />
              ) : (
                <Icon name="marker" style={style.iconMarker} size={16} />
              )}
              <Text style={style.addressText}>{outrun ? strings.outOfRun : address || ' '}</Text>
            </ScrollView>
          </View>
        )}
        <View style={styleConstants.rootContainer}>
          <View style={style.container}>
            {regionReady && (
              <MapView
                ref={ref => (this.map = ref)}
                initialRegion={coordinates}
                style={[
                  style.map,
                  this.state.comfortInfo && { flex: 1, position: 'relative', maxHeight: '60%' },
                ]}
                scrollEnabled
                zoomEnabled
                pitchEnabled={false}
                rotateEnabled={false}
                cacheEnabled={false}
                onRegionChangeComplete={this.handleRegionChange}
                customMapStyle={mapConfig}
                minDelta={0.002}
                minZoomLevel={destScene ? undefined : 12}
                provider="google"
              >
                {this.props.comfortable.length > 0 && this.state.comfortInfo
                  ? this.props.comfortable?.map((el, index) => {
                      return (
                        <Polyline
                          key={el.object}
                          coordinates={[
                            this.state.radiusCheck
                              ? {
                                  latitude: this.props.user.initialAddress?.lat,
                                  longitude: this.props.user.initialAddress?.lon,
                                }
                              : {
                                  latitude: this.props.nearAddress?.[0]?.lat,
                                  longitude: this.props.nearAddress?.[0]?.lon,
                                },
                            { latitude: el?.lat, longitude: el?.lon },
                          ]}
                          strokeColor={index < 11 ? constants.COLORS_POLY[index].hex : colors.red}
                          strokeWidth={2}
                          lineDashPattern={[10, 5]}
                        />
                      );
                    })
                  : null}
                {this.props.comfortable.length > 0 && this.state.comfortInfo
                  ? this.props.comfortable?.map((el, index) => {
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
                {this.props.comfortable.length > 0 && this.state.comfortInfo ? (
                  <Marker
                    coordinate={{
                      latitude: this.props.user.initialAddress?.lat,
                      longitude: this.props.user.initialAddress?.lon,
                    }}
                    tracksViewChanges={false}
                  >
                    <Icon mci name="human-male" size={32} />
                  </Marker>
                ) : null}
              </MapView>
            )}
            {!this.state.comfortInfo && (
              <View style={style.marker}>
                <Pins type={!destScene ? 'origin' : 'destination'} />
              </View>
            )}
            {this.state.comfortInfo && !this.props.destScene ? (
              <ComfortSheet
                places={this.props.comfortable}
                onClose={() => this.setState({ comfortInfo: false, radiusCheck: false })}
                onPick={this.handlePick}
              />
            ) : null}
          </View>
          {!this.state.comfortInfo && (
            <View style={style.geobuttonWrap}>
              <Button
                buttonStyle={style.geobutton}
                icon="geolocation"
                onPress={this.getInitialPosition}
                colorIcon={colors.black}
              />
            </View>
          )}
        </View>
      </View>
    );
  }
}

export default connect(
  ({ data, user, tech }) => ({
    data,
    user,
    nearAddress: data.nearAddress,
    comfortable: data.comfortable,
    isCreateTemplate: tech.isCreateTemplate,
  }),
  {
    socketAPI,
    setFrom,
    setTo,
    addressNominatim,
    clearComfortable,
  }
)(MapFinder);
