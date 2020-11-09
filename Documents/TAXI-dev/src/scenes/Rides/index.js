import React, { PureComponent } from 'react';
import { View, Platform } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import moment from 'moment';

import style from './style';
import { TabView, Header } from '../../components';
import { styleConstants, strings } from '../../helpers';
import {
  socketAPI,
  socketTypes,
  setFrom,
  setTo,
  setOrderOptions,
  deleteHistoryItem,
  reloadHistory,
  clearDetails,
  changeRidesTabs,
  createTemplateProcess,
} from '../../actions';

import RidesList from './RidesList';
import CancelModal from '../MapDirections/CancelModal';
import LaterModal from '../MapDirections/LaterModal';

class Rides extends PureComponent {
  static propTypes = {
    socketAPI: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired,
    history: PropTypes.array.isRequired,
    tripTemplates: PropTypes.array.isRequired,
    currentOrders: PropTypes.array,
    popup: PropTypes.object,
    setFrom: PropTypes.func.isRequired,
    setTo: PropTypes.func.isRequired,
    setOrderOptions: PropTypes.func.isRequired,
    deleteHistoryItem: PropTypes.func.isRequired,
    reloadHistory: PropTypes.func,
    startPage: PropTypes.number,
    clearDetails: PropTypes.func,
    changeRidesTabs: PropTypes.func,
    indexTab: PropTypes.number,
    createTemplateProcess: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      preloader: false,
      reasonId: [6],
      visibleReason: false,
      showLater: false,
      laterDate: moment().format('DD-MM-YY'),
      laterTime: moment()
        .add(35, 'minutes')
        .format('HH:mm'),
      laterDateTime: null,
      activeTimeButton: null,
      isDateTimePickerVisible: false,
      timeMode: undefined,
    };
    this.routesData = [
      { key: 'first', title: strings.previous },
      { key: 'second', title: strings.planned },
      { key: 'third', title: strings.templates },
    ];
  }

  componentDidMount() {
    this.props.reloadHistory().then(() => this.getHistory());
    this.props.clearDetails();
  }

  componentWillUnmount() {
    this.props.changeRidesTabs(0);
  }

  getHistory = () => {
    const { history, user } = this.props;
    this.props.socketAPI(socketTypes.GET_HISTORY, {
      clientId: user.clientId,
      limit: 10,
      offset: history.length,
      lang: user.lang || user.settings.defaultLang,
    });
  };

  loadTab = ({ route }) => {
    const { clientId } = this.props.user;
    if (route.key === 'first') {
      this.getHistory();
      this.props.changeRidesTabs(0);
    }
    if (route.key === 'second') {
      this.props.changeRidesTabs(1);
    }
    if (route.key === 'third') {
      this.props.socketAPI(socketTypes.GET_TRIP_TEMPLATES, { clientId });
      this.props.changeRidesTabs(2);
    }
  };

  handleDeleteOrder = orderId => {
    const { clientId } = this.props.user;
    this.setState({ loading: true });
    this.props.socketAPI(socketTypes.DELETE_ORDER, { clientId, orderId });
    setTimeout(() => {
      this.setState({ loading: false });
      this.props.deleteHistoryItem(orderId);
    }, 300);
  };

  handleDeleteTemplate = templateId => {
    const { clientId } = this.props.user;
    this.setState({ loading: true });
    this.props.socketAPI(socketTypes.DELETE_TRIP_TEMPLATE, { clientId, templateId });
    setTimeout(() => {
      this.props.socketAPI(socketTypes.GET_TRIP_TEMPLATES, { clientId });
      this.setState({ loading: false });
    }, 300);
  };

  handleDeletion = item => {
    this.props.popup.showPopup({
      header: item.templateId ? strings.deleteTemplateConfirm : strings.deleteTripConfirm,
      text: item.templateId
        ? item.name || item.object || item.street0
        : item.street1
        ? `${item.street0}, ${item.house0} -\n ${item.street1}, ${item.house1}`
        : `${item.street0}, ${item.house0}`,
      onPressRight: item.templateId
        ? () => this.handleDeleteTemplate(item.templateId)
        : () => this.handleDeleteOrder(item.id),
      buttons: true,
    });
  };

  handleCall = (item, isReverted = false) => {
    const dataFrom = {
      lat: item.lat0,
      lon: item.lon0,
      street: item.street0,
      house: item.house0,
      object: item.object0,
      lang: this.props.user.lang || this.props.user.settings.defaultLang,
      id: 0,
    };
    const dataToArray = [
      item.lat1
        ? {
            lat: item.lat1,
            lon: item.lon1,
            street: item.street1,
            house: item.house1,
            object: item.object1,
            lang: this.props.user.lang || this.props.user.settings.defaultLang,
            id: 1,
          }
        : undefined,
      item.lat2
        ? {
            lat: item.lat2,
            lon: item.lon2,
            street: item.street2,
            house: item.house2,
            object: item.object2,
            lang: this.props.user.lang || this.props.user.settings.defaultLang,
            id: 2,
          }
        : undefined,
      item.lat3
        ? {
            lat: item.lat3,
            lon: item.lon3,
            street: item.street3,
            house: item.house3,
            object: item.object3,
            lang: this.props.user.lang || this.props.user.settings.defaultLang,
            id: 3,
          }
        : undefined,
      item.lat4
        ? {
            lat: item.lat4,
            lon: item.lon4,
            street: item.street4,
            house: item.house4,
            object: item.object4,
            lang: this.props.user.lang || this.props.user.settings.defaultLang,
            id: 4,
          }
        : undefined,
    ];
    const dataTo = dataToArray.filter(el => el);
    const lastDataTo = dataTo[dataTo.length - 1];
    const dataToReverted = this.revertTripsArray(dataTo, dataFrom);
    this.props
      .setFrom(!isReverted ? dataFrom : lastDataTo)
      .then(() =>
        this.props.setTo(!isReverted ? (dataTo.length === 0 ? undefined : dataTo) : dataToReverted)
      )
      .then(() => this.props.setOrderOptions(item))
      .then(() => {
        Actions.reset('mapDir');
      });
  };

  revertTripsArray = (array, a) => {
    const temp = array.slice(0, array.length - 1).reverse();
    temp.push(a);
    return temp;
  };

  showPopup = () =>
    this.props.popup.showPopup({
      text: strings.finishYourRide,
      error: true,
      header: strings.warning,
    });

  cancelPlanned = planned => {
    this.props.socketAPI(socketTypes.CANCEL_ORDER, {
      clientId: this.props.user.clientId,
      orderId: planned.id,
      reasonId: this.state.reasonId,
    });
  };

  handleShowCanceled = () => {
    this.toggleModal(this.state.planned);
    this.cancelPlanned(this.state.planned);
  };

  toggleModal = item =>
    this.setState(state => ({
      visibleReason: !state.visibleReason,
      planned: !state.planned ? item : undefined,
    }));

  changePlanned = () => {
    const data = {
      orderId: this.state.planned.id,
      clientId: this.props.user.clientId,
      dt: Platform.select({
        ios: moment(this.state.laterDateTime, 'DD-MM-YYYY HH:mm').format('YYYY-MM-DD HH:mm:ss'),
        android: moment(
          `${this.state.laterDate} ${this.state.laterTime}`,
          'DD-MM-YYYY HH:mm'
        ).format('YYYY-MM-DD HH:mm:ss'),
      }),
    };
    this.props.socketAPI(socketTypes.UPDATE_ADVANCE_ORDER, data);
    this.toggleLaterModal();
  };

  toggleLaterModal = item => {
    this.setState(state => ({
      showLater: !state.showLater,
      planned: !state.planned ? item : undefined,
      laterDateTime: !state.planned
        ? moment(item.orderTime, 'DD-MM-YYYY HH:mm').format('DD-MM-YYYY HH:mm')
        : '',
      laterDate: !state.planned ? item.orderTime.split(' ')[0] : '',
      laterTime: !state.planned ? item.orderTime.split(' ')[1] : '',
    }));
  };

  showDateTimePicker = mode => {
    this.setState({ isDateTimePickerVisible: true, timeMode: mode });
  };

  hideDateTimePicker = () => {
    this.setState({ isDateTimePickerVisible: false });
  };

  handleDatePicked = date => {
    const laterDateTime = moment(date);
    if (Platform.OS === 'ios') {
      const timeToDiff = laterDateTime.format('DD-MM-YYYY HH:mm');
      const dateTime = moment(timeToDiff, 'DD-MM-YYYY HH:mm').isBefore(moment())
        ? moment()
            .add(35, 'minutes')
            .format('DD-MM-YYYY HH:mm')
        : moment(date).format('DD-MM-YYYY HH:mm');
      return this.setState({
        laterDateTime: dateTime,
        activeTimeButton: null,
        isDateTimePickerVisible: false,
      });
    }
    if (this.state.timeMode) {
      const timeToDiff = `${this.state.laterDate} ${laterDateTime.format('HH:mm')}`;
      const laterTime = moment(timeToDiff, 'DD-MM-YYYY HH:mm').isBefore(moment())
        ? moment()
            .add(35, 'minutes')
            .format('HH:mm')
        : moment(date).format('HH:mm');
      this.setState({ laterTime, activeTimeButton: null, isDateTimePickerVisible: false });
    } else {
      const isBeforeDate = moment(
        `${laterDateTime.format('DD-MM-YYYY')} ${this.state.laterTime}`,
        'DD-MM-YYYY HH:mm'
      ).isBefore(moment());
      const laterDate = moment(date).format('DD-MM-YYYY');
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
          : { laterDate, activeTimeButton: null, isDateTimePickerVisible: false }
      );
    }
  };

  onEndReached = () => {
    if (this.state.preloader || this.onEndReachedCalledDuringMomentum) return;
    this.setState({ preloader: true });
    this.getHistory();
    this.onEndReachedCalledDuringMomentum = true;
    setTimeout(() => {
      this.setState({ preloader: false });
    }, 1000);
  };

  openHistoryDetails = id => {
    const detailed = this.props.history?.find(el => el.id === id);
    Actions.details({ activeDetails: detailed });
  };

  openTemplateDetails = id => {
    const detailed = this.props.tripTemplates?.find(el => el.templateId === id);
    Actions.details({ activeTemplate: detailed });
  };

  createTemplateStart = () => {
    this.props.createTemplateProcess().then(() => Actions.mapDir());
  };

  searchHistory = () => Actions.searchHistory();

  renderRoutes = () => {
    const FirstRoute = () => (
      <RidesList
        data={this.props.history}
        stub={strings.yourHistoryEmpty}
        onDeleteOrder={this.handleDeletion}
        onCall={this.handleCall}
        loading={this.state.loading}
        preloader={this.state.preloader}
        onEndReached={this.onEndReached}
        onMomentumScrollBegin={() => {
          this.onEndReachedCalledDuringMomentum = false;
        }}
        onDetailsOpen={this.openHistoryDetails}
        lang={this.props.user.lang || this.props.user.settings.defaultLang}
      />
    );
    const SecondRoute = () => (
      <RidesList
        data={this.props.currentOrders?.filter(el => el.statusId === 14 || el.statusId === 8)}
        stub={strings.noPlannedRides}
        onCancelPlanned={this.toggleModal}
        onChangePlanned={this.toggleLaterModal}
        lang={this.props.user.lang || this.props.user.settings.defaultLang}
      />
    );
    const ThirdRoute = () => (
      <RidesList
        data={this.props.tripTemplates}
        stub={strings.noSavedTemplates}
        onCall={this.handleCall}
        onDelete={this.handleDeletion}
        loading={this.state.loading}
        lang={this.props.user.lang || this.props.user.settings.defaultLang}
        onDetailsOpen={this.openTemplateDetails}
      />
    );

    return [FirstRoute, SecondRoute, ThirdRoute];
  };

  render() {
    const {
      visibleReason,
      reasonId,
      showLater,
      laterDateTime,
      activeTimeButton,
      isDateTimePickerVisible,
      timeMode,
    } = this.state;
    const { indexTab, startPage } = this.props;
    const laterDate = Platform.select({
      ios: laterDateTime ? laterDateTime.split(' ')[0] : '',
      android: this.state.laterDate,
    });
    const laterTime = Platform.select({
      ios: laterDateTime ? laterDateTime.split(' ')[1] : '',
      android: this.state.laterTime,
    });

    return (
      <View style={styleConstants.rootContainer}>
        <Header
          headerStyle={style.headerContainer}
          bigTitle={strings.myTrips}
          arrowRight={indexTab === 2 || indexTab === 0}
          onPress={
            indexTab === 2
              ? this.createTemplateStart
              : indexTab === 0
              ? this.searchHistory
              : undefined
          }
          icon={indexTab === 2 ? 'plus' : indexTab === 0 ? 'search' : undefined}
        />
        <View style={styleConstants.flex}>
          <TabView
            routes={this.renderRoutes()}
            routesData={this.routesData}
            onLoadTab={this.loadTab}
            startPage={startPage || indexTab}
            isNewRides={
              this.props.currentOrders?.filter(el => el.statusId === 14 || el.statusId === 8)
                .length > 0
            }
          />
        </View>
        <CancelModal
          active={reasonId[0]}
          onLeft={this.toggleModal}
          onPressRadio={() => {}}
          onRight={this.handleShowCanceled}
          visible={visibleReason}
          planned
        />

        <LaterModal
          isChange
          onLeft={this.toggleLaterModal}
          onRight={this.changePlanned}
          visible={showLater}
          date={laterDate}
          time={laterTime}
          activeTimeButton={activeTimeButton}
          onDateTimePress={this.showDateTimePicker}
          showDatePicker={isDateTimePickerVisible}
          onConfirm={this.handleDatePicked}
          onCancel={this.hideDateTimePicker}
          timeMode={timeMode}
          laterTime={laterTime}
          laterDate={laterDate}
        />
      </View>
    );
  }
}

export default connect(
  ({ user, data, popup, orders, tech }) => ({
    user,
    data,
    popup,
    history: orders.history,
    tripTemplates: orders.tripTemplates,
    currentOrders: orders.currentOrders,
    indexTab: tech.indexRidesTab,
  }),
  {
    socketAPI,
    setFrom,
    setTo,
    setOrderOptions,
    deleteHistoryItem,
    reloadHistory,
    clearDetails,
    changeRidesTabs,
    createTemplateProcess,
  }
)(Rides);
