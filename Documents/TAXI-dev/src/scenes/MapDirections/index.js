import React, { PureComponent } from 'react';
import { View, Platform, Share, Alert, Keyboard, Linking } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { Actions } from 'react-native-router-flux';
import moment from 'moment';
import RNCalendarEvents from 'react-native-calendar-events';
import Carousel from 'react-native-snap-carousel';

import {
  UserMarker,
  Radar,
  TaxiMarker,
  InputModal,
  Button,
  Icon,
  Pins,
  Preloader,
} from '../../components';
import {
  socketAPI,
  setUserPosition,
  socketTypes,
  setTo,
  setOrderOptions,
  loginRequest,
  clearChatWithDriver,
  showRatingGlobal,
  clearOrderDetails,
  chooseContact,
  clearErrors,
  clearRoutes,
  clearDetails,
  createTemplateProcess,
  switchCorporate,
  setOrderId,
} from '../../actions';
import {
  constants,
  colors,
  strings,
  getCorrectPhoneNumber,
  Dimension,
  getDistanceFromLatLonInKm,
  getDataFromRoutes,
  getTemplateName,
} from '../../helpers';
import mapConfig from '../../config/mapStyle.json';

import style from './style';
import DirectionForm from './DirectionForm';
import CarList from './CarList';
import BottomControls from './BottomControls';
import CommentForm from './Comment';
import Header from './Header';
import InfoCard from './InfoCard';

import ChatWithDriverModal from './ChatWithDriverModal';
import AdditionalServicesModal from './AdditionalServicesModal';
import CancelInfoModal from './CancelInfoModal';
import CancelModal from './CancelModal';
import SearchTaxi from './SearchTaxi';
import NoTaxi from './NoTaxi';
import DriverInfo from './DriverInfo';
import OverPrice from './OverPrice';
import CancelModalDriver from './CancelModalDriver';
import DriverArrive from './DriverArrive';
import RideInfo from './RideInfo';
import RideSuccess from './RideSuccess';
import TemplateModal from './TemplateModal';
import CancelType from './CancelType';
import LaterModal from './LaterModal';
import RateTrip from './RateTrip';
import BadRating from './BadRating';
import Payment from './Payment';
import MultiPoints from './MultiPoints';
import ActiveTripsBar from './ActiveTripsBar';
import FormWarningModal from './FormWarningModal';
import CorporateSwitch from './CorporateSwitch';
import FriendConfirmModal from './FriendConfirmModal';
import env from '../../env';

const servicesDefault = {
  emptyTrunk: false,
  tinted: false,
  conditioner: false,
  terminal: false,
  animals: false,
  childSeat: false,
  lowLanding: false,
  receipt: false,
  priceId: undefined,
  additionalPrice: 0,
};

class MapDirections extends PureComponent {
  static propTypes = {
    additionalFares: PropTypes.object,
    chooseContact: PropTypes.func,
    clearChatWithDriver: PropTypes.func,
    clearOrderDetails: PropTypes.func,
    contact: PropTypes.object,
    coordinates: PropTypes.object,
    currentOrders: PropTypes.array,
    details: PropTypes.object,
    dialog: PropTypes.array,
    fares: PropTypes.array,
    loginRequest: PropTypes.func.isRequired,
    messageFromDriver: PropTypes.array,
    order: PropTypes.string,
    orderId: PropTypes.number,
    popup: PropTypes.object.isRequired,
    prices: PropTypes.array.isRequired,
    savedAddresses: PropTypes.array,
    scene: PropTypes.string,
    setOrderOptions: PropTypes.func.isRequired,
    setTo: PropTypes.func.isRequired,
    settings: PropTypes.object,
    showRating: PropTypes.bool,
    showRatingId: PropTypes.string,
    showRatingGlobal: PropTypes.func,
    socketAPI: PropTypes.func.isRequired,
    token: PropTypes.string,
    user: PropTypes.object,
    clearErrors: PropTypes.func,
    orderError: PropTypes.string,
    drivers: PropTypes.array,
    routes: PropTypes.array,
    clearRoutes: PropTypes.func,
    time: PropTypes.number,
    distance: PropTypes.number,
    clearDetails: PropTypes.func,
    isCreateTemplate: PropTypes.bool,
    createTemplateProcess: PropTypes.func,
    templates: PropTypes.array,
    isCorporate: PropTypes.number,
    switchCorporate: PropTypes.func,
    orderCarousel: PropTypes.number,
    setOrderId: PropTypes.func,
  };

