import React, { PureComponent } from 'react';
import { View, TouchableOpacity, Image, Platform } from 'react-native';
import PropTypes from 'prop-types';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';

import { Text, Icon, Button, Ratings, Pins } from '../../components';
import { clearOrderDetails, socketAPI, socketTypes, clearRoutes } from '../../actions';
import {
  colors,
  styleConstants,
  strings,
  constants,
  Images,
  getDataFromRoutes,
  Dimension,
} from '../../helpers';
import InfoModal from './InfoModal';
import style from './style';
import mapConfig from '../../config/mapStyle.json';
import RateTrip from '../MapDirections/RateTrip';
import BadRating from '../MapDirections/BadRating';

import env from '../../env';

class Details extends PureComponent {
  static propTypes = {
    activeDetails: PropTypes.object,
    activeTemplate: PropTypes.object,
    user: PropTypes.object,
    details: PropTypes.object,
    clearOrderDetails: PropTypes.func,
    socketAPI: PropTypes.func,
    addFares: PropTypes.object,
    routes: PropTypes.array,
    clearRoutes: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = {
      coordinates: {
        longitudeDelta: constants.LONGITUDE_DELTA,
        latitudeDelta: constants.LATITUDE_DELTA,
        latitude: 0,
        longitude: 0,
      },
      infoVisible: false,
      showRating: false,
      showBadRating: false,
      rating: 5,
      ratingComment: '',
      ratingReasonId: [],
      template: undefined,
    };
  }

  componentDidMount() {
    if (this.props.activeDetails) {
      const { lat0, lon0, id } = this.props.activeDetails;
      this.getOrderDetails(id);
      this.setState(state => ({
        coordinates: { ...state.coordinates, latitude: lat0, longitude: lon0 },
      }));
    }
    if (this.props.activeTemplate) {
      const { lat0, lon0 } = this.props.activeTemplate;
      this.setState(state => ({
        coordinates: { ...state.coordinates, latitude: lat0, longitude: lon0 },
        template: this.props.activeTemplate,
      }));
    }
  }

  componentWillUnmount() {
    this.props.clearOrderDetails();
    this.props.clearRoutes();
  }

  getOrderDetails = order => {
    const { user } = this.props;
    if (!user.clientId) return;
    if (order === 'clear') {
      return this.props.clearOrderDetails();
    }
    this.props.socketAPI(socketTypes.GET_ORDER_DETAILS, {
      clientId: user.clientId,
      orderId: order,
      lang: user.lang || user.settings.defaultLang,
    });
  };

  getStatusTranslation = statusId => {
    let status = '';
    switch (statusId) {
      case 1:
      case 2:
        status = strings.statusSearching;
        break;
      case 3:
        status = strings.statusAwaiting;
        break;
      case 4:
        status = strings.statusDriveOnPlace;
        break;
      case 5:
        status = strings.statusInTheWay;
        break;
      case 6:
        status = strings.ended;
        break;
      case 7:
        status = strings.taxiNotFound;
        break;
      case 8:
        status = strings.reserved;
        break;
      case 9:
      case 10:
      case 11:
      case 12:
        status = strings.canceled;
        break;
      case 13:
        status = 'Blocked by agregator';
        break;
      case 14:
        status = strings.preordered;
        break;
      default:
        break;
    }
    return status;
  };

  showModal = () => {
    this.setState(state => ({
      infoVisible: !state.infoVisible,
    }));
  };

  getPoints = obj => {
    if (!obj) return undefined;
    const arr = [
      { latitude: obj.lat0, longitude: obj.lon0 },
      { latitude: obj.lat1, longitude: obj.lon1 },
      { latitude: obj.lat2, longitude: obj.lon2 },
      { latitude: obj.lat3, longitude: obj.lon3 },
      { latitude: obj.lat4, longitude: obj.lon4 },
    ];
    return arr.filter(el => el.latitude);
  };

  toggleRating = () => {
    this.setState(state => ({ showRating: !state.showRating }));
  };

  handleRating = rating => this.setState({ rating });

  pickReasons = id => {
    const { ratingReasonId } = this.state;
    const isInArray = this.state.ratingReasonId.some(el => el === id);
    if (!isInArray) {
      this.setState(state => ({ ratingReasonId: [...state.ratingReasonId, id] }));
    } else {
      const removeData = ratingReasonId.filter(el => el !== id);
      this.setState({ ratingReasonId: removeData });
    }
  };

