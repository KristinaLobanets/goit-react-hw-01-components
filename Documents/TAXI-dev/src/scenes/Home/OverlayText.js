import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';

import { Text } from '../../components';
import style from './style';
import { strings } from '../../helpers';

const OverlayText = ({ address, changeAddress, outrun, noGps }) => {
  // const addressName = address
  //   ? address.object
  //     ? `${address.object}, ${address.street}, ${address.house}`
  //     : address.house
  //     ? `${address.street}, ${address.house}`
  //     : address.street
  //   : '';
  const addressName2 = address.name;
  return (
    <TouchableOpacity style={style.overlayContainer} onPress={changeAddress}>
      {!noGps && (
        <View style={style.overlayAddressWrap}>
          <Text style={style.overlayText}>{!outrun ? addressName2 : strings.outOfRun}</Text>
        </View>
      )}
      <View style={style.overlayLinkWrap}>
        {(addressName2 !== undefined || outrun || noGps) && (
          <Text normalText>{strings.changeAddress}</Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default OverlayText;

OverlayText.propTypes = {
  address: PropTypes.object,
  changeAddress: PropTypes.func,
  outrun: PropTypes.bool,
  noGps: PropTypes.bool,
};

OverlayText.defaultProps = {
  address: undefined,
  changeAddress: () => {},
  outrun: false,
};
