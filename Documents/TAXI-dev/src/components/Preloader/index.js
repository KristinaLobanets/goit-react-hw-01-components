import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import PropTypes from 'prop-types';

import style from './style';
import { colors } from '../../helpers';

const Preloader = ({
  loading = false,
  stylePreloaderFullscreen = {},
  size = 'large',
  color = colors.orange,
  fullScreen = false,
}) => {
  const renderSimple = <ActivityIndicator size={size} color={color} animating={loading} />;
  const renderFullScreen = loading ? (
    <View style={[style.preloader, stylePreloaderFullscreen]}>
      <ActivityIndicator size={size} color={color} />
    </View>
  ) : null;
  return fullScreen ? renderFullScreen : renderSimple;
};

export default Preloader;

Preloader.propTypes = {
  loading: PropTypes.bool,
  stylePreloaderFullscreen: PropTypes.object,
  size: PropTypes.string,
  color: PropTypes.string,
  fullScreen: PropTypes.bool,
};