  sendRating = () => {
    const data = {
      clientId: this.props.user.clientId,
      orderId: this.props.details.id,
      rating: this.state.rating,
      comments: this.state.ratingComment,
      reasonId: this.state.ratingReasonId,
    };
    this.props.socketAPI(socketTypes.RANK_ORDER, data);
    this.setState({ showBadRating: false, showRating: false }, () =>
      this.getOrderDetails(this.props.details.id)
    );
  };

  getTrack = data => {
    if (!data) return;
    const trackParse = JSON.parse(data);
    const trackArray = trackParse?.coordinates?.map(el => ({ latitude: el[1], longitude: el[0] }));
    return trackArray;
  };

  getRoute = () => {
    const { details } = this.props;
    if (details && details.route) {
      const result = getDataFromRoutes(JSON.parse(details.route).features);
      if (result) {
        return result;
      }
      return null;
    }
    if (
      this.state.template &&
      this.state.template.lat0 &&
      this.state.template.lat1 &&
      this.props.routes &&
      this.props.routes.length === 0
    ) {
      const { template } = this.state;
      const origin = { latitude: template?.lat0, longitude: template.lon0 };
      const destination = [
        template.lat1 ? { latitude: template.lat1, longitude: template.lon1, id: 0 } : undefined,
        template.lat2 ? { latitude: template.lat2, longitude: template.lon2, id: 1 } : undefined,
        template.lat3 ? { latitude: template.lat3, longitude: template.lon3, id: 2 } : undefined,
        template.lat4 ? { latitude: template.lat4, longitude: template.lon4, id: 3 } : undefined,
      ].filter(el => el);
      let text = `${origin.longitude},${origin.latitude}`;
      destination.forEach(el => {
        const part = `|${el.longitude},${el.latitude}`;
        text += part;
      });

      const data = {
        taxiToken: env.app_token,
        text,
      };
      this.props.socketAPI(socketTypes.ROUTE, data);
    }
  };

  getServicesCount = (details, names = false, template) => {
    const { emptyTrunk, tinted, conditioner, terminal, animals, childSeat, lowLanding, receipt } =
      details && this.props.details ? this.props.details : template || {};
    const services = [
      {
        name: strings.servicesTravelTrunk,
        key: 'emptyTrunk',
        isTrue: emptyTrunk,
      },
      {
        name: strings.servicesTinted,
        key: 'tinted',
        isTrue: tinted,
      },
      {
        name: strings.servicesConditioner,
        key: 'conditioner',
        isTrue: conditioner,
      },
      {
        name: strings.servicesTerminal,
        key: 'terminal',
        isTrue: terminal,
      },
      {
        name: strings.servicesAnimals,
        key: 'animals',
        isTrue: animals,
      },
      {
        name: strings.servicesChildSeat,
        key: 'childSeat',
        isTrue: childSeat,
      },
      {
        name: strings.servicesLowLanding,
        key: 'lowLanding',
        isTrue: lowLanding,
      },
      {
        name: strings.servicesReceipt,
        key: 'receipt',
        isTrue: receipt,
      },
    ];
    const filtered = services.filter(el => el?.isTrue === true);
    if (names) {
      let textService = '';
      filtered.forEach(el => {
        textService += `${el.name}, `;
      });
      return textService.slice(0, -2);
    }
    return filtered.length;
  };

