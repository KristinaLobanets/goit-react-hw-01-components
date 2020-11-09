import React from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';

import { Text, Button } from '..';
import { strings } from '../../helpers';
import style from './style';
import Preloader from '../Preloader';

const NoInternet = ({ onPress, loader }) => {
  const connectionText = strings.noInternet;
  return (
    <View style={style.container}>
      <View style={style.modal}>
        <Text normalText style={style.text}>
          {connectionText}
        </Text>
        {!loader ? (
          <Button title={strings.update} onPress={onPress} buttonStyle={style.button} />
        ) : (
          <View style={{ marginTop: 16 }}>
            <Preloader loading={loader} />
          </View>
        )}
      </View>
    </View>
  );
};

NoInternet.propTypes = {
  onPress: PropTypes.func,
  loader: PropTypes.bool,
};

export default NoInternet;
