import React from 'react';
import { TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';

import { Text } from '../../components';
import style from './style';

const ActiveTripsBar = ({ currentOrders, details }) => {
  const activeLength = currentOrders
    ? currentOrders.filter(
        el => el.statusId !== 6 && el.statusId !== 7 && el.statusId !== 12 && el.statusId !== 10
      ).length
    : 0;
  return activeLength > 1 ? (
    <TouchableOpacity
      style={style.activeBarContainer}
      onPress={() => Actions.activeTrips({ fromFormId: details?.id })}
    >
      <Text style={style.activeBarText}>{`${currentOrders ? activeLength : 0}`}</Text>
    </TouchableOpacity>
  ) : null;
};

ActiveTripsBar.propTypes = {
  currentOrders: PropTypes.array,
  details: PropTypes.object,
};

export default connect(({ orders }) => ({
  currentOrders: orders.currentOrders,
  details: orders.details,
}))(ActiveTripsBar);