  constructor(props) {
    super(props);
    Keyboard.dismiss();
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
      entrance: '',
      activeFare: this.props.fares.some(el => el.standardTypeId === 2)
        ? this.props.fares.find(el => el.standardTypeId === 2)?.id
        : this.props.fares[0]?.id,
      comment: '',
      commentVisible: false,
      prevComment: '',

      addServicesVisible: false,
      emptyTrunk: false,
      tinted: false,
      conditioner: false,
      terminal: false,
      animals: false,
      childSeat: false,
      lowLanding: false,
      receipt: false,

      statusId: 0,
      time: 0,
      driveDuration: '-/-',
      finish: false,

      reasonId: [2],
      reason: strings.cancelReasonOrderByMistake,
      visible: false,
      visibleDriver: false,
      visibleCancelType: false,

      lateTime: 1,
      showTime: false,

      otherCar: false,
      additionalPrice: 0,

      visibleTemplate: false,
      templateName: '',

      showLater: false,
      laterDate: moment().format('DD.MM.YY'),
      laterTime: moment()
        .add(35, 'minutes')
        .format('HH:mm'),
      laterDateTime: null,
      alarm: false,
      activeTimeButton: null,
      callLater: false,
      isDateTimePickerVisible: false,
      timeMode: undefined,

      showRating: false,
      rating: 5,
      ratingComment: '',
      ratingReasonId: [],
      showBadRating: false,

      showEntranceInput: false,

      paymentTypeId: 0,
      showPayment: false,
      defaultPrice: 0,

      showChat: false,
      textMessage: '',
      isMessageDisabled: true,

      bonusCount: '',
      errorBonus: false,

      orderId: undefined,
      current: undefined,

      servicesFriends: false,
      addNumber: false,

      showMultiPoints: false,

      isExpandCorporate: false,
      isCorporate: 0,

      holdTemplate: false,
      friendConfirmVisible: false,
    };
    this.count = 0;
  }

  async componentDidMount() {
    const {
      origin,
      coordinates,
      orderOptions,
      defaultPaymentType,
      priceId,
      clientId,
    } = this.props.user;
    if (clientId) {
      this.props.socketAPI(socketTypes.GET_PROFILE, { clientId });
    }
    let current;
    const currentId = this.props.orderId || this.props.showRatingId;

    if (this.props.orderId || this.props.showRatingId) {
      current =
        this.props.currentOrders.length > 0
          ? this.props.currentOrders.find(el => el.id === currentId)
          : undefined;
      this.getOrderDetails(currentId);
      this.getOrderChat(currentId);
      this.current = current;
    } else {
      this.getOrderDetails('clear');
    }
    const empty = undefined;
    if (orderOptions.allowDelete === true && this.props.isCorporate) {
      await this.handleCorporate(0);
    } else if (orderOptions.allowDelete === false && !this.props.isCorporate) {
      await this.handleCorporate(1);
    }
    this.setState(
      prevState => ({
        coordinates: { ...prevState.coordinates, ...coordinates },
        statusId: current ? current.statusId : 0,
        time: current && current.statusId === 3 && current.time > 0 ? current.time : 0,
        visibleDriver: !!(current && current.statusId === 4),

        comment: origin && origin.comments ? origin.comments : orderOptions.comments,
        entrance: origin && origin.entrance ? origin.entrance : orderOptions.entrance,
        paymentTypeId:
          this.props.scene === 'addCreditCard' && this.props.user.defaultCreditCard
            ? 1
            : !this.props.settings.merchantProviderId || !this.props.user.defaultCreditCard
            ? 0
            : orderOptions.paymentTypeId !== 2
            ? orderOptions.paymentTypeId || parseInt(defaultPaymentType, 10)
            : parseInt(defaultPaymentType, 10),
        activeFare:
          orderOptions.priceId ||
          (this.props.isCorporate && this.props.prices.length > 0
            ? this.props.prices[0].id
            : empty) ||
          (priceId && this.props.fares.some(el => el.id === priceId) ? priceId : empty) ||
          (this.props.fares.some(el => el.standardTypeId === 2)
            ? this.props.fares.find(el => el.standardTypeId === 2)?.id
            : this.props.fares[0]?.id),
        emptyTrunk: orderOptions ? orderOptions.emptyTrunk : false,
        tinted: orderOptions.tinted || false,
        conditioner: orderOptions.conditioner || false,
        terminal: orderOptions.terminal || false,
        animals: orderOptions.animals || false,
        childSeat: orderOptions.childSeat || false,
        lowLanding: orderOptions.lowLanding || false,
        receipt: orderOptions.receipt || false,
        orderId: currentId,
        current,
        showRating: this.props.showRating,
        additionalPrice: orderOptions.additionalPrice ? orderOptions.additionalPrice : 0,
      }),
      () => {
        if (this.props.isCorporate && !orderOptions.priceId) {
          this.handleCorporate(1);
        } else {
          this.getPrices(1);
        }
      }
    );
  }

  componentDidUpdate({
    order,
    currentOrders,
    messageFromDriver,
    user,
    orderError,
    prices,
    details,
  }) {
    if (this.props.currentOrders?.length !== currentOrders?.length && this.disable === true) {
      this.disable = false;
      const getOrder =
        this.props.currentOrders &&
        this.props.currentOrders.length &&
        this.props.currentOrders[0].statusId !== 0 &&
        this.props.currentOrders.id < 6
          ? this.props.currentOrders[0]
          : undefined;
      if (getOrder) {
        this.getOrderDetails(getOrder.id);
        this.setState(
          { statusId: getOrder.statusId, orderId: parseInt(getOrder.id, 10) },
          () => (this.disable = false)
        );
      }
      if (getOrder.statusId < 3) {
        this.props.clearChatWithDriver();
      }
    }

    if (
      orderError !== this.props.orderError &&
      !orderError &&
      this.props.orderError === 'client is locked'
    ) {
      this.props.popup.showPopup({
        error: true,
        text: strings.formatString(strings.blockedUser, this.props.settings.taxiPhone),
        header: strings.warning,
      });
      this.props.clearErrors();
      this.disable = false;
    }

    if (order !== this.props.order && this.props.order !== undefined) {
      this.getOrderDetails(this.props.order);
      this.setState(
        { statusId: 1, orderId: parseInt(this.props.order, 10) },
        () => (this.disable = false)
      );
      this.props.clearChatWithDriver();
      if (this.state.callLater) {
        if (this.state.alarm) {
          this.createCalendarEvent(this.props.order);
        }
        this.setState({ alarm: false, callLater: false }, () => {
          Actions.reset('home');
          Actions.rides({ startPage: 1 });
        });
      }
    }

    if (
      messageFromDriver.length !== this.props.messageFromDriver.length &&
      this.props.messageFromDriver.length
    ) {
      if (!this.state.showChat) {
        this.handleChatShow();
      }
      this.confirmMessage(this.props.messageFromDriver[this.props.messageFromDriver.length - 1].id);
      const id = this.props.orderCarousel || this.props.orderId;
      this.getOrderChat(id);
    }

    if (
      this.props.scene === 'addCreditCard' &&
      this.props.user.defaultCreditCard !== user.defaultCreditCard &&
      user.defaultCreditCard === undefined
    ) {
      this.setState({
        paymentTypeId: 1,
      });
    }

    if (details && this.props.details && details.id !== this.props.details.id) {
      this.scrollEnabled = false;
    }

    if (
      (this.props.user.destination !== user.destination ||
        this.props.user.origin !== user.origin) &&
      this.props.isCreateTemplate
    ) {
      this.getPrices(1);
    }

    if (this.props.prices.length !== prices.length && prices.length !== 0) {
      this.setState({
        activeFare: this.props.prices.some(el => el.standardTypeId === 2)
          ? this.props.prices.find(el => el.standardTypeId === 2)?.id
          : this.props.prices[0]?.id,
      });
    }

    if (this.props.orderCarousel || this.props.orderId || this.props.showRatingId) {
      if (
        this.props.currentOrders &&
        this.props.currentOrders.length &&
        currentOrders &&
        currentOrders.length &&
        this.props.currentOrders.find(el => el.id === this.current.id) !== undefined &&
        currentOrders.find(el => el.id === this.current.id) !== undefined &&
        JSON.stringify(this.props.currentOrders.find(el => el.id === this.current.id)) !==
          JSON.stringify(currentOrders.find(el => el.id === this.current.id))
      ) {
        const current =
          this.props.currentOrders.length > 0
            ? this.props.currentOrders.find(el => el.id === this.current.id)
            : undefined;
        const prevCurrent =
          currentOrders.length > 0
            ? currentOrders.find(el => el.id === this.current.id)
            : undefined;

        if (
          current !== undefined &&
          prevCurrent !== undefined &&
          current.time !== prevCurrent.time &&
          (this.state.statusId === 3 || this.state.statusId === 4 || this.state.statusId === 5)
        ) {
          this.getRoutes(this.state.statusId);
        }
        if (
          (current !== undefined &&
            prevCurrent !== undefined &&
            current.id === prevCurrent.id &&
            current.statusId !== prevCurrent.statusId) ||
          (prevCurrent === undefined && current !== undefined) ||
          (current !== undefined &&
            prevCurrent !== undefined &&
            current.id !== prevCurrent.id &&
            current.statusId !== prevCurrent.statusId &&
            this.props.currentOrders.length > currentOrders.length)
        ) {
          const { statusId, time, id } = current;
          switch (statusId) {
            case 1: // 1 Новый
            case 2: // 2 Подтверждение
            case 7: // 7 Без машины
            case 8: // 8 Зарезервирован
            case 12: // 12 Отмена клиентом
            case 13: // 13 Заблокировано агрегатором
            case 14: // 14 Предварительный
              this.props.clearRoutes();
              this.getOrderDetails(id);
              return this.setState({ statusId, time, otherCar: false });
            case 3: // 3 Принят
              this.getOrderDetails(id);
              this.countTick = 5000;
              setTimeout(() => {
                const { lat, lon } = current;
                if (lat && lon) {
                  this.centerMap({ latitude: lat, longitude: lon }, true);
                } else {
                  setTimeout(() => {
                    // eslint-disable-next-line no-shadow
                    const { lat, lon } = current;
                    if (lat && lon) {
                      this.centerMap({ latitude: lat, longitude: lon }, true);
                    }
                  }, this.countTick + 2000);
                }
              }, this.countTick);
              return this.setState({ statusId, time, otherCar: false });
            case 4: // 4 По адресу
              this.getOrderDetails(id);
              return this.setState({ statusId, time: 0, visibleDriver: true });
            case 5: // 5 С пассажиром
              this.getOrderDetails(id);
              return this.setState(state => ({
                statusId,
                driveDuration: moment()
                  .add(state.duration, 'minutes')
                  .format('HH:mm'),
              }));
            case 6: // 6 Закрыт
              this.props.socketAPI(socketTypes.GET_ADDRESS_TEMPLATES, {
                clientId: this.props.user.clientId,
              });
              this.getOrderDetails(id);
              this.props.setOrderOptions(servicesDefault);
              this.props.chooseContact({});
              return this.setState({ statusId, time: 0, showRating: true, showChat: false }, () => {
                this.handleClearDest();
              });
            case 9: // 9 Отмена (вина диспетчера)
            case 10: // 10 Отмена (вина клиента)
            case 11: // 11 Отмена (вина водителя)
              this.getOrderDetails(id);
              this.props.setOrderOptions(servicesDefault);
              this.props.chooseContact({});
              this.handleClearDest();
              this.handleShowCancelDriver();
              return this.setState({ statusId, time });
            default:
              break;
          }
        }
      }
    } else if (
      this.props.currentOrders &&
      currentOrders &&
      JSON.stringify(this.props.currentOrders[0]) !== JSON.stringify(currentOrders[0]) &&
      this.state.statusId !== 0
    ) {
      if (
        this.props.currentOrders[0] !== undefined &&
        currentOrders[0] !== undefined &&
        this.props.currentOrders[0].time !== currentOrders[0].time &&
        (this.state.statusId === 3 || this.state.statusId === 4 || this.state.statusId === 5)
      ) {
        this.getRoutes(this.state.statusId);
      }
      if (
        (this.props.currentOrders[0] !== undefined &&
          currentOrders[0] !== undefined &&
          this.props.currentOrders[0].id === currentOrders[0].id &&
          this.props.currentOrders[0].statusId !== currentOrders[0].statusId) ||
        (currentOrders[0] === undefined && this.props.currentOrders[0] !== undefined) ||
        (this.props.currentOrders[0] !== undefined &&
          currentOrders[0] !== undefined &&
          this.props.currentOrders[0].id !== currentOrders[0].id &&
          this.props.currentOrders[0].statusId !== currentOrders[0].statusId &&
          this.props.currentOrders.length > currentOrders.length)
      ) {
        const { statusId, time, id } = this.props.currentOrders[0];
        switch (statusId) {
          case 1: // 1 Новый
          case 2: // 2 Подтверждение
          case 7: // 7 Без машины
          case 8: // 8 Зарезервирован
          case 12: // 12 Отмена клиентом
          case 13: // 13 Заблокировано агрегатором
          case 14: // 14 Предварительный
            this.props.clearRoutes();
            this.getOrderDetails(id);
            return this.setState({ statusId, time, otherCar: false });
          case 3: // 3 Принят
            this.getOrderDetails(id);
            this.countTick = 5000;
            setTimeout(() => {
              const { lat, lon } = this.props.currentOrders[0];
              if (lat && lon) {
                this.centerMap({ latitude: lat, longitude: lon }, true);
              } else {
                setTimeout(() => {
                  // eslint-disable-next-line no-shadow
                  const { lat, lon } = this.props.currentOrders[0];
                  if (lat && lon) {
                    this.centerMap({ latitude: lat, longitude: lon }, true);
                  }
                }, this.countTick + 2000);
              }
            }, this.countTick);
            return this.setState({ statusId, time, otherCar: false });
          case 4: // 4 По адресу
            this.getOrderDetails(id);
            return this.setState({ statusId, time: 0, visibleDriver: true });
          case 5: // 5 С пассажиром
            this.getOrderDetails(id);
            return this.setState(state => ({
              statusId,
              driveDuration: moment()
                .add(state.duration, 'minutes')
                .format('HH:mm'),
            }));
          case 6: // 6 Закрыт
            this.props.socketAPI(socketTypes.GET_ADDRESS_TEMPLATES, {
              clientId: this.props.user.clientId,
            });
            this.getOrderDetails(id);
            this.props.setOrderOptions(servicesDefault);
            return this.setState({ statusId, time: 0, showRating: true, showChat: false }, () => {
              this.handleClearDest();
            });
          case 9: // 9 Отмена (вина диспетчера)
          case 10: // 10 Отмена (вина клиента)
          case 11: // 11 Отмена (вина водителя)
            this.getOrderDetails(id);
            this.props.setOrderOptions(servicesDefault);
            this.handleClearDest();
            this.handleShowCancelDriver();
            return this.setState({ statusId, time });
          default:
            break;
        }
      }
    }
  }

  componentWillUnmount() {
    if (this.props.isCreateTemplate && !this.state.holdTemplate) {
      this.handleClearDest();
      this.props.createTemplateProcess();
    }
    this.props.clearRoutes();
    this.props.setOrderId(undefined);
  }

  getOrderDetails = order => {
    const { user, details } = this.props;
    if (!user.clientId) return;
    if (order === 'clear') {
      return this.props.clearOrderDetails();
    }
    this.props.socketAPI(socketTypes.GET_ORDER_DETAILS, {
      clientId: user.clientId,
      orderId: order || (details ? details.id : this.props.order),
      lang: user.lang || user.settings.defaultLang,
    });
  };

  getOrderChat = order => {
    this.props.socketAPI(socketTypes.GET_ORDER_MESSAGES, {
      orderId: order || (this.props.details ? this.props.details.id : this.props.order),
    });
  };

  confirmMessage = messageId => {
    this.props.socketAPI('CONFIRM_MESSAGE', { messageId });
  };

  getDirectionPoints = name => {
    let result;
    const { orderId, currentOrders, details, user, orderCarousel } = this.props;
    const addressFrom = user.origin || user.initialAddress;
    if (orderCarousel || orderId) {
      const current =
        currentOrders && currentOrders.length > 0
          ? currentOrders.find(el => el.id === (orderCarousel || orderId || this.current.id))
          : undefined;
      if (!!current && current.statusId !== 0 && !!this.props.details) {
        if (name === 'origin') {
          result = { latitude: details.lat0, longitude: details.lon0 };
        } else {
          result = [
            details.lat1 ? { latitude: details.lat1, longitude: details.lon1, id: 0 } : undefined,
            details.lat2 ? { latitude: details.lat2, longitude: details.lon2, id: 1 } : undefined,
            details.lat3 ? { latitude: details.lat3, longitude: details.lon3, id: 2 } : undefined,
            details.lat4 ? { latitude: details.lat4, longitude: details.lon4, id: 3 } : undefined,
          ];
        }
      }
    } else {
      const current = currentOrders && currentOrders.length > 0 ? currentOrders[0] : undefined;
      if (current && current.statusId < 6 && current.statusId !== 0 && details) {
        if (name === 'origin') {
          result = { latitude: details.lat0, longitude: details.lon0 };
        } else {
          result = [
            details.lat1 ? { latitude: details.lat1, longitude: details.lon1, id: 0 } : undefined,
            details.lat2 ? { latitude: details.lat2, longitude: details.lon2, id: 1 } : undefined,
            details.lat3 ? { latitude: details.lat3, longitude: details.lon3, id: 2 } : undefined,
            details.lat4 ? { latitude: details.lat4, longitude: details.lon4, id: 3 } : undefined,
          ];
        }
      } else if (name === 'origin') {
        result = addressFrom
          ? { latitude: addressFrom?.lat, longitude: addressFrom?.lon }
          : undefined;
      } else {
        result =
          user.destination && user.destination.length > 0
            ? [
                { latitude: user.destination[0]?.lat, longitude: user.destination[0]?.lon, id: 0 },
                user.destination[1]
                  ? {
                      latitude: user.destination[1]?.lat,
                      longitude: user.destination[1]?.lon,
                      id: 1,
                    }
                  : undefined,
                user.destination[2]
                  ? {
                      latitude: user.destination[2]?.lat,
                      longitude: user.destination[2]?.lon,
                      id: 2,
                    }
                  : undefined,
                user.destination[3]
                  ? {
                      latitude: user.destination[3]?.lat,
                      longitude: user.destination[3]?.lon,
                      id: 3,
                    }
                  : undefined,
              ]
            : undefined;
      }
    }

    return !!result && name === 'destination'
      ? result.filter(el => el && el.latitude !== 0)
      : !!result && name === 'origin'
      ? result
      : undefined;
  };

  getPrices = route => {
    const {
      emptyTrunk,
      tinted,
      conditioner,
      terminal,
      animals,
      childSeat,
      lowLanding,
      receipt,
      showLater,
      laterDate,
      laterTime,
    } = this.state;
    const { clientId, corporateId, lang, settings } = this.props.user;
    const origin = this.getDirectionPoints('origin');
    const destination = this.getDirectionPoints('destination');
    const date = `${moment(laterDate, 'DD.MM.YY').format('DD-MM-YYYY')} ${moment(
      laterTime,
      'HH:mm'
    ).format('HH:mm')}`;
    this.props.socketAPI(socketTypes.ORDER_PRICE, {
      taxiToken: env.app_token,
      lat0: origin ? origin.latitude : null,
      lon0: origin ? origin.longitude : null,
      lat1: destination && destination[0] ? destination[0].latitude : null,
      lon1: destination && destination[0] ? destination[0].longitude : null,
      lat2: destination && destination[1] ? destination[1].latitude : null,
      lon2: destination && destination[1] ? destination[1].longitude : null,
      lat3: destination && destination[2] ? destination[2].latitude : null,
      lon3: destination && destination[2] ? destination[2].longitude : null,
      lat4: destination && destination[3] ? destination[3].latitude : null,
      lon4: destination && destination[3] ? destination[3].longitude : null,
      emptyTrunk,
      tinted,
      conditioner,
      terminal,
      animals,
      childSeat,
      lowLanding,
      receipt,
      dt: showLater ? date : null,
      clientId: this.props.isCorporate && corporateId ? corporateId : clientId || null,
      lang: lang || settings.defaultLang,
    });
    if (route) {
      this.getRoutes();
    }
  };

  getRoutes = car => {
    if (this.state.statusId > 5) return;
    if (!this.getDirectionPoints('destination') && (car !== 3 || car !== 4)) {
      return this.props.clearRoutes();
    }
    const { currentOrders, orderId, details, orderCarousel } = this.props;
    const current =
      currentOrders && currentOrders.length > 0
        ? currentOrders.find(el => el.id === (orderCarousel || orderId || this.state.orderId))
        : undefined;
    const origin = car
      ? { latitude: current?.lat, longitude: current?.lon }
      : this.getDirectionPoints('origin');
    const destination = this.getDirectionPoints('destination');
    let text = `${origin.longitude},${origin.latitude}`;
    if (car === 3 || car === 4) {
      text += `|${details.lon0},${details.lat0}`;
    } else if (destination) {
      destination.forEach(el => {
        const part = `|${el.longitude},${el.latitude}`;
        text += part;
      });
    }
    const data = {
      taxiToken: env.app_token,
      text,
    };
    this.props.socketAPI(socketTypes.ROUTE, data);
  };

  goHome = () => Actions.reset('home');

  handleAddress = () => {
    this.getCoords();
    if (this.props.isCreateTemplate) {
      return this.setState({ holdTemplate: true }, () => Actions.address());
    }
    Actions.address();
  };

  handleDestination = point => {
    if (this.props.isCreateTemplate) {
      return this.setState({ holdTemplate: true }, () =>
        Actions.address({ destScene: true, point })
      );
    }
    Actions.address({ destScene: true, point });
  };

  handleState = (key, value) => this.setState({ [key]: value });

  handleEntranceText = entrance => this.setState({ entrance });

  handleFare = fare => {
    this.props.setOrderOptions({ priceId: fare });
    this.setState({ activeFare: fare });
    if (this.state.paymentTypeId === 2) {
      this.setState({
        paymentTypeId: this.props.user.defaultPaymentType
          ? parseInt(this.props.user.defaultPaymentType, 10)
          : 0,
      });
    }
  };

  // Comment to driver
  handleCommentInput = value => {
    this.setState({ comment: value });
  };

  openComment = () =>
    this.setState(state => ({ commentVisible: true, prevComment: state.comment }));

  handleCommentSave = () => {
    this.props.setOrderOptions({ comments: this.state.comment });
    this.setState({ commentVisible: false, prevComment: '' });
  };

  handleCommentCancel = () =>
    this.setState(state => ({ commentVisible: false, comment: state.prevComment }));

  // Services modal
  onServiceOpenPress = () =>
    this.setState(prevState => ({ addServicesVisible: !prevState.addServicesVisible }));

  handleServicesCancel = () => {
    this.setState(
      prevState => ({
        emptyTrunk: false,
        tinted: false,
        conditioner: false,
        terminal: false,
        animals: false,
        childSeat: false,
        lowLanding: false,
        receipt: false,
        addServicesVisible: !prevState.addServicesVisible,
        additionalPrice: 0,
      }),
      () => this.getPrices()
    );
  };

  handleServicesSave = () => {
    const {
      emptyTrunk,
      tinted,
      conditioner,
      terminal,
      animals,
      childSeat,
      lowLanding,
      receipt,
      additionalPrice,
    } = this.state;
    this.props.setOrderOptions({
      emptyTrunk,
      tinted,
      conditioner,
      terminal,
      animals,
      childSeat,
      lowLanding,
      receipt,
      additionalPrice,
    });
    this.setState({ addServicesVisible: false, friendConfirmVisible: false });
  };

  handleServiceItemChange = key => {
    this.setState(
      prevState => ({ [key]: !prevState[key] }),
      () => this.getPrices()
    );
  };

  handleFriendVisible = () => {
    this.setState(state => ({
      friendConfirmVisible: !state.friendConfirmVisible,
      addServicesVisible: !state.addServicesVisible,
    }));
  };

  // Chat with driver
  handleChatShow = () => {
    this.setState(prevState => ({ showChat: !prevState.showChat, visibleDriver: false }));
  };

  onInputChatChange = value => {
    if (value.trim().length > 0) {
      return this.setState({ textMessage: value.trimLeft(), isMessageDisabled: false });
    }
    this.setState({ textMessage: value.trimLeft(), isMessageDisabled: true });
  };

  sendMessageToDriver = () => {
    const { textMessage } = this.state;
    const { clientId } = this.props.user;
    this.props.socketAPI(socketTypes.SEND_MESSAGE, {
      clientId,
      orderId: this.props.details.id,
      text: textMessage,
    });
    this.setState({ textMessage: '', isMessageDisabled: true });
    const current =
      this.props.currentOrders && this.props.currentOrders.length > 0
        ? this.props.currentOrders.find(el => el.id === this.state.orderId)
        : undefined;
    if (current && current.statusId < 6) {
      this.getOrderChat(current.id);
    }
  };

  handleOverprice = (type = false) => {
    if (type === true) {
      return this.setState(state => ({ additionalPrice: state.additionalPrice + 5 }));
    }
    return this.setState(state => ({
      additionalPrice: state.additionalPrice > 0 ? state.additionalPrice - 5 : 0,
    }));
  };

  openInfo = item => {
    this.props.popup.showPopup({
      CustomComponent: <InfoCard image={item.carImage} item={item} />,
      error: item?.coefficient > 1,
    });
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
  };

  callTaxi = () => {
    if (this.disable) return false;
    this.disable = true;
    const {
      additionalPrice,
      activeFare,
      callLater,
      comment,
      laterDateTime,
      entrance,
      paymentTypeId,
      emptyTrunk,
      tinted,
      conditioner,
      terminal,
      animals,
      childSeat,
      lowLanding,
      receipt,
    } = this.state;
    const { clientId, destination, origin, initialAddress, corporateId, phone } = this.props.user;
    const addressFrom = origin || initialAddress;
    if (!addressFrom || !addressFrom?.lat || !addressFrom?.lon) return;
    const prices = this.props.prices.length ? this.props.prices.find(e => e.id === activeFare) : 0;
    const price = prices ? Math.ceil(prices.price * prices.coefficient) : 0;
    const tripTime = prices ? prices.tripTime : 0;
    const distance = prices ? prices.distance : 0;
    const data = {
      providerId: Platform.select({
        ios: 4,
        android: 3,
      }),
      clientId: this.props.isCorporate && corporateId ? corporateId : clientId,
      dt: callLater ? laterDateTime : null,
      lat0: addressFrom?.lat,
      lon0: addressFrom?.lon,
      lat1: destination && destination[0] ? destination[0]?.lat : null,
      lon1: destination && destination[0] ? destination[0]?.lon : null,
      lat2: destination && destination[1] ? destination[1]?.lat : null,
      lon2: destination && destination[1] ? destination[1]?.lon : null,
      lat3: destination && destination[2] ? destination[2]?.lat : null,
      lon3: destination && destination[2] ? destination[2]?.lon : null,
      lat4: destination && destination[3] ? destination[3]?.lat : null,
      lon4: destination && destination[3] ? destination[3]?.lon : null,
      object0: addressFrom.object,
      street0: addressFrom.street,
      house0: addressFrom.house,
      object1: destination && destination[0] ? destination[0].object : null,
      object2: destination && destination[1] ? destination[1].object : null,
      object3: destination && destination[2] ? destination[2].object : null,
      object4: destination && destination[3] ? destination[3].object : null,
      street1: destination && destination[0] ? destination[0].street : null,
      street2: destination && destination[1] ? destination[1].street : null,
      street3: destination && destination[2] ? destination[2].street : null,
      street4: destination && destination[3] ? destination[3].street : null,
      house1: destination && destination[0] ? destination[0].house : null,
      house2: destination && destination[1] ? destination[1].house : null,
      house3: destination && destination[2] ? destination[2].house : null,
      house4: destination && destination[3] ? destination[3].house : null,
      entrance,
      comments: comment,
      bonusOrder: false,
      priceId: activeFare,
      emptyTrunk,
      lowLanding,
      tinted,
      receipt,
      terminal,
      conditioner,
      animals,
      childSeat,
      paymentTypeId,
      additionalPrice,
      otherPhone:
        this.props.contact.recordID && this.props.contact.phoneNumbers[0]
          ? `${this.props.settings.phonePrefix}${getCorrectPhoneNumber(
              this.props.contact.phoneNumbers[0].number
            )}`
          : null,
      price,
      bonusCount:
        paymentTypeId === 2 && !this.props.settings.allowPartialBonus
          ? price
          : paymentTypeId === 2
          ? this.state.bonusCount
          : null,
      distance,
      tripTime,
      phone,
    };
    this.props.socketAPI(socketTypes.CREATE_ORDER, data);
    const dataLogin = {
      taxiToken: env.app_token,
      phone: this.props.user.phone,
      firebaseToken: this.props.token,
    };
    this.props.socketAPI('LOGON', dataLogin);
  };

  updateOrder = () => {
    this.getRoutes();
    const data = {
      orderId: this.props.details.id,
      clientId: this.props.user.clientId,
      additionalPrice: this.state.additionalPrice,
    };
    this.props.socketAPI(socketTypes.UPDATE_ORDER, data);
    this.setState({
      statusId: 1,
    });
  };

  getCurrentPrice = () => {
    const price = this.props.prices.length
      ? this.props.prices.find(e => e.id === this.state.activeFare)
      : 0;
    if (price) return Math.ceil(price.price * price.coefficient);
    return 0;
  };

  cancelOrder = () => {
    this.props.socketAPI(socketTypes.CANCEL_ORDER, {
      clientId: this.props.user.clientId,
      orderId: this.props.details?.id,
      reasonId: this.state.reasonId,
    });
    this.handleClearDest();
    this.props.setOrderOptions(servicesDefault);
    this.props.chooseContact({});
  };

  toggleModal = () =>
    this.setState(state => ({
      visible: !state.visible,
      visibleCancelType: false,
    }));

  handleRadio = (id, reason) => this.setState({ reasonId: [id], reason });

  handleShowCanceled = () => {
    this.toggleModal();
    this.cancelOrder();
    this.props.popup.showPopup({
      onPress: () => this.goHome(),
      CustomComponent: <CancelInfoModal reason={this.state.reason} />,
    });
  };

  handlePressOtherCar = () => this.setState({ otherCar: true, addServicesVisible: false });

  handleShowCancelDriver = () =>
    this.props.popup.showPopup({
      onPress: () => this.goHome(),
      CustomComponent: <CancelModalDriver reason={strings.cancelReasonDriverAsked} />,
    });

  handleClientExit = () => {
    this.setState({ visibleDriver: false });
    this.props.socketAPI(socketTypes.SEND_MESSAGE_GO_OUT, {
      clientId: this.props.user.clientId,
      orderId: this.props.details.id,
    });
  };

  handleClientLate = () => {
    this.setState(state => ({ showTime: !state.showTime }));
  };

  handleClientLateTime = () => {
    this.setState({ visibleDriver: false });
    this.props.socketAPI(socketTypes.SEND_MESSAGE_LINGER, {
      clientId: this.props.user.clientId,
      orderId: this.props.details.id,
      interval: this.state.lateTime,
    });
  };

  handleChangeTime = condition => {
    if (condition) {
      return this.setState(state => ({ lateTime: state.lateTime + 1 }));
    }
    return this.setState(state => ({
      lateTime: state.lateTime > 1 ? state.lateTime - 1 : 1,
    }));
  };

  handleSaveTemplate = () => {
    const { clientId } = this.props.user;
    this.props.socketAPI(socketTypes.ADD_TRIP_TEMPLATE, {
      clientId,
      orderId: this.props.details?.id,
      name:
        this.state.templateName ||
        (this.props.details
          ? `${strings.templateDefault}${this.props.details.id}`
          : strings.templateDefault),
    });
    this.handleCloseTemplate();
  };

  handleSaveAddress = point => {
    if (this.saveAddressFetch) return;
    this.saveAddressFetch = true;
    const { details, user } = this.props;
    const data = {
      clientId: user.clientId,
      name: details[`object${point}`],
      object: details[`object${point}`],
      street: details[`street${point}`],
      house: details[`house${point}`],
      comments: details.comments,
      lat: details[`lat${point}`],
      lon: details[`lon${point}`],
    };
    this.props.socketAPI(socketTypes.ADD_ADDRESS_TEMPLATE, data);
    setTimeout(() => {
      this.saveAddressFetch = false;
      this.props.socketAPI(socketTypes.GET_ADDRESS_TEMPLATES, {
        clientId: this.props.user.clientId,
      });
    }, 500);
  };

  handleCreateTemplate = () => {
    this.setState({ finish: false, visibleTemplate: true });
  };

  handleCloseTemplate = () => {
    this.setState({ finish: !this.props.isCreateTemplate, visibleTemplate: false });
  };

  onChangeNameTemplate = name => this.setState({ templateName: name });

  toggleCancelTypeModal = () =>
    this.setState(state => ({
      visibleCancelType: !state.visibleCancelType,
    }));

  toggleLaterModal = () =>
    this.setState(
      state => ({ showLater: !state.showLater }),
      () => this.getPrices()
    );

  createCalendarEvent = async id => {
    const authorizeCalendars = async () => {
      const status = await RNCalendarEvents.authorizationStatus();
      if (status !== 'authorized') {
        const getStatus = await RNCalendarEvents.authorizeEventStore();
        if (getStatus === 'authorized') {
          return true;
        }
        return false;
      }
      return true;
    };
    const calendarStatus =
      Platform.OS === 'android' && Platform.Version < 23 ? true : await authorizeCalendars();
    if (calendarStatus) {
      const { laterDate, laterTime } = this.state;
      const calendars = await RNCalendarEvents.findCalendars();
      const findCalendar = calendars?.find(el => el.isPrimary);
      const startDate = moment(`${laterDate} ${laterTime}`, 'DD-MM-YYYY HH:mm').toISOString();
      const endDate = moment(startDate)
        .add(20, 'minutes')
        .toISOString();
      const alarm = moment(startDate)
        .subtract(15, 'minutes')
        .toISOString();
      await RNCalendarEvents.saveEvent(`${strings.calendarPlanned} #${id}`, {
        calendarId: findCalendar?.id,
        startDate,
        endDate,
        alarms: [{ date: Platform.OS === 'ios' ? alarm : 15 }],
      });
    }
  };

  switchAlarm = alarm => {
    this.setState({ alarm });
  };

  handleActiveTime = key => {
    let newDateTime;
    if (key === 60) {
      newDateTime = moment()
        .add(key, 'minutes')
        .format('DD.MM.YY HH:mm');
    }
    if (key === 35) {
      newDateTime = moment()
        .add(key, 'minutes')
        .format('DD.MM.YY HH:mm');
    }
    if (this.state.activeTimeButton === key) {
      newDateTime = moment()
        .add(35, 'minutes')
        .format('DD.MM.YY HH:mm');
    }
    this.setState(
      state => ({
        activeTimeButton: state.activeTimeButton === key ? null : key,
        laterTime: newDateTime.split(' ')[1] || '',
        laterDate: newDateTime.split(' ')[0] || '',
      }),
      () => this.getPrices()
    );
  };

  showDateTimePicker = mode => {
    this.setState({ isDateTimePickerVisible: true, timeMode: mode });
  };

  hideDateTimePicker = () => {
    this.setState({ isDateTimePickerVisible: false });
  };

  handleDatePicked = date => {
    const laterDateTime = moment(date);
    if (this.state.timeMode) {
      const timeToDiff = `${this.state.laterDate} ${laterDateTime.format('HH:mm')}`;
      const laterTime = moment(timeToDiff, 'DD.MM.YY HH:mm').isBefore(moment())
        ? moment()
            .add(35, 'minutes')
            .format('HH:mm')
        : moment(date).format('HH:mm');
      this.setState(
        {
          laterTime,
          activeTimeButton: null,
          isDateTimePickerVisible: false,
        },
        () => this.getPrices()
      );
    } else {
      const isBeforeDate =
        Platform.OS === 'android'
          ? moment(
              `${laterDateTime.format('DD.MM.YY')} ${this.state.laterTime}`,
              'DD.MM.YY HH:mm'
            ).isBefore(moment())
          : moment(laterDateTime.format('DD.MM.YY HH:mm'), 'DD.MM.YY HH:mm').isBefore(moment());
      const laterDate = moment(date).format('DD.MM.YY');
      const laterTime = moment(date).format('HH:mm');
      this.setState(
        isBeforeDate
          ? {
              laterDate,
              laterTime: moment()
                .add(35, 'minutes')
                .format('HH:mm'),
              activeTimeButton: null,
              isDateTimePickerVisible: false,
            }
          : { laterDate, activeTimeButton: null, laterTime, isDateTimePickerVisible: false },
        () => this.getPrices()
      );
    }
  };

  callTaxiLater = () => {
    const { laterDate, laterTime, callLater } = this.state;
    const laterDateTime = `${moment(laterDate, 'DD.MM.YY').format('YYYY-MM-DD')} ${moment(
      laterTime,
      'HH:mm'
    ).format('HH:mm:ss')}`;
    this.setState(
      {
        callLater: true,
        laterDateTime,
        showLater: false,
      },
      () => {
        if (callLater) {
          this.callTaxi();
        } else {
          setTimeout(() => this.callTaxi(), 500);
        }
      }
    );
  };

  // Rating
  toggleRating = () => {
    this.setState(state => ({ showRating: !state.showRating }));
  };

  handleRating = rating => this.setState({ rating });

  handleClearDest = () => {
    if (this.props.user.destination) {
      this.props.setTo(undefined).then(() => this.getPrices());
      this.props.clearRoutes();
      const origin = this.getDirectionPoints('origin');
      this.centerMap(origin, true);
    }
  };

  handleEntranceSave = () => {
    this.props
      .setOrderOptions({ entrance: this.state.entrance })
      .then(() => this.setState({ showEntranceInput: false }));
  };

  showPayment = () => {
    this.setState(state => ({
      showPayment: !state.showPayment,
      showBonusesInput: false,
      errorBonus: false,
    }));
  };

  handlePaymentType = type => {
    const { user, settings } = this.props;
    if (type === 1 && user.creditCards && user.creditCards.length === 0) {
      if (settings.merchantProviderId === 1) {
        Actions.addCreditCard({ scene: 'mapDir' });
      } else if (this.props.settings.merchantProviderId === 2) {
        Linking.openURL(
          `https://${env.app_host}/web/client-payments/asset?clientId=${user.clientId}`
        ).then(() => {
          Actions.reset('home');
        });
      }
    }
    this.setState({
      paymentTypeId: type,
      showPayment: false,
      showBonusesInput: false,
      errorBonus: false,
    });
  };

  login = () => {
    this.props.loginRequest('mapDir').then(() => Actions.signin());
  };

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
    if (this.props.showRating) {
      this.props.showRatingGlobal();
    }
    this.setState({ showBadRating: false, showRating: false, finish: true });
  };

  getServicesCount = (details, names = false) => {
    const { emptyTrunk, tinted, conditioner, terminal, animals, childSeat, lowLanding, receipt } =
      details && this.props.details ? this.props.details : this.state;
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

  handleRideShare = async () => {
    const {
      object0,
      object1,
      object2,
      object3,
      object4,
      street0,
      street1,
      street2,
      street3,
      street4,
      house0,
      house1,
      house2,
      house3,
      house4,
    } = this.props.details;
    const getTo = () => {
      if (object4 || object3 || object2 || object1) {
        return ` ${strings.tripTo.toLowerCase()} ${object4 || object3 || object2 || object1}`;
      }
      if (street4 && house4) {
        return ` ${strings.tripTo.toLowerCase()} ${street4} ${house4}`;
      }
      if (street3 && house3) {
        return ` ${strings.tripTo.toLowerCase()} ${street3} ${house3}`;
      }
      if (street2 && house2) {
        return ` ${strings.tripTo.toLowerCase()} ${street2} ${house2}`;
      }
      return ` ${strings.tripTo.toLowerCase()} ${street1} ${house1}`;
    };
    const from = object0 || `${street0} ${house0}`;
    const to = street1 && house1 ? getTo() : '';

    const link = `
      AppStore: https://apps.apple.com/us/app/id${env.package_id},
      PlayMarket: https://play.google.com/store/apps/details?id=${env.package_name_android}
    `;

    try {
      const shareData = `${strings.shareTrip1} ${env.app_name} - ${link}, ${strings.shareTrip2} ${from}${to}`;
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

  // Bonuses
  handleShowBonusesInput = () => {
    if (this.props.settings.allowPartialBonus) {
      this.setState(state => ({
        showBonusesInput: !state.showBonusesInput,
        errorBonus: false,
      }));
    } else this.handlePaymentType(2);
  };

  handleInputBonus = value => {
    if (value.match(/^[0-9]*?$/) === null || value[0] === '0') {
      return this.setState({ errorBonus: 1 });
    }
    if (value > this.props.settings.maxBonusCount) {
      return this.setState({ errorBonus: 2, bonusCount: '' });
    }
    if (value > this.props.user.balance) {
      return this.setState({ errorBonus: 3, bonusCount: '' });
    }
    if (value >= this.getCurrentPrice()) {
      return this.setState({ bonusCount: JSON.stringify(this.getCurrentPrice()) });
    }
    return this.setState({ bonusCount: value, errorBonus: false });
  };

  handleBonuses = () => {
    this.handlePaymentType(2);
  };

  getCardLastNumbers = () => {
    const { creditCards, defaultCreditCard } = this.props.user;
    const { settings } = this.props;
    return creditCards.length === 0
      ? undefined
      : defaultCreditCard
      ? `*${
          defaultCreditCard.maskedCard.split(
            settings.merchantProviderId === 1 ? 'XXXXXX' : '******'
          )[1]
        }`
      : undefined;
  };

  startNewOrder = () => {
    Promise.all([
      this.props.setOrderOptions(servicesDefault),
      this.props.chooseContact({}),
      this.props.clearDetails(),
      this.props.setTo(undefined),
      this.props.clearRoutes(),
      Actions.reset('mapDir'),
    ]);
  };

  handleFriendChoose = () => {
    this.setState(state => ({ servicesFriends: !state.servicesFriends, addNumber: false }));
  };

  handleAddNumber = () => {
    this.setState(state => ({ addNumber: !state.addNumber, servicesFriends: false }));
  };

  handleDeleteFriend = () => {
    this.props.chooseContact({});
  };

  cancelSession = () => {
    Promise.all([
      this.props.setOrderOptions(servicesDefault),
      this.props.chooseContact({}),
      this.handleClearDest(),
      Actions.reset('home'),
    ]);
  };

  handleMultiModal = () => {
    this.setState(state => ({
      showMultiPoints: !state.showMultiPoints,
    }));
  };

  getCoordinateTo = point => {
    const { coordinates } = this.state;
    const destination = this.getDirectionPoints('destination');

    const coordTo =
      destination && destination[point]
        ? {
            ...destination[point],
            longitudeDelta: coordinates.longitudeDelta,
            latitudeDelta: coordinates.latitudeDelta,
          }
        : coordinates;
    return coordTo;
  };

  handlePointChange = data => {
    this.props.setTo(data).then(() => {
      this.getPrices(1);
    });
  };

  handleDeletePoint = id => {
    const { destination } = this.props.user;
    let filtered = destination.filter(el => {
      let isFilter = true;
      if (el.templateId) {
        isFilter = el.templateId !== id;
      } else {
        isFilter = el.id !== id;
      }
      return isFilter;
    });
    if (filtered && filtered.length === 0) {
      filtered = undefined;
      this.handleMultiModal();
    }
    this.props.setTo(filtered).then(() => {
      if (!filtered) {
        this.setState({ duration: 0 });
      }
      this.getPrices(1);
    });
  };

  checkFormComlpetion = () => {
    if (this.props.user.clientId && !this.state.entrance && !this.state.comment) {
      return this.setState({ formWarnVisible: true, isInputs: true });
    }
    if (this.props.user.clientId && !this.props.user.destination) {
      return this.setState({ formWarnVisible: true, isInputs: false });
    }
    if (this.props.user.clientId && !!this.props.user.destination) {
      this.setState({ formWarnVisible: false, isInputs: false });
      return this.callTaxi();
    }
    return this.login();
  };

  centerMap = (coords, isToRegion) => {
    if (isToRegion && this.map && coords) {
      const region = {
        ...coords,
        latitudeDelta: constants.LATITUDE_DELTA,
        longitudeDelta: constants.LONGITUDE_DELTA,
      };
      return this.map.animateToRegion(region, 1000);
    }
    if (this.map && coords) {
      this.map.animateCamera({ center: { ...coords } }, { duration: 1000 });
    }
  };

  getDetailsRoute = () => {
    const { details } = this.props;
    if (details && details.route) {
      const parsedRoute = JSON.parse(details.route);
      const result = getDataFromRoutes(parsedRoute.features);
      return result;
    }
  };

  handleExpandCorporate = () => {
    this.setState(state => ({ isExpandCorporate: !state.isExpandCorporate }));
  };

  handleCorporate = async id => {
    let isInCorporate;
    let paymentTypeChange;
    if (id === 1) {
      isInCorporate =
        id === 1 && this.props.user.corporatePaymentTypes?.length >= 1
          ? this.props.user.corporatePaymentTypes.find(el => el || el === 0)
          : false;
      paymentTypeChange = this.props.user.corporatePaymentTypes?.find(el => el || el === 0);
    } else {
      paymentTypeChange = 0;
      isInCorporate = false;
    }
    this.props.switchCorporate(id).then(() => {
      this.setState(
        {
          isCorporate: id,
          isExpandCorporate: false,
          paymentsBlock: isInCorporate !== false,
          paymentTypeId: paymentTypeChange,
        },
        () => this.getPrices(1)
      );
    });
    return Promise.resolve();
  };

  handleCorporateModal = id => {
    this.props.popup.showPopup({
      header: `${this.props.isCorporate > 0 ? strings.standartConfirm : strings.corporateConfirm}
      `,
      onPressRight: () => this.handleCorporate(id),
      onPressLeft: () => this.handleExpandCorporate(),
      buttons: true,
    });
  };

  createTemplate = (modal = false) => {
    if (this.disable && !this.props.isCreateTemplate) return false;
    this.disable = true;
    const {
      activeFare,
      comment,
      entrance,
      paymentTypeId,
      emptyTrunk,
      tinted,
      conditioner,
      terminal,
      animals,
      childSeat,
      lowLanding,
      receipt,
      templateName,
    } = this.state;
    const { clientId, destination, origin, initialAddress } = this.props.user;
    const addressFrom = origin || initialAddress;
    if (!addressFrom || !addressFrom?.lat || !addressFrom.lon) return;
    const data = {
      clientId,
      name: templateName || getTemplateName(this.props.templates, strings.templateDefault),
      lat0: addressFrom?.lat,
      lon0: addressFrom?.lon,
      lat1: destination && destination[0] ? destination[0]?.lat : null,
      lon1: destination && destination[0] ? destination[0]?.lon : null,
      lat2: destination && destination[1] ? destination[1]?.lat : null,
      lon2: destination && destination[1] ? destination[1]?.lon : null,
      lat3: destination && destination[2] ? destination[2]?.lat : null,
      lon3: destination && destination[2] ? destination[2]?.lon : null,
      lat4: destination && destination[3] ? destination[3]?.lat : null,
      lon4: destination && destination[3] ? destination[3]?.lon : null,
      object0: addressFrom.object,
      street0: addressFrom.street,
      house0: addressFrom.house,
      object1: destination && destination[0] ? destination[0].object : null,
      object2: destination && destination[1] ? destination[1].object : null,
      object3: destination && destination[2] ? destination[2].object : null,
      object4: destination && destination[3] ? destination[3].object : null,
      street1: destination && destination[0] ? destination[0].street : null,
      street2: destination && destination[1] ? destination[1].street : null,
      street3: destination && destination[2] ? destination[2].street : null,
      street4: destination && destination[3] ? destination[3].street : null,
      house1: destination && destination[0] ? destination[0].house : null,
      house2: destination && destination[1] ? destination[1].house : null,
      house3: destination && destination[2] ? destination[2].house : null,
      house4: destination && destination[3] ? destination[3].house : null,
      entrance,
      comments: comment,
      priceId: activeFare,
      emptyTrunk,
      lowLanding,
      tinted,
      receipt,
      terminal,
      conditioner,
      animals,
      childSeat,
      paymentTypeId,
    };
    if (!modal) {
      this.setState({ visibleTemplate: false, finish: false }, () => {
        this.props.socketAPI(socketTypes.CREATE_TRIP_TEMPLATE, data);
        this.props.socketAPI(socketTypes.GET_TRIP_TEMPLATES, { clientId });
        this.props.createTemplateProcess().then(() => {
          this.handleClearDest();
          Actions.pop();
        });
      });
    } else {
      this.setState({ visibleTemplate: true, templateData: data });
    }
  };

  render() {
    const {
      activeFare,
      activeTimeButton,
      additionalPrice,
      addNumber,
      addServicesVisible,
      alarm,
      animals,
      bonusCount,
      childSeat,
      comment,
      commentVisible,
      conditioner,
      coordinates,
      defaultPrice,
      emptyTrunk,
      entrance,
      errorBonus,
      finish,
      formWarnVisible,
      friendConfirmVisible,
      isDateTimePickerVisible,
      isExpandCorporate,
      isInputs,
      isMessageDisabled,
      laterDate,
      laterTime,
      lateTime,
      lowLanding,
      otherCar,
      paymentsBlock,
      paymentTypeId,
      rating,
      ratingComment,
      ratingReasonId,
      reasonId,
      receipt,
      servicesFriends,
      showBadRating,
      showBonusesInput,
      showChat,
      showEntranceInput,
      showLater,
      showMultiPoints,
      showPayment,
      showRating,
      showTime,
      statusId,
      templateName,
      templateData,
      terminal,
      textMessage,
      timeMode,
      tinted,
      visible,
      visibleCancelType,
      visibleDriver,
      visibleTemplate,
    } = this.state;

    const services = {
      emptyTrunk,
      tinted,
      conditioner,
      terminal,
      animals,
      childSeat,
      lowLanding,
      receipt,
    };

    const {
      additionalFares,
      contact,
      currentOrders,
      details,
      dialog,
      drivers,
      isCorporate,
      isCreateTemplate,
      orderCarousel,
      orderId,
      prices,
      routes,
      savedAddresses,
      settings,
      user,
    } = this.props;

    const addressFrom = user.origin || user.initialAddress;
    const origin = this.getDirectionPoints('origin');
    const destination = this.getDirectionPoints('destination');
    const disabledDestination =
      settings.allowCreateOrderWithoutSecondAddress === false && !destination;

    const current =
      currentOrders && currentOrders.length > 0
        ? currentOrders.find(el => el.id === (orderCarousel || orderId || this.state.orderId))
        : undefined;

    const carPoint = {
      latitude: currentOrders && current ? current?.lat : coordinates.latitude,
      longitude: currentOrders && current ? current?.lon : coordinates.longitude,
      longitudeDelta: coordinates.longitudeDelta,
      latitudeDelta: coordinates.latitudeDelta,
    };

    const addressOrigin = addressFrom?.object
      ? `${addressFrom?.object}, ${addressFrom?.street}, ${addressFrom?.house || 1}`
      : addressFrom?.house
      ? `${addressFrom?.street}, ${addressFrom?.house}`
      : addressFrom?.street
      ? addressFrom.street
      : '';

    const addressDestination =
      user.destination && user.destination[0] && user.destination[0].object
        ? `${user.destination[0].object}, ${user.destination[0].street}, ${user.destination[0]
            .house || 1}`
        : user.destination && user.destination[0] && user.destination[0].house
        ? `${user.destination[0].street}, ${user.destination[0].house}`
        : user.destination && user.destination[0] && user.destination[0].street
        ? user.destination[0].street
        : '';

    const coordinateFrom = this.getDirectionPoints('origin')
      ? {
          ...this.getDirectionPoints('origin'),
          longitudeDelta: coordinates.longitudeDelta,
          latitudeDelta: coordinates.latitudeDelta,
        }
      : coordinates;
    const initAddress = this.props.user.initialAddress
      ? {
          latitude: this.props.user.initialAddress?.lat,
          longitude: this.props.user.initialAddress?.lon,
        }
      : coordinates;

    const time = this.state.time > 0 ? this.state.time / 60 : 0;
    const orders = currentOrders?.filter(el => el.statusId > 0 && el.statusId < 6);
    return (
      <View style={style.rootContainer}>
        <View style={style.mapWrapper}>
          <View style={style.container}>
            <UserMarker style={{ width: 0, height: 0 }} />
            <UserMarker destScene style={{ width: 0, height: 0 }} />
            <TaxiMarker style={{ width: 0, height: 0 }} />
            <Pins style={{ width: 1, height: 1 }} />
            <ActiveTripsBar />
            {(statusId === 3 || statusId === 4) && (
              <View style={{ position: 'absolute', bottom: 94, left: 16, zIndex: 500 }}>
                <Button
                  buttonStyle={{
                    height: 36,
                    width: 36,
                    backgroundColor: colors.white,
                    justifyContent: 'center',
                  }}
                  icon="car"
                  mci
                  onPress={() => this.centerMap(carPoint, true)}
                  colorIcon={colors.black}
                />
              </View>
            )}
            {(statusId === 3 || statusId === 4) && (
              <View style={{ position: 'absolute', bottom: 46, left: 16, zIndex: 500 }}>
                <Button
                  buttonStyle={{
                    height: 36,
                    width: 36,
                    backgroundColor: colors.white,
                    justifyContent: 'center',
                  }}
                  icon="geolocation"
                  onPress={() => this.centerMap(coordinateFrom, true)}
                  colorIcon={colors.black}
                />
              </View>
            )}
            <TaxiMarker free />
            {statusId !== 6 && (
              <MapView
                ref={ref => (this.map = ref)}
                initialRegion={coordinateFrom}
                style={style.map}
                scrollEnabled
                zoomEnabled
                pitchEnabled={false}
                rotateEnabled={false}
                cacheEnabled={false}
                customMapStyle={mapConfig}
                toolbarEnabled={false}
                provider="google"
              >
                {(statusId === 0 || statusId === 5) &&
                !!destination &&
                !!destination[destination.length - 1] &&
                destination[destination.length - 1].latitude !== 0 &&
                destination[destination.length - 1].longitude !== 0 &&
                (routes?.length || details) ? (
                  <Polyline
                    coordinates={
                      statusId === 5
                        ? this.getDetailsRoute().routes || [coordinateFrom]
                        : routes?.length
                        ? routes
                        : [coordinateFrom]
                    }
                    strokeWidth={statusId === 5 ? 3 : 7}
                    strokeColor={colors.blue}
                    onLayout={() => {
                      this.getRoutes();
                      if (this.map) {
                        this.map.fitToCoordinates([origin, ...destination], {
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
                ) : null}

                {(statusId === 3 || statusId === 4 || statusId === 5) &&
                ((!!destination &&
                  !!destination[destination.length - 1] &&
                  destination[destination.length - 1].latitude !== 0 &&
                  destination[destination.length - 1].longitude !== 0) ||
                  (destination?.length === 0 && (statusId === 3 || statusId === 4))) &&
                routes?.length ? (
                  <Polyline
                    coordinates={routes?.length ? routes : [coordinateFrom]}
                    strokeWidth={7}
                    strokeColor={statusId === 3 || statusId === 4 ? colors.darkGrey : colors.blue}
                    onLayout={() => {
                      this.getRoutes(statusId);
                      if (this.map) {
                        const fit =
                          (statusId === 3 || statusId === 4) &&
                          carPoint.latitude &&
                          carPoint.longitude
                            ? [carPoint, origin]
                            : [coordinateFrom, ...destination];
                        this.map.fitToCoordinates(fit, {
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
                ) : null}

                {statusId !== 1 && statusId !== 2 && statusId !== 0 ? (
                  <Marker coordinate={coordinateFrom} tracksViewChanges={false}>
                    <UserMarker
                      duration={
                        statusId === 5 || statusId > 6
                          ? this.props.time / 60
                          : statusId === 3
                          ? current?.time / 60
                          : time
                      }
                    />
                  </Marker>
                ) : null}

                {statusId === 0 ? (
                  <Marker coordinate={coordinateFrom} tracksViewChanges={false}>
                    <Pins style={{ width: 36, height: 46 }} />
                  </Marker>
                ) : null}

                {(statusId === 0 || statusId === 3 || statusId === 4) &&
                getDistanceFromLatLonInKm(
                  initAddress?.latitude,
                  initAddress?.longitude,
                  coordinateFrom?.latitude,
                  coordinateFrom?.longitude
                ) < 0.5 &&
                getDistanceFromLatLonInKm(
                  initAddress?.latitude,
                  initAddress?.longitude,
                  coordinateFrom?.latitude,
                  coordinateFrom?.longitude
                ) > 0.03 ? (
                  <Marker coordinate={initAddress} tracksViewChanges={false}>
                    <Icon mci name="human-male" size={32} />
                  </Marker>
                ) : null}
                {(statusId === 0 || statusId === 3 || statusId === 4) &&
                getDistanceFromLatLonInKm(
                  initAddress?.latitude,
                  initAddress?.longitude,
                  coordinateFrom?.latitude,
                  coordinateFrom?.longitude
                ) < 0.5 &&
                getDistanceFromLatLonInKm(
                  initAddress?.latitude,
                  initAddress?.longitude,
                  coordinateFrom?.latitude,
                  coordinateFrom?.longitude
                ) > 0.03 ? (
                  <Polyline
                    coordinates={[initAddress, coordinateFrom]}
                    strokeColor={colors.violet}
                    strokeWidth={2}
                    lineDashPattern={[10, 5]}
                    onLayout={() => {
                      const fit = destination
                        ? [initAddress, coordinateFrom, ...destination]
                        : [initAddress, coordinateFrom];
                      if (this.map) {
                        this.map.fitToCoordinates(fit, {
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
                    }}
                  />
                ) : null}

                {statusId !== 1 &&
                statusId !== 2 &&
                statusId < 6 &&
                !!destination &&
                !!destination[destination.length - 1]
                  ? destination.map((el, index) => (
                      <Marker
                        coordinate={this.getCoordinateTo(index)}
                        tracksViewChanges={false}
                        key={el.templateId || el.id}
                        pinColor={index === 0 ? 'red' : index === 1 ? 'blue' : 'green'}
                      >
                        <UserMarker destScene />
                      </Marker>
                    ))
                  : null}

                {statusId > 2 && currentOrders && currentOrders.length > 0 && statusId < 6 ? (
                  <Marker
                    coordinate={carPoint}
                    tracksViewChanges={false}
                    rotation={current ? current.bearing : 0}
                    onLayout={() => this.forceUpdate()}
                  >
                    <TaxiMarker free />
                  </Marker>
                ) : null}

                {(statusId === 1 || statusId === 2) &&
                  drivers
                    .filter(el => el.isFree)
                    .map(el => (
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
              </MapView>
            )}
            {(statusId === 1 || statusId === 2) && (
              <Radar
                onLayout={() => {
                  this.props.socketAPI(socketTypes.GET_DRIVERS_ON_MAP, { clientId: user.clientId });
                  this.centerMap(origin, true);
                }}
              />
            )}
          </View>
        </View>

        {/* ****** CREATE ORDER COMPONENTS ****** */}

        {(statusId === 0 ||
          (statusId === 6 && !finish && !visibleTemplate && !this.props.showRating) ||
          statusId > 7) &&
        !showMultiPoints &&
        !otherCar ? (
          <View style={[style.bottomNavigationView]}>
            <DirectionForm
              currentAddress={addressOrigin}
              destination={addressDestination}
              onPressCurrent={this.handleAddress}
              onPressDestination={
                !!user.destination && user.destination.length < 5 && user.destination.length > 1
                  ? this.handleMultiModal
                  : () => this.handleDestination(undefined)
              }
              onEntranceInput={() => this.handleState('showEntranceInput', true)}
              onClearDestination={this.handleClearDest}
              entrance={entrance}
              onMultiPress={() =>
                this.handleDestination(user.destination ? user.destination.length : undefined)
              }
              multiButton={!!user.destination && user.destination.length < 4}
              multiAddress={
                user.destination && user.destination.length > 1
                  ? user.destination.length
                  : undefined
              }
            />
            <View style={style.slider}>
              <CarList
                fares={prices}
                activeFare={activeFare}
                onPressFare={this.handleFare}
                openInfo={this.openInfo}
                dest={!!user.destination}
                additionalPrice={additionalPrice}
              />
            </View>
            <BottomControls
              additionalServices={this.getServicesCount()}
              onCallLater={this.toggleLaterModal}
              laterButton={settings.allowCreateAdvanceOrder && !!user.clientId}
              onCallNow={this.checkFormComlpetion}
              onCommentPress={this.openComment}
              onServiceOpenPress={user.clientId ? this.onServiceOpenPress : this.login}
              isComment={!!comment}
              onPaymentPress={user.clientId ? this.showPayment : this.login}
              paymentTypeId={paymentTypeId}
              bonuses={bonusCount}
              cardNumber={this.getCardLastNumbers()}
              disabled={
                !addressFrom || !addressFrom?.lon || !addressFrom?.lat || disabledDestination
              }
              block={paymentsBlock}
              isCreateTemplate={isCreateTemplate}
              onCreateTemplate={() => this.createTemplate(true)}
              isFriend={contact.phoneNumbers ? 1 : 0}
              isAddPrice={additionalPrice ? 1 : 0}
            />
          </View>
        ) : (statusId === 0 ||
            (statusId === 6 && !finish && !visibleTemplate && !this.props.showRating) ||
            statusId > 7) &&
          showMultiPoints ? (
          <MultiPoints
            visible={showMultiPoints}
            onMultiPress={this.handleMultiModal}
            onDrag={this.handlePointChange}
            onDelete={this.handleDeletePoint}
          />
        ) : null}

        {/* ****** SWIPER COMPONENTS ****** */}

        {orders && orders.length > 1 && statusId > 0 && statusId < 6 ? (
          <View>
            <View
              style={{
                position: 'absolute',
                flexDirection: 'row',
                top: -16,
                left: 0,
                right: 0,
                justifyContent: 'center',
              }}
            >
              {orders &&
                orders.map(el => {
                  return (
                    <View
                      key={el.id}
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: 4,
                        backgroundColor:
                          el.id === current?.id || el.id === orders[0]
                            ? colors.orange
                            : colors.grey,
                        marginRight: 8,
                        borderWidth: 1,
                        borderColor: colors.darkGrey,
                      }}
                    />
                  );
                })}
            </View>
            <Carousel
              ref={c => {
                this.carousel = c;
              }}
              data={orders}
              enableSnap
              scrollEnabled={!this.scrollEnabled}
              loop
              sliderWidth={Dimension.ScreenWidth()}
              itemWidth={Dimension.ScreenWidth() - 24}
              layoutCardOffset={9}
              containerCustomStyle={
                statusId === 5 ? { position: 'absolute', bottom: 1 } : undefined
              }
              onSnapToItem={i => {
                this.scrollEnabled = true;
                const currentId = orders?.[i]?.id;
                const currentRide =
                  currentOrders.length > 0
                    ? currentOrders.find(el => el.id === currentId)
                    : undefined;
                this.getOrderDetails(currentId);
                this.getOrderChat(currentId);
                this.current = currentRide;
                this.props.setOrderId(currentId);
                this.setState({
                  statusId: currentRide ? currentRide.statusId : 0,
                  time:
                    currentRide && currentRide.statusId === 3 && currentRide.time > 0
                      ? currentRide.time
                      : 0,
                  visibleDriver: !!(currentRide && currentRide.statusId === 4),
                  orderId: currentId,
                  currentRide,
                });
              }}
              renderItem={() => {
                return (
                  <View>
                    {(statusId === 1 || statusId === 2) && (
                      <SearchTaxi
                        order={details || {}}
                        additionalServices={this.getServicesCount()}
                        lang={user.lang || user.settings.defaultLang}
                      />
                    )}

                    {(statusId === 3 || statusId === 4) && (
                      <DriverInfo
                        onChatOpenPress={this.handleChatShow}
                        order={details || {}}
                        time={current?.time > 0 ? current?.time / 60 : 0}
                        handleRideShare={this.handleRideShare}
                      />
                    )}

                    {statusId === 5 && (
                      <View style={{ height: this.rideInfoHeight }}>
                        <RideInfo
                          distance={Math.ceil(this.props.distance / 1000)}
                          duration={moment()
                            .add(this.props.time, 'seconds')
                            .format('HH:mm')}
                          handleRideShare={this.handleRideShare}
                          order={details || {}}
                          onLayout={e => (this.rideInfoHeight = e.nativeEvent.layout.height + 32)}
                        />
                      </View>
                    )}
                  </View>
                );
              }}
            />
          </View>
        ) : (
          <View>
            {(statusId === 1 || statusId === 2) && (
              <SearchTaxi
                order={details || {}}
                additionalServices={this.getServicesCount()}
                lang={user.lang || user.settings.defaultLang}
              />
            )}

            {(statusId === 3 || statusId === 4) && (
              <DriverInfo
                onChatOpenPress={this.handleChatShow}
                order={details || {}}
                time={current?.time > 0 ? current?.time / 60 : 0}
                handleRideShare={this.handleRideShare}
              />
            )}

            {statusId === 5 && (
              <RideInfo
                distance={Math.ceil(this.props.distance / 1000)}
                duration={moment()
                  .add(this.props.time, 'seconds')
                  .format('HH:mm')}
                handleRideShare={this.handleRideShare}
                order={details || {}}
              />
            )}
          </View>
        )}

        {/* ****** NO TAXI COMPONENTS ****** */}

        {statusId === 7 && !otherCar && (
          <NoTaxi
            onPressOtherCar={this.handlePressOtherCar}
            onPressOtherClass={() => {}}
            onPressOthers={() => this.handleState('statusId', 0)}
            onWait={this.updateOrder}
          />
        )}

        {otherCar && (
          <OverPrice
            additionalPrice={additionalPrice}
            onMinus={this.handleOverprice}
            onPlus={() => this.handleOverprice(true)}
            onRecall={
              statusId === 7
                ? this.updateOrder
                : () => {
                    this.setState({ otherCar: false, addServicesVisible: true });
                  }
            }
            orderPrice={details ? Math.ceil(details.calculatedPrice) : this.getCurrentPrice()}
            disabled={!additionalPrice && statusId === 7}
          />
        )}

        {/* ****** HEADER COMPONENTS ****** */}

        <Header
          onBackPress={
            otherCar
              ? () =>
                  this.setState({
                    otherCar: false,
                    additionalPrice,
                    addServicesVisible: statusId !== 7,
                  })
              : !otherCar && statusId === 7
              ? () => this.setState({ statusId: 0 })
              : isCreateTemplate
              ? () => {
                  this.props.createTemplateProcess().then(() => {
                    this.handleClearDest();
                    Actions.pop();
                  });
                }
              : this.goHome
          }
          onTypePress={() => {}}
          onCancelSession={this.cancelSession}
          cancelIcon={statusId === 7 && !otherCar}
          onPressCancel={this.toggleModal}
          buttons={statusId < 5 && statusId !== 0}
          moreTaxi={statusId < 6 && statusId !== 0}
          type={statusId === 0}
          onNewTaxi={this.startNewOrder}
        />

        {statusId === 0 && !!user.corporateId && !isCreateTemplate && (
          <CorporateSwitch
            isExpand={isExpandCorporate}
            onExpand={this.handleExpandCorporate}
            onChoose={this.handleCorporate}
            value={isCorporate}
            onModal={this.handleCorporateModal}
          />
        )}

        {/* ****** MODALS ****** */}

        {statusId === 4 && visibleDriver && (
          <DriverArrive
            visible={visibleDriver}
            onRight={this.handleClientExit}
            onLeft={this.handleClientLate}
            order={details || {}}
            onClose={() => this.handleState('visibleDriver', false)}
            onChatOpenPress={this.handleChatShow}
            onChooseLateTime={this.handleClientLateTime}
            showTime={showTime}
            onChangeTime={this.handleChangeTime}
            lateTime={lateTime}
          />
        )}

        {!isCreateTemplate && finish && (
          <RideSuccess
            visible={finish}
            onEndRide={this.goHome}
            onSaveAddress={this.handleSaveAddress}
            onSaveTemplate={this.handleCreateTemplate}
            order={details || {}}
            templates={savedAddresses}
          />
        )}

        {!isCreateTemplate && visible && (
          <CancelModal
            active={reasonId[0]}
            onLeft={this.toggleModal}
            onPressRadio={this.handleRadio}
            onRight={this.handleShowCanceled}
            visible={visible}
          />
        )}

        {!isCreateTemplate && formWarnVisible && (
          <FormWarningModal
            visible={formWarnVisible}
            isInputs={isInputs}
            onePoint={user.clientId && !user.destination}
            onRight={() => this.setState({ formWarnVisible: false }, () => this.callTaxi())}
            onLeft={() => this.setState({ formWarnVisible: false })}
            onInputsConfirm={() =>
              entrance || comment
                ? this.checkFormComlpetion()
                : !user.destination
                ? this.setState({ isInputs: false })
                : this.setState({ formWarnVisible: false }, () => this.callTaxi())
            }
            onChangeComment={this.handleCommentInput}
            onEntranceInput={value => this.handleState('entrance', value)}
            commentValue={comment}
            entranceValue={entrance}
          />
        )}

        {commentVisible && (
          <CommentForm
            visible={commentVisible}
            onChangeText={this.handleCommentInput}
            onLeft={this.handleCommentCancel}
            onRight={this.handleCommentSave}
            value={comment}
          />
        )}

        {addServicesVisible && (
          <AdditionalServicesModal
            visible={addServicesVisible}
            onLeft={this.handleServicesCancel}
            onRight={contact.phoneNumbers ? this.handleFriendVisible : this.handleServicesSave}
            onPress={this.handleServiceItemChange}
            addServices={services}
            defaultPrice={defaultPrice}
            carPrice={
              prices.length && !!prices.find(e => e.id === activeFare)
                ? prices.find(e => e.id === activeFare).price *
                  prices.find(e => e.id === activeFare).coefficient
                : 0
            }
            additionalFares={additionalFares}
            onFriendPress={this.handleFriendChoose}
            friend={contact}
            showFriends={servicesFriends}
            addNumber={addNumber}
            showNumberForm={this.handleAddNumber}
            onBackFriends={this.handleFriendChoose}
            onDeleteFriend={this.handleDeleteFriend}
            onAddPrice={this.handlePressOtherCar}
            additionalPrice={additionalPrice}
          />
        )}

        {!isCreateTemplate && showChat && (
          <ChatWithDriverModal
            onInputChatChange={this.onInputChatChange}
            visible={showChat}
            onClose={this.handleChatShow}
            sendMessage={this.sendMessageToDriver}
            dialog={dialog}
            isMessageDisabled={isMessageDisabled}
            textMessage={textMessage}
            order={details || {}}
            userpic={user.base64Photo}
          />
        )}

        {visibleTemplate && (
          <TemplateModal
            order={details || {}}
            onSave={isCreateTemplate ? () => this.createTemplate(false) : this.handleSaveTemplate}
            onBack={this.handleCloseTemplate}
            visible={visibleTemplate}
            name={templateName}
            onChangeName={this.onChangeNameTemplate}
            additionalServices={this.getServicesCount(true)}
            isCreateTemplate={isCreateTemplate}
            servicesText={this.getServicesCount(false, true)}
            templateData={templateData}
            fareName={prices?.find(el => el.id === activeFare)}
          />
        )}

        {!isCreateTemplate && visibleCancelType && (
          <CancelType
            onCancelAuto={() => {}}
            onCancelRide={this.toggleModal}
            onClose={this.toggleCancelTypeModal}
            visible={visibleCancelType}
          />
        )}

        {showLater && (
          <LaterModal
            onLeft={this.toggleLaterModal}
            onRight={this.callTaxiLater}
            visible={showLater}
            date={laterDate}
            time={laterTime}
            price={this.getCurrentPrice()}
            onSwitchAlarm={this.switchAlarm}
            alarm={alarm}
            onPresetTimePress={this.handleActiveTime}
            activeTimeButton={activeTimeButton}
            onDateTimePress={this.showDateTimePicker}
            showDatePicker={isDateTimePickerVisible}
            onConfirm={this.handleDatePicked}
            onCancel={this.hideDateTimePicker}
            timeMode={timeMode}
            laterTime={laterTime}
            laterDate={laterDate}
            disabled={!addressFrom || !addressFrom?.lon || !addressFrom?.lat || disabledDestination}
          />
        )}

        {!isCreateTemplate && showRating && (
          <RateTrip
            visible={showRating}
            onSend={
              rating < 3
                ? () => this.setState({ showBadRating: true, showRating: false })
                : this.sendRating
            }
            onFinish={() => {
              if (this.props.showRating) {
                this.props.showRatingGlobal();
              }
              this.setState({ showRating: false, finish: true });
            }}
            onChangeRating={this.handleRating}
            rating={rating}
            comment={ratingComment}
            onChangeComment={text => this.setState({ ratingComment: text })}
            order={details || {}}
          />
        )}

        {!isCreateTemplate && showBadRating && (
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

        {statusId === 0 && showEntranceInput && (
          <InputModal
            visible={showEntranceInput}
            onChangeText={this.handleEntranceText}
            value={entrance}
            onSubmit={this.handleEntranceSave}
            keyboardType="phone-pad"
            placeholder={strings.approach}
            maxLength={3}
          />
        )}

        {statusId === 0 && showPayment && (
          <Payment
            visible={showPayment}
            onClose={this.showPayment}
            onChooseType={this.handlePaymentType}
            bonuses={user.balance ? user.balance.toFixed(2) : 0}
            maxBonusCount={settings.maxBonusCount}
            allowPartialBonus={settings.allowPartialBonus}
            destPoint={!!user.destination}
            tripCost={this.getCurrentPrice()}
            cardNumber={this.getCardLastNumbers()}
            onShowInput={this.handleShowBonusesInput}
            onBonusesChoose={this.handleBonuses}
            onChangeText={this.handleInputBonus}
            showInput={showBonusesInput}
            bonusCount={bonusCount}
            error={!bonusCount || errorBonus}
            showCard={!!settings.merchantProviderId}
            corporateTypes={user.corporatePaymentTypes}
            paymentTypes={user.paymentTypes}
            isCorporate={isCorporate}
          />
        )}

        {friendConfirmVisible && (
          <FriendConfirmModal
            visible={friendConfirmVisible}
            onClose={this.handleFriendVisible}
            onConfirm={this.handleServicesSave}
            friend={contact}
          />
        )}

        <Preloader
          loading={this.scrollEnabled}
          fullScreen
          stylePreloaderFullscreen={{ backgroundColor: colors.modal }}
        />
      </View>
    );
  }
}

export default connect(
  ({ user, popup, orders, data, auth, errors, tech }) => ({
    user,
    popup,
    order: orders.currentOrder,
    currentOrders: orders.currentOrders,
    prices: orders.prices,
    details: orders.details,
    additionalFares: data.additionalFares,
    dialog: data.dialog,
    token: auth.token,
    messageFromDriver: data.messageFromDriver,
    showRating: orders.showRating,
    showRatingId: orders.showRatingId,
    settings: data.settings,
    fares: data.fares,
    contact: orders.contact,
    savedAddresses: data.addressTemplates,
    orderError: errors.orderError,
    drivers: data.drivers,
    routes: data.routes,
    distance: data.totalDistance,
    time: data.totalTime,
    isCreateTemplate: tech.isCreateTemplate,
    templates: orders.tripTemplates,
    isCorporate: tech.isCorp,
    orderCarousel: tech.orderCarousel,
  }),
  {
    socketAPI,
    setUserPosition,
    setTo,
    setOrderOptions,
    loginRequest,
    clearChatWithDriver,
    showRatingGlobal,
    clearOrderDetails,
    chooseContact,
    clearErrors,
    clearRoutes,
    clearDetails,
    createTemplateProcess,
    switchCorporate,
    setOrderId,
  }
)(MapDirections);
