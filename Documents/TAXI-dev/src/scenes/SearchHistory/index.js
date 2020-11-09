import React, { PureComponent } from 'react';
import { View, TouchableOpacity, ScrollView, Platform } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import moment from 'moment';
import DateTimePicker from 'react-native-modal-datetime-picker';

import { Header, Text, TextInput, Icon, ArrowRight } from '../../components';
import { styleConstants, strings, colors } from '../../helpers';
import style from './style';
import RidesList from '../Rides/RidesList';

import {
  socketAPI,
  socketTypes,
  setFrom,
  setTo,
  setOrderOptions,
  deleteHistoryItem,
  clearDetails,
  selectSearchCar,
} from '../../actions';

class SearchHistory extends PureComponent {
  static propTypes = {
    socketAPI: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired,
    historySearch: PropTypes.array.isRequired,
    fares: PropTypes.array,
    searchCar: PropTypes.number,
    selectSearchCar: PropTypes.func,
    clearDetails: PropTypes.func,
    popup: PropTypes.object,
    setOrderOptions: PropTypes.func,
    setFrom: PropTypes.func,
    setTo: PropTypes.func,
    deleteHistoryItem: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = {
      pointA: '',
      pointB: '',
      timeFrom: moment('01-01-2020', 'DD-MM-YY').format('DD-MM-YYYY'),
      timeTo: moment().format('DD-MM-YYYY'),
      form: true,
      showDatePicker: false,
      pickerType: '',
      loading: false,
    };
    this.maxDate = new Date();
    this.minDate = new Date(2020, 0, 1);
    this.date = date => {
      return new Date(date);
    };
  }

  componentDidMount() {
    this.getHistory();
    this.props.clearDetails();
  }

  componentDidUpdate({ searchCar }) {
    if (this.props.searchCar !== searchCar) {
      this.getHistory();
    }
  }

  getHistory = () => {
    const { pointA, pointB, timeFrom, timeTo } = this.state;
    const { searchCar, user } = this.props;
    const data = {
      clientId: user.clientId,
      limit: 0,
      offset: 0,
      lang: user.lang || user.settings.defaultLang,
      addressFrom: pointA || null,
      addressTo: pointB || null,
      timeFrom: timeFrom || null,
      timeTo: timeTo || null,
      carTypeId: searchCar || null,
    };
    this.props.socketAPI(socketTypes.GET_HISTORY, data, true);
  };

  handleInput = (key, value) => {
    this.setState(
      {
        [key]: value,
      },
      () => this.getHistory()
    );
  };

  toggleDatePicker = type => {
    this.setState(state => ({ showDatePicker: !state.showDatePicker, pickerType: type }));
  };

  handleConfirmPicker = data => {
    const { pickerType } = this.state;
    if (pickerType === 'from') {
      const date = moment(data).format('DD-MM-YYYY');
      this.setState({ pickerType: '', timeFrom: date, showDatePicker: false }, () =>
        this.getHistory()
      );
    }
    if (pickerType === 'to') {
      const date = moment(data).format('DD-MM-YYYY');
      this.setState({ pickerType: '', timeTo: date, showDatePicker: false }, () =>
        this.getHistory()
      );
    }
  };

  clearSearch = type => {
    if (type === 'car') {
      return this.props.selectSearchCar(undefined).then(() => this.getHistory());
    }
    if (type) {
      return this.setState({ pointB: '' }, () => {
        this.getHistory();
        if (this.pointB) {
          this.pointB.clear();
        }
      });
    }
    return this.setState({ pointA: '' }, () => {
      this.getHistory();
      if (this.pointA) {
        this.pointA.clear();
      }
    });
  };

  getFareName = () => {
    const { fares, searchCar } = this.props;
    const active = fares.find(el => el.id === searchCar) || fares[0];
    const name = Object.keys(active || {}).length > 0 ? active.priceName : fares[0]?.priceName;
    return name || '';
  };

  toggleForm = () => {
    this.setState(state => ({ form: !state.form }));
  };

