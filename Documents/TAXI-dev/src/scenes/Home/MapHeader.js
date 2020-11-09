import React from 'react';
import { View, Image, TouchableOpacity, Platform } from 'react-native';
import PropTypes from 'prop-types';

import style from './style';
import { Button, Text } from '../../components/index';
import { colors, Images, Dimension, strings } from '../../helpers';
import env from '../../env';

const MapHeader = ({ nameIcon, onPress, onProfilePress, imagePic, activeTrips, onActiveTrips }) => (
  <View
    style={[
      style.mapHeader,
      !activeTrips && Dimension.IsIphoneX()
        ? { top: 25 }
        : !activeTrips && Platform.OS === 'ios'
        ? { top: 12 }
        : null,
    ]}
  >
    {!!activeTrips && (
      <TouchableOpacity onPress={onActiveTrips} style={style.activeTrips}>
        <Text
          normalText
          style={{ color: env.app_colorText }}
        >{`${strings.activeTrips}: ${activeTrips}`}</Text>
      </TouchableOpacity>
    )}
    <View style={style.mapHeaderButtonRow}>
      <TouchableOpacity
        onPress={onProfilePress}
        style={[
          style.profileIcon,
          {
            borderColor: imagePic ? colors.blue : colors.iconGrey,
          },
        ]}
      >
        <Image
          style={style.mapHeaderImg}
          source={imagePic ? { uri: `data:image/png;base64,${imagePic}` } : Images.SmallAvatar}
        />
      </TouchableOpacity>
      <View>
        <Button
          buttonStyle={style.mapHeaderLocation}
          icon={nameIcon}
          onPress={onPress}
          colorIcon={colors.black}
        />
      </View>
    </View>
  </View>
);

export default MapHeader;

MapHeader.propTypes = {
  nameIcon: PropTypes.string,
  onPress: PropTypes.func,
  onProfilePress: PropTypes.func,
  imagePic: PropTypes.string,
  activeTrips: PropTypes.number,
  onActiveTrips: PropTypes.func,
};

MapHeader.defaultProps = {
  nameIcon: 'none',
  onPress: () => {},
  onProfilePress: () => {},
};
