import React, { PureComponent } from 'react';
import { View, FlatList, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import moment from 'moment';

import style from './style';
import { Header, Text, Icon } from '../../components';
import { styleConstants, strings, colors, constants } from '../../helpers';

class ActiveTrips extends PureComponent {
  static propTypes = {
    currentOrders: PropTypes.array,
    fromFormId: PropTypes.number,
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  openTrip = id => {
    Actions.reset('mapDir', { orderId: id });
  };

  keyExtractor = item => item.id.toString();

  renderItem = ({ item }) => {
    let status = '';
    switch (item.statusId) {
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
    const color = constants.COLORS.find(e => e.id === item.driverColorId)
      ? constants.COLORS.find(e => e.id === item.driverColorId).hex
      : '';
    const planned = !!item.address0;
    return (
      <TouchableOpacity
        style={style.rideContainer}
        onPress={
          item.statusId === 8 || item.statusId === 14
            ? () => Actions.rides({ startPage: 1 })
            : item.id === this.props.fromFormId
            ? () => Actions.pop()
            : () => this.openTrip(item.id)
        }
        disabled={
          item.statusId === 6 || item.statusId === 12 || item.statusId === 7 || item.statusId === 10
        }
      >
        <View style={style.directionsBody}>
          <View style={styleConstants.flex}>
            <View style={style.originContainer}>
              <View style={style.directionsIconContainer}>
                <View style={styleConstants.orangeDot} />
              </View>
              <Text normalText style={style.directionsText}>
                {item.address0}
              </Text>
            </View>
            {!!item.address1 && item.address1[0] !== ',' && (
              <View style={style.destinationContainer}>
                <View style={style.directionsIconContainer}>
                  <Icon name="marker" size={11} />
                </View>
                <Text normalText style={style.directionsText}>
                  {item.address1}
                </Text>
              </View>
            )}
            {!!item.address2 && item.address2[0] !== ',' && (
              <View style={style.destinationContainer}>
                <View style={style.directionsIconContainer}>
                  <Icon name="marker" size={11} />
                </View>
                <Text normalText style={style.directionsText}>
                  {item.address2}
                </Text>
              </View>
            )}
            {!!item.address3 && item.address3[0] !== ',' && (
              <View style={style.destinationContainer}>
                <View style={style.directionsIconContainer}>
                  <Icon name="marker" size={11} />
                </View>
                <Text normalText style={style.directionsText}>
                  {item.address3}
                </Text>
              </View>
            )}
            {!!item.address4 && item.address4[0] !== ',' && (
              <View style={style.destinationContainer}>
                <View style={style.directionsIconContainer}>
                  <Icon name="marker" size={11} />
                </View>
                <Text normalText style={style.directionsText}>
                  {item.address4}
                </Text>
              </View>
            )}
          </View>
        </View>
        <View style={style.rideFooter}>
          <Text smallRegular numberOfLines={1} style={{ flex: 1, maxWidth: '35%' }}>
            {item.priceName}
          </Text>
          <View style={style.paymentContainer}>
            <Icon
              name={
                item.paymentTypeId === 0
                  ? 'cash'
                  : item.paymentTypeId === 1
                  ? 'credit-card'
                  : 'rocket'
              }
              color={colors.green}
            />
            <Text smallRegular style={style.paymentText} numberOfLines={1}>
              {item.paymentTypeId === 0
                ? strings.cash
                : item.paymentTypeId === 1
                ? strings.payWithCreditCard
                : item.paymentTypeId === 2
                ? strings.bonusPay
                : strings.cashless}
            </Text>
          </View>
        </View>
        <Text
          smallRegular={!planned}
          smallBlackText={planned}
          key="dt"
          style={[
            { marginHorizontal: 8, flex: 1, textAlign: 'center', marginTop: 6 },
            planned ? { color: colors.red } : null,
          ]}
          numberOfLines={1}
        >
          {moment(planned ? item.orderTime : item.dt, 'DD-MM-YYYY HH:mm').format(
            'DD.MM.YYYY HH:mm'
          )}
        </Text>
        {((item.statusId > 2 && item.statusId < 6) || item.statusId === 8) && (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginVertical: 12,
              marginHorizontal: 16,
            }}
          >
            <View style={[style.driverInfo, { maxWidth: '24%' }]}>
              <Text smallRegular style={style.driverLabel}>
                {strings.driver}
              </Text>
              <Text smallBlackText numberOfLines={1}>
                {item.driverName}
              </Text>
            </View>
            <View style={style.driverInfo}>
              <Text smallRegular style={style.driverLabel}>
                {strings.car}
              </Text>
              <Text smallBlackText numberOfLines={1}>
                {item.driverCar}
              </Text>
            </View>
            <View style={[style.driverInfo, { marginRight: 12 }]}>
              <Text smallRegular style={style.driverLabel}>
                {strings.number}
              </Text>
              <Text smallBlackText>{item.driverCarNumber}</Text>
            </View>
            <View>
              <Text smallRegular style={{ marginBottom: 6 }}>
                {strings.color}
              </Text>
              <View style={[style.driverColor, { backgroundColor: color }]} />
            </View>
          </View>
        )}
        <View
          style={
            item.statusId === 7
              ? {
                  backgroundColor: colors.orange,
                  borderBottomLeftRadius: 10,
                  borderBottomRightRadius: 10,
                }
              : null
          }
        >
          <Text
            smallRegular
            style={[
              style.statusText,
              item.statusId === 7
                ? {
                    color: colors.textEnv,
                  }
                : null,
            ]}
          >
            {status}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  createData = data => {
    if (data) {
      const filtered = data.filter(el => el.statusId !== 6);
      return filtered;
    }
    return [];
  };

  renderEmptyData = () => {
    return (
      <View style={styleConstants.flexCenter}>
        <Text style={{ marginTop: 16 }}>{strings.noActiveTrips}</Text>
      </View>
    );
  };

  render() {
    const data = this.createData(this.props.currentOrders);
    return (
      <View style={[styleConstants.rootContainer, { backgroundColor: colors.lightGrey }]}>
        <Header headerStyle={style.headerContainer} bigTitle={strings.activeTrips} />
        <View style={styleConstants.flex}>
          <FlatList
            data={data}
            renderItem={this.renderItem}
            keyExtractor={this.keyExtractor}
            ListFooterComponent={<View style={style.ridesListFooter} />}
            ListEmptyComponent={this.renderEmptyData}
            bounces={false}
            extraData={this.props}
          />
        </View>
      </View>
    );
  }
}

export default connect(
  ({ data, popup, orders }) => ({
    data,
    popup,
    currentOrders: orders.currentOrders,
  }),
  {}
)(ActiveTrips);