  handleDeletion = item => {
    this.props.popup.showPopup({
      header: strings.deleteTripConfirm,
      text: item.street1
        ? `${item.street0}, ${item.house0} -\n ${item.street1}, ${item.house1}`
        : `${item.street0}, ${item.house0}`,
      onPressRight: () => this.handleDeleteOrder(item.id),
      buttons: true,
    });
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

  openHistoryDetails = id => {
    const detailed = this.props.historySearch?.find(el => el.id === id);
    Actions.details({ activeDetails: detailed });
  };

  renderForm() {
    const { pointA, pointB, timeFrom, timeTo, showDatePicker, pickerType } = this.state;
    const { historySearch, searchCar } = this.props;
    return (
      <ScrollView contentContainerStyle={styleConstants.rootContainer}>
        <Header bigTitle={strings.findTrips} />
        <View style={styleConstants.flex}>
          <View style={style.searchInputsContainer}>
            <View style={style.pointAContainer}>
              <View style={style.dotContainer}>
                <View style={styleConstants.orangeDot} />
              </View>
              <TextInput
                value={pointA}
                onChangeText={value => this.handleInput('pointA', value)}
                textInputWrap={styleConstants.flex}
                textInputStyle={{
                  paddingVertical: Platform.select({ ios: 16, android: undefined }),
                }}
                placeholder={strings.startAddress}
                ref={a => (this.pointA = a)}
              />
              {!!pointA && (
                <TouchableOpacity
                  style={style.dotContainer}
                  hitSlop={{ right: 24, left: 24, bottom: 24, top: 24 }}
                  onPress={() => this.clearSearch(0)}
                >
                  <Icon name="remove" size={16} />
                </TouchableOpacity>
              )}
            </View>
            <View style={style.pointBContainer}>
              <View style={style.dotContainer}>
                <Icon name="marker" size={16} />
              </View>
              <TextInput
                value={pointB}
                onChangeText={value => this.handleInput('pointB', value)}
                textInputWrap={styleConstants.flex}
                placeholder={strings.addressOfArrival}
                textInputStyle={{
                  paddingVertical: Platform.select({ ios: 16, android: undefined }),
                }}
                ref={b => (this.pointB = b)}
              />
              {!!pointB && (
                <TouchableOpacity
                  style={style.dotContainer}
                  hitSlop={{ right: 24, left: 24, bottom: 24, top: 24 }}
                  onPress={() => this.clearSearch(1)}
                >
                  <Icon name="remove" size={16} />
                </TouchableOpacity>
              )}
            </View>
          </View>
          <View style={style.timeSearchContainer}>
            <TouchableOpacity
              style={style.timeFromContainer}
              onPress={() => this.toggleDatePicker('from')}
            >
              <Text smallRegular>{`${strings.search} ${strings.tripFrom.toLowerCase()}:`}</Text>
              <View style={style.timeTouchable} onPress={() => this.toggleDatePicker('from')}>
                <Text normalText>{moment(timeFrom, 'DD-MM-YYYY').format('DD.MM.YY')}</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={style.timeToContainer}
              onPress={() => this.toggleDatePicker('to')}
            >
              <Text smallRegular>{`${strings.search} ${strings.tripTo.toLowerCase()}:`}</Text>
              <View style={style.timeTouchable}>
                <Text normalText>
                  {moment(timeTo, 'DD-MM-YYYY').isSame(moment(), 'day')
                    ? strings.today
                    : moment(timeTo, 'DD-MM-YYYY').format('DD.MM.YY')}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
          <View style={style.carTypeWrap}>
            <TouchableOpacity
              style={style.carTypeContainer}
              onPress={() => Actions.defaultTariff({ search: searchCar || 'empty' })}
            >
              <Text smallRegular>{`${strings.carClass}:`}</Text>
              <View style={style.carTouchable}>
                <Text normalText style={{ color: !searchCar ? colors.grey : undefined }}>
                  {searchCar ? this.getFareName() : strings.findPick}
                </Text>
              </View>
            </TouchableOpacity>
            {!!searchCar && (
              <TouchableOpacity
                style={style.dotContainer}
                hitSlop={{ right: 24, left: 24, bottom: 24, top: 24 }}
                onPress={() => this.clearSearch('car')}
              >
                <View style={styleConstants.flex} />
                <View style={styleConstants.flexCenter}>
                  <Icon name="remove" size={16} />
                </View>
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View style={style.bottomBar}>
          <View>
            <Text>{strings.findRequest}</Text>
            <Text
              style={style.bottomBigText}
            >{`${strings.findHistory}: ${historySearch.length}`}</Text>
          </View>
          <ArrowRight onPress={this.toggleForm} disabled={!historySearch.length} />
        </View>

        <DateTimePicker
          isVisible={showDatePicker}
          onConfirm={this.handleConfirmPicker}
          onCancel={this.toggleDatePicker}
          timePickerModeAndroid="spinner"
          minimumDate={this.minDate}
          maximumDate={this.maxDate}
          date={
            pickerType === 'from'
              ? new Date(moment(timeFrom, 'DD-MM-YYYY').toDate())
              : new Date(moment(timeTo, 'DD-MM-YYYY').toDate())
          }
        />
      </ScrollView>
    );
  }

  renderResults = () => {
    const { historySearch } = this.props;
    return (
      <View style={styleConstants.flex}>
        <Header
          bigTitle={strings.pastTrips}
          headerStyle={style.header}
          subtitle={`${strings.findHistory}: ${historySearch.length}`}
          minHHeight={120}
          subtitleStyle={style.subtitle}
        />
        <RidesList
          data={this.props.historySearch}
          stub={strings.yourHistoryEmpty}
          onDeleteOrder={this.handleDeletion}
          onCall={this.handleCall}
          loading={this.state.loading}
          onDetailsOpen={this.openHistoryDetails}
          lang={this.props.user.lang || this.props.user.settings.defaultLang}
        />
        <TouchableOpacity style={style.bottomButton} onPress={this.toggleForm}>
          <Text normalText style={style.bottomButtonText}>
            {strings.changeRequest}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  render = () => {
    return this.state.form ? this.renderForm() : this.renderResults();
  };
}

export default connect(
  ({ user, popup, orders, data, tech }) => ({
    user,
    popup,
    historySearch: orders.historySearch,
    fares: data.fares,
    searchCar: tech.searchCar,
  }),
  {
    socketAPI,
    setFrom,
    setTo,
    setOrderOptions,
    deleteHistoryItem,
    clearDetails,
    selectSearchCar,
  }
)(SearchHistory);