  render() {
    const { details, routes } = this.props;
    const {
      coordinates,
      infoVisible,
      showBadRating,
      showRating,
      rating,
      ratingComment,
      ratingReasonId,
      template,
    } = this.state;
    const item = details ? { ...details } : template ? { ...template } : {};
    const status = this.getStatusTranslation(item?.statusId);
    const payment =
      item?.paymentTypeId === 0
        ? strings.cash
        : item?.paymentTypeId === 1
        ? strings.payWithCreditCard
        : item?.paymentTypeId === 2
        ? strings.bonusPay
        : strings.cashless;
    const paymentIcon =
      item.paymentTypeId === 0 ? 'cash' : item.paymentTypeId === 1 ? 'credit-card' : 'rocket';
    const points = this.getPoints(item);
    const route = this.getRoute();
    return (
      <View style={style.container}>
        <View style={style.mapWrapper}>
          <Pins style={{ width: 1, height: 1 }} />
          <Pins style={{ width: 1, height: 1 }} type="destination" />
          <MapView
            ref={ref => (this.map = ref)}
            initialRegion={coordinates}
            style={style.map}
            scrollEnabled
            zoomEnabled
            pitchEnabled={false}
            rotateEnabled={false}
            cacheEnabled={false}
            customMapStyle={mapConfig}
            toolbarEnabled={false}
            provider="google"
            onMapReady={() => {
              if (!points || points.length === 0) return;
              this.map.fitToCoordinates(points, {
                edgePadding: { top: 100, bottom: 60, left: 60, right: 60 },
              });
            }}
          >
            {this.getPoints(item)?.map((el, index) => (
              <Marker coordinate={el} tracksViewChanges={false} key={index}>
                <Pins type={index !== 0 ? 'dest' : 'origin'} />
              </Marker>
            ))}

            {!!route && (
              <Polyline
                coordinates={route.routes}
                strokeWidth={5}
                strokeColor={colors.blue}
                onLayout={() => {
                  if (this.map && item.lat1) {
                    this.map.fitToCoordinates(this.getPoints(item), {
                      edgePadding: Platform.select({
                        ios: { top: 90, right: 20, bottom: 90, left: 20 },
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
                }}
              />
            )}
            {!!template && !!routes?.length && (
              <Polyline
                coordinates={routes}
                strokeWidth={5}
                strokeColor={colors.blue}
                onLayout={() => {
                  if (this.map && item.lat1) {
                    this.map.fitToCoordinates(this.getPoints(item), {
                      edgePadding: Platform.select({
                        ios: { top: 90, right: 20, bottom: 90, left: 20 },
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
                }}
              />
            )}
          </MapView>
        </View>
        <View>
          {!template && (
            <View style={style.header}>
              <View style={style.headerRow}>
                <Text normalText style={style.headerStatus}>
                  {status}
                </Text>
              </View>
              <Text normalText>{item?.dt}</Text>
              <TouchableOpacity onPress={this.showModal}>
                <Icon mci name="dots-horizontal" />
              </TouchableOpacity>
            </View>
          )}
          <View
            style={{
              marginBottom: !(item?.statusId > 2 && item?.statusId !== 7 && item?.statusId !== 12)
                ? 30
                : 0,
              paddingTop: template ? 16 : 0,
            }}
          >
            <View style={style.originContainer}>
              <View style={style.directionsIconContainer}>
                <View style={styleConstants.orangeDot} />
              </View>
              <View>
                {!!item?.object0 && <Text normalText>{item?.object0}</Text>}
                <Text normalText={!item?.object0}>
                  {item?.street0 ? `${item?.street0}, ${item?.house0}` : ''}
                </Text>
              </View>
            </View>
            {!!item?.street1 && (
              <View style={style.destinationContainer}>
                <View style={style.directionsIconContainer}>
                  <Icon name="marker" size={11} />
                </View>
                <View>
                  {!!item?.object1 && <Text normalText>{item?.object1}</Text>}
                  <Text normalText={!item?.object1}>{`${item?.street1 || ''}, ${item?.house1 ||
                    ''}`}</Text>
                </View>
              </View>
            )}
            {!!item?.street2 && (
              <View style={style.destinationContainer}>
                <View style={style.directionsIconContainer}>
                  <Icon name="marker" size={11} />
                </View>
                <View>
                  {!!item?.object2 && <Text normalText>{item?.object2}</Text>}
                  <Text normalText={!item?.object2}>{`${item?.street2 || ''}, ${item?.house2 ||
                    ''}`}</Text>
                </View>
              </View>
            )}
            {!!item?.street3 && (
              <View style={style.destinationContainer}>
                <View style={style.directionsIconContainer}>
                  <Icon name="marker" size={11} />
                </View>
                <View>
                  {!!item?.object3 && <Text normalText>{item?.object3}</Text>}
                  <Text normalText={!item?.object3}>{`${item?.street3 || ''}, ${item?.house3 ||
                    ''}`}</Text>
                </View>
              </View>
            )}
            {!!item?.street4 && (
              <View style={style.destinationContainer}>
                <View style={style.directionsIconContainer}>
                  <Icon name="marker" size={11} />
                </View>
                <View>
                  {!!item?.object4 && <Text normalText>{item?.object4}</Text>}
                  <Text normalText={!item?.object4}>{`${item?.street4 || ''}, ${item?.house4 ||
                    ''}`}</Text>
                </View>
              </View>
            )}
          </View>
          {item?.statusId > 2 && item?.statusId !== 7 && (
            <View style={style.driverContainer}>
              <View style={style.driverInfo}>
                <View style={style.driverWrap}>
                  <Image
                    source={
                      item?.driverPhoto
                        ? { uri: `data:image/png;base64,${item?.driverPhoto}` }
                        : Images.SmallAvatar
                    }
                    style={style.driverAvatar}
                  />
                  <View style={style.driverCarTextWrap}>
                    <Text normalText>{item?.driverName}</Text>
                  </View>
                </View>
                <View style={style.driverWrap}>
                  <View style={style.driverAvatar}>
                    <Icon mci name="taxi" size={32} color={colors.iconGrey} />
                  </View>
                  <Text normalText>{item?.car}</Text>
                </View>
              </View>
            </View>
          )}
          {item?.statusId > 2 && item?.statusId !== 7 && item?.statusId !== 12 && (
            <View style={style.orderInfoContainer}>
              <View style={style.orderInfoWrap}>
                <View>
                  <Text smallRegular>{strings.carClass}</Text>
                  <Text normalText>{item?.priceName}</Text>
                </View>
                <View>
                  <Text smallRegular>{strings.cost}</Text>
                  <Text normalText>{item?.price}</Text>
                </View>
                <View>
                  <Text smallRegular>{strings.payment}</Text>
                  <View style={style.headerRow}>
                    <Icon name={paymentIcon} color={colors.green} />
                    <Text style={{ color: colors.green }}>{payment}</Text>
                  </View>
                </View>
              </View>
            </View>
          )}
          {item?.statusId === 6 && (
            <View style={style.ratingWrap}>
              {!item?.rating ? (
                <Button title={strings.rateARide} onPress={this.toggleRating} />
              ) : (
                <View style={{ alignItems: 'center' }}>
                  <Text style={style.rateTripText}>{strings.yourRating}</Text>
                  <Ratings
                    maxStars={5}
                    rating={item?.rating}
                    starSize={24}
                    buttonStyle={style.rateTripRatingStar}
                    disabled
                  />
                </View>
              )}
            </View>
          )}
          {!!template && (
            <View style={{ marginHorizontal: 16 }}>
              <View
                style={{
                  borderTopWidth: 1,
                  borderTopColor: colors.lightGrey,
                  paddingTop: 16,
                  marginBottom: 10,
                }}
              >
                <Text style={{ marginBottom: 8 }}>{strings.name}</Text>
                <Text normalText>{template?.name}</Text>
              </View>
              {!!this.getServicesCount(false, false, item) && (
                <View
                  style={{
                    borderTopWidth: 1,
                    borderTopColor: colors.lightGrey,
                    paddingTop: 16,
                    marginBottom: 10,
                  }}
                >
                  <Text style={{ marginBottom: 8 }}>{strings.additionalServices}</Text>
                  <Text normalText>{this.getServicesCount(false, true, item)}</Text>
                </View>
              )}
              {!!item?.comments && (
                <View
                  style={{
                    borderTopWidth: 1,
                    borderTopColor: colors.lightGrey,
                    paddingTop: 16,
                    marginBottom: 10,
                  }}
                >
                  <Text style={{ marginBottom: 8 }}>{strings.commentDriver}</Text>
                  <Text normalText>{item.comments}</Text>
                </View>
              )}
              <View
                style={{
                  borderTopWidth: 1,
                  borderTopColor: colors.lightGrey,
                  paddingTop: 16,
                  marginBottom: 10,
                }}
              >
                <Text style={{ marginBottom: 8 }}>{strings.payment}</Text>
                <View style={style.headerRow}>
                  <Icon name={paymentIcon} color={colors.green} />
                  <Text style={{ color: colors.green }}>{payment}</Text>
                </View>
              </View>
            </View>
          )}
        </View>
        <TouchableOpacity onPress={Actions.pop} style={style.backButton}>
          <Icon name="arrow-left" size={18} />
        </TouchableOpacity>
        {!template && (
          <InfoModal
            visible={infoVisible}
            onPress={this.showModal}
            details={this.props.details || {}}
            fareName={item?.priceName}
            route={route}
            paymentIcon={paymentIcon}
            payment={payment}
            addFares={this.props.addFares}
          />
        )}
        {!template && (
          <RateTrip
            visible={showRating}
            onSend={
              rating < 3
                ? () => this.setState({ showBadRating: true, showRating: false })
                : this.sendRating
            }
            onFinish={() => {
              this.setState({ showRating: false });
            }}
            onChangeRating={this.handleRating}
            rating={rating}
            comment={ratingComment}
            onChangeComment={text => this.setState({ ratingComment: text })}
            order={details || {}}
          />
        )}

        {!template && (
          <BadRating
            visible={showBadRating}
            onSend={this.sendRating}
            onCancel={() => this.setState({ showBadRating: false, showRating: true })}
            onPick={this.pickReasons}
            active={ratingReasonId}
            comment={ratingComment}
            onCommentChange={text => this.setState({ ratingComment: text })}
          />
        )}
      </View>
    );
  }
}

export default connect(
  ({ user, orders, data }) => ({
    user,
    details: orders.details,
    routes: data.routes,
    addFares: data.additionalFares,
  }),
  {
    clearOrderDetails,
    socketAPI,
    clearRoutes,
  }
)(Details);

Details.propTypes = {};
