import React from 'react';
import { View, Image } from 'react-native';

import { Images } from '../../helpers';
import style from './style';
import env from '../../env';

const Logotype = () => (
  <View style={style.logoWrap}>
    <View style={style.logoContainer}>
      <Image
        source={Images.Logo}
        style={env.app_logoLong ? style.logoLong : style.logoImg}
        resizeMode={env.app_logoLong ? 'center' : undefined}
      />
    </View>
  </View>
);

export default Logotype;
