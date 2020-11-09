import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';

import { Text, Icon } from '../../components';
import { styleConstants, strings } from '../../helpers';
import style from './style';

const RideInfo = ({ distance, duration, handleRideShare, order, onLayout }) => {
  const {
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
    object0,
    object1,
    object2,
    object3,
    object4,
  } = order;
  const address0 = object0 ? `${object0} (${street0}, ${house0})` : `${street0}, ${house0 || 1}`;
  const address1 = object1 ? `${object1} (${street1}, ${house1})` : `${street1}, ${house1 || 1}`;
  const address2 = object2 ? `${object2} (${street2}, ${house2})` : `${street2}, ${house2 || 1}`;
  const address3 = object3 ? `${object3} (${street3}, ${house3})` : `${street3}, ${house3 || 1}`;
  const address4 = object4 ? `${object4} (${street4}, ${house4})` : `${street4}, ${house4 || 1}`;
  return (
    <View style={[style.rideInfoContainer]} onLayout={onLayout}>
      <View style={style.rideInfo}>
        <View style={style.originContainer}>
          <View style={style.directionsIconContainer}>
            <View style={styleConstants.orangeDot} />
          </View>
          <Text normalText style={style.directionsText}>
            {street0 ? address0 : '--/--'}
          </Text>
        </View>
        {!!street1 && (
          <View style={style.destinationContainer}>
            <View style={style.directionsIconContainer}>
              <Icon name="marker" size={12} />
            </View>
            <Text normalText style={style.directionsText}>
              {address1}
            </Text>
          </View>
        )}
        {!!street2 && (
          <View style={style.destinationContainer}>
            <View style={style.directionsIconContainer}>
              <Icon name="marker" size={12} />
            </View>
            <Text normalText style={style.directionsText}>
              {address2}
            </Text>
          </View>
        )}
        {!!street3 && (
          <View style={style.destinationContainer}>
            <View style={style.directionsIconContainer}>
              <Icon name="marker" size={12} />
            </View>
            <Text normalText style={style.directionsText}>
              {address3}
            </Text>
          </View>
        )}
        {!!street4 && (
          <View style={style.destinationContainer}>
            <View style={style.directionsIconContainer}>
              <Icon name="marker" size={12} />
            </View>
            <Text normalText style={style.directionsText}>
              {address4}
            </Text>
          </View>
        )}
        <View
          style={{
            flexDirection: 'row',
            marginTop: 16,
            justifyContent: !distance ? 'center' : undefined,
          }}
        >
          {distance ? (
            <View style={styleConstants.flex}>
              <View style={style.rideInfoTimeWrap}>
                <Text style={styleConstants.fontMedium}>{`${strings.timeArrive}: `}</Text>
                <Text normalText>{duration}</Text>
              </View>
              <View style={style.rideInfoDistanceWrap}>
                <Text style={styleConstants.fontMedium}>{`${strings.distance}: `}</Text>
                <Text normalText>{`${distance} км.`}</Text>
              </View>
            </View>
          ) : null}
          <TouchableOpacity
            onPress={handleRideShare}
            style={style.rideInfoShare}
            hitSlop={{ left: 20, top: 20, bottom: 20 }}
          >
            <Icon name="share" size={16} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default RideInfo;

RideInfo.propTypes = {
  distance: PropTypes.number,
  duration: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  handleRideShare: PropTypes.func,
  order: PropTypes.object,
  onLayout: PropTypes.func,
};
